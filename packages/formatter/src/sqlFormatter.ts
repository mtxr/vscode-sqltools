import Db2Formatter from './languages/Db2Formatter';
import N1qlFormatter from './languages/N1qlFormatter';
import PlSqlFormatter from './languages/PlSqlFormatter';
import StandardSqlFormatter from './languages/StandardSqlFormatter';
import { Config, Token } from './core/types';

/**
 * Format whitespaces in a query to make it easier to read.
 *
 * @param {string} query
 * @param {Config} cfg
 *  @param {string} cfg.language Query language, default is Standard SQL
 *  @param {string} cfg.indent Characters used for indentation, default is "  " (2 spaces)
 *  @param {string} cfg.reservedWordCase Reserverd case change. Allowed upper, lower, null. Default null (no changes).
 *  @param {number | 'preserve'} cfg.linesBetweenQueries How many line breaks between queries
 *  @param {any} cfg.params Collection of params for placeholder replacement
 * @return {string}
 */
export const format = (query: string, cfg: Config = {}): string => {
  switch (cfg.language) {
    case 'db2':
      return new Db2Formatter(cfg).format(query);
    case 'n1ql':
      return new N1qlFormatter(cfg).format(query);
    case 'pl/sql':
      return new PlSqlFormatter(cfg).format(query);
    case 'sql':
    default:
      return new StandardSqlFormatter(cfg).format(query);
  }
};

/**
 * Tokenize query.
 *
 * @param {string} query
 * @param {Config} cfg
 * @return {Token[]}
 */
export const tokenize = (query: string, cfg: Config = {}): Token[] => {
  return new StandardSqlFormatter(cfg).tokenize(query);
};
export default {
  format,
  tokenize,
};
