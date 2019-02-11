import FirebirdLib from 'node-firebird';
import queries from './queries';
import GenericDialect from '@sqltools/core/dialect/generic';
import { ConnectionDialect, ConnectionCredentials, DatabaseInterface } from '@sqltools/core/interface';

export default class fb extends GenericDialect<FirebirdLib.ConnectionPool> implements ConnectionDialect {
  queries = queries;

  public open() {
    if (this.connection) {
      return this.connection;
    }
    const firebaseSpecific = (this.credentials.dialectOptions || {}).firebase || {} as ConnectionCredentials['dialectOptions']['firebase'];

    return new Promise<FirebirdLib.ConnectionPool>((resolve, reject) => {
      const pool = FirebirdLib.pool(10, {
        database: this.credentials.database,
        host: this.credentials.server,
        password: this.credentials.password,
        port: this.credentials.port,
        user: this.credentials.username,
        lowercase_keys: firebaseSpecific.lowercaseKeys,
        role: firebaseSpecific.role,
        pageSize: firebaseSpecific.pageSize,
      }, undefined);
      pool.get((err, db) => {
        if (err) return reject(err);
        db.detach();
        this.connection = Promise.resolve(pool);
        return resolve(this.connection);
      });
    });
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    const pool = await this.connection;
    pool.destroy();
    this.connection = undefined;
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const pool = await this.open();
    const db = await new Promise<FirebirdLib.Database>((resolve, reject) => {
      pool.get((err, db) => {
        if (err) return reject(err);
        return resolve(db);
      })
    });
    let results = await new Promise<any[]>((resolve, reject) => {
      db.execute(query, [], (err, results) => {
        if (err) return reject(err);
        return resolve(results);
      });
    })
    const queries = query.split(/\s*;\s*(?=([^']*'[^']*')*[^']*$)/g);
    const messages = [];
    if (!Array.isArray(results)) {
      results = [results];
    }

    return results.map((r, i) => {
      if (r.rows.length === 0 && r.command.toLowerCase() !== 'select') {
        messages.push(`${r.rowCount} rows were affected.`);
      }
      return {
        cols: r.rows.length > 0 ? Object.keys(r.rows[0]) : [],
        messages,
        query: queries[i],
        results: r.rows,
      };
    });
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.tablename,
              isView: !!obj.isview,
              numberOfColumns: parseInt(obj.numberofcolumns, 10),
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableSchema: obj.tableschema,
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
            return {
              columnName: obj.columnname,
              defaultValue: obj.defaultvalue,
              isNullable: !!obj.FIELDNULL ? obj.FIELDNULL.toString() === '' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableName: obj.tablename,
              tableSchema: obj.tableschema,
              type: obj.FIELD_TYPE,
            } as DatabaseInterface.TableColumn;
          })
          .sort();
      });
  }
}
