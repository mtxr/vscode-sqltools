import SQLTools from '@sqltools/core/plugin-api';
import { CompletionItem } from 'vscode-languageserver';
import { TableCompletionItem, TableColumnCompletionItem } from './models';
import { TextDocumentPositionParams } from 'vscode-languageclient';

export default class IntellisensePlugin implements SQLTools.LanguageServerPlugin {
  private server: SQLTools.LanguageServerInterface;

  private onCompletion = (pos: TextDocumentPositionParams): CompletionItem[] => {
    const { textDocument, position } = pos;
    const doc = this.server.docManager.get(textDocument.uri);
    const docText = doc.getText();

    const queryEndingsMatch = docText.match(/;/gi);

    console.log({ queryEndingsMatch });

    return [];
    // const { connectionInfo, lastUsedId } = this.server.store.getState();
    // if (!lastUsedId) return [];

    // const { columns, tables } = connectionInfo[lastUsedId];

    // return tables.map(TableCompletionItem)
    //   .concat(columns.map(TableColumnCompletionItem));
  }

  public register(server: SQLTools.LanguageServerInterface) {
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
