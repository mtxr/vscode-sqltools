import { DatabaseInterface } from '../interface';
import { format } from '@sqltools/plugins/formatter/utils';

export function parse(query = '') {
  return query.split(/\s*;\s*(?=([^']*'[^']*')*[^']*$)/g).filter((v) => !!v && !!`${v}`.trim());
}

export function generateInsert(
  table: string,
  cols: Array<{ value: string, column: DatabaseInterface.TableColumn }>,
  indentSize?: number,
): string {
  let insertQuery = `INSERT INTO ${table} (${cols.map((col) => col.value).join(', ')}) VALUES (`;
  cols.forEach((col, index) => {
    insertQuery = insertQuery.concat(`'\${${index + 1}:${col.column.type}}', `);
  });
  return format(`${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`, indentSize).concat('$0');
}
