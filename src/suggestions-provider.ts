import {
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  Position,
  TextDocument,
  workspace as workspace,
} from 'vscode';
import { Logger } from './api';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import Connection from './connection';

export class SuggestionsProvider implements CompletionItemProvider {
  private connection: Connection;
  private completionItems: CompletionItem[] = [];
  constructor(private logger: Logger) {
  }
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
    Promise.all([
      this.connection.getTables(),
      this.connection.getColumns(),
    ])
      .then(([tables, columns]) => {
        this.completionItems.push(...tables.map((table) => {
          const item: CompletionItem = new CompletionItem(table.name, CompletionItemKind.Struct);
          item.detail = 'Table';
          return item;
        }));
        this.completionItems.push(...columns.map((col) => {
          const item: CompletionItem = new CompletionItem(col.columnName, CompletionItemKind.Property);
          item.detail = `${col.tableName} Column`;
          return item;
        }));
      }).catch((e) => {
        this.logger.error('Error while preparing columns completions', e);
      });
  }
}
