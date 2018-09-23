/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import fs = require('fs');
import formatter = require('sql-formatter');
import Constants from '../constants';
import { EnvironmentException } from './exception';
import DatabaseInterface from './interface/database-interface';

let localSetupData: any;

namespace Utils {
  /**
   * Format SQLQuery
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  export function formatSql(query, indentSize: number = 2) {
    return formatter.format(query, { indent: ' '.repeat(indentSize) });
  }

  /**
   * Get user home path
   *
   * @throws {EnvironmentException} Can't find user path from wnv
   * @returns {string} Returns user path as string
   */
  export function getHome(): string {
    if (process.env.HOME || process.env.USERPROFILE)
      return (process.env.HOME || process.env.USERPROFILE);
    throw new EnvironmentException('Could not find user home path');
  }

  export function replacer(source: string, toReplace: object) {
    return Object.keys(toReplace).reduce((destination, replaceParam) => {
      return destination.replace(`:${replaceParam}`, toReplace[replaceParam]);
    }, source);
  }

  export function generateInsertQuery(
    table: string,
    cols: Array<{ value: string, column: DatabaseInterface.TableColumn }>,
    indentSize?: number,
  ): string {
    let insertQuery = `INSERT INTO ${table} (${cols.map((col) => col.value).join(', ')}) VALUES (`;
    cols.forEach((col, index) => {
      insertQuery = insertQuery.concat(`'\${${index + 1}:${col.column.type}}', `);
    });
    return formatSql(`${insertQuery.substr(0, Math.max(0, insertQuery.length - 2))});`, indentSize).concat('$0');
  }

  export function localSetupInfo() {
    try {
      const file = require('path').join(getHome(), '.sqltools-setup');
      return JSON.parse(fs.readFileSync(file, 'utf-8'));
    } catch (e) { /**/ }
    return {};
  }

  export function writeLocalSetupInfo(data) {
    const actualData = localSetupInfo();
    const file = require('path').join(getHome(), '.sqltools-setup');
    Object.keys(data).forEach((k) => {
      actualData[k] = data[k];
    });
    fs.writeFileSync(file, JSON.stringify(actualData, null, 2));
  }

  export async function getlastRunInfo() {
    if (localSetupData) {
      return localSetupData;
    }
    const localConfig = {
      current: {
        numericVersion: numericVersion(Constants.version),
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
      localConfig.installed = localSetupInfo();
      localConfig.current.updated = localConfig.current.numericVersion > localConfig.installed.numericVersion;
    } catch (e) { /**/ }

    localSetupData = localConfig;
    writeLocalSetupInfo(localConfig.current);

    return localConfig;
  }

  export function numericVersion(v: string) {
    const n: number[] = v.replace(/^v/, '').split('.')
      .map((a) => parseInt(a.replace(/\D+/, ''), 10));
    if (n.length >= 3) return n[0] * 10000 + n[1] * 100 + n[2];
    if (n.length === 2) return n[0] * 10000 + n[1] * 100;
    return n[0] * 10000;
  }

  export function parseQueries(query = '') {
    return query.split(/\s*;\s*(?=([^']*'[^']*')*[^']*$)/g).filter((v) => !!v && !!`${v}`.trim());
  }

  // ref from https://github.com/Microsoft/vscode-mssql/blob/master/src/models/utils.ts
  export class Timer {
    private s: [number, number];
    private e: [number, number];

    constructor() {
      this.start();
    }

    /**
     * Returns the elapsed time im ms
     *
     * @returns {number} miliseconds elapsed
     * @memberof Timer
     */
    public elapsed(): number {
      if (!this.s) {
        return -1;
      } else if (!this.e) {
        const end = process.hrtime(this.s);
        return end[0] * 1000 + end[1] / 1000000;
      } else {
        return this.e[0] * 1000 + this.e[1] / 1000000;
      }
    }

    public start(): void {
      this.s = process.hrtime();
    }

    public end(): void {
      if (!this.e) {
        this.e = process.hrtime(this.s);
      }
    }
  }
}

export default Utils;
