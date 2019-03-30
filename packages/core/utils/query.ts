import { DatabaseInterface, Settings } from '../interface';
import { format } from '@sqltools/plugins/formatter/utils';

export function parse(query = '') {
  return query.split(/\s*;\s*(?=([^']*'[^']*')*[^']*$)/g).filter((v) => !!v && !!`${v}`.trim());
}

// @todo add some tests for this new function
export function cleanUp(query = '') {
  return query.replace(/('(''|[^'])*')|[\t\r\n]|(--[^\r\n]*)|(\/\*[\w\W]*?(?=\*\/)\*\/)/gmi, '')
}

export function generateInsert(
  table: string,
  cols: Array<{ value: string, column: DatabaseInterface.TableColumn }>,
  formatOptions?: Settings['format'],
): string {
  // @todo: snippet should have variable name and type
  let insertQuery = `INSERT INTO ${table} (${cols.map((col) => col.value).join(', ')}) VALUES (`;
  cols.forEach((col, index) => {
    insertQuery = insertQuery.concat(`'\${${index + 1}:${col.column.type}}', `);
  });
  return format(`${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`, formatOptions)
  .replace(/'(\${\d+:(int|bool|num)[\w ]+})'/gi, '$1')
  .concat('$0');
}
