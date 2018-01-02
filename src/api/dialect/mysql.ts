import Utils from './../utils';
import mysql = require('mysql2');
import { ConnectionCredentials } from './../interface/connection-credentials';
import { ConnectionDialect } from './../interface/connection-dialect';
import DatabaseInterface from './../interface/database-interface';
import { DialectQueries } from './../interface/dialect-queries';

export default class MySQL implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    describeTable: 'DESCRIBE :table',
    fetchColumns: `SELECT TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName,
        DATA_TYPE AS type,
        CHARACTER_MAXIMUM_LENGTH AS size,
        TABLE_SCHEMA as tableSchema,
        TABLE_CATALOG AS tableCatalog,
        DATABASE() as dbName,
        COLUMN_DEFAULT as defaultValue,
        IS_NULLABLE as isNullable
      FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE()`,
    fetchRecords: 'SELECT * FROM :table LIMIT :limit',
    fetchTables: `SELECT TABLE_NAME AS tableName,
        TABLE_SCHEMA AS tableSchema,
        TABLE_CATALOG AS tableCatalog,
        DATABASE() as dbName,
        COUNT(1) as numberOfColumns
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
      GROUP by tableName, tableSchema, tableCatalog, dbName
      ORDER BY TABLE_NAME`,
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {

  }

  public open() {
    if (this.connection) {
      return this.connection;
    }
    const options = {
      connectionTimeout: this.credentials.connectionTimeout,
      database: this.credentials.database,
      host: this.credentials.server,
      multipleStatements: true,
      password: this.credentials.password,
      port: this.credentials.port,
      user: this.credentials.username,
    };
    const self = this;
    const connection = mysql.createConnection(options);
    return new Promise((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          return reject(err);
        }
        self.connection = Promise.resolve(connection);
        resolve(self.connection);
      });
    });
  }

  public close() {
    if (!this.connection) return Promise.resolve();

    return this.connection.then((conn) => {
      conn.destroy();
      this.connection = null;
      return Promise.resolve();
    });
  }

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.open().then((conn): Promise<DatabaseInterface.QueryResults[]> => {
      return new Promise((resolve, reject) => {
        conn.query(query, (error, results) => {
          if (error) return reject(error);
          const queries = query.split(';');
          if (results && !Array.isArray(results[0])) {
            results = [results];
            results = [results];
          }
          if (results.length === 0) {
            return [];
          }
          return resolve(results.map((r, i) => {
            const messages = [];
            if (r.affectedRows) {
              messages.push(`${r.affectedRows} rows were affected.`);
            }
            if (r.changedRows) {
              messages.push(`${r.changedRows} rows were changed.`);
            }
            return {
              cols: Array.isArray(r) ? Object.keys(r[0]) : [],
              messages,
              query: queries[i],
              results: Array.isArray(r) ? r : [],
            };
          }));
        });
      });
    });
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
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
      .then(([queryRes]) => {
        return queryRes.results
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
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }
}
