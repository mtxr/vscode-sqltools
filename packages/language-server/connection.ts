import { NSDatabase, IConnectionDriver, IConnection } from '@sqltools/types';
import { decorateException } from '@sqltools/core/utils/errors';
import { getConnectionId } from '@sqltools/core/utils';
import ConfigManager from '@sqltools/core/config-manager';
import telemetry from '@sqltools/core/utils/telemetry';
import Drivers from '@sqltools/drivers/src';

export default class Connection {
  private tables: NSDatabase.ITable[] = [];
  private columns: NSDatabase.IColumn[] = [];
  private functions: NSDatabase.IFunction[] = [];
  private connected: boolean = false;
  private conn: IConnectionDriver;
  constructor(private credentials: IConnection) {
    this.conn = new Drivers[credentials.driver](this.credentials);
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
      await this.query('SELECT 1;', true);
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

  public getTables(cached: boolean = false): Promise<NSDatabase.ITable[]> {
    if (cached && this.tables.length > 0) {
      return Promise.resolve(this.tables);
    }
    return this.conn.getTables().then((tables: NSDatabase.ITable[]) => {
      this.tables = tables;
      return this.tables;
    }).catch(this.decorateException);
  }

  public getColumns(cached: boolean = false): Promise<NSDatabase.IColumn[]> {
    if (cached && this.columns.length > 0) {
      return Promise.resolve(this.columns);
    }
    return this.conn.getColumns().then((columns: NSDatabase.IColumn[]) => {
      this.columns = columns;
      return this.columns;
    }).catch(this.decorateException);
  }

  public getFunctions(cached: boolean = false): Promise<NSDatabase.IFunction[]> {
    if (cached && this.columns.length > 0) {
      return Promise.resolve(this.functions);
    }
    return this.conn.getFunctions().then((functions: NSDatabase.IFunction[]) => {
      this.functions = functions;
      return this.functions;
    }).catch(this.decorateException);
  }

  public async describeTable(tableName: string) {
    const info = await this.conn.describeTable(tableName).catch(this.decorateException);

    if (info[0]) {
      info[0].label = `Table ${tableName}`;
    }
    return info;
  }
  public async showRecords(tableName: string, page: number = 0) {
    const limit = this.conn.credentials.previewLimit || (ConfigManager.results && ConfigManager.results.limit) || 50;

    const [records] = await this.conn.showRecords(tableName, limit, page).catch(this.decorateException);

    let totalPart = '';
    if (typeof records.total === 'number') {
      totalPart = `of ${records.total}`;
    }
    if (records) {
      records.label = `Showing ${Math.min(limit, records.results.length || 0)} ${totalPart}${tableName} records`;
    }
    return [records];
  }

  public query(query: string, throwIfError: boolean = false): Promise<NSDatabase.IResult[]> {
    return this.conn.query(query)
      .catch(this.decorateException)
      .catch((e) => {
        if (throwIfError) throw e;
        telemetry.registerException(e, { driver: this.conn.credentials.driver });
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

  public getDriver() {
    return this.conn.credentials.driver;
  }

  public getId() {
    return getConnectionId(this.conn.credentials);
  }

  public serialize(): IConnection {
    return {
      id: this.getId(),
      ...this.conn.credentials,
      isConnected: this.isConnected(),
    };
  }

  public static async testConnection(credentials: IConnection) {
    const testConn = new Connection(credentials);
    await testConn.connect();
    await testConn.close();
    return true;
  }
}
