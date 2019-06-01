import MSSQLLib, { IResult } from 'mssql';

import {
  ConnectionDialect,
  ConnectionInterface,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import queries from './queries';
import GenericDialect from '@sqltools/core/dialect/generic';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

export default class MSSQL extends GenericDialect<MSSQLLib.ConnectionPool> implements ConnectionDialect {
  queries = queries;

  private retryCount = 0;
  public async open(encryptOverride?: boolean) {
    if (this.connection) {
      return this.connection;
    }

    if ((<any>this.credentials).dialectOptions) { // Will be removed on version 0.20
      console.warn(`dialectOptions is deprecated. Use mssqlOptions instead.`);
    }

    const { encrypt, ...mssqlOptions }: any = this.credentials.mssqlOptions || { encrypt: true };

    let encryptAttempt = typeof encrypt !== 'undefined'
      ? encrypt : true;
    if (typeof encryptOverride !== 'undefined') {
      encryptAttempt = encryptOverride;
    }

    const pool = new MSSQLLib.ConnectionPool({
      database: this.credentials.database,
      connectionTimeout: this.credentials.connectionTimeout * 1000,
      server: this.credentials.server,
      user: this.credentials.username,
      password: this.credentials.password,
      domain: this.credentials.domain || undefined,
      port: this.credentials.port,
      ...mssqlOptions,
      options: {
        ...((mssqlOptions || {}).options || {}),
        encrypt: encryptAttempt,
      },
    } as MSSQLLib.config);

    await new Promise((resolve, reject) => {
      pool.on('error', reject);
      pool.connect().then(resolve).catch(reject);
    }).catch(e => {
      if (this.retryCount === 0) {
        this.retryCount++;
        return this.open(!encryptAttempt)
        .catch(() => {
          this.retryCount = 0;
          return Promise.reject(e);
        });
      }
      return Promise.reject(e);
    });

    this.connection = Promise.resolve(pool);

    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    const pool = await this.connection;
    await pool.close();
    this.connection = null;
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const pool = await this.open();
    const request = pool.request();
    request.multiple = true;
    query = query.replace(/^[ \t]*GO;?[ \t]*$/gmi, '');
    const { recordsets = [], rowsAffected, error } = <IResult<any> & { error: any }>(await request.query(query).catch(error => Promise.resolve({ error, recordsets: [], rowsAffected: [] })));
    const queries = Utils.query.parse(query, 'mssql');
    return queries.map((q, i): DatabaseInterface.QueryResults => {
      const r = recordsets[i] || [];
      const messages = [];
      if (error) {
        messages.push(error.message || error.toString());
      }
      if (typeof rowsAffected[i] === 'number')
        messages.push(`${rowsAffected[i]} rows were affected.`);

      return {
        connId: this.getId(),
        cols: Array.isArray(r) ? Object.keys(r[0] || {}) : [],
        messages,
        error,
        query: q,
        results: Array.isArray(r) ? r : [],
      };
    })
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
              tree: obj.tree,
            } as DatabaseInterface.Table;
          });
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.query(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return <DatabaseInterface.TableColumn>{
              ...obj,
              isNullable: !!obj.isNullable ? obj.isNullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableDatabase: obj.dbName,
              isPk: (obj.constraintType || '').toLowerCase() === 'primary key',
              isFk: (obj.constraintType || '').toLowerCase() === 'foreign key',
              tree: obj.tree,
            };
          });
      });
  }

  public getFunctions(): Promise<DatabaseInterface.Function[]> {
    return this.query(this.queries.fetchFunctions)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              ...obj,
              args: obj.args ? obj.args.split(/, */g) : [],
              database: obj.dbName,
              schema: obj.dbSchema,
            } as DatabaseInterface.Function;
          });
      });
  }

  public describeTable(prefixedTable: string) {
    prefixedTable.split('].[').reverse().join('], [');
    return this.query(Utils.replacer(this.queries.describeTable, { table: prefixedTable.split(/\.(?=\[)/g).reverse().join(',') }));
  }
}
