import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';
import { DatabaseInterface } from '@sqltools/core/interface';

class MarkdownString {
  public value: string = '';
  constructor() {
    this.value = '';
  }

  public appendCodeblock(value: string, language: string = '') {
    this.value += `\n\`\`\`${language}
${value}
\`\`\`\n`;
    return this;
  }

  public append(value: string) {
    this.value += value;
    return this;
  }
}

export function TableCompletionItem(table: DatabaseInterface.Table) {

  let yml = '';
  if (table.tableDatabase) {
    yml += `Database: ${table.tableDatabase}\n`;
  }
  if (table.tableCatalog) {
    yml += `Table Catalog: ${table.tableCatalog}\n`;
  }
  if (table.tableSchema) {
    yml += `Table Schema: ${table.tableSchema}\n`;
  }
  yml += `Table: ${table.name}\n`;
  if (table.numberOfColumns !== null && typeof table.numberOfColumns !== 'undefined') {
    yml += `Number of Columns: ${table.numberOfColumns}\n`;
  }
  return {
    detail: 'Table',
    documentation: (
      (new MarkdownString())
        .appendCodeblock(yml, 'yaml') as any
    ),
    kind: 21 as CompletionItemKind,
    label: table.name,
  } as CompletionItem;
}

export function TableColumnCompletionItem(col: DatabaseInterface.TableColumn) {
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
  let yml = '';
  if (col.tableDatabase) {
    yml += `Database: ${col.tableDatabase}\n`;
  }
  if (col.tableCatalog) {
    yml += `Table Catalog: ${col.tableCatalog}\n`;
  }
  if (col.tableSchema) {
    yml += `Table Schema: ${col.tableSchema}\n`;
  }
  yml += `Table: ${col.tableName}`;

  return {
    detail: 'Column',
    documentation: (
      (new MarkdownString())
        .appendCodeblock(colInfo.join(' '), 'sql')
        .appendCodeblock(yml, 'yaml') as any
    ),
    kind: CompletionItemKind.Property,
    label: col.columnName,
  } as CompletionItem;
}
