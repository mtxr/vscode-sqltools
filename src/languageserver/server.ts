import {
  createConnection, Disposable,
  DocumentRangeFormattingRequest,
  IConnection,
  InitializeResult, IPCMessageReader, IPCMessageWriter,
  TextDocuments, TextEdit,
} from 'vscode-languageserver';
import ConfigManager = require('../api/config-manager');
import { Settings } from '../interface/settings';
import Formatter = require('./fomatter');

let formatterRegistration: Thenable<Disposable> | null = null;
let workspaceRoot: string;
const connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));
const docManager: TextDocuments = new TextDocuments();

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

connection.listen();
