import { LoggerInterface } from './interface';

export default class Logger implements LoggerInterface {
  public static loggerInstance: Logger;
  public static packageName: string = '';
  public static packageVersion: string = '';
  public static logging: boolean = false;

  public static setLogging(param: boolean) {
    Logger.logging = param;
    // Logger.instance().debug('Logging is active');
    return Logger;
  }

  public static isLogging() {
    return Logger.logging;
  }

  public static setPackageName(param: string) {
    Logger.packageName = param;
    return Logger;
  }

  public static getPackageName() {
    return Logger.packageName;
  }

  public static setPackageVersion(param: string) {
    Logger.packageVersion = param;
    return Logger;
  }

  public static getPackageVersion() {
    return Logger.packageVersion;
  }

  public static instance(): Logger {
    if (!Logger.loggerInstance) {
      Logger.loggerInstance = new Logger();
    }
    return Logger.loggerInstance;
  }

  private constructor() {
    // this.debug('Logger started!');
  }

  public debug(message: string, ...data: any[]) {
    this.emitMessage('debug', message, ...data);
  }
  public error(message: string, ...data: any[]) {
    this.emitMessage('error', message, ...data);
  }
  public info(message: string, ...data: any[]) {
    this.emitMessage('info', message, ...data);
  }
  public warn(message: string, ...data: any[]) {
    this.emitMessage('warn', message, ...data);
  }

  private emitMessage(type: 'debug' | 'warn' | 'info' | 'error', message: string, ...data: any[]) {
    if (!Logger.isLogging) {
      return false;
    }
    console[type](message, ...data);
  }

  get instance() {
    return Logger.loggerInstance;
  }
  get packageName() {
    return Logger.packageName;
  }
  set packageName(val: string) {
    Logger.packageName = val;
  }
  get packageVersion() {
    return Logger.packageVersion;
  }
  set packageVersion(val: string) {
    Logger.packageVersion = val;
  }
  get logging() {
    return Logger.logging;
  }
  set logging(val: boolean) {
    Logger.logging = val;
  }
}
