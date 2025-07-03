import MySQLXLib from '@mysql/xdevapi';
import { IConnectionDriver, IConnection, NSDatabase } from '@sqltools/types';
import { parse as queryParse } from '@sqltools/util/query';
import AbstractDriver from '@sqltools/base-driver';
import * as Queries from './queries';
import generateId from '@sqltools/util/internal-id';

export default class MySQLX extends AbstractDriver<any, any> implements IConnectionDriver {
  queries = Queries;
  public async open() {
    if (this.connection) {
      return this.connection;
    }

    try {
      const mysqlOptions = this.credentials.mysqlOptions || <IConnection['mysqlOptions']>{};
      let connectionOptions: string | MySQLXLib.ConnectionOptions;

      if (this.credentials.connectString) {
        connectionOptions = this.credentials.connectString;
      } else {
        connectionOptions = {
          host: this.credentials.server,
          password: this.credentials.password,
          port: this.credentials.port,
          user: this.credentials.username,
          schema: this.credentials.database,
          connectTimeout: this.credentials.connectionTimeout * 1000,
          socket: this.credentials.socketPath,
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
          Object.assign(connectionOptions, {
            host: 'localhost',
            port: localPort,
          });
        }
      }

      const client = MySQLXLib.getClient(connectionOptions, {
        pooling: {
          enabled: true,
          maxIdleTime: this.credentials.connectionTimeout * 1000,
          maxSize: 15,
          queueTimeout: 30000,
        },
      });

      await client.getSession();
      this.connection = Promise.resolve(client);
      return this.connection;
    } catch (error) {
      this.connection = null;
      return Promise.reject(error);
    }
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    const client = await this.connection;
    await client.close();
    this.connection = null;
  }

  private async runSingleQuery(query: string, session: any, opt: any = {}): Promise<NSDatabase.IResult> {
    try {
      const results: any[] = [];
      const messages: string[] = [];
      const cols: string[] = [];
      const props = {};
      const { requestId } = opt;

      function toMappedRow(row = []) {
        const mapped = {};
        Object.defineProperty(mapped, '______row', {
          enumerable: false,
          writable: false,
          value: row,
        });
        Object.defineProperties(mapped, props);
        return JSON.parse(JSON.stringify(mapped, cols));
      }

      await session.sql(query).execute(_result => results.push(toMappedRow(_result)), _meta => {
        _meta.forEach(({ name }, i) => {
          cols.push(name);
          props[name] = {
            enumerable: true,
            get: function() {
              return this.______row[i];
            },
          }
        });
      });

      return {
        requestId,
        resultId: generateId(),
        connId: this.getId(),
        cols,
        messages,
        query,
        results,
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = async (query, opt = {}) => {
    try {
      const session = await this.open().then(client => client.getSession());
      const queries = queryParse(query.toString());
      const results = [];
      for(let q of queries) {
        const res = await this.runSingleQuery(q, session, opt);
        res && results.push(res);
      }
      await session.close();
      return results;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    throw new Error('Never called! Must use parent classe');
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
    throw new Error('Never called! Must use parent classe');
  }
}
