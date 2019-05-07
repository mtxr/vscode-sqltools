
import {
  ConnectionDialect
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import queries from './queries';
import GenericDialect from '@sqltools/core/dialect/generic';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
// Cannot simply use hanaClient from '@sap/hana-client', because webpack is moving it away from its native libs.
// Instead, the webpack.config.js includes copying the lib and the native libs, and here we skip the webpacking of the require, and use eval, to makesure
// the require happens simple inside the webpack, finding the copyed lib.

var path = require('path');

let hanaClient: HanaClientModule;
let modulePath = path.join(__dirname, 'lib/index.js');
console.info('path: ' + modulePath);
console.log('path: ' + modulePath);
hanaClient = eval('require')(modulePath);

interface Statement {
  exec(params: any[], handler: (err: any, row: any) => void);
}

interface HanaClientModule {
  createClient(connOptions: object): HanaConnection;
}


interface HanaConnection {
  connect(handler: (err: any) => void);
  exec(query: string, handler: (err: any, row: any) => void);
  disconnect();
  prepare(query: string, handler: (err: any, statement: Statement) => void);
}

export default class SAPHana extends GenericDialect<HanaConnection> implements ConnectionDialect {
  queries = queries;
  private schema: String;

  public open(encrypt?: boolean): Promise<HanaConnection> {
    if (this.connection) {
      return this.connection;
    }

    const connOptions = {
      host: this.credentials.server,
      port: this.credentials.port,
      user: this.credentials.username,
      password: this.credentials.password
    };
    try {
      let conn = hanaClient.createClient(connOptions);

      this.connection = new Promise<HanaConnection>((resolve, reject) => conn.connect(err => {
        if (err) {
          console.error("Connection to HANA failed", err.toString());
          reject(err);
        }
        this.schema = this.credentials.database;
        conn.exec("SET SCHEMA " + this.schema, err => {
            if (err) {
              reject(err);
            }
            console.log("Connection to SAP Hana succedded!");
            resolve(conn);
          });
      }));
      return this.connection;
    } catch (e) {
      console.error("Connection to HANA failed" + e.toString());
      Promise.reject(e);
    }
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    await this.connection.then(conn => conn.disconnect());
    this.connection = null;
  }

  public async testConnection?() {
    return this.open().then(conn => conn.exec('select 1 from dummy;', (err, rows) => rows));
  }

  public query(query: string, args?): Promise<DatabaseInterface.QueryResults[]> {
    return this.open().then(conn => {
      return new Promise<DatabaseInterface.QueryResults[]>((resolve, reject) => {
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
      connId: "1",
      results: rows,
      cols: cols,
      query: query,
      messages: []
    } as DatabaseInterface.QueryResults

    return resolve([res]);
  }

  private resolveErr(resolve, err, query) {
    let messages: string[] = [];
    if (err.message) {
      messages.push(err.message);
    }

    return resolve([{
      connId: "1",
      error: err,
      results: [],
      cols: [],
      query: query,
      messages: messages
    } as DatabaseInterface.QueryResults]);
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables, [this.schema])
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
            } as DatabaseInterface.Table;
          });
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.query(this.queries.fetchColumns, [this.schema])
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
            } as DatabaseInterface.TableColumn;
          });
      });
  }

  public async getFunctions() {
    return [];
  }

  public describeTable(prefixedTable: string) {
    return this.query(this.queries.describeTable, [this.schema, prefixedTable]);
  }
}
