import SQLTools from '@sqltools/core/plugin-api';
import { CompletionItem, CompletionParams } from 'vscode-languageserver';
import { TableCompletionItem, TableColumnCompletionItem } from './models';
import formatter from '@sqltools/formatter/src/sqlFormatter';
import { TokenTypes } from '@sqltools/formatter/src/core/types';
import { DatabaseInterface } from '@sqltools/core/interface';

export default class IntellisensePlugin implements SQLTools.LanguageServerPlugin {
  private server: SQLTools.LanguageServerInterface;

  private onCompletion = (params: CompletionParams): CompletionItem[] => {

    const { connectionInfo, lastUsedId } = this.server.store.getState();
    if (!lastUsedId) return undefined;

    const { textDocument,  } = params;
    const doc = this.server.docManager.get(textDocument.uri);
    const tokens = formatter.tokenize(doc.getText());
    const usedTables = tokens.reduce((names, token) => ({ ...names, ...(token.type === TokenTypes.TABLENAME) ? { [token.value.toLowerCase()]: false } : {} }), {});

    const { columns, tables } = connectionInfo[lastUsedId];

    let countValidUsedtables = 0;
    (<DatabaseInterface.Table[]>tables).forEach(table => {
      if (usedTables[`${table.tableCatalog}.${table.name}`] === false) {
        usedTables[`${table.tableCatalog}.${table.name}`] = true;
        countValidUsedtables++;
      } else if (usedTables[table.name] === false) {
        usedTables[table.name] = true;
        countValidUsedtables++;
      }
    });
    if (countValidUsedtables) {
      return (<DatabaseInterface.TableColumn[]>columns).filter(col => {
        return usedTables[`${col.tableCatalog || ''}.${col.tableName}`.toLowerCase()] || usedTables[col.tableName.toLowerCase()];
      })
        .map(TableColumnCompletionItem)
    }

    return columns.map(TableColumnCompletionItem)
      .concat(tables.map(TableCompletionItem));
  }

  public register(server: SQLTools.LanguageServerInterface) {
    this.server = this.server || server;
    this.server.addOnInitializeHook(() => ({
      capabilities: {
        completionProvider: {
          // resolveProvider: true,
        },
      }
    }));

    this.server.onCompletion(this.onCompletion);

    // this.server.onCompletionResolve((item: CompletionItem): CompletionItem => {
    //   return item;
    // });
  }
}
