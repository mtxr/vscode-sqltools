import { CompletionItem, CompletionParams, Range } from 'vscode-languageserver';
import { TableCompletionItem, TableColumnCompletionItem, TableCompletionItemFirst } from './models';
import { ILanguageServerPlugin, ILanguageServer } from '@sqltools/types';

export default class IntellisensePlugin<T extends ILanguageServer<any>> implements ILanguageServerPlugin<T> {
  private server: T;

  private onCompletion = (params: CompletionParams): CompletionItem[] => {
    return [];
    // const { connectionInfo, lastUsedId } = this.server.store.getState();
    // if (!lastUsedId) return;

    // const { textDocument, position } = params;
    // const doc = this.server.docManager.get(textDocument.uri);

    // const prevWord = doc.getText(Range.create(Math.max(0, position.line - 5), 0, position.line, position.character)).replace(/[\r\n|\n]+/g, ' ').split(/[\s]+/g).filter(Boolean).pop();

    // const tablePrefixes = [
    //   'from',
    //   'join',
    //   'update',
    //   'table'
    // ];

    // const { columns, tables } = connectionInfo[lastUsedId];

    // if (tablePrefixes.includes(prevWord.toLowerCase())) {
    //   return tables.map(TableCompletionItemFirst)
    //   .concat(columns.map(TableColumnCompletionItem));
    // }

    // return columns.map(TableColumnCompletionItem).concat(tables.map(TableCompletionItem));
  }

  public register(server: T) {
    this.server = this.server || server;
    this.server.addOnInitializeHook(() => ({
      capabilities: {
        completionProvider: {
          // resolveProvider: true,
          triggerCharacters: ['.', ' '],
        },
      }
    }));

    this.server.onCompletion(this.onCompletion);

    // this.server.onCompletionResolve((item: CompletionItem): CompletionItem => {
    //   return item;
    // });
  }
}
