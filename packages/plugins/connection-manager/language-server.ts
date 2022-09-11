import Connection from '@sqltools/language-server/src/connection';
import ConfigRO from '@sqltools/util/config-manager';
import { IConnection, NSDatabase, ILanguageServerPlugin, ILanguageServer, RequestHandler } from '@sqltools/types';
import { getConnectionId, migrateConnectionSetting } from '@sqltools/util/connection';
import csvStringify from 'csv-stringify/lib/sync';
import { ConnectRequest, DisconnectRequest, SearchConnectionItemsRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RunCommandRequest, GetResultsRequest, ProgressNotificationStart, ProgressNotificationComplete, TestConnectionRequest, GetChildrenForTreeItemRequest, ForceListRefresh, GetInsertQueryRequest, ReleaseResultsRequest } from './contracts';
import Handlers from './cache/handlers';
import decorateLSException from '@sqltools/util/decorators/ls-decorate-exception';
import { createLogger } from '@sqltools/log/src';
import telemetry from '@sqltools/util/telemetry';
import connectionStateCache, { ACTIVE_CONNECTIONS_KEY, LAST_USED_ID_KEY } from './cache/connections-state.model';
import { getRetainedResults, releaseResults } from './cache/query-results.model';
import { DriverNotInstalledNotification } from '@sqltools/language-server/src/notifications';
import { MissingModuleNotification } from '@sqltools/base-driver/dist/lib/notification';

const log = createLogger('conn-manager');

export default class ConnectionManagerPlugin implements ILanguageServerPlugin {
  private server: ILanguageServer;
  private getConnectionsList = async () => {
    const [activeConnections = {}, lastUsedId] = await Promise.all([
      connectionStateCache.get(ACTIVE_CONNECTIONS_KEY,),
      connectionStateCache.get(LAST_USED_ID_KEY),
    ]);
    return (ConfigRO.connections || []).map(conn => {
      conn = migrateConnectionSetting(conn);
      conn.isActive = getConnectionId(conn) === lastUsedId;
      conn.isConnected = !!activeConnections[getConnectionId(conn)];

      return conn;
    });
  }

  private async getConnectionInstance(creds: IConnection) {
    const id = getConnectionId(creds);
    const activeConnections = await connectionStateCache.get(ACTIVE_CONNECTIONS_KEY, {});
    return <Connection | null>(activeConnections[id] || null);
  }

  private runCommandHandler: RequestHandler<typeof RunCommandRequest> = async ({ conn, args, command }) => {
    try {
      const c = await this.getConnectionInstance(conn);
      if (!c) throw 'Connection not found';
      const results: NSDatabase.IResult[] = await c[command](...args);
      await Handlers.QuerySuccess(results);
      return results;
    } catch (e) {
      this.server.notifyError('Execute query error', e);
      throw e;
    }
  };

  private releaseResultsHandler: RequestHandler<typeof ReleaseResultsRequest> = async ({ connId, requestId }) => {
    releaseResults(connId, requestId);
  };

  private getResultsHandler: RequestHandler<typeof GetResultsRequest> = async ({ formatType, ...opts }) => {
    const retainedResult = getRetainedResults(opts.connId, opts.requestId);
    if (!retainedResult) {
      return;
    }

    const { results, cols } = retainedResult;
    return formatType === 'json'
      ? JSON.stringify(results, null, 2)
      : csvStringify(results, {
          columns: cols,
          header: true,
          quoted_string: true,
          quoted_empty: true,
        });
  };

  private searchItemsHandler: RequestHandler<typeof SearchConnectionItemsRequest> = async ({ conn, itemType, search, extraParams = {} }) => {
    if (!conn) {
      return undefined;
    }
    const activeConnections = await connectionStateCache.get(ACTIVE_CONNECTIONS_KEY, {});
    if (Object.keys(activeConnections).length === 0) return { results: [] };

    const c = await this.getConnectionInstance(conn);
    const results = await c.searchItems(itemType, search, extraParams);
    return { results };
  };

