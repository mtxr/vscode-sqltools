import { Pool, Client } from 'ibm-netezza';
import Queries from './queries';
import { IConnectionDriver, NSDatabase, Arg0, ContextValue, MConnectionExplorer } from '@sqltools/types';
import AbstractDriver from '@sqltools/base-driver';
import { parse as queryParse } from '@sqltools/util/query';
import generateId from '@sqltools/util/internal-id';

interface NetezzaPoolConfig {
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  connectionString?: string;
  connectionTimeoutMillis?: number;
  max?: number;
  idleTimeoutMillis?: number;
  [key: string]: any;
}

export default class Netezza extends AbstractDriver<Pool, NetezzaPoolConfig> implements IConnectionDriver {
  queries = Queries;
  public async open() {
    if (this.connection) {
      return this.connection;
    }
    try {
      const nzOptions: NetezzaPoolConfig = this.credentials.nzOptions || {};

      let poolConfig: NetezzaPoolConfig = {
        connectionTimeoutMillis: Number(`${this.credentials.connectionTimeout || 0}`) * 1000,
        ...nzOptions,
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
          port: this.credentials.port || 5480,
          user: this.credentials.username,
          ...poolConfig,
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
              port: this.credentials.port || 5480,
            }
          );
          Object.assign(poolConfig, {
            host: 'localhost',
            port: localPort,
          });
        }
      }

      const pool = new Pool(poolConfig);
      const cli = await pool.connect();
      cli.release();
      this.connection = Promise.resolve(pool);
      return this.connection;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    const pool = await this.connection;
    this.connection = null;
    pool.end();
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = (query, opt = {}) => {
    const messages = [];
    let cli: Client;
    const { requestId } = opt;
    return this.open()
      .then(async (pool) => {
        cli = await pool.connect();
        const results = await cli.query(query.toString());
        cli.release();
        return results;
      })
      .then((results: any[] | any) => {
        const queries = queryParse(query.toString(), 'pg');
        if (!Array.isArray(results)) {
          results = [results];
        }

        return results.map((r, i): NSDatabase.IResult => {
          const cols = r.fields ? r.fields.map((f: any) => f.name) : [];
          return {
            requestId,
            resultId: generateId(),
            connId: this.getId(),
            cols,
            messages: messages.concat([
              this.prepareMessage(`${r.command || 'Query'} successfully executed.${
                r.command && r.command.toLowerCase() !== 'select' && typeof r.rowCount === 'number' ? ` ${r.rowCount} rows were affected.` : ''
              }`)
            ]),
            query: queries[i],
            results: r.rows || [],
          };
        });
      })
      .catch(err => {
        cli && cli.release();
        return [<NSDatabase.IResult>{
          connId: this.getId(),
          requestId,
          resultId: generateId(),
          cols: [],
          messages: messages.concat([
            this.prepareMessage ([
              (err && err.message || err),
              err && err.routine === 'scanner_yyerror' && err.position ? `at character ${err.position}` : undefined
            ].filter(Boolean).join(' '))
          ]),
          error: true,
          rawError: err,
          query,
          results: [],
        }];
      });
  }

  private async getColumns(parent: NSDatabase.ITable): Promise<NSDatabase.IColumn[]> {
    const results = await this.queryResults(this.queries.fetchColumns(parent));
    return results.map(col => ({
      ...col,
      iconName: col.isPk ? 'pk' : (col.isFk ? 'fk' : null),
      childType: ContextValue.NO_CHILD,
      table: parent
    }));
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

  public searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.searchTables({ search }));
      case ContextValue.COLUMN:
        return this.queryResults(this.queries.searchColumns({ search, ...extraParams }));
    }
  }

  private completionsCache: { [w: string]: NSDatabase.IStaticCompletion } = null;
  public getStaticCompletions = async () => {
    if (this.completionsCache) return this.completionsCache;
    this.completionsCache = {};
    
    // Netezza SQL keywords - basic set
    const keywords = [
      'SELECT', 'FROM', 'WHERE', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP', 'ALTER',
      'TABLE', 'VIEW', 'INDEX', 'DATABASE', 'SCHEMA', 'JOIN', 'LEFT', 'RIGHT', 'INNER',
      'OUTER', 'ON', 'AS', 'AND', 'OR', 'NOT', 'NULL', 'IS', 'IN', 'BETWEEN', 'LIKE',
      'ORDER', 'BY', 'GROUP', 'HAVING', 'LIMIT', 'OFFSET', 'UNION', 'INTERSECT', 'EXCEPT',
      'DISTINCT', 'ALL', 'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'CAST',
      'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES', 'UNIQUE', 'CHECK', 'DEFAULT', 'CONSTRAINT'
    ];

    keywords.forEach((keyword: string) => {
      this.completionsCache[keyword] = {
        label: keyword,
        detail: keyword,
        filterText: keyword,
        sortText: (['SELECT', 'CREATE', 'UPDATE', 'DELETE'].includes(keyword) ? '2:' : '') + keyword,
        documentation: {
          value: `\`\`\`yaml\nWORD: ${keyword}\nTYPE: KEYWORD\n\`\`\``,
          kind: 'markdown'
        }
      }
    });

    return this.completionsCache;
  }
}
