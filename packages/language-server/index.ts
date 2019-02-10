import {
  CompletionItem, createConnection,
  Disposable,
  DocumentRangeFormattingRequest, IConnection, TextDocumentPositionParams, TextDocuments, InitializeParams, ProposedFeatures,
} from 'vscode-languageserver';

import Formatter from './requests/format';
import * as Utils from '@sqltools/core/utils';
import Connection from '@sqltools/core/connection';
import ConfigManager from '@sqltools/core/config-manager';
import { TableCompletionItem, TableColumnCompletionItem } from './requests/completion/models';
import {
  UpdateConnectionExplorerRequest,
  ClientRequestConnections,
  OpenConnectionRequest,
  RefreshConnectionData,
  GetTablesAndColumnsRequest,
  RunCommandRequest,
  CloseConnectionRequest,
  GetCachedPassword,
} from '@sqltools/core/contracts/connection-requests';
import Notification from '@sqltools/core/contracts/notifications';
import { SerializedConnection, DatabaseInterface } from '@sqltools/core/interface';
import ConnectionManager from '@sqltools/core/connection-manager';
import store from './store';
import * as actions from './store/actions';
import { Telemetry } from '@sqltools/core/utils';

namespace SQLToolsLanguageServer {
  const server: IConnection = createConnection(ProposedFeatures.all);
  let Logger = console;
  const docManager: TextDocuments = new TextDocuments();
  let formatterRegistration: Thenable<Disposable> | null = null;
  let formatterLanguages: string[] = [];
  let sgdbConnections: Connection[] = [];
  let completionItems: CompletionItem[] = [];

  docManager.listen(server);

  export function getServer() { return server; }

  export function getStatus() {
    return {
      completionItems,
      connections: sgdbConnections.map((c) => c.serialize()),
      formatterLanguages,
    };
  }
  /* internal functions */

  function notifyError(message: string, error?: any): any {
    const cb = (err: any = '') => {
      Logger.error(message, err);
      Telemetry.registerException(err, { message, languageServer: true });
      server.sendNotification(Notification.OnError, { err, message, errMessage: (err.message || err).toString() });
    }
    if (typeof error !== 'undefined') return cb(error);
    return cb;
  }

  function loadCompletionItens(tables, columns) {
    completionItems = [];
    completionItems.push(...tables.map((table) => TableCompletionItem(table)));
    completionItems.push(...columns.map((col) => TableColumnCompletionItem(col)));
    return completionItems;
  }

  async function loadConnectionData(conn: Connection) {
    completionItems = [];
    if (!conn) {
      updateSidebar(null, [], []);
      return completionItems;
    }
    return Promise.all([conn.getTables(), conn.getColumns()])
      .then(([t, c]) => {
        updateSidebar(conn.serialize(), t, c);
        return loadCompletionItens(t, c);
      }).catch(e => {
        notifyError(`Error while preparing columns completions for connection ${conn.getName()}`)(e);
        throw e;
      });
  }

  function updateSidebar(conn: SerializedConnection, tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[]) {
    return server.client.connection.sendRequest(UpdateConnectionExplorerRequest, { conn, tables, columns });
  }

  /* server events */
  server.onInitialize((params: InitializeParams) => {
    return {
      capabilities: {
        completionProvider: {
          resolveProvider: true,
        },
        documentFormattingProvider: false,
        documentRangeFormattingProvider: false,
        textDocumentSync: docManager.syncKind,
      },
    };
  });

  server.onInitialized(async () => {
    server.sendNotification(Notification.LanguageServerReady, { });
  });

  server.onDidChangeConfiguration(async (change) => {
    ConfigManager.setSettings(change.settings.sqltools);
    Utils.Telemetry.register('language-server', ConfigManager.telemetry);

    const oldLang = formatterLanguages.sort(Utils.sortText);
    const newLang = ConfigManager.formatLanguages.sort(Utils.sortText);
    const register = newLang.length > 0 && (!formatterRegistration || oldLang.join() !== newLang.join());
    if (register) {
      formatterLanguages = newLang.reduce((agg, language) => {
        if (typeof language === 'string') {
          agg.push({ language, scheme: 'untitled' });
          agg.push({ language, scheme: 'file' });
        } else {
          agg.push(language);
        }
        return agg;
      }, []);
      if (formatterRegistration) (await formatterRegistration).dispose();
      formatterRegistration = server.client.register(DocumentRangeFormattingRequest.type, {
        documentSelector: formatterLanguages,
      }).then((a) => a, error => notifyError('formatterRegistration error', error));
    } else if (formatterRegistration) {
      (await formatterRegistration).dispose();
    }
    sgdbConnections = ConnectionManager.getConnections(Logger);
  });

