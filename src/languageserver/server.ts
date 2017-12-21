import { SelectionFormatter } from './../formatting-provider';

import {
  CompletionItem, CompletionItemKind, createConnection, Diagnostic, DiagnosticSeverity, Disposable,
  DocumentFormattingParams, DocumentOnTypeFormattingParams,
  DocumentRangeFormattingParams, DocumentRangeFormattingRequest, DocumentSelector,
  FormattingOptions, IConnection,
  InitializeResult, IPCMessageReader, IPCMessageWriter, RequestType0,
  TextDocument, TextDocumentPositionParams, TextDocuments, TextEdit,
} from 'vscode-languageserver';
import { Settings } from '../interface/settings';

const connection: IConnection = createConnection(new IPCMessageReader(process), new IPCMessageWriter(process));

const docManager: TextDocuments = new TextDocuments();
docManager.listen(connection);

let workspaceRoot: string;
connection.onInitialize((params): InitializeResult => {
  workspaceRoot = params.rootPath;
  return {
    capabilities: {
      completionProvider: {
        resolveProvider: true,
      },
      documentFormattingProvider: true,
      documentRangeFormattingProvider: true,
      textDocumentSync: docManager.syncKind,
    },
  };
});

connection.onDocumentFormatting(({ textDocument, options }) => {
  return SelectionFormatter.handler(docManager.get(textDocument.uri), options);
});

connection.onDocumentRangeFormatting(({ textDocument, range, options }): TextEdit[] => {
  return SelectionFormatter.handler(docManager.get(textDocument.uri), options, range);
});

let formatterRegistration: Thenable<Disposable> | null = null;
let globalSettings: Settings = {};

connection.onDidChangeConfiguration((change) => {
  globalSettings = change.settings;

  if (!formatterRegistration) {
    formatterRegistration = connection.client.register(DocumentRangeFormattingRequest.type, {
      documentSelector: [ 'sql' ],
    });
  }
});

connection.listen();
