import Connection from '@sqltools/language-server/connection';
import ConfigManager from '@sqltools/core/config-manager';
import { IConnection, NSDatabase, ILanguageServerPlugin, ILanguageServer, RequestHandler} from '@sqltools/types';
import { getConnectionId, migrateConnectionSetting } from '@sqltools/core/utils';
import csvStringify from 'csv-stringify/lib/sync';
import fs from 'fs';
import { ConnectionDataUpdatedRequest, ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RefreshTreeRequest, RunCommandRequest, SaveResultsRequest, ProgressNotificationStart, ProgressNotificationComplete, TestConnectionRequest, GetChildrenForTreeItemRequest } from './contracts';
import actions from './store/actions';
import DependencyManager from '../dependency-manager/language-server';
import { DependeciesAreBeingInstalledNotification } from '../dependency-manager/contracts';
import { decorateException } from '@sqltools/core/utils/errors';
import logger from '@sqltools/core/log';
import telemetry from '@sqltools/core/utils/telemetry';
import { Store } from 'redux';

const log = logger.extend('conn-mann');

export default class ConnectionManagerPlugin implements ILanguageServerPlugin {
  private server: ILanguageServer<Store>;
  private get connections() {
    const { activeConnections, lastUsedId } = this.server.store.getState();
    return (ConfigManager.connections || []).map(conn => {
      conn = migrateConnectionSetting(conn);
      conn.isActive = getConnectionId(conn) === lastUsedId;
      conn.isConnected = !!activeConnections[getConnectionId(conn)];

      return conn;
    });
  }

  private getConnectionInstance(creds: IConnection) {
    const id = getConnectionId(creds);
    const { activeConnections } = this.server.store.getState();
    return <Connection | null>(activeConnections[id] || null);
  }

  private runCommandHandler: RequestHandler<typeof RunCommandRequest> = async ({ conn, args, command }) => {
    try {
      const c = this.getConnectionInstance(conn);
      if (!c) throw 'Connection not found';
      const results: NSDatabase.IResult[] = await c[command](...args);
      this.server.store.dispatch(actions.QuerySuccess(c, { results }));
      return results;
    } catch (e) {
      this.server.notifyError('Execute query error', e);
      throw e;
    }
  };

  private saveResultsHandler: RequestHandler<typeof SaveResultsRequest> = ({ connId, filename, query, filetype = 'csv' }) => {
    const { queryResults } = this.server.store.getState();
    const { results, cols } = queryResults[connId][query];
    let output = '';
    if (filetype === 'json') {
      output = JSON.stringify(results, null, 2);
    } else if (filetype === 'csv') {
      output = csvStringify(results, {
        columns: cols,
        header: true,
        quoted_string: true,
        quoted_empty: true,
      });
    }
    fs.writeFileSync(filename, output);
  };

  private getTablesAndColumnsHandler: RequestHandler<typeof GetConnectionDataRequest> = async ({ conn }) => {
    if (!conn) {
      return undefined;
    }
    const { activeConnections } = this.server.store.getState();
    if (Object.keys(activeConnections).length === 0) return { tables: [], columns: [], functions: [] };

    const c = this.getConnectionInstance(conn);
    const [
      tables,
      columns,
      functions,
    ] = await Promise.all([
      c.getTables(true),
      c.getColumns(true),
      c.getFunctions(true)
    ])
    return {
      tables,
      columns,
      functions,
    };
  };

  private refreshConnectionHandler: RequestHandler<typeof RefreshTreeRequest> = async ({ connIds } = {}) => {
    const { activeConnections } = this.server.store.getState();
    let toRefresh = Object.keys(activeConnections);
    if(connIds) {
      toRefresh = toRefresh.filter(c => connIds.includes(c));
    }
    await Promise.all(toRefresh.map(c => {
      log.extend('info')(`Refreshing ${(<Connection>activeConnections[c]).getName()}`)
      return this._loadConnectionData(activeConnections[c]);
    }));
  };

  private closeConnectionHandler: RequestHandler<typeof DisconnectRequest> = async ({ conn }) => {
    if (!conn) {
      return undefined;
    }
    const c = this.getConnectionInstance(conn);
    if (!c) return;
    await c.close().catch(this.server.notifyError('Connection Error'));
    this.server.store.dispatch(actions.Disconnect(c));
    conn.isConnected = false;
    await this._updateSidebar({ conn, tables: null, columns: null, functions: null });
  };