  server.listen();

  /* Requests */
  server.onDocumentFormatting((params) => Formatter(docManager, params));
  server.onDocumentRangeFormatting((params) => Formatter(docManager, params));

  server.onCompletion((pos: TextDocumentPositionParams): CompletionItem[] => {
    // const { textDocument, position } = pos;
    // const doc = docManager.get(textDocument.uri);
    if (!store.getState().activeConnections) return [];
    return completionItems;
  });

  server.onCompletionResolve((item: CompletionItem): CompletionItem => {
    return item;
  });

  /* Custom Requests */
  server.onRequest(ClientRequestConnections, () => {
    return sgdbConnections.map((c) => c.serialize())
      .sort((a, b) => {
        if (a.isConnected === b.isConnected) return a.name.localeCompare(b.name);
        if (a.isConnected && !b.isConnected) return -1;
        if (!a.isConnected && b.isConnected) return 1;
      });
  });

  server.onRequest(
    OpenConnectionRequest,
    async (req: { conn: SerializedConnection, password?: string }
  ): Promise<SerializedConnection> => {
    if (!req.conn) {
      return undefined;
    }
    const c = sgdbConnections.find((conn) => conn.getId() === Utils.getDbId(req.conn));
    if (req.password) c.setPassword(req.password);
    if (await c.connect()) {
      store.dispatch(actions.Connect(c));
      await loadConnectionData(c);
      return c.serialize();
    }
    return null;
  });

  server.onRequest(
    GetCachedPassword,
    async (req: { conn: SerializedConnection }): Promise<string> => {
    if (!req.conn) {
      return undefined;
    }
    const c = sgdbConnections.find((conn) => conn.getId() === Utils.getDbId(req.conn));
    if (c && store.getState().activeConnections[c.getId()]) {
      return store.getState().activeConnections[c.getId()].getPassword();
    }
    return null;
  });

  server.onRequest(
    CloseConnectionRequest,
    async (req: { conn: SerializedConnection }): Promise<void> => {
    if (!req.conn) {
      return undefined;
    }
    const c = sgdbConnections.find((conn) => conn.getName() === req.conn.name);
    await c.close().catch(notifyError('Connection Error'));
    store.dispatch(actions.Disconnect(c));
    const state = store.getState();
    req.conn.isConnected = false;
    updateSidebar(req.conn, null, null);
  });

  server.onRequest(RefreshConnectionData, async () => {
    const activeConnections = store.getState().activeConnections;
    await Promise.all(Object.keys(activeConnections).map(c => loadConnectionData(activeConnections[c])));
  });

  server.onRequest(GetTablesAndColumnsRequest, async ({ conn }) => {
    if (!conn) {
      return undefined;
    }
    const c = sgdbConnections.find((c) => c.getId() === Utils.getDbId(conn));
    const { activeConnections } = store.getState();
    if (Object.keys(activeConnections).length === 0) return { tables: [], columns: [] };
    return { tables: await c.getTables(true), columns: await c.getColumns(true) };
  });

  server.onRequest(RunCommandRequest, async (req: {
    conn: SerializedConnection,
    command: string,
    args: any[],
  }) => {
    try {
      const c = sgdbConnections.find((c) => c.getName() === req.conn.name);
      if (!c) throw 'Connection not found';
      const results: DatabaseInterface.QueryResults[] = (await c[req.command](...req.args));
      results.forEach((r) => {
        store.dispatch(actions.QuerySuccess(c, r.query, r));
      });
      return results;
    } catch (e) {
      notifyError('Execute query error', e);
      throw e;
    }
  });

  const nodeExit = process.exit;
  process.exit = ((code?: number): void => {
    const stack = new Error('stack');
    server.sendNotification(Notification.ExitCalled, [code ? code : 0, stack.stack]);
    setTimeout(() => {
      nodeExit(code);
    }, 1000);
  }) as any;
  process.on('uncaughtException', (error: any) => {
    let message: string;
    if (error) {
      Telemetry.registerException(error, { type: 'uncaughtException' })
      if (typeof error.stack === 'string') {
        message = error.stack;
      } else if (typeof error.message === 'string') {
        message = error.message;
      } else if (typeof error === 'string') {
        message = error;
      }
      if (!message) {
        try {
          message = JSON.stringify(error, undefined, 4);
        } catch (e) {
          // Should not happen.
        }
      }
    }
    Logger.error('Uncaught exception received.');
    if (message) {
      Logger.error(message);
    }
  });
}

export default SQLToolsLanguageServer;
