import * as CassandraLib from 'cassandra-driver';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';
import * as Utils from '@sqltools/core/utils';
import AbstractDriver from '../../lib/abstract';
import Queries from './queries';
import { TREE_SEP } from '@sqltools/core/constants';

interface CQLBatch {
  query: string,
  statements: string[],
  options: CassandraLib.QueryOptions,
}

export default class CQL extends AbstractDriver<CassandraLib.Client, CassandraLib.ClientOptions> implements IConnectionDriver {
  queries = Queries;

  public async open() {
    if (this.connection) {
      return this.connection;
    }
    const cqlOptions: CassandraLib.ClientOptions = this.credentials.cqlOptions || {};
    const clientOptions: CassandraLib.ClientOptions = {
      contactPoints: [this.credentials.server],
      keyspace: this.credentials.database ? this.credentials.database : undefined,
      authProvider: new CassandraLib.auth.PlainTextAuthProvider(this.credentials.username, this.credentials.password),
      protocolOptions: {
        port: this.credentials.port,
      },
      socketOptions: {
        connectTimeout: parseInt(`${this.credentials.connectionTimeout || 5}`, 10) * 1_000,
      },
      policies: {
        loadBalancing: new CassandraLib.policies.loadBalancing.RoundRobinPolicy(),
      },
      ...cqlOptions,
    };
    const conn = new CassandraLib.Client(clientOptions);
    await conn.connect();
    this.connection = Promise.resolve(conn);
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    const conn = await this.connection;
    await conn.shutdown();
    this.connection = null;
  }

  /**
   * Creates an array of CQL regular statements and batch statements to execute.
   * @param query
   */
  private cqlParse(query: string): (string|CQLBatch)[] {
    const queries = Utils.query.parse(query, 'cql');
    const cqlQueries: (string|CQLBatch)[] = [];
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      const found = query.match(/^BEGIN\s+(UNLOGGED\s+|COUNTER\s+)?BATCH\s+(?:USING\s+TIMESTAMP\s+(\d+)\s+)?([\s\S]+)$/i);

      if (found) {
        const options: CassandraLib.QueryOptions = {};
        if (found[1]) {
          if (found[1].trim().toUpperCase() === 'COUNTER') {
            options.counter = true;
          } else if (found[1].trim().toUpperCase() === 'UNLOGGED') {
            options.logged = false;
          }
        }
        if (found[2]) {
          options.timestamp = parseInt(found[2], 10);
        }
        const batch = {
          query: found[0],
          statements: [found[3]],
          options
        };
        while (true) {
          if (++i == queries.length) {
            throw new Error('Unterminated batch block; include "APPLY BATCH;" at the end');
          }
          const batchQuery = queries[i];
          batch.query += ` ${batchQuery}`;
          if (batchQuery.match(/^APPLY\s+BATCH\s*;?$/i)) {
            cqlQueries.push(batch);
            break;
          } else {
            batch.statements.push(batchQuery);
          }
        }

      } else {
        cqlQueries.push(query);
      }
    }
    return cqlQueries;
  }

  public async query(query: string): Promise<NSDatabase.IResult[]> {
    const conn = await this.open();
    const queries = this.cqlParse(query);
    const results: NSDatabase.IResult[] = [];
    for (let i = 0; i < queries.length; i++) {
      const q = queries[i];
      let query: string;
      let result: CassandraLib.types.ResultSet;
      try {
        if (typeof q === 'string') {
          query = q;
          result = await conn.execute(q);
        } else {
          query = q.query;
          result = await conn.batch(q.statements, q.options);
        }
        const messages = [];
        const cols = result.columns ? result.columns.map(column => column.name) : [];
        const queryresult: NSDatabase.IResult = {
          connId: this.getId(),
          cols,
          messages,
          query,
          results: result.rows || [],
        };
        results.push(queryresult);
      } catch (e) {
        // Return error and previous queries, as they might have modified data
        const queryresult: NSDatabase.IResult = {
          connId: this.getId(),
          cols: [],
          messages: [e.toString()],
          query,
          results: [],
          error: true,
        };
        results.push(queryresult);
        // continue;
        return results;
      }
    }
    return results;
  }

  public async getTables(): Promise<NSDatabase.ITable[]> {
    const [queryResults, numberOfColumnsResults] = await this.query(this.queries.fetchTables);
    const numberOfColumnsMap: {string: {string: number}} = numberOfColumnsResults.results.reduce((prev, curr) => prev.concat(curr), []).reduce((acc, obj: any) => {
      if (typeof acc[obj.keyspace_name] === 'undefined') {
        acc[obj.keyspace_name] = {};
      }
      acc[obj.keyspace_name][obj.table_name] = parseInt(JSON.parse(obj.count), 10);
      return acc;
    }, {});
    return queryResults.results.reduce((prev, curr) => prev.concat(curr), []).map((obj: any) => {
      const table: NSDatabase.ITable = {
        name: obj.table_name,
        isView: false,
        tableSchema: obj.keyspace_name,
        numberOfColumns: numberOfColumnsMap[obj.keyspace_name] ? numberOfColumnsMap[obj.keyspace_name][obj.table_name] : undefined,
        tree: [obj.keyspace_name, 'tables', obj.table_name].join(TREE_SEP)
      };
      return table;
    });
  }

  public async getColumns(): Promise<NSDatabase.IColumn[]> {
    const [queryResults] = await this.query(this.queries.fetchColumns);
    return queryResults.results.reduce((prev, curr) => prev.concat(curr), []).map((obj: any) => {
      const column: NSDatabase.IColumn = {
        columnName: obj.column_name,
        tableName: obj.table_name,
        type: obj.type,
        isNullable: obj.kind === 'regular',
        isPk: obj.kind !== 'regular',
        isPartitionKey: obj.kind === 'partition_key',
        tableSchema: obj.keyspace_name,
        tree: [obj.keyspace_name, 'tables', obj.table_name, obj.column_name].join(TREE_SEP)
      };
      return column;
    });
  }

  public async getFunctions(): Promise<NSDatabase.IFunction[]> {
    const [queryResults] = await this.query(this.queries.fetchFunctions);
    return queryResults.results.reduce((prev, curr) => prev.concat(curr), []).map((obj: any) => {
      const func: NSDatabase.IFunction = {
        name: obj.function_name,
        schema: obj.keyspace_name,
        database: '',
        signature: obj.argument_types ? `(${obj.argument_types.join(',')})` : '()',
        args: obj.argument_names,
        resultType: obj.return_type,
        source: obj.body,
        tree: [obj.keyspace_name, 'functions', obj.function_name].join(TREE_SEP),
      };
      return func;
    });
  }

  public async describeTable(prefixedTable: string) {
    const [keyspace, table] = prefixedTable.split('.');
    return this.query(Utils.replacer(this.queries.describeTable, {keyspace, table}));
  }

  public async showRecords(prefixedTable: string, limit: number) {
    const [keyspace, table] = prefixedTable.split('.');
    return this.query(Utils.replacer(this.queries.fetchRecords, {keyspace, table, limit}));
  }

  public async testConnection() {
    await this.query('SELECT now() FROM system.local');
  }

}
