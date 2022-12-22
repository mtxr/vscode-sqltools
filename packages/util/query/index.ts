import { ISettings } from '@sqltools/types';
import formatter from '@sqltools/formatter/src/sqlFormatter';
import multipleQueriesParse from './parse';

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
 * Formats generated insert queries 
 *
 * @export
 * @param {string} insertQuery
 * @param {ISettings['format']} [formatOptions]
 * @returns {string}
 */
export function formatInsertQuery(
  insertQuery: string,
  formatOptions?: ISettings['format'],
): string {
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

  const paramsMap: { [k: string]: { param: string; string: string; varName?: string }} = {};

  let match;
  while ((match = regex.exec(query)) !== null) {
    const queryPart = query.substring(Math.max(0, regex.lastIndex - 15), Math.min(query.length, regex.lastIndex + 15)).replace(/[\r\n]/g, '').replace(/\s+/g, ' ').trim();
    if (!paramsMap[match[0]]) {
      paramsMap[match[0]] = {
        param: match[0],
        string: `...${queryPart}...`,
      };

      if (match[1]) {
        paramsMap[match[0]].varName = match[1]
      }
    }
  }
  return Object.values(paramsMap);
}


const dollarRegex = /\$([^\s]+)/gi;
/**
 * Format query with vscode snippet parameters
 * @param query
 * @param originalQuery
 */
function fixParameters(query: string, originalQuery: string) {
  if (!dollarRegex.test(originalQuery)) return query;
  const matches = originalQuery.match(dollarRegex) || [];

  return matches.reduce((text, match) => {
    const matchEscaped = match.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp('\\\$' + ' +' + matchEscaped.substr(2), 'g'), match.replace(/\$/g, '$$$$'));
  }, query);
}

export function format(query: string, formatOptions: Partial<{ insertSpaces: boolean, tabSize: number, reservedWordCase: 'upper' | 'lower' }> = {}) {
  const { reservedWordCase = null, insertSpaces = true, tabSize = 2, ...opts } = formatOptions;
  return fixParameters(formatter.format(query, {
    ...opts,
    indent: insertSpaces ? ' '.repeat(tabSize) : '\t',
    reservedWordCase,
  }), query);
}