import {
  createConnection, Disposable,
  DocumentRangeFormattingRequest,
  IConnection,
  InitializeResult, IPCMessageReader, IPCMessageWriter,
  TextDocuments, TextEdit,
} from 'vscode-languageserver';
import * as ConfigManager from '../api/config-manager';
import { Settings } from '../interface/settings';
import * as Formatter from './fomatter';

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
      documentSelector: [ 'sql' ],
    });
  }
});

connection.listen();
