import SQLTools from '@sqltools/core/plugin-api';
import SQLToolsLanguageServer from '@sqltools/language-server/server';
import { TextDocumentPositionParams, CompletionItem } from 'vscode-languageserver';
import { TableCompletionItem, TableColumnCompletionItem } from './models';

export default class IntellisensePlugin implements SQLTools.LanguageServerPlugin {
  private server: SQLToolsLanguageServer;

  private onCompletion = (pos: TextDocumentPositionParams): CompletionItem[] => {
    // const { textDocument, position } = pos;
    // const doc = docManager.get(textDocument.uri);
    const { connectionInfo, lastUsedId } = this.server.store.getState();
    if (!lastUsedId) return [];

    const { columns, tables } = connectionInfo[lastUsedId];

    return tables.map(TableCompletionItem)
    .concat(columns.map(TableColumnCompletionItem));
  }

  public register(server: SQLToolsLanguageServer) {
    this.server = this.server || server;
    this.server.addOnInitializeHook(() => ({
      capabilities: {
        completionProvider: {
          resolveProvider: true,
        },
      }
    }));

    this.server.onCompletion(this.onCompletion);

    this.server.onCompletionResolve((item: CompletionItem): CompletionItem => {
      return item;
    });
  }
}
