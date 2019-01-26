import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from './../interface';
import * as Utils from '../utils';
import USQL from '../utils/usql';
import path from 'path';

export default class SQLiteUSQL implements ConnectionDialect {
  public connection: Promise<any>;
  private connectString: string;
  private queries: DialectQueries = {
    describeTable: 'PRAGMA table_info(:table)',
    fetchRecords: 'SELECT * FROM :table LIMIT :limit',
    fetchTables: `SELECT
        name AS tableName
      FROM
        sqlite_master
      WHERE type = 'table' OR type = 'view'
      ORDER BY
        name;`,
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {
    this.connectString = `sqlite3://${path.normalize(this.credentials.database)}`;
  }

  public open() {
    return USQL.checkAndInstall()
      .then(() => Promise.resolve(true));
  }

  public close() {
    return Promise.resolve();
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    await this.open()
    const results = await USQL.runQuery({ query, connectString: this.connectString });
    const queries = Utils.query.parse(query).filter(Boolean);
    return queries.map((query: any, index: number) => {
      const res = JSON.parse(results[index] || '{}');
      return this.prepareResults(query, res.cols, res.values, res.count);
    });
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

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public showRecords(table: string, limit: number = 10) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
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