import {
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
  workspace as workspace,
} from 'vscode';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import Connection from './connection';

export class SuggestionsProvider implements CompletionItemProvider {
  private connection: Connection;
  private completionItems: CompletionItem[] = [];
  public provideCompletionItems(
    document: TextDocument,
    position: Position,
    token: CancellationToken): Thenable<CompletionItem[]> {

    return this.provideCompletionItemsInternal(document, position, token);
  }

  public provideCompletionItemsInternal(
    document: TextDocument,
    position: Position,
    token: CancellationToken): Thenable<CompletionItem[]> {
    return Promise.resolve(this.completionItems) as Thenable<CompletionItem[]>;
  }

  public setConnection(connection: Connection) {
    this.connection = connection;
    this.completionItems = [];
    if (!connection) {
      return;
    }
    this.connection.getTables()
      .then((tables) => {
        this.completionItems = tables.map((table) => {
          const item: CompletionItem = new CompletionItem(table.name, CompletionItemKind.Keyword);
          item.detail = 'Table';
          return item;
        });
      });
    this.connection.getColumns()
      .then((columns) => {
        this.completionItems = columns.map((table) => {
          const item: CompletionItem = new CompletionItem(table.columnName, CompletionItemKind.Keyword);
          item.detail = 'Column';
          return item;
        });
      });
  }
}
