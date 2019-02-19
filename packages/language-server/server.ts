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
import Logger from '@sqltools/core/utils/logger';
import { Telemetry, TelemetryArgs } from '@sqltools/core/utils';
import { MissingModule } from '@sqltools/core/exception';
import Notifications from '@sqltools/core/contracts/notifications';
import { DepInstaller } from './dep-install/service';

namespace SQLToolsLanguageServer {
  const server: IConnection = createConnection(ProposedFeatures.all);
  const docManager: TextDocuments = new TextDocuments();
  let formatterRegistration: Thenable<Disposable> | null = null;
  let formatterLanguages: string[] = [];
  let sgdbConnections: Connection[] = [];
  let completionItems: CompletionItem[] = [];
  let telemetry: Telemetry;
  let extensionPath: string;
  let depInstaller = new DepInstaller({ root: __dirname });

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
      telemetry.registerException(err, { message, languageServer: true });
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
      await updateSidebar(null, [], []);
      return completionItems;
    }
    return Promise.all([conn.getTables(), conn.getColumns()])
      .then(async ([t, c]) => {
        await updateSidebar(conn.serialize(), t, c);
        return loadCompletionItens(t, c);
      }).catch(e => {
        notifyError(`Error while preparing columns completions for connection ${conn.getName()}`)(e);
        throw e;
      });
  }

  function updateSidebar(conn: SerializedConnection, tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[]) {
    if (!conn) return Promise.resolve();
    return server.client.connection.sendRequest(UpdateConnectionExplorerRequest, { conn, tables, columns });
  }

  /* server events */
  server.onInitialize(({ initializationOptions = {} }: InitializeParams) => {
    const telemetryArgs: TelemetryArgs = initializationOptions.telemetry || {
      product: 'language-server'
    }
    telemetry = new Telemetry(telemetryArgs);

    extensionPath = initializationOptions.extensionPath;
    depInstaller.boot({ root: extensionPath, server });
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

  server.onInitialized(() => {
    Logger.log('Initialized', process.version, process.execPath);
  });

  server.onDidChangeConfiguration(async (change) => {
    ConfigManager.setSettings(change.settings.sqltools);
    if (ConfigManager.telemetry) telemetry.enable()
    else telemetry.disable();

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
    sgdbConnections = ConnectionManager.getConnections(telemetry);
  });

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
    if (!c) return null;

    if (req.password) c.setPassword(req.password);
    return c.connect()
    .then(async () => {
      await loadConnectionData(c);
      store.dispatch(actions.Connect(c));
      return c.serialize();
    })
    .catch(e => {
      if (e instanceof MissingModule) {
        server.sendNotification(Notifications.MissingModule, {
          conn: c.serialize(),
          moduleName: e.moduleName,
          moduleVersion: e.moduleVersion,
        });
        return c.serialize();
      }
      throw e;
    });
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
    req.conn.isConnected = false;
    await updateSidebar(req.conn, null, null);
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
      telemetry.registerException(error, { type: 'uncaughtException' })
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

  export function listen() {
    return server.listen();
  }
}

export default SQLToolsLanguageServer;
