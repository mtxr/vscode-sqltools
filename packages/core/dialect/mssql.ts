import tds from 'tedious';

import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from '../interface';
import * as Utils from '../utils';

export default class MSSQL implements ConnectionDialect {
  public connection: Promise<tds.Connection>;
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

  private retryCount = 0;
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
      config.options.encrypt = this.credentials.dialectOptions.encrypt;
    }

    return new Promise((resolve, reject) => {
      const connection = new tds.Connection(config);
      connection.on('error', (err) => {
        return reject(err);
      });
      connection.on('connect', (err) => {
        if (err) return reject(err);
        // alway keep one connection
        this.connection = this.connection || Promise.resolve(connection);
        resolve(connection);
      });
    }).catch(error => {
      if (this.retryCount < 3
        && (
          !this.credentials.dialectOptions
          || typeof this.credentials.dialectOptions.encrypt === 'undefined'
          || this.credentials.dialectOptions.encrypt === true
        )
      ) {
        this.credentials.dialectOptions = (this.credentials.dialectOptions || {} as ConnectionCredentials['dialectOptions'])
        this.credentials.dialectOptions.encrypt = false;
        this.retryCount++;

        // retry without encryption, but if fails, throws the first error
        return this.open().catch(() => Promise.reject(error));
      }
      return Promise.reject(error);
    });
  }

  private closeConnection(conn) {
    return new Promise((resolve) => {
      conn.on('end', () => resolve());
      try {
        conn.cancel();
      } catch (e) { /**/ }
      conn.close();
    })
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    await this.closeConnection(await this.connection);
    this.connection = null;
  }

  private runSingleQuery(query, shouldClose = false) {
    return new Promise<DatabaseInterface.QueryResults>(async (resolve, reject) => {
      const result = this.prepareRow(null, query);
      let error = null;
      const request = new tds.Request(query, (err) => error = err);
      let count = 0;
      const cb = (rowCount, ...rest) => {
        if (typeof rowCount !== 'undefined' && query.toLowerCase().indexOf('select') === -1) {
          result.messages.push(`${rowCount} rows were affected.`);
          ++count;
        }
      };
      request.on('row', (row) => this.prepareRow(result, query, row));
      request.on('done', cb);
      request.on('doneInProc', cb);
      request.on('doneProc', cb);
      request.on('requestCompleted', () => {
        if (error) {
          return reject(error);
        }

        if (shouldClose) this.closeConnection(connection).catch(Promise.resolve);

        return resolve(result);
      });
      const connection = await this.open();
      connection.execSql(request);
    });
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const queries = Utils.query.parse(query);
    return Promise.all(queries.map((q, i) => this.runSingleQuery(q, i > 0)));
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
  private prepareRow(result: DatabaseInterface.QueryResults, query: string, row?: any) {
    result = result || {
      messages: [],
      query,
      results: [],
    } as DatabaseInterface.QueryResults;
    if (row) {
      result.cols = row ? Object.keys(row) : (result.cols && result.cols.length > 0 ? result.cols : []),
      result.results.push(Object.keys(row).reduce((p, c) => {
        p[c] = row[c].value;
        return p;
      }, {}));
    }
    return result;
  }
}
