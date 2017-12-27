/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import formatter = require('sql-formatter');
import { SidebarColumn } from '../sidebar-tree-items';
import { EnvironmentException } from './exception';

export default class Utils {
  /**
   * Format SQLQuery
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  public static formatSql(query, indentSize: number = 2) {
    return formatter.format(query, { indent: ' '.repeat(indentSize) });
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

  public static replacer(source: string, toReplace: object) {
    return Object.keys(toReplace).reduce((destination, replaceParam) => {
      return destination.replace(`:${replaceParam}`, toReplace[replaceParam]);
    }, source);
  }

  public static generateInsertQuery(table: string, cols: SidebarColumn[], indentSize?: number): string {
    let insertQuery = `INSERT INTO ${table} (${cols.map((col) => col.value).join(', ')}) VALUES (`;
    cols.forEach((col, index) => {
      insertQuery = insertQuery.concat(`'\${${index + 1}:${col.column.type}}', `);
    });
    return Utils.formatSql(`${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`, indentSize).concat('$0');
  }
}
