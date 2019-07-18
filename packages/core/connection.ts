import { getConnectionId } from './utils';
import Dialects from './dialect';
import {
  ConnectionDialect,
  ConnectionInterface,
} from './interface';
import SQLTools, { DatabaseInterface } from './plugin-api';
import { decorateException } from './utils/errors';

export default class Connection {
  private tables: DatabaseInterface.Table[] = [];
  private columns: DatabaseInterface.TableColumn[] = [];
  private functions: DatabaseInterface.Function[] = [];
  private connected: boolean = false;
  private conn: ConnectionDialect;
  constructor(private credentials: ConnectionInterface, private telemetry: SQLTools.TelemetryInterface) {
    this.conn = new Dialects[credentials.dialect](this.credentials);
  }

  private decorateException = (e: Error) => {
    e = decorateException(e, { conn: this.credentials });
    return Promise.reject(e);
  }

  public needsPassword() {
    return this.conn.credentials.askForPassword;
  }

  public async connect() {
    if (typeof this.conn.testConnection === 'function')
      await this.conn.testConnection().catch(this.decorateException);
    else
      await this.query('SELECT 1;', {}, true);
    this.connected = true;
  }

  public setPassword(password: string) {
    this.conn.credentials.password = password;
  }

  public getPassword() {
    return this.conn.credentials.password;
  }
  public isConnected() {
    return this.connected;
  }

  public close() {
    if (this.needsPassword()) this.conn.credentials.password = null;
    this.connected = false;
    return this.conn.close();
  }

  public open() {
    return this.conn.open().catch(this.decorateException);
  }

  public getTables(cached: boolean = false): Promise<DatabaseInterface.Table[]> {
    if (cached && this.tables.length > 0) {
      return Promise.resolve(this.tables);
    }
    return this.conn.getTables().then((tables: DatabaseInterface.Table[]) => {
      this.tables = tables;
      return this.tables;
    }).catch(this.decorateException);
  }

  public getColumns(cached: boolean = false): Promise<DatabaseInterface.TableColumn[]> {
    if (cached && this.columns.length > 0) {
      return Promise.resolve(this.columns);
    }
    return this.conn.getColumns().then((columns: DatabaseInterface.TableColumn[]) => {
      this.columns = columns;
      return this.columns;
    }).catch(this.decorateException);
  }

  public getFunctions(cached: boolean = false): Promise<DatabaseInterface.Function[]> {
    if (cached && this.columns.length > 0) {
      return Promise.resolve(this.functions);
    }
    return this.conn.getFunctions().then((functions: DatabaseInterface.Function[]) => {
      this.functions = functions;
      return this.functions;
    }).catch(this.decorateException);
  }
  public async getDDL(tableName: string) {
    const info = await this.conn.getDDL(tableName).catch(this.decorateException);
    return info;
  }

  public async describeTable(tableName: string) {
    const info = await this.conn.describeTable(tableName).catch(this.decorateException);

    if (info[0]) {
      info[0].label = `Table ${tableName}`;
    }
    return info;
  }
  public async showRecords(tableName: string, globalLimit: number) {
    const limit = this.conn.credentials.previewLimit || globalLimit || 50;
    const records = await this.conn.showRecords(tableName, limit).catch(this.decorateException);

    if (records[0]) {
      records[0].label = `Showing ${Math.min(limit, records[0].results.length || 0)} ${tableName} records`;
    }
    return records;
  }

  public query(query: string, params: DatabaseInterface.Parameters = {},  throwIfError: boolean = false): Promise<DatabaseInterface.QueryResults[]> {
    return this.conn.query(query, params)
      .catch(this.decorateException)
      .catch((e) => {
        if (throwIfError) throw e;
        this.telemetry.registerException(e, { dialect: this.conn.credentials.dialect });
        let message = '';
        if (typeof e === 'string') {
          message = e;
        } else if (e.message) {
          message = e.message;
        } else {
          message = JSON.stringify(e);
        }
        return [ {
          connId: this.getId(),
          cols: [],
          error: true,
          messages: [ message ],
          query,
          results: [],
        } ];
      });
  }
  public getName() {
    return this.conn.credentials.name;
  }
  public getServer() {
    return this.conn.credentials.server;
  }

  public getPort() {
    return this.conn.credentials.port;
  }
  public getUsername() {
    return this.conn.credentials.username;
  }

  public getDatabase() {
    return this.conn.credentials.database;
  }

  public getDialect() {
    return this.conn.credentials.dialect;
  }

  public getId() {
    return getConnectionId(this.conn.credentials);
  }

  public serialize(): ConnectionInterface {
    return {
      id: this.getId(),
      ...this.conn.credentials,
      isConnected: this.isConnected(),
    };
  }
}
