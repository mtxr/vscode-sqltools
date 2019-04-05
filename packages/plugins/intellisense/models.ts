import {
  CompletionItem,
  CompletionItemKind,
} from 'vscode-languageserver';
import { DatabaseInterface } from '@sqltools/core/interface';

export function TableCompletionItem(table: DatabaseInterface.Table): CompletionItem {

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
    documentation: {
      value: `\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: 21,
    label: table.name,
  };
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
    detail: 'Column',
    documentation: {
      value: `\`\`\`sql\n${colInfo.join(' ')}\n\`\`\`\n\`\`\`yaml\n${yml}\n\`\`\``,
      kind: 'markdown',
    },
    kind: CompletionItemKind.Field,
    filterText: `${col.tableName}.${col.columnName}`,
    label: col.columnName,
  };
}
