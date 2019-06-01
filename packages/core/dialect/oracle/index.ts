import {
  ConnectionDialect,
} from '../../interface';
import * as Utils from '../../utils';
import queries from './queries';
import OracleDBLib from 'oracledb';
import GenericDialect from '../generic';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
import { trim, pipe, trimCharsEnd } from 'lodash/fp';

const OracleDBLibVersion = '3.1.1';
export default class OracleDB extends GenericDialect<OracleDBLib.Connection> implements ConnectionDialect {
  public static deps: typeof GenericDialect['deps'] = [{
    type: 'package',
    name: 'oracledb',
    version: OracleDBLibVersion,
  }];

  public static poolMap = new Map<string, boolean>();
  public get connection() {
    if (!this.poolCreated) return;
    return this.lib.getConnection(this.poolName) as Promise<OracleDBLib.Connection>;
  }

  queries = queries

  private get lib(): typeof OracleDBLib {
    const oracledb = __non_webpack_require__('oracledb');
    oracledb.fetchAsString = [oracledb.DATE, oracledb.CLOB, oracledb.NUMBER];
    return oracledb;
  }

  private get poolName(): string {
    return Utils.getConnectionId(this.credentials);
  }

  private get poolCreated(): boolean {
    return !!OracleDB.poolMap.get(this.poolName);
  }

  private registerPool() {
    OracleDB.poolMap.set(this.poolName, true);
  }
  private unregisterPool() {
    OracleDB.poolMap.delete(this.poolName);
  }

  public async open() {
    if (this.poolCreated) {
      return this.connection;
    }

    this.needToInstallDependencies();

    let { connectString } = this.credentials;
    if (!connectString) {
      if (this.credentials.server && this.credentials.port) {
        connectString = `${this.credentials.server}:${this.credentials.port}/${this.credentials.database}`;
      } else {
        connectString = this.credentials.database;
      }
    }
    await this.lib.createPool({
      connectString,
      password: this.credentials.password,
      user: this.credentials.username,
      poolAlias: this.poolName,
      ...this.credentials.oracleOptions
    });
    this.registerPool();
    return this.connection;
  }

  public async close() {
    if (!this.poolCreated) return Promise.resolve();
    await this.lib.getPool(this.poolName).close(10 as any);
    this.unregisterPool();
  }

  public simpleParse(code) {
    // Trim empties and slash (/) from code if it exists
    code = pipe(
      trim,
      trimCharsEnd("/"),
      trim
    )(code);

    // Trim semicolon (;) if it doesn't end with "END;" or "END <name>; etc"
    if (!/END(\s\w*)*;$/gi.test(code)) {
      code = trimCharsEnd(";")(code);
    }
    return  [code];
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const conn = await this.open();
    const queries = this.simpleParse(query);
    const results: DatabaseInterface.QueryResults[] = [];
    try {
      for(let q of queries) {
        let res = await conn.execute(q, [], { outFormat: this.lib.OBJECT });
        const messages = [];
        if (res.rowsAffected) {
          messages.push(`${res.rowsAffected} rows were affected.`);
        }
        results.push({
          connId: this.getId(),
          cols: (res.rows && res.rows.length) > 0 ? Object.keys(res.rows[0]) : [],
          messages,
          query: q,
          results: res.rows,
        });
      }
    } finally {
      if (conn) {
        try {
          await conn.close();
        } catch (e) {
          console.log(e);
        }
      }
    }
    return results;
  }

  public async testConnection(): Promise<void> {
    return this.query('select 1 from dual').then(() => void 0);
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.TABLENAME,
              isView: !!obj.ISVIEW,
              numberOfColumns: parseInt(obj.NUMBEROFCOLUMNS, 10),
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableSchema: obj.TABLESCHEMA,
              tree: obj.TREE,
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
              columnName: obj.COLUMNNAME,
              defaultValue: obj.DEFAULTVALUE,
              isNullable: !!obj.ISNULLABLE ? obj.ISNULLABLE.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.SIZE, 10) : null,
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableName: obj.TABLENAME,
              tableSchema: obj.TABLESCHEMA,
              type: obj.TYPE,
              isPk: obj.KEYTYPE === 'P',
              isFk: obj.KEYTYPE === 'R',
              tree: obj.TREE,
            } as DatabaseInterface.TableColumn;
          });
      });
  }

  public describeTable(prefixedTable: string) {
    const [ schema, table ] = prefixedTable.split('.');
    return this.query(Utils.replacer(this.queries.describeTable, { schema, table }));
  }

  public getFunctions(): Promise<DatabaseInterface.Function[]> {
    return this.query(this.queries.fetchFunctions)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.NAME,
              schema: obj.DBSCHEMA,
              database: obj.DBNAME,
              signature: obj.SIGNATURE,
              args: obj.ARGS ? obj.ARGS.split(/, */g) : [],
              resultType: obj.RESULTTYPE,
              tree: obj.TREE,
            } as DatabaseInterface.Function;
          });
      });
  }
}
