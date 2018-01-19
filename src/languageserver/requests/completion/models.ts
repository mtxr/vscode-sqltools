import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';
import {
  DatabaseInterface,
  LoggerInterface,
} from './../../../api/interface';

export function TableCompletionItem(table: DatabaseInterface.Table) {

  let documentation = '';
  if (table.tableDatabase) {
    documentation += `__Database__: ${table.tableDatabase}\n\n`;
  }
  if (table.tableCatalog) {
    documentation += `__Table Catalog__: ${table.tableCatalog}\n\n`;
  }
  if (table.tableSchema) {
    documentation += `__Table Schema__: ${table.tableSchema}\n\n`;
  }
  documentation += `__Table__: ${table.name}\n\n`;
  if (table.numberOfColumns !== null && typeof table.numberOfColumns !== 'undefined') {
    documentation += `__Number of Columns__: ${table.numberOfColumns}\n\n`;
  }

  return {
    detail: 'Table',
    documentation: { value: documentation } as any,
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
  let documentation = `\`\`\`sql\n${colInfo.join(' ')}\`\`\`\n\n`;
  if (col.tableDatabase) {
    documentation += `__Database__: ${col.tableDatabase}\n\n`;
  }
  if (col.tableCatalog) {
    documentation += `__Table Catalog__: ${col.tableCatalog}\n\n`;
  }
  if (col.tableSchema) {
    documentation += `__Table Schema__: ${col.tableSchema}\n\n`;
  }
  documentation += `__Table__: ${col.tableName}\n`;

  return {
    detail: 'Table',
    documentation: { value: documentation } as any,
    kind: CompletionItemKind.Property,
    label: col.columnName,
  } as CompletionItem;
}
