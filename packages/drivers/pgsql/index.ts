import { Pool, PoolConfig, types } from 'pg';
import Queries from './queries';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';
import AbstractDriver from '@sqltools/drivers/abstract';
import * as Utils from '@sqltools/core/utils';
import fs from 'fs';

const rawValue = (v: string) => v;

types.setTypeParser(types.builtins.TIMESTAMP, rawValue);
types.setTypeParser(types.builtins.TIMESTAMPTZ, rawValue);
types.setTypeParser(types.builtins.DATE, rawValue);

export default class PostgreSQL extends AbstractDriver<Pool, PoolConfig> implements IConnectionDriver {
  queries = Queries;
  public open() {
    if (this.connection) {
      return this.connection;
    }

    const pgOptions: PoolConfig = this.credentials.pgOptions || {};

    let poolConfig: PoolConfig = {
      // statement_timeout: parseInt(`${this.credentials.connectionTimeout || 0}`, 10) * 1000,
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

    if (poolConfig.ssl && typeof poolConfig.ssl === 'object') {
      Object.keys(poolConfig.ssl).forEach(key => {
        if (typeof poolConfig.ssl[key] === 'string' && poolConfig.ssl[key].startsWith('file://')) return;
        this.log.extend('info')(`Reading file ${poolConfig.ssl[key].replace('file://', '')}`)
        poolConfig.ssl[key] = fs.readFileSync(poolConfig.ssl[key].replace('file://', '')).toString();
      });
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

  public query(query: string): Promise<NSDatabase.IResult[]> {
    const messages = [];
    return this.open()
      .then(async (pool) => {
        const cli = await pool.connect();
        cli.on('notice', notice => messages.push(`${notice.name.toUpperCase()}: ${notice.message}`));
        const results = await cli.query(query);
        cli.release();
        return results;
      })
      .then((results: any[] | any) => {
        const queries = Utils.query.parse(query, 'pg');
        if (!Array.isArray(results)) {
          results = [results];
        }

        return results.map((r, i): NSDatabase.IResult => {
          messages.push(`${r.command} successfully executed.${r.command.toLowerCase() !== 'select' && typeof r.rowCount === 'number' ? ` ${r.rowCount} rows were affected.` : ''}`);
          return {
            connId: this.getId(),
            cols: (r.fields || []).map(({ name }) => name),
            messages,
            query: queries[i],
            results: r.rows,
          };
        });
      })
      .catch(err => ([{
          connId: this.getId(),
          cols: [],
          messages: messages.concat([
            [
              (err && err.message || err),
              err && err.routine === 'scanner_yyerror' && err.position ? `at character ${err.position}` : undefined
            ].filter(Boolean).join(' ')
          ]),
          error: true,
          query,
          results: [],
      }]))
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => ({
              name: obj.tablename,
              isView: !!obj.isview,
              numberOfColumns: parseInt(obj.numberofcolumns, 10),
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableSchema: obj.tableschema,
              tree: obj.tree,
            } as NSDatabase.ITable));
      });
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
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
            } as NSDatabase.IColumn;
          });
      });
  }

  public getFunctions(): Promise<NSDatabase.IFunction[]> {
    return this.query(this.queries.fetchFunctions)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              ...obj,
              args: obj.args ? obj.args.split(/, */g) : [],
            } as NSDatabase.IColumn;
          });
      });
  }

  public describeTable(prefixedTable: string) {
    const [ catalog, schema, table ] = prefixedTable.split('.').map(v => v.replace(/^("(.+)")$/g, '$2'));
    return this.query(Utils.replacer(this.queries.describeTable, { catalog, schema, table }));
  }
}