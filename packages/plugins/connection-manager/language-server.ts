import fs from 'fs';
import { LanguageServerPlugin, RequestHandler as RHandler } from '@sqltools/core/interface/plugin';
import SQLToolsLanguageServer from '@sqltools/language-server/server';
import {
  ClientRequestConnections,
  RefreshConnectionData,
  GetCachedPassword,
  RunCommandRequest,
  OpenConnectionRequest,
  CloseConnectionRequest,
  UpdateConnectionExplorerRequest,
  GetTablesAndColumnsRequest,
  SaveResults,
} from './contracts';
import csvStringify from 'csv-stringify/lib/sync';
import actions from './store/actions';
import { DatabaseInterface, ConnectionInterface } from '@sqltools/core/interface';
import ConnectionManager from '@sqltools/core/connection-manager';
import { getDbId } from '@sqltools/core/utils';
import Connection from '@sqltools/core/connection';
import { MissingModuleException } from '@sqltools/core/exception';
import { MissingModuleNotification } from '@sqltools/plugins/dependency-manager/contracts';

export default class ConnectionManagerPlugin implements LanguageServerPlugin {
  private server: SQLToolsLanguageServer;

  private get connections() {
    return ConnectionManager.getConnections(this.server.logger);
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

  private saveResultsHandler: RHandler<typeof SaveResults> = ({ connId, filename, query, filetype = 'csv' }) => {
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

  private getTablesAndColumnsHandler: RHandler<typeof GetTablesAndColumnsRequest> = async ({ conn }) => {
    if (!conn) {
      return undefined;
    }
    const c = this.connections.find(c => c.getId() === getDbId(conn));
    const { activeConnections } = this.server.store.getState();
    if (Object.keys(activeConnections).length === 0) return { tables: [], columns: [] };
    return { tables: await c.getTables(true), columns: await c.getColumns(true) };
  };

  private refreshConnectionHandler: RHandler<typeof RefreshConnectionData> = async () => {
    const activeConnections = this.server.store.getState().activeConnections;
    await Promise.all(Object.keys(activeConnections).map(c => this.loadConnectionData(activeConnections[c])));
  };

  private closeConnectionHandler: RHandler<typeof CloseConnectionRequest> = async ({ conn }): Promise<void> => {
    if (!conn) {
      return undefined;
    }
    const c = this.connections.find(c => c.getName() === conn.name);
    await c.close().catch(this.server.notifyError('Connection Error'));
    this.server.store.dispatch(actions.Disconnect(c));
    conn.isConnected = false;
    await this.updateSidebar(conn, null, null);
  };

  private getCachedPasswordHandler: RHandler<typeof GetCachedPassword> = async ({ conn }): Promise<string> => {
    if (!conn) {
      return undefined;
    }
    const c = this.connections.find(c => c.getId() === getDbId(conn));
    if (c && this.server.store.getState().activeConnections[c.getId()]) {
      return this.server.store.getState().activeConnections[c.getId()].getPassword();
    }
    return null;
  };

  private openConnectionHandler: RHandler<typeof OpenConnectionRequest> = async (req: {
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

  private clientRequestConnectionHandler: RHandler<typeof ClientRequestConnections> = ({ connectedOnly } = {}) => {
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
    this.server.onRequest(SaveResults, this.saveResultsHandler);
    this.server.onRequest(GetTablesAndColumnsRequest, this.getTablesAndColumnsHandler);
    this.server.onRequest(RefreshConnectionData, this.refreshConnectionHandler);
    this.server.onRequest(CloseConnectionRequest, this.closeConnectionHandler);
    this.server.onRequest(GetCachedPassword, this.getCachedPasswordHandler);
    this.server.onRequest(OpenConnectionRequest, this.openConnectionHandler);
    this.server.onRequest(ClientRequestConnections, this.clientRequestConnectionHandler)
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
    return this.server.sendRequest(UpdateConnectionExplorerRequest, { conn, tables, columns });
  }
}
