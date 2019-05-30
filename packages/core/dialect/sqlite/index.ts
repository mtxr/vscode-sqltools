import {
  ConnectionDialect,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import SQLiteLib from 'sqlite3';
import GenericDialect from '../generic';
import queries from './queries';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

const SQLite3Version = '4.0.8';

export default class SQLite extends GenericDialect<SQLiteLib.Database> implements ConnectionDialect {

  public static deps: typeof GenericDialect['deps'] = [{
    type: 'package',
    name: 'sqlite3',
    version: SQLite3Version,
  }];


  queries = queries;

  private get lib() {
    return __non_webpack_require__('sqlite3') as SQLiteLib.sqlite3;
  }

  public async open() {
    if (this.connection) {
      return this.connection;
    }

    this.needToInstallDependencies();

    const db = await new Promise<SQLiteLib.Database>((resolve, reject) => {
      const instance = new (this.lib).Database(this.credentials.database, (err) => {
        if (err) return reject(err);
        return resolve(instance);
      });
    });

    this.connection = Promise.resolve(db);
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    const db = await this.connection
    await new Promise((resolve, reject) => {
      db.close(err => err ? reject(err) : resolve());
    });
    this.connection = null;
  }

  private runSingleQuery(db: SQLiteLib.Database, query: string) {
    return new Promise<any[]>((resolve, reject) => {
      db.all(query,(err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      })
    });
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const db = await this.open();
    const queries = Utils.query.parse(query).filter(Boolean);
    const results: DatabaseInterface.QueryResults[] = [];
    for(let i = 0; i < queries.length; i++) {
      const res: any[][] = (await this.runSingleQuery(db, queries[i])) || [];
      const messages = [];
      if (res.length === 0 && queries[i].toLowerCase() !== 'select') {
        messages.push(`${res.length} rows were affected.`);
      }
      results.push({
        connId: this.getId(),
        cols: res && res.length ? Object.keys(res[0]) : [],
        messages,
        query: queries[i],
        results: res,
      });
    }
    return results;
  }

  public async getTables(): Promise<DatabaseInterface.Table[]> {
    const [ queryRes ] = await this.query(this.queries.fetchTables);
    return queryRes.results
      .reduce((prev, curr) => prev.concat(curr), [])
      .map((obj) => {
        return {
          name: obj.tableName,
          isView: obj.type === 'view',
          tableDatabase: this.credentials.database,
          tree: obj.tree,
        } as DatabaseInterface.Table;
      });
  }

  public async getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    const allTables = await this.getTables();
    const columns: DatabaseInterface.TableColumn[] = [];

    await Promise.all(allTables.map(async t => {
      const [[{ results: tableColumns }], [{ results: fks }]] = await Promise.all([
        this.query(Utils.replacer(this.queries.fetchColumns, { table: t.name })),
        this.query(Utils.replacer(this.queries.listFks, { table: t.name })),
      ]);

      const fksMap = fks.reduce((agg, fk) => ({ ...agg, [fk.from]: true }), {});

      tableColumns.forEach(obj => columns.push({
          columnName: obj.name,
          defaultValue: obj.dftl_value || undefined,
          isNullable: obj.notnull ? obj.notnull.toString() === '1' : null,
          tableCatalog: obj.tablecatalog,
          tableDatabase: this.credentials.database,
          tableName: t.name,
          type: obj.type,
          size: null,
          isPk: Boolean(obj.pk),
          isFk: !!fksMap[obj.name],
          tree: obj.tree,
      }));
      return Promise.resolve();
    }));

    return columns;
  }

  public getFunctions() {
    // this doesn exists for SQLite. It's just to avoid watning messages
    return Promise.resolve([]);
  }

  public describeTable(prefixedTable: string) {
    return super.describeTable(prefixedTable.replace(/^("(.+)")$/g, '$2'));
  }
}