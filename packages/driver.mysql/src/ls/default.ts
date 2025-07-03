import MySQLLib from 'mysql2';
import AbstractDriver from '@sqltools/base-driver';
import * as Queries from './queries';
import fs from 'fs';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';
import {countBy} from 'lodash';
import { parse as queryParse } from '@sqltools/util/query';
import generateId from '@sqltools/util/internal-id';

export default class MySQLDefault extends AbstractDriver<MySQLLib.Pool, MySQLLib.PoolOptions> implements IConnectionDriver {
  queries = Queries;
  public async open() {
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

    let pool: MySQLLib.Pool;

    if (this.credentials.connectString) {
      pool = MySQLLib.createPool(this.credentials.connectString);
    } else {
      const poolConfig = {
        host: this.credentials.server,
        port: this.credentials.port,
        connectTimeout: this.credentials.connectionTimeout * 1000,
        database: this.credentials.database,
        socketPath: this.credentials.socketPath,
        password: this.credentials.password,
        user: this.credentials.username,
        multipleStatements: true,
        dateStrings: true,
        bigNumberStrings: true,
        supportBigNumbers: true,
        ...mysqlOptions,
      };

      if (this.credentials.ssh === 'Enabled' && this.credentials.sshOptions) {
        const { port: localPort } = await this.createSshTunnel(
          {
            host: this.credentials.sshOptions.host,
            port: this.credentials.sshOptions.port,
            username: this.credentials.sshOptions.username,
            password: this.credentials.sshOptions.password,
            privateKeyPath: this.credentials.sshOptions.privateKeyPath,
          },
          {
            host: this.credentials.server,
            port: this.credentials.port,
          }
        );
        Object.assign(poolConfig, {
          host: 'localhost',
          port: localPort,
        });
      }

      pool = MySQLLib.createPool(poolConfig);
    }

    return new Promise<MySQLLib.Pool>((resolve, reject) => {
      pool.getConnection((err, conn) => {
        if (err) return reject(err);
        this.connection = Promise.resolve(pool);
        conn.release();
        return resolve(this.connection);
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

  public query: (typeof AbstractDriver)['prototype']['query'] = (query, opt = {}) => {
    return this.open().then((conn): Promise<NSDatabase.IResult[]> => {
      const { requestId } = opt;
      return new Promise((resolve, reject) => {
        conn.query({ sql: query.toString(), nestTables: true }, (error, results, fields: any) => {
          if (error) return reject(error);
          try {
            const queries = queryParse(query.toString());
            var resultsAny: any = results;
            var fieldsAny: any = fields;

            // Shape of results and fields is different when querystring contains multiple queries.
            // Must also cater for the result of an INSERT, where results is not an array and fields is undefined.
            if (results
                && (
                    (!Array.isArray(results[0]) && typeof results[0] !== 'undefined')
                  ||
                    !Array.isArray(results)
                  )
              ) {
              resultsAny = [results];
            }
            if (fields && !Array.isArray(fields[0]) && typeof fields[0] !== 'undefined') {
              fieldsAny = [fields];
            }
            
            return resolve(queries.map((q, i): NSDatabase.IResult => {
              const r = resultsAny[i] || [];
              var f = fieldsAny ? fieldsAny[i] || [] : undefined;
              const messages = [];
              if (r.affectedRows) {
                messages.push(`${r.affectedRows} rows were affected.`);
              }
              if (r.changedRows) {
                messages.push(`${r.changedRows} rows were changed.`);
              }
              if (f) {
                f = f.filter(field => typeof field !== 'undefined');
              }
              return {
                connId: this.getId(),
                requestId,
                resultId: generateId(),
                cols: f && Array.isArray(f) ? this.getColumnNames(f) : [],
                messages,
                query: q,
                results: Array.isArray(r) ? this.mapRows(r, f) : [],
              };
            }));
          } catch (err) {
            return reject(err);
          }
        });
      });
    }).catch((reason) => {
      throw new Error(reason.message);
    });
  }

  private getColumnNames(fields: MySQLLib.FieldPacket[] = []): string[] {
    const count = countBy(fields, ({name}) => name);
    return fields.map(({table, name}) => count[name] > 1 ? `${table}.${name}` : name);
  }

  private mapRows(rows: any[] = [], fields: MySQLLib.FieldPacket[] = []): any[] {
    const names = this.getColumnNames(fields);
    return rows.map((row) => fields.reduce((r, {table, name}, i) => ({...r, [names[i]]: castResultsIfNeeded(row[table][name])}), {}));
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
}