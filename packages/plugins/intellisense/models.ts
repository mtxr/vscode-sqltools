import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

export function TableCompletionItem(table: DatabaseInterface.Table): CompletionItem {
  const tableOrView = table.isView ? 'View' : 'Table';
  let yml = '';
  if (table.tableDatabase) {
    yml += `Database: ${table.tableDatabase}\n`;
  }
  if (table.tableCatalog) {
    yml += `Table Catalog: ${table.tableCatalog}\n`;
  }
  if (table.tableSchema) {
    yml += `${tableOrView} Schema: ${table.tableSchema}\n`;
  }
  yml += `${tableOrView}: ${table.name}\n`;
  if (table.numberOfColumns !== null && typeof table.numberOfColumns !== 'undefined') {
    yml += `Number of Columns: ${table.numberOfColumns}\n`;
  }
  return {
    detail: tableOrView,
    documentation: {
      value: `\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: table.isView ? CompletionItemKind.Reference : CompletionItemKind.Constant,
    label: table.name,
  };
}

export function TableCompletionItemFirst(table: DatabaseInterface.Table): CompletionItem {
  return {
    ...TableCompletionItem(table),
    sortText: `0.${table.name}`,
  }
}

export function TableColumnCompletionItem(col: DatabaseInterface.TableColumn): CompletionItem {
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

  return <CompletionItem>{
    detail: `${col.tableName} Col`,
    documentation: {
      value: `\`\`\`sql\n${colInfo.join(' ')}\n\`\`\`\n\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: CompletionItemKind.Field,
    filterText: `${col.tableName}.${col.columnName}`,
    label: col.columnName,
    sortText: `${col.tableName}.${col.columnName}`,
  };
}
