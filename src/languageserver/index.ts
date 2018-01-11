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
      documentFormattingProvider: true,
      documentRangeFormattingProvider: true,
      textDocumentSync: docManager.syncKind,
    },
  };
});

connection.onDocumentFormatting((params) => Formatter.handler(docManager, params));
connection.onDocumentRangeFormatting((params) => Formatter.handler(docManager, params));

connection.onDidChangeConfiguration((change) => {
  ConfigManager.setSettings(change.settings.sqltools);
  if (!formatterRegistration) {
    formatterRegistration = connection.client.register(DocumentRangeFormattingRequest.type, {
      documentSelector: ConfigManager.get('completionLanguages', [ 'sql' ]),
    });
  }
});

connection.onRequest(SetQueryResults.method, (req: { data: DatabaseInterface.QueryResults[] }): boolean => {
  httpServerInstance.setData('GET /api/query-results', req.data);
  return true;
});

connection.listen();
