import { Pool, PoolConfig, types } from 'pg';
import Queries from './queries';
import { ConnectionDialect, ConnectionInterface } from '@sqltools/core/interface';
import GenericDialect from '@sqltools/core/dialect/generic';
import * as Utils from '@sqltools/core/utils';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

const TIMESTAMPTZ_OID = 1184
const TIMESTAMP_OID = 1114
const rawValue = (v: string) => v;
types.setTypeParser(TIMESTAMPTZ_OID, rawValue);
types.setTypeParser(TIMESTAMP_OID, rawValue);

export default class PostgreSQL extends GenericDialect<Pool> implements ConnectionDialect {
  queries = Queries;
  public open() {
    if (this.connection) {
      return this.connection;
    }

    const pgOptions: any = this.credentials.pgOptions || <ConnectionInterface['pgOptions']>{};

    let poolConfig: PoolConfig = {
      statement_timeout: this.credentials.connectionTimeout * 1000,
      ...pgOptions,
    };

    if (this.credentials.connectString) {
      poolConfig = {
        connectionString: this.credentials.connectString,
        ...poolConfig,
      }
    } else {
      poolConfig = {
        database: this.credentials.database,
        host: this.credentials.server,
        password: this.credentials.password,
        port: this.credentials.port,
        user: this.credentials.username,
        ...poolConfig,
      };
    }

    const pool = new Pool(poolConfig);
    return pool.connect()
      .then(cli => {
        cli.release();
        this.connection = Promise.resolve(pool);
        return this.connection;
      });
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    const pool = await this.connection;
    this.connection = null;
    pool.end();
  }

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.open()
      .then((conn) => conn.query(query))
      .then((results: any[] | any) => {
        const queries = Utils.query.parse(query, 'pg');
        const messages = [];
        if (!Array.isArray(results)) {
          results = [results];
        }

        return results.map((r, i): DatabaseInterface.QueryResults => {
          if (r.rows.length === 0 && r.command.toLowerCase() !== 'select' && typeof r.rowCount === 'number') {
            messages.push(`${r.rowCount} rows were affected.`);
          }
          return {
            connId: this.getId(),
            cols: (r.fields || []).map(({ name }) => name),
            messages,
            query: queries[i],
            results: r.rows,
          };
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
              name: obj.tablename,
              isView: !!obj.isview,
              numberOfColumns: parseInt(obj.numberofcolumns, 10),
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableSchema: obj.tableschema,
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
            return {
              columnName: obj.columnname,
              defaultValue: obj.defaultvalue,
              isNullable: !!obj.isnullable ? obj.isnullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableName: obj.tablename,
              tableSchema: obj.tableschema,
              isPk: (obj.keytype || '').toLowerCase() === 'primary key',
              isFk: (obj.keytype || '').toLowerCase() === 'foreign key',
              type: obj.type,
              tree: obj.tree,
            } as DatabaseInterface.TableColumn;
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
            } as DatabaseInterface.TableColumn;
          });
      });
  }

  public describeTable(prefixedTable: string) {
    const [ catalog, schema, table ] = prefixedTable.split('.').map(v => v.replace(/^("(.+)")$/g, '$2'));
    return this.query(Utils.replacer(this.queries.describeTable, { catalog, schema, table }));
  }
}