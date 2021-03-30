import MySQLLib from 'mysql';
import AbstractDriver from '@sqltools/base-driver';
import * as Queries from './queries';
import fs from 'fs';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';
import { countBy } from 'lodash';
import { parse as queryParse } from '@sqltools/util/query';
import generateId from '@sqltools/util/internal-id';

export default class MySQLDefault
  extends AbstractDriver<MySQLLib.Pool, MySQLLib.PoolConfig>
  implements IConnectionDriver {
  queries = Queries;
  public open() {
    if (this.connection) {
      return this.connection;
    }

    const mysqlOptions: any = this.credentials.mysqlOptions || {};
    if (typeof mysqlOptions.ssl === 'object') {
      ['ca', 'cert', 'crl', 'key', 'pfx'].forEach(k => {
        if (!mysqlOptions.ssl[k]) return;
        mysqlOptions.ssl[k] = fs.readFileSync(mysqlOptions.ssl[k]);
      });
    }

    const pool = MySQLLib.createPool(
      this.credentials.connectString || {
        connectTimeout: this.credentials.connectionTimeout * 1000,
        database: this.credentials.database,
        socketPath: this.credentials.socketPath,
        host: this.credentials.server,
        port: this.credentials.port,
        password: this.credentials.password,
        user: this.credentials.username,
        multipleStatements: true,
        dateStrings: true,
        bigNumberStrings: true,
        supportBigNumbers: true,
        ...mysqlOptions,
      }
    );

    return new Promise<MySQLLib.Pool>((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) return reject(err);
        conn.ping(error => {
          if (error) return reject(error);
          this.connection = Promise.resolve(pool);
          conn.release();
          return resolve(this.connection);
        });
      });
    });
  }

  public close() {
    if (!this.connection) return Promise.resolve();

    return this.connection.then(pool => {
      return new Promise<void>((resolve, reject) => {
        pool.end(err => {
          if (err) return reject(err);
          this.connection = null;
          return resolve();
        });
      });
    });
  }

  public query: typeof AbstractDriver['prototype']['query'] = (query, opt = {}) => {
    return this.open().then(
      (conn): Promise<NSDatabase.IResult[]> => {
        const { requestId } = opt;
        return new Promise((resolve, reject) => {
          conn.query({ sql: query.toString(), nestTables: true }, (error, results, fields) => {
            if (error) return reject(error);
            try {
              const queries = queryParse(query.toString());
              if (results && !Array.isArray(results[0]) && typeof results[0] !== 'undefined') {
                results = [results];
              }
              return resolve(
                queries.map(
                  (q, i): NSDatabase.IResult => {
                    const r = results[i] || [];
                    const messages = [];
                    if (r.affectedRows) {
                      messages.push(`${r.affectedRows} rows were affected.`);
                    }
                    if (r.changedRows) {
                      messages.push(`${r.changedRows} rows were changed.`);
                    }
                    return {
                      connId: this.getId(),
                      requestId,
                      resultId: generateId(),
                      cols: fields && Array.isArray(fields) ? this.getColumnNames(fields) : [],
                      messages,
                      query: q,
                      results: Array.isArray(r) ? this.mapRows(r, fields) : [],
                    };
                  }
                )
              );
            } catch (err) {
              return reject(err);
            }
          });
        });
      }
    );
  };

  private getColumnNames(fields: MySQLLib.FieldInfo[] = []): string[] {
    const count = countBy(fields, ({ name }) => name);
    return fields.map(({ table, name }) => (count[name] > 1 ? `${table}.${name}` : name));
  }

  private mapRows(rows: any[] = [], fields: MySQLLib.FieldInfo[] = []): any[] {
    const names = this.getColumnNames(fields);
    return rows.map(row =>
      fields.reduce((r, { table, name }, i) => ({ ...r, [names[i]]: castResultsIfNeeded(row[table][name]) }), {})
    );
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    throw new Error('Never called! Must use parent classe');
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
    throw new Error('Never called! Must use parent classe');
  }
}

const castResultsIfNeeded = (data: any) => {
  if (!Buffer.isBuffer(data)) return data;
  return Buffer.from(data).toString('hex');
};
