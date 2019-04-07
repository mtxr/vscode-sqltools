import MySQLXLib from '@mysql/xdevapi';
import {
  ConnectionDialect,
  ConnectionInterface,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import GenericDialect from '@sqltools/core/dialect/generic';
import Queries from './queries';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

export default class MySQLX extends GenericDialect<any> implements ConnectionDialect {
  queries = Queries;
  public async open() {
    if (this.connection) {
      return this.connection;
    }

    const { ssl } = this.credentials.mysqlOptions || <ConnectionInterface['mysqlOptions']>{};
    const client = MySQLXLib.getClient(
      {
        host: this.credentials.server,
        password: this.credentials.password,
        port: this.credentials.port,
        user: this.credentials.username,
        schema: this.credentials.database,
        connectTimeout: this.credentials.connectionTimeout * 1000,
        ssl,
      },
      {
        pooling: {
          enabled: true,
          maxIdleTime: this.credentials.connectionTimeout * 1000,
          maxSize: 15,
          queueTimeout: 30000
        }
      }
    );

    await client.getSession();
    this.connection = Promise.resolve(client);
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    const client = await this.connection;
    await client.close();
    this.connection = null;
  }

  private async runSingleQuery(query: string, session): Promise<DatabaseInterface.QueryResults> {
    const results: any[] = [];
    const messages: string[] = [];
    const cols: string[] = [];
    const props = {};

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

    const queryInfo = await session.sql(query).execute(_result => results.push(toMappedRow(_result)), _meta => {
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

    const affectedRows = queryInfo.getAffectedRowsCount();



    if (affectedRows) {
      messages.push(`${affectedRows} rows were affected.`);
    }
    return {
      connId: this.getId(),
      cols,
      messages,
      query,
      results,
    }
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const session = await this.open().then(client => client.getSession());
    const queries = Utils.query.parse(query);
    const results = [];
    for(let q of queries) {
      const res = await this.runSingleQuery(q, session);
      res && results.push(res);
    }
    await session.close();
    return results;
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
              isPk: Boolean(obj.isPk),
              isFk: Boolean(obj.isFk),
            };
          });
      });
  }
}
