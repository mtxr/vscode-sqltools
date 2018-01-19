import http = require('http');
import {
  CompletionItem, CompletionItemKind,
  createConnection,
  Disposable,
  DocumentRangeFormattingRequest, IConnection, InitializeResult,
  IPCMessageReader, IPCMessageWriter, TextDocumentPositionParams, TextDocuments, TextEdit,
} from 'vscode-languageserver';
import {
  ConfigManager,
  Connection,
  ConnectionManager,
  SerializedConnection,
  Utils,
} from '../api';
import Formatter = require('./requests/format');
import {
  DatabaseInterface,
  SettingsInterface,
} from '../api/interface';
import {
  CreateNewConnectionRequest,
  GetConnectionListRequest,
  OpenConnectionRequest,
  SetQueryResultsRequest,
} from '../contracts/connection-requests';
import HTTPServer from './http-server';
import { TableColumnCompletionItem, TableCompletionItem } from './requests/completion/models';
import Logger from './utils/logger';

namespace SQLToolsLanguageServer {
  const server: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
  const docManager: TextDocuments = new TextDocuments();
  const localSetup = Utils.localSetupInfo();
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

  function loadCompletions(conn: Connection) {
    completionItems = [];
    Promise.all([
      conn.getTables(),
      conn.getColumns(),
    ])
      .then(([tables, columns]) => {
        completionItems.push(...tables.map((table) => TableCompletionItem(table)));
        completionItems.push(...columns.map((col) => TableColumnCompletionItem(col)));
      }).catch((e) => {
        Logger.error('Error while preparing columns completions', e);
      });
    return completionItems;
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
    const newLang = (ConfigManager.get('formatLanguages', ['sql']) as string[]).sort(sortLangs);
    const register = newLang.length > 0 && (!formatterRegistration || oldLang.join() !== newLang.join());
    if (register) {
      formatterLanguages = newLang;
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
  server.onDocumentFormatting((params) => Formatter.handler(docManager, params));
  server.onDocumentRangeFormatting((params) => Formatter.handler(docManager, params));

  server.onCompletion((pos: TextDocumentPositionParams): CompletionItem[] => {
    if (!activeConnection) return [];
    return completionItems;
  });

  server.onCompletionResolve((item: CompletionItem): CompletionItem => {
    return item;
  });

  /* Custom Requests */
  server.onRequest(SetQueryResultsRequest.method, (req: { data: DatabaseInterface.QueryResults[] }): boolean => {
    HTTPServer.set('GET /api/query-results', req.data);
    return true;
  });

  server.onRequest(GetConnectionListRequest.method, () => {
    return sgdbConnections.map((c) => c.serialize());
  });

  server.onRequest(OpenConnectionRequest.method, async (req: { conn: SerializedConnection, password?: string }) => {
    const c = sgdbConnections.find((conn) => conn.getName() === req.conn.name);
    if (req.password) c.setPassword(req.password);
    const result = await c.connect();
    activeConnection = c;
    loadCompletions(activeConnection);
    return result;
  });
}

export default SQLToolsLanguageServer;