  private closeConnectionHandler: RequestHandler<typeof DisconnectRequest> = async ({ conn }) => {
    if (!conn) {
      return undefined;
    }
    const c = await this.getConnectionInstance(conn);
    if (!c) return;
    await c.close().catch(this.server.notifyError('Connection Error'));
    await Handlers.Disconnect(c);
  };

  private GetConnectionPasswordRequestHandler: RequestHandler<typeof GetConnectionPasswordRequest> = async ({ conn }): Promise<string> => {
    if (!conn) {
      return undefined;
    }
    const c = await this.getConnectionInstance(conn);
    if (c) {
      return c.getPassword();
    }
    return null;
  };

  private connectionStateSerializer = async (conn: IConnection) => {
    const instance = await this.getConnectionInstance(conn);
    const lastUsedId = await connectionStateCache.get(LAST_USED_ID_KEY);
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
    internalRequest: boolean;
  }): Promise<IConnection> => {
    if (!req || !req.conn) {
      return undefined;
    }
    let progressBase: any;
    const creds = req.conn;

    creds.id = getConnectionId(creds);

    let c: Connection;
    try {
      let c = await this.getConnectionInstance(creds);
      if (c) {
        log.info('Connection instance already exists for %s.', c.getName());
        await Handlers.Connect(c);
        return this.connectionStateSerializer(creds);
      }
      c = new Connection(creds, () => this.server.server.workspace.getWorkspaceFolders());
      log.info('Connection instance created for %s.', c.getName());

      // @OPTIMIZE
      progressBase = {
        id: `progress:${c.getId()}`,
        title: c.getName(),
      }

      if (req.password) c.setPassword(req.password);

      this.server.sendNotification(ProgressNotificationStart, { ...progressBase, message: 'Connecting....' });

      await c.connect();
      await Handlers.Connect(c);

      this.server.sendNotification(ProgressNotificationComplete, { ...progressBase, message: 'Connected!' });
      return this.connectionStateSerializer(creds);
    } catch (e) {
      if (req.internalRequest) {
        e.callback = () => progressBase && this.server.sendNotification(ProgressNotificationComplete, progressBase);
        return Promise.reject(e);
      }
      log.error('Connecting error: %O', e);
      await Handlers.Disconnect(c);
      progressBase && this.server.sendNotification(ProgressNotificationComplete, progressBase);
      e = decorateLSException(e, { conn: creds });
      if (e.data && e.data.notification) {
        return void this.server.sendNotification(e.data.notification, e.data.args);
      }

      telemetry.registerException(e);

      return Promise.reject(e);
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
      await Connection.testConnection(creds, () => this.server.server.workspace.getWorkspaceFolders());
      this.server.sendNotification(ProgressNotificationComplete, { ...progressBase, message: 'Connection test successful!' });
      return req.conn;
    } catch (e) {
      progressBase && this.server.sendNotification(ProgressNotificationComplete, progressBase);
      e = decorateLSException(e, { conn: req.conn });
      if (e.data && e.data.notification) {
        this.server.sendNotification(e.data.notification, e.data.args);
        return e.data;
      }
      throw e;
    }
  };

  private clientRequestConnectionHandler: RequestHandler<typeof GetConnectionsRequest> = async ({ connId, connectedOnly, sort = 'connectedFirst' } = {}) => {
    let connList = await this.getConnectionsList();

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
    const { conn, ...params } = req;
    let c = await this.getConnectionInstance(conn);
    if (!c) return [];
    return c.getChildrenForItem(params);
  };

  private GetInsertQueryHandler: RequestHandler<typeof GetInsertQueryRequest> = async (req) => {
    if (!req || !req.conn) {
      return "";
    }
    const { conn, ...params } = req;
    let c = await this.getConnectionInstance(conn);
    if (!c) return "";
    return c.getInsertQuery(params);
  };

  public register(server: typeof ConnectionManagerPlugin.prototype['server']) {
    this.server = this.server || server;

    this.server.onRequest(RunCommandRequest, this.runCommandHandler);
    this.server.onRequest(ReleaseResultsRequest, this.releaseResultsHandler);
    this.server.onRequest(GetResultsRequest, this.getResultsHandler);
    this.server.onRequest(SearchConnectionItemsRequest, this.searchItemsHandler);
    this.server.onRequest(DisconnectRequest, this.closeConnectionHandler);
    this.server.onRequest(GetConnectionPasswordRequest, this.GetConnectionPasswordRequestHandler);
    this.server.onRequest(ConnectRequest, this.openConnectionHandler);
    this.server.onRequest(TestConnectionRequest, this.testConnectionHandler);
    this.server.onRequest(GetConnectionsRequest, this.clientRequestConnectionHandler);
    this.server.onRequest(GetChildrenForTreeItemRequest, this.GetChildrenForTreeItemHandler);
    this.server.onRequest(GetInsertQueryRequest, this.GetInsertQueryHandler);
    this.server.addOnDidChangeConfigurationHooks(() => this._autoConnectIfActive());
  }

  // internal utils
  public _autoConnectIfActive = async (retryCount = 0) => {
    if (retryCount >= RETRY_LIMIT) return;
    retryCount++;
    const defaultConnections: IConnection[] = [];
    const [activeConnections, lastUsedId] = await Promise.all([
      connectionStateCache.get(ACTIVE_CONNECTIONS_KEY, {}),
      connectionStateCache.get(LAST_USED_ID_KEY),
    ])
    if (lastUsedId && activeConnections[lastUsedId]) {
      defaultConnections.push(await this.connectionStateSerializer(activeConnections[lastUsedId].serialize()));
    }
    if (
      typeof ConfigRO.autoConnectTo === 'string'
      || (
        Array.isArray(ConfigRO.autoConnectTo) && ConfigRO.autoConnectTo.length > 0
      )
    ) {
      const autoConnectTo = Array.isArray(ConfigRO.autoConnectTo)
        ? ConfigRO.autoConnectTo
        : [ConfigRO.autoConnectTo];
      log.info(`Configuration set to auto connect to: %s. connection attempt count: %d`, autoConnectTo.join(', '), retryCount);

      const existingConnections = ConfigRO.connections;
      autoConnectTo.forEach(connName => {
        if (defaultConnections.find(c => c.name === connName)) return;
        const foundConn = existingConnections.find(c => connName === c.name);
        if (!foundConn) return;
        defaultConnections.push(foundConn);
      });
    }
    if (defaultConnections.length === 0) {
      return;
    }
    log.debug(`Found connections: %s. connection attempt count: %d`, defaultConnections.map(c => c.name).join(', '), retryCount);
    try {
      await Promise.all(defaultConnections.slice(1).map(conn => {
        log.info(`Auto connect to %s`, conn.name);
        return Promise.resolve(this.openConnectionHandler({ conn, internalRequest: true }))
          .catch(e => {
            if (retryCount < RETRY_LIMIT) return Promise.reject(e);
            this.server.notifyError(`Failed to auto connect to ${conn.name}`, e);
            return Promise.resolve();
          });
      }));
      log.debug('Will mark %s as active', defaultConnections[0].name);
      // leave the last one active
      await this.openConnectionHandler({ conn: defaultConnections[0], internalRequest: true });
      this.server.sendRequest(ForceListRefresh, undefined);
    } catch (error) {
      if (retryCount < RETRY_LIMIT && (error && error.data && error.data.notification === DriverNotInstalledNotification)) {
        log.info('auto connect will retry: attempts %d', retryCount);
        return new Promise((res) => {
          setTimeout(res, 2000);
        }).then(() => this._autoConnectIfActive(retryCount));
      }
      if (error && typeof error.callback === 'function') {
        error.callback();
      }
      delete error.callback;
      log.error('auto connect error >> %O', error);
      if (error.data && error.data.notification) {
        return void this.server.sendNotification(error.data.notification, error.data.args);
      }
      this.server.notifyError('Auto connect failed:', error);
    }
  }
}
const RETRY_LIMIT = 15;