import { NSDatabase, IConnectionDriver, IConnection, MConnectionExplorer, ContextValue } from '@sqltools/types';
import decorateLSException from '@sqltools/util/decorators/ls-decorate-exception';
import { getConnectionId } from '@sqltools/util/connection';
import ConfigRO from '@sqltools/util/config-manager';
import telemetry from '@sqltools/util/telemetry';
import Drivers from '@sqltools/drivers/src';

export default class Connection {
  private connected: boolean = false;
  private conn: IConnectionDriver;
  constructor(private credentials: IConnection) {
    this.conn = new Drivers[credentials.driver](this.credentials);
  }

  private decorateException = (e: Error) => {
    e = decorateLSException(e, { conn: this.credentials });
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

  public async describeTable(table: NSDatabase.ITable) {
    const info = await this.conn.describeTable(table).catch(this.decorateException);

    if (info[0]) {
      info[0].label = `Table ${table.label}`;
    }
    return info;
  }
  public async showRecords(table: NSDatabase.ITable, page: number = 0) {
    const limit = this.conn.credentials.previewLimit || (ConfigRO.results && ConfigRO.results.limit) || 50;

    const [records] = await this.conn.showRecords(table, limit, page).catch(this.decorateException);

    let totalPart = '';
    if (typeof records.total === 'number') {
      totalPart = `of ${records.total}`;
    }
    if (records) {
      records.label = `Showing ${Math.min(limit, records.results.length || 0)} ${totalPart}${table.label} records`;
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

  public getChildrenForItem(params: { item: MConnectionExplorer.IChildItem; parent?: MConnectionExplorer.IChildItem }) {
    return this.conn.getChildrenForItem(params);
  }

  public searchItems(itemType: ContextValue, search: string) {
    if (!search || !search.trim()) return [];
    return this.conn.searchItems(itemType, search);
  }
}
