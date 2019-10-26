import { Settings } from '../interface';
import { format } from '@sqltools/plugins/formatter/utils';
import multipleQueriesParse from './query/parse';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

/**
 * Parse multiple queries to an array of queries
 *
 * @export
 * @param {string} query
 * @param {('pg' | 'mysql' | 'mssql')} [driver='mysql']
 * @param {string} [delimiter=';']
 * @returns {string[]}
 */
export function parse(query: string, driver: 'pg' | 'mysql' | 'mssql' | 'cql' = 'mysql'): string[] {
  return multipleQueriesParse(query, driver);
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
  let insertQuery = `INSERT INTO ${table} (${cols.map((col) => col.columnName).join(', ')}) VALUES (`;
  cols.forEach((col, index) => {
    insertQuery = insertQuery.concat(`'\${${index + 1}:${col.columnName}:${col.type}}', `);
  });
  return format(`${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`, formatOptions)
  .replace(/'\${(\d+):([\w\s]+):((int|bool|num|real)[\w\s]*)}'/gi, (_, pos, colName, type) => `\${${pos}:${colName.trim()}:${type.trim()}}`)
  .concat('$0');
}

export function extractConnName(query: string) {
  return ((query.match(/@conn\s*(.+)$/m) || [])[1] || '').trim() || null;
}

export function getQueryParameters(query: string, regexStr: string) {
  if (!query || !regexStr) return [];

  const regex = new RegExp(regexStr, 'g');

  const paramsMap: { [k: string]: { param: string; string: string; }} = {};

  let match;
  while ((match = regex.exec(query)) !== null) {
    console.log(`Found ${match[0]}. Next starts at ${regex.lastIndex}.`);
    const queryPart = query.substring(Math.max(0, regex.lastIndex - 15), Math.min(query.length, regex.lastIndex + 15)).replace(/[\r\n]/g, '').replace(/\s+/g, ' ').trim();
    if (!paramsMap[match[0]]) {
      paramsMap[match[0]] = {
        param: match[0],
        string: `...${queryPart}...`,
      };
    }
  }
  return Object.values(paramsMap);
}

