import StandardSqlFormatter from './languages/StandardSqlFormatter';
import { Config, Token } from './core/types';

export default {
  /**
   * Format whitespaces in a query to make it easier to read.
   *
   * @param {string} query
   * @param {Config} cfg
   *  @param {string} cfg.language Query language, default is Standard SQL
   *  @param {string} cfg.indent Characters used for indentation, default is "  " (2 spaces)
   *  @param {string} cfg.reservedWordCase Reserverd case change. Allowed upper, lower, null. Default null (no changes).
   *  @param {any} cfg.params Collection of params for placeholder replacement
   * @return {string}
   */
  format: (query: string, cfg: Config = {}): string => {
    return new StandardSqlFormatter(cfg).format(query);
  },

  /**
   * Tokenize query.
   *
   * @param {string} query
   * @param {Config} cfg
   * @return {Token[]}
   */
  tokenize: (query: string, cfg: Config = {}): Token[] => {
    return new StandardSqlFormatter(cfg).tokenize(query);
  },
};
