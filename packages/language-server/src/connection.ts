import { NSDatabase, IConnectionDriver, IConnection, MConnectionExplorer, ContextValue, InternalID, IQueryOptions } from '@sqltools/types';
import decorateLSException from '@sqltools/util/decorators/ls-decorate-exception';
import { getConnectionId } from '@sqltools/util/connection';
import ConfigRO from '@sqltools/util/config-manager';
import generateId from '@sqltools/util/internal-id';
import LSContext from './context';
import { IConnection as LSIconnection } from 'vscode-languageserver';
import DriverNotInstalledError from './exception/driver-not-installed';
import { createLogger } from '@sqltools/log/src';

const log = createLogger('conn');

export default class Connection {
  private connected: boolean = false;
  private conn: IConnectionDriver;
  constructor(private credentials: IConnection, getWorkspaceFolders: LSIconnection['workspace']['getWorkspaceFolders']) {
    if (!LSContext.drivers.has(credentials.driver)) {
      throw new DriverNotInstalledError(credentials.driver);
    }

    const DriverClass = LSContext.drivers.get(credentials.driver);

    this.conn = new DriverClass(this.credentials, getWorkspaceFolders);
  }

  private decorateException = (e: Error) => {
    e = decorateLSException(e, { conn: this.credentials });
    return Promise.reject(e);
  }

  public needsPassword() {
    return this.conn.credentials.askForPassword;
  }

  public async connect() {
    if (!this.connected && this.conn.checkDependencies) {
      await this.conn.checkDependencies();
    }

    if (typeof this.conn.testConnection === 'function')
      await this.conn.testConnection().catch(this.decorateException);
    else
      await this.query('SELECT 1;', { throwIfError: true });
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

  public async describeTable(table: NSDatabase.ITable, opt: { requestId: InternalID }) {
    const info = await this.conn.describeTable(table, opt).catch(this.decorateException);

    if (info[0]) {
      info[0].label = `Table ${table.label}`;
    }
    return info;
  }
  public async showRecords(table: NSDatabase.ITable, opt: { requestId: InternalID; page: number; pageSize?: number }) {
    const { pageSize, page, requestId } = opt;
    const limit = pageSize || this.conn.credentials.previewLimit || (ConfigRO.results && ConfigRO.results.limit) || 50;

    const [records] = await this.conn.showRecords(table, { limit, page, requestId }).catch(this.decorateException);

    if (records) {
      records.label = [
        Math.max(records.total || 0, records.results.length, 0),
        'records on',
        `'${table.label}'`,
        'table'
      ].join(' ');
    }
    return [records];
  }

  public query(query: string, opt: IQueryOptions & { throwIfError?: boolean } = {}): Promise<NSDatabase.IResult[]> {
    return this.conn.query(query, opt)
      .catch(this.decorateException)
      .catch((e) => {
        log.error('%O', e);
        if (opt.throwIfError) throw e;
        let message = '';
        if (typeof e === 'string') {
          message = e;
        } else if (e.message) {
          message = e.message;
        } else {
          message = JSON.stringify(e);
        }
        return [{
          requestId: opt.requestId,
          resultId: generateId(),
          connId: this.getId(),
          cols: [],
          error: true,
          messages: [{ message, date: new Date() }],
          query,
          results: [],
        }];
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

  public static async testConnection(credentials: IConnection, getWorkspaceFolders: LSIconnection['workspace']['getWorkspaceFolders']) {
    const testConn = new Connection(credentials, getWorkspaceFolders);
    await testConn.connect();
    await testConn.close();
    return true;
  }

  public getChildrenForItem(params: { item: MConnectionExplorer.IChildItem; parent?: MConnectionExplorer.IChildItem }) {
    return this.conn.getChildrenForItem(params);
  }

  public getInsertQuery(params: { item: NSDatabase.ITable; columns: Array<NSDatabase.IColumn> }) {
    if (this.conn.getInsertQuery && typeof this.conn.getInsertQuery === 'function') {
      return this.conn.getInsertQuery(params);
    }
    const { item, columns } = params;
    let insertQuery = `INSERT INTO ${item.label} (${columns.map((col) => col.label).join(', ')}) VALUES (`;
    columns.forEach((col, index) => {
      insertQuery = insertQuery.concat(`'\${${index + 1}:${col.label}:${col.dataType}}', `);
    });
    return insertQuery;
  }

  public searchItems(itemType: ContextValue, search: string = '', extraParams = {}) {
    return this.conn.searchItems(itemType, search, extraParams);
  }

  public getStaticCompletions: IConnectionDriver['getStaticCompletions'] = () => {
    if (typeof this.conn.getStaticCompletions !== 'function') return Promise.resolve({} as any);
    return this.conn.getStaticCompletions();
  }
}
