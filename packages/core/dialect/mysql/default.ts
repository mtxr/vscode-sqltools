import MySQLLib from 'mysql';
import {
  ConnectionDialect,
  DatabaseInterface,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import GenericDialect from '@sqltools/core/dialect/generic';
import Queries from './queries';
export default class MySQLDefault extends GenericDialect<MySQLLib.Pool> implements ConnectionDialect {
  queries = Queries;
  public open() {
    if (this.connection) {
      return this.connection;
    }

    const pool = MySQLLib.createPool({
      connectTimeout: this.credentials.connectionTimeout * 1000,
      database: this.credentials.database,
      host: this.credentials.server,
      password: this.credentials.password,
      port: this.credentials.port,
      user: this.credentials.username,
      multipleStatements: true
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

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.open().then((conn): Promise<DatabaseInterface.QueryResults[]> => {
      return new Promise((resolve, reject) => {
        conn.query(query, (error, results) => {
          if (error) return reject(error);
          const queries = Utils.query.parse(query);
          if (results && !Array.isArray(results[0]) && typeof results[0] !== 'undefined') {
            results = [results];
          }
          if (results.length === 0) {
            return [];
          }
          return resolve(results.map((r, i): DatabaseInterface.QueryResults => {
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
              query: queries[i],
              results: Array.isArray(r) ? r : [],
            };
          }));
        });
      });
    });
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
