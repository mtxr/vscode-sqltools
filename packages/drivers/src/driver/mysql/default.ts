import MySQLLib from 'mysql';
import * as Utils from '@sqltools/core/utils';
import AbstractDriver from '@lib/abstract';
import Queries from './queries';
import fs from 'fs';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';

export default class MySQLDefault extends AbstractDriver<MySQLLib.Pool, MySQLLib.PoolConfig> implements IConnectionDriver {
  queries = Queries;
  public open() {
    if (this.connection) {
      return this.connection;
    }

    const mysqlOptions: any = this.credentials.mysqlOptions || {};
    if (typeof mysqlOptions.ssl === 'object') {
      ['ca', 'cert', 'crl', 'key', 'pfx'].forEach((k) => {
        if (!mysqlOptions.ssl[k]) return;
        mysqlOptions.ssl[k] = fs.readFileSync(mysqlOptions.ssl[k]);
      });
    }

    const pool = MySQLLib.createPool(this.credentials.connectString || {
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
      ...mysqlOptions
    });

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

    return this.connection.then((pool) => {
      return new Promise<void>((resolve, reject) => {
        pool.end((err) => {
          if (err) return reject(err);
          this.connection = null;
          return resolve();
        });
      });
    });
  }

  public query(query: string): Promise<NSDatabase.IResult[]> {
    return this.open().then((conn): Promise<NSDatabase.IResult[]> => {
      return new Promise((resolve, reject) => {
        conn.query(query, (error, results) => {
          if (error) return reject(error);
          const queries = Utils.query.parse(query);
          if (results && !Array.isArray(results[0]) && typeof results[0] !== 'undefined') {
            results = [results];
          }
          return resolve(queries.map((q, i): NSDatabase.IResult => {
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
              cols: Array.isArray(r) ? Object.keys(r[0] || {}) : [],
              messages,
              query: q,
              results: Array.isArray(r) ? r : [],
            };
          }));
        });
      });
    });
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    throw new Error('Never called! Must use parent classe');
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
    throw new Error('Never called! Must use parent classe');
  }
}