  private GetConnectionPasswordRequestHandler: RequestHandler<typeof GetConnectionPasswordRequest> = async ({ conn }): Promise<string> => {
    if (!conn) {
      return undefined;
    }
    const c = this.getConnectionInstance(conn);
    if (c) {
      return c.getPassword();
    }
    return null;
  };

  private serializarConnectionState = (conn: IConnection) => {
    const instance = this.getConnectionInstance(conn);
    const { lastUsedId } = this.server.store.getState();
    if (instance) {
      return {
        ...instance.serialize(),
        isActive: instance.getId() === lastUsedId,
      };
    }
    return conn;
  }

  private openConnectionHandler: RequestHandler<typeof ConnectRequest> = async (req: {
    conn: IConnection;
    password?: string;
  }): Promise<IConnection> => {
    if (!req || !req.conn) {
      return undefined;
    }
    let c = this.getConnectionInstance(req.conn);
    let progressBase;
    try {
      if (c) {
        this.server.store.dispatch(actions.Connect(c));
        this._loadConnectionData(c);
        return this.serializarConnectionState(req.conn);
      }
      c = new Connection(req.conn);
      progressBase = {
        id: `progress:${c.getId()}`,
        title: c.getName(),
      }

      if (req.password) c.setPassword(req.password);

      this.server.store.dispatch(actions.Connect(c));

      this.server.sendNotification(ProgressNotificationStart, { ...progressBase, message: 'Connecting....' });
      await c.connect();
      this._loadConnectionData(c);
      this.server.sendNotification(ProgressNotificationComplete, { ...progressBase, message: 'Connected!' });
      return this.serializarConnectionState(req.conn);
    } catch (e) {
      this.server.store.dispatch(actions.Disconnect(c));
      progressBase && this.server.sendNotification(ProgressNotificationComplete, progressBase);
      e = decorateException(e, { conn: req.conn });
      if (e.data && e.data.notification) {
        if (req.conn.driver && DependencyManager.runningJobs.includes(req.conn.driver)) {
          return void this.server.sendNotification(DependeciesAreBeingInstalledNotification, e.data.args);
        }
        return void this.server.sendNotification(e.data.notification, e.data.args);
      }

      telemetry.registerException(e);

      throw e;
    }
  };

  private testConnectionHandler: RequestHandler<typeof TestConnectionRequest> = async (req: {
    conn: IConnection;
    password?: string;
  }): Promise<IConnection> => {
    if (!req || !req.conn) {
      return undefined;
    }
    const progressBase = {
      id: `progress:testingConnection`,
      title: req.conn.name,
    }
    try {
      this.server.sendNotification(ProgressNotificationStart, { ...progressBase, message: 'Testing connection....' });
      const creds = {
        ...req.conn,
        password: req.conn.password || req.password,
      }
      await Connection.testConnection(creds);
      this.server.sendNotification(ProgressNotificationComplete, { ...progressBase, message: 'Connection test successful!' });
      return req.conn;
    } catch (e) {
      progressBase && this.server.sendNotification(ProgressNotificationComplete, progressBase);
      e = decorateException(e, { conn: req.conn });
      if (e.data && e.data.notification) {
        if (req.conn.driver && DependencyManager.runningJobs.includes(req.conn.driver)) {
          return void this.server.sendNotification(DependeciesAreBeingInstalledNotification, e.data.args);
        }
        delete e.data.args.conn;
        this.server.sendNotification(e.data.notification, e.data.args);
        return e.data;
      }
      throw e;
    }
  };

  private clientRequestConnectionHandler: RequestHandler<typeof GetConnectionsRequest> = ({ connId, connectedOnly, sort = 'connectedFirst' } = {}) => {
    let connList = this.connections;

    if (connId) return connList.filter(c => c.id === connId);
    
    if (connectedOnly) connList = connList.filter(c => c.isConnected);

    switch (sort) {
      case 'name':
      return connList
        .sort((a, b) => a.name.localeCompare(b.name));
      case 'connectedFirst':
      default:
        return connList
        .sort((a, b) => {
          if (a.isConnected === b.isConnected) return a.name.localeCompare(b.name);
          if (a.isConnected && !b.isConnected) return -1;
          if (!a.isConnected && b.isConnected) return 1;
        });

    }
  }

