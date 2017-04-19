// tslint:disable:no-reference
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import Constants from '../constants';
import { LoggerInterface } from './interface';

export enum Levels {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

export default class Logger implements LoggerInterface {
  public static loggerInstance: Logger;
  public static levels = Levels;
  public static instance(writer?: any): Logger {
    if (!Logger.loggerInstance) {
      Logger.loggerInstance = new Logger(writer);
    }
    return Logger.loggerInstance;
  }

  public packageName: string = '';
  public packageVersion: string = '';
  public logging: boolean = false;
  public level: Levels = Levels.DEBUG;
  private writer: any;

  private constructor(writer?: any) {
    if (!writer) {
      throw new Error('Logger writer not provided.');
    }
    this.writer = writer;
  }

  public setLogging(param: boolean): this {
    this.logging = param;
    const level: string = Object.keys(Levels).find((key) => Levels[key] === this.level);
    this.debug(this.logging ? `Logger is active for >= ${level}` : 'Logger deactivated');
    return this;
  }
  public setLevel(level: Levels): this {
    this.level = level;
    const levelString: string = Object.keys(Levels).find((key) => Levels[key] === this.level);
    this.debug(`Log level set to '${levelString}'`);
    return this;
  }
  public isLogging(): boolean {
    return this.logging;
  }
  public setPackageName(param: string): this {
    this.packageName = param;
    return this;
  }
  public getPackageName(): string {
    return this.packageName;
  }
  public setPackageVersion(param: string) {
    this.packageVersion = param;
    return this;
  }
  public getPackageVersion(): string {
    return this.packageVersion;
  }
  public debug(message: string, ...data: any[]): this {
    return this.emitMessage('debug', message, ...data);
  }
  public error(message: string, ...data: any[]): this {
    return this.emitMessage('error', message, ...data);
  }
  public info(message: string, ...data: any[]): this {
    return this.emitMessage('info', message, ...data);
  }
  public warn(message: string, ...data: any[]): this {
    return this.emitMessage('warn', message, ...data);
  }
  private emitMessage(type: 'debug' | 'warn' | 'info' | 'error', message: string, ...data: any[]): this {

    if (!this.isLogging || Levels[type.toUpperCase()] < this.level) {
      return this;
    }
    this.writer[type](message, ...data);
    return this;
  }
}
