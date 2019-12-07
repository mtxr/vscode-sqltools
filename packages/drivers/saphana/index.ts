
import queries from './queries';
import AbstractDriver from '@sqltools/drivers/abstract';
import sqltoolsRequire from '@sqltools/core/utils/sqltools-require';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';

interface Statement {
  exec(params: any[], handler: (err: any, row: any) => void);
}

interface HanaClientModule {
  createConnection(connOptions: object): HanaConnection;
}

interface HanaConnection {
  connect(handler: (err: any) => void);
  exec(query: string, handler: (err: any, row: any) => void);
  disconnect();
  prepare(query: string, handler: (err: any, statement: Statement) => void);
}

export default class SAPHana extends AbstractDriver<HanaConnection, any> implements IConnectionDriver {

  public static deps: typeof AbstractDriver['deps'] = [{
    type: 'package',
    name: '@sap/hana-client',
    version: '2.4.126',
    args: ['--@sap:registry=https://npm.sap.com']
  }];

  private get lib() {
    return sqltoolsRequire('@sap/hana-client') as HanaClientModule;
  }

  queries = queries;
  private schema: String;

  public open(): Promise<HanaConnection> {
    if (this.connection) {
      return this.connection;
    }

    this.needToInstallDependencies();

    let connOptions = {
      HOST: this.credentials.server,
      PORT: this.credentials.port,
      UID: this.credentials.username,
      PWD: this.credentials.password
    }
    if (this.credentials.connectionTimeout && this.credentials.connectionTimeout > 0) {
      connOptions["CONNECTTIMEOUT"] = this.credentials.connectionTimeout * 1000;
    }
    
    connOptions = {
      ...connOptions,
      ...(this.credentials["hanaOptions"] || {}),
    };
    
    try {
      let conn = this.lib.createConnection(connOptions);

      this.connection = new Promise<HanaConnection>((resolve, reject) => conn.connect(err => {
        if (err) {
          this.log.extend('error')("Connection to HANA failed", err.toString());
          reject(err);
        }
        this.schema = this.credentials.database;
        conn.exec("SET SCHEMA " + this.schema, err => {
            if (err) {
              reject(err);
            }
            this.log.extend('debug')("Connection to SAP Hana succeeded!");
            resolve(conn);
          });
      }));
      return this.connection;
    } catch (e) {
      this.log.extend('error')("Connection to HANA failed" + e.toString());
      Promise.reject(e);
    }
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    await this.connection.then(conn => conn.disconnect());
    this.connection = null;
  }

  public query(query: string, args?: any[]): Promise<NSDatabase.IResult[]> {
    return this.open().then(conn => {
      return new Promise<NSDatabase.IResult[]>((resolve) => {
        if (args) {
          conn.prepare(query, (err, statement) => {
            if (err) {
              return this.resolveErr(resolve, err, query);
            }
            statement.exec(args, (err, rows) => {
              if (err) {
                return this.resolveErr(resolve, err, query);
              }
              return this.resolveQueryResults(resolve, rows, query);
            });
          });
        } else {
          conn.exec(query, (err, rows) => {
            if (err) {
              return this.resolveErr(resolve, err, query);
            }
            return this.resolveQueryResults(resolve, rows, query);
          });
        }
      });
    });
  }

  private resolveQueryResults(resolve, rows, query) {
    let cols: string[] = [];
    if (rows && rows.length > 0) {
      for (let colName in rows[0]) {
        cols.push(colName);
      }
    }

    let res = {
      connId: this.getId(),
      results: rows,
      cols: cols,
      query: query,
      messages: []
    } as NSDatabase.IResult

    return resolve([res]);
  }

  private resolveErr(resolve, err, query) {
    let messages: string[] = [];
    if (err.message) {
      messages.push(err.message);
    }

    return resolve([{
      connId: this.getId(),
      error: err,
      results: [],
      cols: [],
      query: query,
      messages: messages
    } as NSDatabase.IResult]);
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    return this.query(this.queries.fetchTables, [this.schema, this.schema])
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.TABLENAME,
              isView: !!obj.ISVIEW,
              numberOfColumns: parseInt(obj.NUMBEROFCOLUMNS, 10),
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableSchema: obj.TABLESCHEMA,
              tree: obj.TREE,
            } as NSDatabase.ITable;
          });
      });
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
    return this.query(this.queries.fetchColumns, [this.schema, this.schema])
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              columnName: obj.COLUMNNAME,
              defaultValue: obj.DEFAULTVALUE,
              isNullable: !!obj.ISNULLABLE ? obj.ISNULLABLE.toString() === 'yes' : null,
              size: obj.SIZE !== null ? parseInt(obj.SIZE, 10) : null,
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableName: obj.TABLENAME,
              tableSchema: obj.TABLESCHEMA,
              isPk: (obj.KEYTYPE || '').toLowerCase() === 'primary key',
              isFk: (obj.KEYTYPE || '').toLowerCase() === 'foreign key',
              type: obj.TYPE,
              tree: obj.TREE,
            } as NSDatabase.IColumn;
          });
      });
  }

  public async getFunctions() {
    return [];
  }

  public describeTable(prefixedTable: string) {
    return new Promise<NSDatabase.IResult[]>(resolve => {
      this.query(this.queries.describeTable, [this.schema, prefixedTable]).then(queryRes => {
        if (queryRes[0].results.length == 0) {
          this.query(this.queries.describeView as string, [this.schema, prefixedTable]).then(res => resolve(res));
        } else {
          resolve(queryRes);
        }
      })
    });
  }
  
}
