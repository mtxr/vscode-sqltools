import { IConnectionDriver, NSDatabase } from '@sqltools/types';
import queries from './queries';
import * as db2Lib from 'ibm_db';
import AbstractDriver from '@sqltools/base-driver';
import sqltoolsRequire from '@sqltools/util/dependencies/require';
import { parse as queryParse } from '@sqltools/util/query';
const D2BLibVersion = '2.6.1';
export default class DB2 extends AbstractDriver<db2Lib.Database, any> implements IConnectionDriver {
  public readonly deps: typeof AbstractDriver.prototype['deps'] = [{
    type: AbstractDriver.CONSTANTS.DEPENDENCY_PACKAGE,
    name: 'ibm_db',
    version: D2BLibVersion
  }];

  queries = queries

  private get lib(): typeof db2Lib.Pool {
    const dbLib = sqltoolsRequire('ibm_db').Pool;
    return dbLib;
  }

  public async open() {
    if (this.connection) {
      return this.connection;
    }

    let { connectString } = this.credentials;
    if (!connectString) {
      connectString = `database=${this.credentials.database};`
        + `hostname=${this.credentials.server};`
        + `port=${this.credentials.port};`
        + `uid=${this.credentials.username};`
        + `pwd=${this.credentials.password}`;
    }

    this.connection = this.dbopen(connectString)
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    await this.dbcloseAll().then(() => {
      this.connection = null;
    })
  }

  public async query(query: string): Promise<NSDatabase.IResult[]> {
    let thiz: DB2 = this;
    const database = await thiz.open();
    return new Promise<NSDatabase.IResult[]>(
      function (resolve, reject) {
        try {
          const queries = queryParse(query)
          const results: NSDatabase.IResult[] = [];
          for (let q of queries) {
            try {
              let res = thiz.queryResultSync(database, q);
              let row;
              let dataSet = []
              while (row = res.fetchSync()) {
                dataSet.push(row)
              }
              results.push({
                connId: thiz.getId(),
                cols: dataSet && dataSet.length > 0 ? Object.keys(dataSet[0]) : [],
                messages: [],
                query: q,
                results: dataSet,
              })
            }
            catch (err) {
              reject(err)
            }
          }
          resolve(results);
        }
        finally {
          if (database) {
            database.close()
          }
        }
      });
  }

  public async testConnection(): Promise<void> {
    return this.query('SELECT 1 FROM SYSIBM.SYSDUMMY1').then(() => void 0);
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    return this.query(this.queries.fetchTables)
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
    return this.query(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              columnName: obj.COLUMNNAME,
              defaultValue: obj.DEFAULTVALUE,
              isNullable: !!obj.ISNULLABLE ? obj.ISNULLABLE.toString() === 'yes' : null,
              size: obj.Size !== null ? parseInt(obj.Size, 10) : null,
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableName: obj.TABLENAME,
              tableSchema: obj.TABLESCHEMA,
              type: obj.Type,
              isPk: obj.KEYTYPE === 'P',
              isFk: obj.KEYTYPE === 'R',
              tree: obj.TREE,
            } as NSDatabase.IColumn;
          });
      });
  }

  private getDatabaseName(database: db2Lib.Database): string {
    try {
      let result = this.queryResultSync(database, 'select current_server as NAME from sysibm.sysdummy1');
      let row
      while (row = result.fetchSync()) {
        return row.NAME
      }
    }
    finally {
      if (database) {
        database.close()
      }
    }
    return ''
  }
  public async describeTable(prefixedTable: string): Promise<NSDatabase.IResult[]> {
    const [schema, table] = prefixedTable.split('.');
    let thiz: DB2 = this;
    const database = await thiz.open();
    return new Promise<NSDatabase.IResult[]>(
      function (resolve, reject) {
        const results: NSDatabase.IResult[] = [];
        database.describe({
          database: thiz.getDatabaseName(database),
          schema: schema,
          table: table
        }, (err, res) => {
          if (err) {
            // there is an error during querying
            reject(err)
            return
          }
          else {
            results.push({
              connId: thiz.getId(),
              cols: res && res.length > 0 ? Object.keys(res[0]) : [],
              messages: [],
              query: 'describe',
              results: res,
            });
            resolve(results)
          }
        })
      }
    )
  }

  public getFunctions(): Promise<NSDatabase.IFunction[]> {
    return this.query(this.queries.fetchFunctions)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.NAME,
              schema: obj.DBSCHEMA,
              database: obj.DBNAME,
              signature: obj.SIGNATURE,
              args: obj.ARGS ? obj.ARGS.split(/, */g) : [],
              resultType: obj.RESULTTYPE,
              tree: obj.TREE,
            } as NSDatabase.IFunction;
          });
      });
  }

  private _pool: db2Lib.Pool
  private gePool(): db2Lib.Pool {
    if (!this._pool) {
      this._pool = new this.lib();
      this._pool.setMaxPoolSize(10);
    }
    return this._pool
  }

  private queryResultSync(database: db2Lib.Database, query: string, params?: any): db2Lib.ODBCResult {
    let result = database.queryResultSync(query, params)
    if (this.hasError(result)) {
      throw this.getError(result)
    }
    return result;
  }

  private hasError(result: db2Lib.ODBCResult): boolean {
    return !result.fetchMode
  }

  private getError(result: db2Lib.ODBCResult): { error, sqlcode, message, state } {
    return (({ error, sqlcode, message, state }) => ({ error, sqlcode, message, state }))(<any>result)
  }

  private async dbcloseAll(): Promise<void> {
    let pool: db2Lib.Pool = this.gePool()
    return new Promise<void>(
      function (resolve) {
        pool.close(() => {
          resolve();
        })
      });
  }

  private async dbopen(connectString: string): Promise<db2Lib.Database> {
    let pool: db2Lib.Pool = this.gePool()
    return new Promise<db2Lib.Database>(
      function (resolve, reject) {
        pool.open(connectString, function (err, db) {
          if (err) {
            reject(err);
          }
          else {
            resolve(db);
          }
        })
      });
  }

}
