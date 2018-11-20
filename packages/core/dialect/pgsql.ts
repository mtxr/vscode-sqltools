import { Client } from 'pg';
import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from '../interface';
import * as Utils from '../utils';

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
    fetchTables: `SELECT
        C.TABLE_NAME AS tableName,
        C.TABLE_SCHEMA AS tableSchema,
        C.TABLE_CATALOG AS tableCatalog,
        (CASE WHEN T.TABLE_TYPE = 'VIEW' THEN 1 ELSE 0 END) AS isView,
        CURRENT_DATABASE() AS dbName,
        COUNT(1) AS numberOfColumns
      FROM
        INFORMATION_SCHEMA.COLUMNS AS C
        JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
        AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
        AND C.TABLE_CATALOG = T.TABLE_CATALOG
      WHERE C.TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')
      GROUP by
        C.TABLE_NAME,
        C.TABLE_SCHEMA,
        C.TABLE_CATALOG,
        T.TABLE_TYPE
      ORDER BY
        C.TABLE_NAME;`,
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
      statement_timeout: this.credentials.connectionTimeout * 1000,
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
        const queries = Utils.query.parse(query);
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
              isView: !!obj.isview,
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

  public showRecords(table: string, limit: number) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }
}
