import Utils from './../utils';
import mssql = require('mssql');
import { ConnectionCredentials } from './../interface/connection-credentials';
import { ConnectionDialect } from './../interface/connection-dialect';
import DatabaseInterface from './../interface/database-interface';
import { DialectQueries } from './../interface/dialect-queries';

export default class MSSQL implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    describeTable: 'SP_COLUMNS :table',
    fetchColumns: `SELECT TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName, DATA_TYPE AS type, CHARACTER_MAXIMUM_LENGTH AS size
      FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG= DB_NAME()`,
    fetchRecords: 'SELECT TOP :limit * FROM :table',
    fetchTables: `SELECT TABLE_NAME as tableName
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG= DB_NAME() ORDER BY TABLE_NAME`,
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {

  }

  public open() {
    if (this.connection) {
      return Promise.resolve(this.connection);
    }
    const options = {
      database: this.credentials.database,
      password: this.credentials.password,
      server: this.credentials.server,
      user: this.credentials.username,
    };

    const self = this;
    const pool = new mssql.ConnectionPool(options);
    return new Promise((resolve, reject) => {
      pool.connect((err) => {
        if (err) return reject(err);
        self.connection = Promise.resolve(pool);
        return resolve(self.connection);
      });
    });
  }

  public close() {
    if (!this.connection) return Promise.resolve();

    return this.connection
      .then((pool) => Promise.resolve(pool.close()));
  }

  public query(query: string): Promise<any> {
    return this.open().then((pool) => pool.request().query(query)).then((results) => {
      if (results.recordsets.lenght === 0) {
        return [];
      }
      return results.recordsets;
    });
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then((results) => {
        return results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return { name: obj.tableName } as DatabaseInterface.Table;
          })
          .sort();
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.query(this.queries.fetchColumns)
      .then((results) => {
        return results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => obj as DatabaseInterface.TableColumn)
          .sort();
      });
  }

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public showRecords(table: string, limit: number = 10) {
    return this.query(Utils.replacer(this.queries.fetchRecords, {limit, table }));
  }
}
