import {
  CompletionItem, createConnection,
  Disposable,
  DocumentRangeFormattingRequest, IConnection, InitializeResult,
  IPCMessageReader, IPCMessageWriter, TextDocumentPositionParams, TextDocuments, RemoteConsole, InitializeParams,
} from 'vscode-languageserver';
import getPort from 'get-port';

import HTTPServer from './http-server';
import Formatter from './requests/format';
import * as Utils from '@sqltools/core/utils';
import Connection from '@sqltools/core/connection';
import ConfigManager from '@sqltools/core/config-manager';
import { TableCompletionItem, TableColumnCompletionItem } from './requests/completion/models';
import {
  UpdateTableAndColumnsRequest,
  GetConnectionListRequest,
  OpenConnectionRequest,
  RefreshDataRequest,
  GetTablesAndColumnsRequest,
  RunCommandRequest
} from '@sqltools/core/contracts/connection-requests';
import Notification from '@sqltools/core/contracts/notifications';
import { SerializedConnection, DatabaseInterface } from '@sqltools/core/interface';
import ConnectionManager from '@sqltools/core/connection-manager';

namespace SQLToolsLanguageServer {
  const server: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
  let Logger = console;
  const docManager: TextDocuments = new TextDocuments();
  let httpPort: number = Utils.persistence.get('httpServerPort');
  const portFuture = getPort({ port: httpPort || 5123 });
  let formatterRegistration: Thenable<Disposable> | null = null;
  let formatterLanguages: string[] = [];
  let workspaceRoot: string;
  let sgdbConnections: Connection[] = [];
  let activeConnection: Connection[] = [];
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
      }).catch(notifyError('Error while preparing columns completions'));
  }

  function updateSidebar(conn, tables, columns) {
    server.client.connection.sendRequest(UpdateTableAndColumnsRequest, { conn, tables, columns }).then(console.log, console.error);
  }

  /* server events */
  server.onInitialize((params: InitializeParams) => {
    // Logger = server.console;
    workspaceRoot = params.rootPath;
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
    httpPort = await portFuture;
    HTTPServer.server(server.console, httpPort);
    server.sendNotification(Notification.LanguageServerReady, { httpPort });
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
      }).then((a) => a, error => Logger.error(error.toString()) as any);
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
    if (!activeConnection) return [];
    return completionItems;
  });

  server.onCompletionResolve((item: CompletionItem): CompletionItem => {
    return item;
  });

  /* Custom Requests */
  server.onRequest(GetConnectionListRequest.method, () => {
    return sgdbConnections.map((c) => c.serialize());
  });

  server.onRequest(
    OpenConnectionRequest.method,
    async (req: { conn: SerializedConnection, password?: string }): Promise<SerializedConnection> => {
    if (!req.conn) {
      activeConnection.forEach(c => c.close());
      completionItems = [];
      activeConnection = []
      return undefined;
    }
    const c = sgdbConnections.find((conn) => conn.getName() === req.conn.name);
    if (req.password) c.setPassword(req.password);
    activeConnection[0] = c;
    if (await c.connect().catch(notifyError('Connection Error'))) {
      await loadConnectionData(c);
      return c.serialize();
    }
    return null;
  });

  server.onRequest(RefreshDataRequest.method, () => activeConnection.forEach(c => loadConnectionData(c)));

  server.onRequest(GetTablesAndColumnsRequest.method, async () => {
    if (activeConnection.length === 0) return { tables: [], columns: [] };
    return { tables: await activeConnection[0].getTables(true), columns: await activeConnection[0].getColumns(true) };
  });

  server.onRequest(RunCommandRequest.method, async (req: {
    conn: SerializedConnection,
    command: string,
    args: any[],
  }) => {
    try {
      HTTPServer.queryResultStatus(true);
      const c = sgdbConnections.find((c) => c.getName() === req.conn.name);
      if (!c) throw 'Connection not found';
      const results = (await c[req.command](...req.args)) as DatabaseInterface.QueryResults[];
      results.forEach((r) => {
        HTTPServer.queryResult(r.query, r);
      });
      return true;
    } catch (e) {
      HTTPServer.queryResultStatus(false, e);
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
