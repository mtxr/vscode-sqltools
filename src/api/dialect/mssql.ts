import tds = require('tedious');
import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from './../interface';
import Utils from './../utils';

export default class MSSQL implements ConnectionDialect {
  public connection: Promise<any>;
  private connectionInstance: tds.Connection;
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
    fetchTables: `SELECT
        C.TABLE_NAME AS tableName,
        C.TABLE_SCHEMA AS tableSchema,
        C.TABLE_CATALOG AS tableCatalog,
        (CASE WHEN T.TABLE_TYPE = 'VIEW' THEN 1 ELSE 0 END) AS isView,
        DB_NAME() AS dbName,
        COUNT(1) AS numberOfColumns
      FROM
        INFORMATION_SCHEMA.COLUMNS AS C
        JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
        AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
        AND C.TABLE_CATALOG = T.TABLE_CATALOG
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
    const config: any = {
      password: this.credentials.password,
      server: this.credentials.server,
      domain: this.credentials.domain,
      userName: this.credentials.username,
    };
    config.options = {
      connectTimeout: this.credentials.connectionTimeout * 1000,
      database: this.credentials.database,
      port: this.credentials.port,
      // return on done
      useColumnNames: true,
      rowCollectionOnDone: true,
      rowCollectionOnRequestCompletion: true,
    };
    if (this.credentials.dialectOptions) {
      config.options = Object.assign({}, config.options, this.credentials.dialectOptions);
    }

    return new Promise((resolve, reject) => {
      this.connectionInstance = new tds.Connection(config);
      this.connectionInstance.on('error', (err) => {
        return reject(err);
      });
      this.connectionInstance.on('connect', (err) => {
        if (err) return reject(err);
        this.connection = Promise.resolve(this.connectionInstance);
        resolve(this.connectionInstance);
      });
    });
  }

  public close() {
    if (!this.connection) return Promise.resolve();
    this.connectionInstance.on('end', () => {
      this.connectionInstance = null;
      this.connection = null;
    });
    return this.connection.then(() => {
      try {
        this.connectionInstance.cancel();
      } catch (e) { /**/ }
      this.connectionInstance.close();
    });
  }

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const queries = Utils.parseQueries(query);
    return this.open()
      .then(() => {
        return new Promise((resolve, reject) => {
          const results = [];
          let error = null;
          const request = new tds.Request(query, (err) => error = err);
          let count = 0;
          const cb = (rowCount) => {
            if (typeof rowCount !== 'undefined' && queries[count].toLowerCase().indexOf('SELECT') === -1) {
              results[count].messages.push(`${rowCount} rows were affected.`);
            }
            ++count;
          };
          request.on('row', (row) => this.prepareRow(results, queries, count, row));
          request.on('done', cb);
          request.on('doneInProc', cb);
          request.on('doneProc', cb);
          request.on('requestCompleted', () => {
            if (error) return reject(error);
            return resolve(results);
          });
          this.connectionInstance.execSql(request);
        }) as Promise<DatabaseInterface.QueryResults[]>;
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
              isView: !!obj.isView,
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

  public showRecords(table: string, limit: number) {
    return this.query(Utils.replacer(this.queries.fetchRecords, {limit, table }));
  }
  private prepareRow(results: any[], queries: string [], count: number, row: any): any {
    results[count] = results[count] || {
      cols: row ? Object.keys(row) : [],
      messages: [],
      query: queries[count],
      results: [],
    };
    results[count].results.push(Object.keys(row).reduce((p, c) => {
      p[c] = row[c].value;
      return p;
    }, {}));
  }
}