  private GetChildrenForTreeItemHandler: RequestHandler<typeof GetChildrenForTreeItemRequest> = async (req) => {
    if (!req || !req.conn) {
      return [];
    }
    let c = this.getConnectionInstance(req.conn);
    if (!c) return [];
    switch (req.contextValue) {
      case 'connection':
      case 'connectedConnection':
        // return c.getDatabases(); // @TODO implement
    }
    return [];
  };

  public register(server: typeof ConnectionManagerPlugin.prototype['server']) {
    this.server = this.server || server;

    this.server.onRequest(RunCommandRequest, this.runCommandHandler);
    this.server.onRequest(SaveResultsRequest, this.saveResultsHandler);
    this.server.onRequest(GetConnectionDataRequest, this.getTablesAndColumnsHandler);
    this.server.onRequest(RefreshTreeRequest, this.refreshConnectionHandler);
    this.server.onRequest(DisconnectRequest, this.closeConnectionHandler);
    this.server.onRequest(GetConnectionPasswordRequest, this.GetConnectionPasswordRequestHandler);
    this.server.onRequest(ConnectRequest, this.openConnectionHandler);
    this.server.onRequest(TestConnectionRequest, this.testConnectionHandler);
    this.server.onRequest(GetConnectionsRequest, this.clientRequestConnectionHandler);
    this.server.onRequest(GetChildrenForTreeItemRequest, this.GetChildrenForTreeItemHandler);
    this.server.addOnDidChangeConfigurationHooks(this._autoConnectIfActive);
  }

  // internal utils
  private async _loadConnectionData(conn: Connection) {
    log.extend('warn')('*** DEPRECATION *** _loadConnectionData is deprecated and will be removed in v0.22.x')
    if (!conn) {
      return this._updateSidebar({ conn: null, tables: [], columns: [], functions: [] });
    }
    return Promise.all([conn.getTables(), conn.getColumns(), conn.getFunctions()])
      .then(async ([tables, columns, functions ]) => {
        this.server.store.dispatch(actions.ConnectionData(conn, { tables, columns, functions }))
        return this._updateSidebar({ conn: this.serializarConnectionState(conn.serialize()), tables, columns, functions });
      })
      .catch(e => {
        this.server.notifyError(`Error while preparing columns completions for connection ${conn.getName()}`)(e);
        throw e;
      });
  }

  private _updateSidebar({
    conn,
    tables,
    columns,
    functions
  }: {
    conn: IConnection;
    tables: NSDatabase.ITable[];
    columns: NSDatabase.IColumn[];
    functions: NSDatabase.IFunction[];
   }) {
    if (!conn) return Promise.resolve();
    conn.isActive = this.server.store.getState().lastUsedId === getConnectionId(conn);
    return this.server.sendRequest(ConnectionDataUpdatedRequest, { conn, tables, columns, functions });
  }

  public _autoConnectIfActive = async () => {
    const defaultConnections: IConnection[] = [];
    const { lastUsedId, activeConnections } = this.server.store.getState();
    if (lastUsedId && activeConnections[lastUsedId]) {
      defaultConnections.push(this.serializarConnectionState(activeConnections[lastUsedId].serialize()));
    }
    if (defaultConnections.length === 0
      && (
        typeof ConfigManager.autoConnectTo === 'string'
        || (
          Array.isArray(ConfigManager.autoConnectTo) && ConfigManager.autoConnectTo.length > 0
          )
        )
    ) {
      const autoConnectTo = Array.isArray(ConfigManager.autoConnectTo)
      ? ConfigManager.autoConnectTo
      : [ConfigManager.autoConnectTo];
      log.extend('info')(`Configuration set to auto connect to: ${autoConnectTo}`);

      defaultConnections.push(...ConfigManager.connections
        .filter((conn) => conn && autoConnectTo.indexOf(conn.name) >= 0)
        .filter(Boolean));
    }
    if (defaultConnections.length === 0) {
      return;
    }
    try {
      await Promise.all(defaultConnections.slice(1).map(conn =>
        (<Promise<IConnection>>this.openConnectionHandler({ conn }))
          .catch(e => {
            this.server.notifyError(`Failed to auto connect to  ${conn.name}`, e);
            return Promise.resolve();
          }),
      ));

      await this.openConnectionHandler({ conn: defaultConnections[0] });
    } catch (error) {
      if (error.data && error.data.notification) {
        return void this.server.sendNotification(error.data.notification, error.data.args);
      }
      this.server.notifyError('Auto connect failed', error);
    }
  }
}
