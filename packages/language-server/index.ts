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
import { SerializedConnection, DatabaseInterface } from '@sqltools/core/interface';
import ConnectionManager from '@sqltools/core/connection-manager';

namespace SQLToolsLanguageServer {
  const server: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
  let Logger: Console | RemoteConsole = console;
  const docManager: TextDocuments = new TextDocuments();
  let httpPort: number = Utils.persistence.get('httpServerPort');
  const portFuture = getPort({ port: httpPort || 5123 });
  let formatterRegistration: Thenable<Disposable> | null = null;
  let formatterLanguages: string[] = [];
  let workspaceRoot: string;
  let sgdbConnections: Connection[] = [];
  let activeConnection: Connection = null;
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

  function sortLangs(a, b) { return a.toString().localeCompare(b.toString()); }

  function loadCompletionItens(tables, columns) {
    completionItems = [];
    completionItems.push(...tables.map((table) => TableCompletionItem(table)));
    completionItems.push(...columns.map((col) => TableColumnCompletionItem(col)));
    return completionItems;
  }

  async function loadConnectionData(conn: Connection) {
    completionItems = [];
    if (!conn) {
      updateSidebar([], []);
      return completionItems;
    }
    return conn.getTables()
      .then((t) => Promise.all([t, conn.getColumns()]))
      .then(([t, c]) => {
        updateSidebar(t, c);
        return loadCompletionItens(t, c);
      }).catch((e) => {
        Logger.error('Error while preparing columns completions' + e.toString());
      });
  }

  function updateSidebar(tables, columns) {
    server.client.connection.sendRequest(UpdateTableAndColumnsRequest, { tables, columns });
  }

  /* server events */
  server.onInitialize((params: InitializeParams) => {
    Logger = server.console;
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
  });

  server.onDidChangeConfiguration(async (change) => {
    ConfigManager.setSettings(change.settings.sqltools);
    const oldLang = formatterLanguages.sort(sortLangs);
    const newLang = ConfigManager.formatLanguages.sort(sortLangs);
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
      if (activeConnection) activeConnection.close();
      completionItems = [];
      activeConnection = null;
      return undefined;
    }
    const c = sgdbConnections.find((conn) => conn.getName() === req.conn.name);
    if (req.password) c.setPassword(req.password);
    activeConnection = c;
    await loadConnectionData(activeConnection);
    return activeConnection.serialize();
  });

  server.onRequest(RefreshDataRequest.method, () => loadConnectionData(activeConnection));

  server.onRequest(GetTablesAndColumnsRequest.method, async () => {
    if (!activeConnection) return { tables: [], columns: [] };
    return { tables: await activeConnection.getTables(true), columns: await activeConnection.getColumns(true) };
  });

  server.onRequest(RunCommandRequest.method, async (req: {
    conn: SerializedConnection,
    command: string,
    args: any[],
  }) => {
    try {
      HTTPServer.queryResultStatus(true);
      activeConnection = sgdbConnections.find((c) => c.getName() === req.conn.name);
      const results = (await activeConnection[req.command](...req.args)) as DatabaseInterface.QueryResults[];
      results.forEach((r) => {
        HTTPServer.queryResult(r.query, r);
      });
      return true;
    } catch (e) {
      HTTPServer.queryResultStatus(false, e);
      throw e;
    }
  });

  const nodeExit = process.exit;
  process.exit = ((code?: number): void => {
    const stack = new Error('stack');
    server.sendNotification('exitCalled', [code ? code : 0, stack.stack]);
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
