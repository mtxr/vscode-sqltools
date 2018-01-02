import { Client } from 'pg';
import { ConnectionCredentials } from './../interface/connection-credentials';
import { ConnectionDialect } from './../interface/connection-dialect';
import DatabaseInterface from './../interface/database-interface';
import { DialectQueries } from './../interface/dialect-queries';
import Utils from './../utils';

export default class PostgreSQL implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    describeTable: `SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE table_name = ':table'
        AND TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')`,
    fetchColumns: `SELECT TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName,
        DATA_TYPE AS type,
        CHARACTER_MAXIMUM_LENGTH AS size,
        TABLE_CATALOG AS tableCatalog,
        TABLE_SCHEMA AS tableSchema,
        current_database() as dbName,
        COLUMN_DEFAULT AS defaultValue,
        IS_NULLABLE AS isNullable
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')`,
    fetchRecords: 'SELECT * FROM :table LIMIT :limit',
    fetchTables: `SELECT TABLE_NAME AS tableName,
        TABLE_SCHEMA AS tableSchema,
        TABLE_CATALOG AS tableCatalog,
        current_database() as dbName,
        COUNT(1) as numberOfColumns
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')
      GROUP by tableName, tableSchema, tableCatalog, dbName
      ORDER BY TABLE_NAME;`,
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
      statement_timeout: this.credentials.connectionTimeout,
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

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.open()
      .then((conn) => conn.query(query))
      .then((results: any[] | any) => {
        const queries = query.split(';');
        const messages = [];
        if (!Array.isArray(results)) {
          results = [ results ];
        }

        return results.map((r, i) => {
          if (r.rows.length === 0 && r.command.toLowerCase() !== 'select') {
            messages.push(`${r.rowCount} rows were affected.`);
          }
          return {
            cols: r.rows.length > 0 ? Object.keys(r.rows[0]) : [],
            messages,
            query: queries[i],
            results: r.rows,
          };
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
              name: obj.tablename,
              numberOfColumns: parseInt(obj.numberofcolumns, 10),
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableSchema: obj.tableschema,
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
            return {
              columnName: obj.columnname,
              defaultValue: obj.defaultvalue,
              isNullable: !!obj.isnullable ? obj.isnullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableName: obj.tablename,
              tableSchema: obj.tableschema,
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
