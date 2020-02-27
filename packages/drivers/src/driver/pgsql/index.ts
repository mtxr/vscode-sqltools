import { Pool, PoolConfig, types, FieldDef } from 'pg';
import Queries from './queries';
import { IConnectionDriver, NSDatabase, Arg0, ContextValue, MConnectionExplorer } from '@sqltools/types';
import AbstractDriver from '../../lib/abstract';
import fs from 'fs';
import { zipObject } from 'lodash';
import { parse as queryParse } from '@sqltools/util/query';

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

  private queryResults = async <R = any, Q = any>(query: Q | string | String) => {
    const result = await this.singleQuery<R, Q>(query);
    if (result.error) throw result.rawError;
    return result.results;
  }
  public query: (typeof AbstractDriver)['prototype']['query'] = (query) => {
    console.log(query);
    const messages = [];
    return this.open()
      .then(async (pool) => {
        const cli = await pool.connect();
        cli.on('notice', notice => messages.push(`${notice.name.toUpperCase()}: ${notice.message}`));
        const results = await cli.query({ text: query.toString(), rowMode: 'array' });
        cli.release();
        return results;
      })
      .then((results: any[] | any) => {
        const queries = queryParse(query.toString(), 'pg');
        if (!Array.isArray(results)) {
          results = [results];
        }

        return results.map((r, i): NSDatabase.IResult => {
          messages.push(`${r.command} successfully executed.${r.command.toLowerCase() !== 'select' && typeof r.rowCount === 'number' ? ` ${r.rowCount} rows were affected.` : ''}`);
          const cols = this.getColumnNames(r.fields || []);
          return {
            connId: this.getId(),
            cols,
            messages,
            query: queries[i],
            results: this.mapRows(r.rows, cols),
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
        rawError: err,
        query,
        results: [],
      }]))
  }

  private getColumnNames(fields: FieldDef[]): string[] {
    return fields.reduce((names, { name }) => {
      const count = names.filter((n) => n === name).length;
      return names.concat(count > 0 ? `${name} (${count})` : name);
    }, []);
  }

  private mapRows(rows: any[], columns: string[]): any[] {
    return rows.map((r) => zipObject(columns, r));
  }

  private async getColumns(parent: NSDatabase.ITable): Promise<NSDatabase.IColumn[]> {
    const results = await this.queryResults(this.queries.fetchColumns(parent));
    return results.map(col => ({ ...col, iconName: col.isPk ? 'pk' : (col.isFk ? 'fk' : null), childType: ContextValue.NO_CHILD }));
  }

  public async testConnection() {
    const pool = await this.open()
    const cli = await pool.connect();
    await cli.query('SELECT 1');
    cli.release();
  }

  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        return this.queryResults(this.queries.fetchDatabases());
      case ContextValue.TABLE:
      case ContextValue.VIEW:
      case ContextValue.MATERIALIZED_VIEW:
        return this.getColumns(item as NSDatabase.ITable);
      case ContextValue.DATABASE:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Schemas', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.SCHEMA },
        ];
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
      case ContextValue.SCHEMA:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
          { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
          { label: 'Materialized Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.MATERIALIZED_VIEW },
          { label: 'Functions', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.FUNCTION },
        ];
    }
    return [];
  }
  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.SCHEMA:
        return this.queryResults(this.queries.fetchSchemas(parent as NSDatabase.IDatabase));
      case ContextValue.TABLE:
        return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema));
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema));
      case ContextValue.MATERIALIZED_VIEW:
        return this.queryResults(this.queries.fetchMaterializedViews(parent as NSDatabase.ISchema));
      case ContextValue.FUNCTION:
        return this.queryResults(this.queries.fetchFunctions(parent as NSDatabase.ISchema));
    }
    return [];
  }

  public searchItems(itemType: ContextValue, search: string): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.searchTables({ search }));
    }
  }
}