import MSSQLLib from 'mssql';

import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import queries from './queries';
import GenericDialect from '@sqltools/core/dialect/generic';

export default class MSSQL extends GenericDialect<MSSQLLib.ConnectionPool> implements ConnectionDialect {
  queries = queries;

  private retryCount = 0;
  public async open(encrypt?: boolean) {
    if (this.connection) {
      return this.connection;
    }

    let encryptAttempt = typeof this.credentials.dialectOptions.encrypt !== 'undefined'
      ? this.credentials.dialectOptions.encrypt : true;
    if (typeof encrypt !== 'undefined') {
      encryptAttempt = encrypt;
    }

    const pool = new MSSQLLib.ConnectionPool({
      database: this.credentials.database,
      connectionTimeout: this.credentials.connectionTimeout * 1000,
      server: this.credentials.server,
      user: this.credentials.username,
      password: this.credentials.password,
      domain: this.credentials.domain,
      port: this.credentials.port,
      options: {
        encrypt: encryptAttempt,
      }
    } as MSSQLLib.config);

    await new Promise((resolve, reject) => {
      pool.on('error', reject);
      pool.connect().then(resolve);
    }).catch(e => {
      if (this.retryCount === 0) {
        this.retryCount++;
        return this.open(!encryptAttempt)
        .catch(() => {
          this.retryCount = 0;
          return Promise.reject(e);
        });
      }
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
    const { recordsets, rowsAffected } = await request.query(query);
    const queries = Utils.query.parse(query);
    return recordsets.map((r, i) => {
      const messages = [];
      if (typeof rowsAffected[i] === 'number')
        messages.push(`${rowsAffected[i]} rows were affected.`);

      return {
        cols: Array.isArray(r) ? Object.keys(r[0] || {}) : [],
        messages,
        query: queries[i],
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
}
