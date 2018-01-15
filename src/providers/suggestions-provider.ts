import {
  CancellationToken,
  CompletionItem,
  CompletionItemKind,
  CompletionItemProvider,
  MarkdownString,
  Position,
  TextDocument,
  workspace as workspace,
} from 'vscode';
import { Logger } from './../api';
import Connection from './../api/connection';
import { ConnectionCredentials } from './../api/interface/connection-credentials';
import DatabaseInterface from './../api/interface/database-interface';
import Telemetry from './../api/telemetry';

class TableCompletionItem extends CompletionItem {
  constructor(table: DatabaseInterface.Table) {
    super(table.name, CompletionItemKind.Struct);
    this.detail = 'Table';

    const out = new MarkdownString();
    if (table.tableDatabase) {
      out.appendMarkdown(`__Database__: ${table.tableDatabase}\n\n`);
    }
    if (table.tableCatalog) {
      out.appendMarkdown(`__Table Catalog__: ${table.tableCatalog}\n\n`);
    }
    if (table.tableSchema) {
      out.appendMarkdown(`__Table Schema__: ${table.tableSchema}\n\n`);
    }
    out.appendMarkdown(`__Table__: ${table.name}\n\n`);
    if (table.numberOfColumns !== null && typeof table.numberOfColumns !== 'undefined') {
      out.appendMarkdown(`__Number of Columns__: ${table.numberOfColumns}\n\n`);
    }
    this.documentation = out;
  }
}

class TableColumnCompletionItem extends CompletionItem {
  constructor(col: DatabaseInterface.TableColumn) {
    super(col.columnName, CompletionItemKind.Property);
    this.detail = `Table Column`;
    const out = new MarkdownString();
    const colInfo = [ col.columnName ];
    if (typeof col.size !== 'undefined' && col.size !== null) {
      colInfo.push(`${col.type.toUpperCase()}(${col.size})`);
    } else {
      colInfo.push(col.type.toUpperCase());
    }
    if (col.isNullable === false) {
      colInfo.push('NOT NULL');
    }
    if (col.defaultValue) {
      colInfo.push('DEFAULT');
      colInfo.push(col.defaultValue);
    }
    out.appendCodeblock(colInfo.join(' '), 'sql');
    if (col.tableDatabase) {
      out.appendMarkdown(`__Database__: ${col.tableDatabase}\n\n`);
    }
    if (col.tableCatalog) {
      out.appendMarkdown(`__Table Catalog__: ${col.tableCatalog}\n\n`);
    }
    if (col.tableSchema) {
      out.appendMarkdown(`__Table Schema__: ${col.tableSchema}\n\n`);
    }
    out.appendMarkdown(`__Table__: ${col.tableName}\n`);

    this.documentation = out;
  }
}

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
        this.completionItems.push(...tables.map((table) => new TableCompletionItem(table)));
        this.completionItems.push(...columns.map((col) => new TableColumnCompletionItem(col)));
      }).catch((e) => {
        this.logger.error('Error while preparing columns completions', e);
        Telemetry.registerException(e);
      });
  }
}
