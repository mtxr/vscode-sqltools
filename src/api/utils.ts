// tslint:disable:no-reference
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import * as formatter from 'sql-formatter-sqltools';
import { EnvironmentException } from './exception';

export default class Utils {
  /**
   * Format SQLQuery
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  public static formatSql(query, indentSize: number = 2) {
    return formatter.format(query, { indent: '        '.substring(0, indentSize) });
  }

  /**
   * Get user home path
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  public static getHome(): string {
    if (process.env.HOME || process.env.USERPROFILE)
      return (process.env.HOME || process.env.USERPROFILE);
    throw new EnvironmentException('Could not find user home path');
  }
}
