import http = require('http');
import {
  createConnection, Disposable,
  DocumentRangeFormattingRequest,
  IConnection,
  InitializeResult, IPCMessageReader, IPCMessageWriter,
  TextDocuments, TextEdit,
} from 'vscode-languageserver';
import { Utils } from '../api';
import ConfigManager = require('../api/config-manager');
import { Settings } from '../interface/settings';
import Formatter = require('./formatter');
import DatabaseInterface from '../api/interface/database-interface';
import httpServer from './http-server';
import { createNewConnection, SetQueryResults } from './requests/connection-requests';
import Logger from './utils/logger';

let formatterRegistration: Thenable<Disposable> | null = null;
let formatterLanguages: string[] = [];
let workspaceRoot: string;
const connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
const docManager: TextDocuments = new TextDocuments();
const localSetup = Utils.localSetupInfo();
const httpPort: number = localSetup.httpServerPort || 5123;
const httpServerInstance: any = httpServer(httpPort, connection);

docManager.listen(connection);
connection.onInitialize((params): InitializeResult => {
  workspaceRoot = params.rootPath;
  return {
    capabilities: {
      // completionProvider: {
      //   resolveProvider: true,
      // },
      documentFormattingProvider: false,
      documentRangeFormattingProvider: false,
      textDocumentSync: docManager.syncKind,
    },
  };
});

connection.onDocumentFormatting((params) => Formatter.handler(docManager, params));
connection.onDocumentRangeFormatting((params) => Formatter.handler(docManager, params));

function sortLangs(a, b) {
  return a.toString().localeCompare(b.toString());
}

connection.onDidChangeConfiguration(async (change) => {
  ConfigManager.setSettings(change.settings.sqltools);
  const oldLang = formatterLanguages.sort(sortLangs);
  const newLang = (ConfigManager.get('formatLanguages', ['sql']) as string[]).sort(sortLangs);
  const register = newLang.length > 0 && (!formatterRegistration || oldLang.join() !== newLang.join());
  if (register) {
    formatterLanguages = newLang;
    if (formatterRegistration) (await formatterRegistration).dispose();
    formatterRegistration = connection.client.register(DocumentRangeFormattingRequest.type, {
      documentSelector: formatterLanguages,
    }).then((a) => a, console.error);
  } else if (formatterRegistration) {
    (await formatterRegistration).dispose();
  }
});

connection.onRequest(SetQueryResults.method, (req: { data: DatabaseInterface.QueryResults[] }): boolean => {
  httpServerInstance.setData('GET /api/query-results', req.data);
  return true;
});

connection.listen();
