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
  public static levels = Levels;
  public logging: boolean = false;
  public level: Levels = Levels.DEBUG;
  private writer: any;

  public constructor(writer?: any) {
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
    if (!this.isLogging() || Levels[type.toUpperCase()] < this.level) {
      return this;
    }
    this.writer[type](message, ...data);
    return this;
  }
}
