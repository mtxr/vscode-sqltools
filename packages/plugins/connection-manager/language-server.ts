import Connection from '@sqltools/core/connection';
import ConnectionManager from '@sqltools/core/connection-manager';
import { MissingModuleException } from '@sqltools/core/exception';
import { ConnectionInterface, DatabaseInterface } from '@sqltools/core/interface';
import { LanguageServerPlugin, RequestHandler as RHandler } from '@sqltools/core/interface/plugin';
import { getDbId } from '@sqltools/core/utils';
import SQLToolsLanguageServer from '@sqltools/language-server/server';
import { MissingModuleNotification } from '@sqltools/plugins/dependency-manager/contracts';
import csvStringify from 'csv-stringify/lib/sync';
import fs from 'fs';
import { ConnectionDataUpdatedRequest, ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RefreshAllRequest, RunCommandRequest, SaveResultsRequest } from './contracts';
import actions from './store/actions';

export default class ConnectionManagerPlugin implements LanguageServerPlugin {
  private server: SQLToolsLanguageServer;

  private get connections() {
    return ConnectionManager.getConnections(this.server.telemetry);
  }

  private runCommandHandler: RHandler<typeof RunCommandRequest> = async ({ conn, args, command }) => {
    try {
      const c = this.connections.find(c => c.getName() === conn.name);
      if (!c) throw 'Connection not found';
      const results: DatabaseInterface.QueryResults[] = await c[command](...args);
      results.forEach(r => {
        this.server.store.dispatch(actions.QuerySuccess(c, r.query, r));
      });
      return results;
    } catch (e) {
      this.server.notifyError('Execute query error', e);
      throw e;
    }
  };

  private saveResultsHandler: RHandler<typeof SaveResultsRequest> = ({ connId, filename, query, filetype = 'csv' }) => {
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

  private getTablesAndColumnsHandler: RHandler<typeof GetConnectionDataRequest> = async ({ conn }) => {
    if (!conn) {
      return undefined;
    }
    const c = this.connections.find(c => c.getId() === getDbId(conn));
    const { activeConnections } = this.server.store.getState();
    if (Object.keys(activeConnections).length === 0) return { tables: [], columns: [] };
    return { tables: await c.getTables(true), columns: await c.getColumns(true) };
  };

  private refreshConnectionHandler: RHandler<typeof RefreshAllRequest> = async () => {
    const activeConnections = this.server.store.getState().activeConnections;
    await Promise.all(Object.keys(activeConnections).map(c => this.loadConnectionData(activeConnections[c])));
  };

  private closeConnectionHandler: RHandler<typeof DisconnectRequest> = async ({ conn }): Promise<void> => {
    if (!conn) {
      return undefined;
    }
    const c = this.connections.find(c => c.getName() === conn.name);
    await c.close().catch(this.server.notifyError('Connection Error'));
    this.server.store.dispatch(actions.Disconnect(c));
    conn.isConnected = false;
    await this.updateSidebar(conn, null, null);
  };

  private GetConnectionPasswordRequestHandler: RHandler<typeof GetConnectionPasswordRequest> = async ({ conn }): Promise<string> => {
    if (!conn) {
      return undefined;
    }
    const c = this.connections.find(c => c.getId() === getDbId(conn));
    if (c && this.server.store.getState().activeConnections[c.getId()]) {
      return this.server.store.getState().activeConnections[c.getId()].getPassword();
    }
    return null;
  };

  private openConnectionHandler: RHandler<typeof ConnectRequest> = async (req: {
    conn: ConnectionInterface;
    password?: string;
  }): Promise<ConnectionInterface> => {
    if (!req.conn) {
      return undefined;
    }
    const c = this.connections.find(conn => conn.getId() === getDbId(req.conn));
    if (!c) return null;

    if (req.password) c.setPassword(req.password);
    return c
      .connect()
      .then(async () => {
        await this.loadConnectionData(c);
        this.server.store.dispatch(actions.Connect(c));
        return c.serialize();
      })
      .catch(e => {
        if (e instanceof MissingModuleException) {
          this.server.sendNotification(MissingModuleNotification, {
            conn: c.serialize(),
            moduleName: e.moduleName,
            moduleVersion: e.moduleVersion,
          });
          return c.serialize();
        }
        throw e;
      });
  };

  private clientRequestConnectionHandler: RHandler<typeof GetConnectionsRequest> = ({ connectedOnly } = {}) => {
    let connList = this.connections.map((c) => c.serialize());

    if (connectedOnly) connList = connList.filter(c => c.isConnected);

    return connList
      .sort((a, b) => {
        if (a.isConnected === b.isConnected) return a.name.localeCompare(b.name);
        if (a.isConnected && !b.isConnected) return -1;
        if (!a.isConnected && b.isConnected) return 1;
      });
  }

  public register(server: SQLToolsLanguageServer) {
    this.server = this.server || server;

    this.server.onRequest(RunCommandRequest, this.runCommandHandler);
    this.server.onRequest(SaveResultsRequest, this.saveResultsHandler);
    this.server.onRequest(GetConnectionDataRequest, this.getTablesAndColumnsHandler);
    this.server.onRequest(RefreshAllRequest, this.refreshConnectionHandler);
    this.server.onRequest(DisconnectRequest, this.closeConnectionHandler);
    this.server.onRequest(GetConnectionPasswordRequest, this.GetConnectionPasswordRequestHandler);
    this.server.onRequest(ConnectRequest, this.openConnectionHandler);
    this.server.onRequest(GetConnectionsRequest, this.clientRequestConnectionHandler)
  }

  // internal utils
  private async loadConnectionData(conn: Connection) {
    // @TODO commpletion items should be loaded somewhereelse
    if (!conn) {
      return this.updateSidebar(null, [], []);
    }
    return Promise.all([conn.getTables(), conn.getColumns()])
      .then(async ([t, c]) => this.updateSidebar(conn.serialize(), t, c))
      .catch(e => {
        this.server.notifyError(`Error while preparing columns completions for connection ${conn.getName()}`)(e);
        throw e;
      });
  }

  private updateSidebar(
    conn: ConnectionInterface,
    tables: DatabaseInterface.Table[],
    columns: DatabaseInterface.TableColumn[]
  ) {
    if (!conn) return Promise.resolve();
    return this.server.sendRequest(ConnectionDataUpdatedRequest, { conn, tables, columns });
  }
}
