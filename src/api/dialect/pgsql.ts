import { Client } from 'pg';
import { ConnectionCredentials } from './../interface/connection-credentials';
import { ConnectionDialect } from './../interface/connection-dialect';
import DatabaseInterface from './../interface/database-interface';
import { DialectQueries } from './../interface/dialect-queries';
import Utils from './../utils';

export default class PostgreSQL implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    describeTable: `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = ':table'
      AND table_schema NOT IN ('pg_catalog', 'information_schema')`,
    fetchColumns: `SELECT TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName, DATA_TYPE AS type, CHARACTER_MAXIMUM_LENGTH AS size
      FROM INFORMATION_SCHEMA.COLUMNS WHERE table_schema NOT IN ('pg_catalog', 'information_schema')`,
    fetchRecords: 'SELECT * FROM :table LIMIT :limit',
    fetchTables: `SELECT TABLE_NAME as tableName
      FROM INFORMATION_SCHEMA.TABLES
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema') ORDER BY TABLE_NAME`,
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {

  }

  public open() {
    if (this.connection) {
      return this.connection;
    }
    const options = {
      database: this.credentials.database,
      host: this.credentials.server,
      password: this.credentials.password,
      port: this.credentials.port,
      user: this.credentials.username,
    };
    const self = this;
    const client = new Client(options);
    return client.connect()
      .then(() => {
        this.connection = Promise.resolve(client);
        return this.connection;
      });
  }

  public close() {
    if (!this.connection) return Promise.resolve();

    return this.connection.then((client) => client.end());
  }

  public query(query: string): Promise<any> {
    return this.open()
      .then((conn) => conn.query(query))
      .then((results: any[] | any) => {
        if (!Array.isArray(results)) {
          results = [ results ];
        }
        return results.map((r) => {
          return r.rows.length === 0 && r.rowCount > 0 ? [ { affectedRows: r.rowCount } ] : r.rows;
        });
      });
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then((results) => {
        return results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return { name: obj.tablename } as DatabaseInterface.Table;
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
            return {
              columnName: obj.columnname,
              size: obj.size,
              tableName: obj.tablename,
              type: obj.type,
            } as DatabaseInterface.TableColumn;
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
