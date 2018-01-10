/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import fs = require('fs');
import formatter = require('sql-formatter');
import Constants from '../constants';
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

  public static localSetupInfo() {
    try {
      const file = require('path').join(Utils.getHome(), '.sqltools-setup');
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) { /**/ }
    return {};
  }

  public static writeLocalSetupInfo(data) {
    const actualData = Utils.localSetupInfo();
    const file = require('path').join(Utils.getHome(), '.sqltools-setup');
    Object.keys(data).forEach((k) => {
      actualData[k] = data[k];
    });
    fs.writeFileSync(file, JSON.stringify(actualData, null, 2), 'utf-8');
  }

  public static async getlastRunInfo() {
    if (Utils.localSetupData) {
      return Utils.localSetupData;
    }
    const localConfig = {
      current: {
        numericVersion: Utils.numericVersion(Constants.version),
        // tslint:disable-next-line:max-line-length
        releaseNotes: `https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/${Constants.version.replace(/\.([\da-z\-_]+)$/, '.x')}.md`,
        run: new Date().getTime(),
        updated: false,
        version: Constants.version,
      },
      installed: {
        numericVersion: 0,
        run: 0,
        version: '',
      },
    };
    try {
      localConfig.installed = Utils.localSetupInfo();
      localConfig.current.updated = localConfig.current.numericVersion > localConfig.installed.numericVersion;
    } catch (e) { /**/ }

    Utils.localSetupData = localConfig;
    Utils.writeLocalSetupInfo(localConfig.current);

    return localConfig;
  }

  public static numericVersion(v: string) {
    const n: number[] = v.replace(/^v/, '').split('.')
      .map((a) => parseInt(a.replace(/\D+/, ''), 10));
    if (n.length >= 3) return n[0] * 10000 + n[1] * 100 + n[2];
    if (n.length === 2) return n[0] * 10000 + n[1] * 100;
    return n[0] * 10000;
  }

  private static localSetupData: any;
}
