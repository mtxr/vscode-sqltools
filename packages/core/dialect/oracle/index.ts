import {
  ConnectionDialect,
} from '../../interface';
import * as Utils from '../../utils';
import queries from './queries';
import queriesLocal from './queriesLocal';
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
    this.queries = this.credentials.local ? queriesLocal : queries; 
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

  public async query(query: string, params: DatabaseInterface.Parameters = {}, maxRows: number = this.credentials.previewLimit): 
      Promise<DatabaseInterface.QueryResults[]> {
        console.time(query.substr(0, 10));
    const conn = await this.open();
    const queries = this.simpleParse(query);
    let realParams:OracleDBLib.BindParameters = {};
    for (let p in params) {
      if (params.hasOwnProperty(p)) {
        let paramValue = params[p];
        let oraType = OracleDBLib.STRING;
        if (paramValue.type == DatabaseInterface.ParameterKind.Date) {
          oraType = OracleDBLib.DATE;
        } else if (paramValue.type == DatabaseInterface.ParameterKind.Number) {
          oraType = OracleDBLib.NUMBER;
        }
        realParams[p] = { type: oraType, dir: OracleDBLib.BIND_IN, val: paramValue.value };
      }
    }
    
    const results: DatabaseInterface.QueryResults[] = [];
    try {
      for(let q of queries) {
        let res = await conn.execute(q, realParams, { outFormat: this.lib.OBJECT, maxRows: maxRows || undefined});
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
    
    console.timeEnd(query.substr(0, 10));
    return results;
  }

  public async testConnection(): Promise<void> {
    return this.query('select 1 from dual').then(() => void 0);
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables,{}, 0)
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
    return this.query(this.queries.fetchColumns,{}, 0)
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
    return this.query(this.queries.describeTable, { "thetable": {type: DatabaseInterface.ParameterKind.String, value: prefixedTable } }, 0);
  }
  
  public async getDDL(object: string): Promise<string[]> {
    await this.query(
      `begin
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM,'EMIT_SCHEMA',false);
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM,'SEGMENT_CREATION',false);
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.SESSION_TRANSFORM,'CONSTRAINTS_AS_ALTER',true);
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.session_transform, 'SQLTERMINATOR', true);
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.session_transform, 'PRETTY', true);
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.session_transform, 'SEGMENT_ATTRIBUTES', false);
        DBMS_METADATA.SET_TRANSFORM_PARAM(DBMS_METADATA.session_transform, 'STORAGE', false);
      end;`
    );
    let res = await this.query(queriesLocal.getDDL, { "theobject": {type: DatabaseInterface.ParameterKind.String, value: object } }, 0);
    return res[0].results.map(p => p.DDL);
  }

  public getFunctions(): Promise<DatabaseInterface.Function[]> {
    return this.query(this.queries.fetchFunctions,{}, 0)
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
