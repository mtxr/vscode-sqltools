import LoggerInterface from './interface/logger';

export enum Levels {
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
}

export default class Logger implements LoggerInterface {
  public static levels = Levels;
  public logging: boolean = true;
  public level: Levels = Levels.DEBUG;
  public writer: any;

  public constructor(writer?: any) {
    if (!writer) {
      throw new Error('Logger writer not provided.');
    }
    this.writer = writer;
  }

  public setLogging(param: boolean): this {
    this.logging = param;
    const level: string = Object.keys(Levels).find((key) => Levels[key] === this.level);
    this.log(this.logging ? `Logger is active for >= ${level}` : 'Logger deactivated');
    return this;
  }
  public setLevel(level: Levels): this {
    this.level = level;
    return this;
  }
  public isLogging(): boolean {
    return this.logging;
  }
  public debug(message: string, ...data: any[]): this {
    return this.emitMessage('debug', message, ...data);
  }
  public log(message: string, ...data: any[]): this {
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
    const a = Levels[type.toUpperCase()];
    const b =  this.level;
    if (!this.isLogging() || Levels[type.toUpperCase()] < this.level) {
      return this;
    }
    this.writer[type](message, ...data);
    return this;
  }
}
