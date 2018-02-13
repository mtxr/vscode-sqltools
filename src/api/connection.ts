import { History, Logger, Telemetry } from './';
import Dialects from './dialect';
import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  LoggerInterface,
} from './interface';

export interface SerializedConnection {
  isConnected: boolean;
  needsPassword: boolean;
  name: string;
  port: number | string;
  server: string;
  username: string;
}

export default class Connection {
  private tables: DatabaseInterface.Table[] = [];
  private columns: DatabaseInterface.TableColumn[] = [];
  private connected: boolean = false;
  private conn: ConnectionDialect;
  constructor(credentials: ConnectionCredentials, private logger: LoggerInterface) {
    this.conn = new Dialects[credentials.dialect](credentials);
  }

  public needsPassword() {
    return this.conn.credentials.askForPassword;
  }

  public connect() {
    return this.query('SELECT 1;', true)
      .then(() => {
        this.connected = true;
        return true;
      })
      .catch((e) => Promise.reject(e));
  }

  public setPassword(password: string) {
    this.conn.credentials.password = password;
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
    return this.conn.open();
  }

  public getTables(cached: boolean = false): Promise<DatabaseInterface.Table[]> {
    if (cached && this.tables.length > 0) {
      return Promise.resolve(this.tables);
    }
    return this.conn.getTables().then((tables: DatabaseInterface.Table[]) => {
      this.tables = tables;
      return this.tables;
    });
  }

  public getColumns(cached: boolean = false): Promise<DatabaseInterface.TableColumn[]> {
    if (cached && this.columns.length > 0) {
      return Promise.resolve(this.columns);
    }
    return this.conn.getColumns().then((columns: DatabaseInterface.TableColumn[]) => {
      this.columns = columns;
      return this.columns;
    });
  }

  public describeTable(tableName: string): Promise<any> {
    return this.conn.describeTable(tableName);
  }
  public showRecords(tableName: string, limit: number = 10): Promise<any> {
    return this.conn.showRecords(tableName, limit);
  }

  public query(query: string, handleError: boolean = true): Promise<DatabaseInterface.QueryResults[]> {
    return this.conn.query(query)
      .catch((e) => {
        if (!handleError) throw e;
        this.logger.error('Query error:', e);
        Telemetry.registerException(e);
        let message = '';
        if (typeof e === 'string') {
          message = e;
        } else if (e.message) {
          message = e.message;
        } else {
          message = JSON.stringify(e);
        }
        return [ {
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

  public serialize(): SerializedConnection {
    return {
      isConnected: this.isConnected(),
      name: this.getName(),
      needsPassword: this.needsPassword(),
      port: this.getPort(),
      server: this.getServer(),
      username: this.getUsername(),
    };
  }
}
