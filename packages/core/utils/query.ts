import { DatabaseInterface, Settings } from '../interface';
import { format } from '@sqltools/plugins/formatter/utils';
import multipleQueiesParse from './query/parse';

/**
 * Parse multiple queries to an array of queries
 *
 * @export
 * @param {string} query
 * @param {('pg' | 'mysql' | 'mssql')} [dialect='mysql']
 * @param {string} [delimiter=';']
 * @returns {string[]}
 */
export function parse(query: string, dialect: 'pg' | 'mysql' | 'mssql' = 'mysql'): string[] {
  return multipleQueiesParse(query, dialect);
  // return fixedQuery.split(/\s*;\s*(?=([^']*'[^']*')*[^']*$)/g).filter((v) => !!v && !!`${v}`.trim()).map(v => `${v};`);
}
/**
 * Removes comments and line breaks from query
 *
 * @export
 * @param {string} [query='']
 * @returns
 */
export function cleanUp(query: string = '') {
  if (!query) return '';

  return query.toString().replace('\t', '  ')
    .replace(/(--.*)|(((\/\*)+?[\w\W]+?(\*\/)+))/gmi, '')
    .split(/\r\n|\n/gi)
    .map(v => v.trim())
    .filter(Boolean)
    .join(' ')
    .trim();
}

/**
 * Generates insert queries based on table columns
 *
 * @export
 * @param {string} table
 * @param {Array<DatabaseInterface.TableColumn>} cols
 * @param {Settings['format']} [formatOptions]
 * @returns {string}
 */
export function generateInsert(
  table: string,
  cols: Array<DatabaseInterface.TableColumn>,
  formatOptions?: Settings['format'],
): string {
  // @todo: snippet should have variable name and type
  let insertQuery = `INSERT INTO ${table} (${cols.map((col) => col.columnName).join(', ')}) VALUES (`;
  cols.forEach((col, index) => {
    insertQuery = insertQuery.concat(`'\${${index + 1}:${col.type}}', `);
  });
  return format(`${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`, formatOptions)
  .replace(/'(\${\d+:(int|bool|num)[\w ]+})'/gi, '$1')
  .concat('$0');
}
