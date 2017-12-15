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
        COLUMN_NAME AS columnName,
        DATA_TYPE AS type,
        CHARACTER_MAXIMUM_LENGTH AS size,
        TABLE_SCHEMA as tableSchema,
        TABLE_CATALOG AS tableCatalog,
        DB_NAME() as dbName,
        COLUMN_DEFAULT as defaultValue,
        IS_NULLABLE as isNullable
      FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG= DB_NAME()`,
    fetchRecords: 'SELECT TOP :limit * FROM :table',
    fetchTables: `SELECT TABLE_NAME AS tableName,
        TABLE_SCHEMA AS tableSchema,
        TABLE_CATALOG AS tableCatalog,
        DB_NAME() as dbName,
        COUNT(1) as numberOfColumns
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DB_NAME() AND TABLE_TYPE = 'BASE TABLE'
      GROUP by tableName, tableSchema, tableCatalog, dbName
      ORDER BY TABLE_NAME;`,
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
      port: this.credentials.port,
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
            return {
              name: obj.tableName,
              numberOfColumns: parseInt(obj.numberOfColumns, 10),
              tableCatalog: obj.tableCatalog,
              tableDatabase: obj.dbName,
              tableSchema: obj.tableSchema,
            } as DatabaseInterface.Table;
          })
          .sort();
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.query(this.queries.fetchColumns)
      .then((results) => {
        return results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            obj.isNullable = !!obj.isNullable ? obj.isNullable.toString() === 'yes' : null;
            obj.size = obj.size !== null ? parseInt(obj.size, 10) : null;
            obj.tableDatabase = obj.dbName;
            return obj as DatabaseInterface.TableColumn;
          })
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
