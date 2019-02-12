import {
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import path from 'path';
import SQLiteLib from 'sqlite3';
import GenericDialect from '../generic';
import queries from './queries';
import { MissingModule } from '@sqltools/core/exception';

const SQLite3Version = '4.0.6';

export default class SQLite extends GenericDialect<SQLiteLib.Database> implements ConnectionDialect {

  static needToInstall() {
    try {
      __non_webpack_require__.resolve('sqlite3');
      return false;
    } catch(e) { }
    return true;
  }
  queries = queries;

  private get lib() {
    return __non_webpack_require__('sqlite3') as SQLiteLib.sqlite3;
  }

  public async open() {
    if (this.connection) {
      return this.connection;
    }

    if (SQLite.needToInstall()) {
      return Promise.reject(new MissingModule('sqlite3', SQLite3Version));
    }

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
      db.all(query,(_, err, rows) => {
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
      const res = await this.runSingleQuery(db, queries[i]);
      console.log({ res });
      // if (r.rows.length === 0 && queries[i].toLowerCase() !== 'select') {
      //   messages.push(`${r.rowCount} rows were affected.`);
      // }
      // results.push({

      // })
      // return {
      //   cols: (r.fields || []).map(({ name }) => name),
      //   messages,
      //   query: queries[i],
      //   results: r.rows,
      // };
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
        } as DatabaseInterface.Table;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public async getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    const allTables = await this.getTables();
    const columns: DatabaseInterface.TableColumn[] = [];

    await Promise.all(allTables.map(async t => {
      const [{ results }] = await this.describeTable(t.name);

      results.forEach(obj => columns.push({
          columnName: obj.name,
          defaultValue: obj.dftl_value || undefined,
          isNullable: obj.notnull ? obj.notnull.toString() === '1' : null,
          tableCatalog: obj.tablecatalog,
          tableDatabase: this.credentials.database,
          tableName: t.name,
          type: obj.type,
          size: null,
      }));
      return Promise.resolve();
    }));

    return columns.sort((a, b) => a.columnName.localeCompare(b.columnName));
  }

  private prepareResults(query: string, cols: string[] = [], rowsValues: any[][] = [], count = 0): DatabaseInterface.QueryResults {
    return {
      query,
      cols,
      results: rowsValues.map(v => this.prepareRow(cols, v)),
      messages: [`${count} rows`]
    }
  }

  private prepareRow(cols: string[], results: any[]) {
    return cols.reduce((agg, c, i) => ({ ...agg, [c]: results[i]  }), {});
  }
}