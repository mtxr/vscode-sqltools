import {
  CompletionItem, createConnection,
  Disposable,
  DocumentRangeFormattingRequest, IConnection, InitializeResult,
  IPCMessageReader, IPCMessageWriter, Position, TextDocumentPositionParams, TextDocuments,
} from 'vscode-languageserver';
import {
  ConfigManager,
  Connection,
  ConnectionManager,
  DatabaseInterface,
  SerializedConnection,
  Telemetry,
  Utils,
} from '../api';
import {
  GetConnectionListRequest,
  GetTablesAndColumnsRequest,
  OpenConnectionRequest,
  RefreshDataRequest,
  RunCommandRequest,
  UpdateTableAndColumnsRequest,
} from '../contracts/connection-requests';
import HTTPServer from './http-server';
import { TableColumnCompletionItem, TableCompletionItem } from './requests/completion/models';
import Formatter from './requests/format';
import Logger from './utils/logger';

namespace SQLToolsLanguageServer {
  const server: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
  const docManager: TextDocuments = new TextDocuments();
  const localSetup = Utils.localSetupInfo();
  Telemetry.register();
  const httpPort: number = localSetup.httpServerPort || 5123;
  let formatterRegistration: Thenable<Disposable> | null = null;
  let formatterLanguages: string[] = [];
  let workspaceRoot: string;
  let sgdbConnections: Connection[] = [];
  let activeConnection: Connection = null;
  let completionItems: CompletionItem[] = [];

  HTTPServer.server(httpPort);
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
        Logger.error('Error while preparing columns completions', e);
      });
  }

  function updateSidebar(tables, columns) {
    server.client.connection.sendRequest(UpdateTableAndColumnsRequest, { tables, columns });
  }

  /* server events */
  server.onInitialize((params): InitializeResult => {
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
      }).then((a) => a, Logger.error);
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
    const { textDocument, position } = pos;
    const doc = docManager.get(textDocument.uri);
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
