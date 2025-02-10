import { OutputEvent } from './debugSession';
export declare enum LogLevel {
    Verbose = 0,
    Log = 1,
    Warn = 2,
    Error = 3,
    Stop = 4
}
export type ILogCallback = (outputEvent: OutputEvent) => void;
export interface ILogger {
    log(msg: string, level?: LogLevel): void;
    verbose(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
}
export interface IInternalLogger {
    dispose(): Promise<void>;
    log(msg: string, level: LogLevel, prependTimestamp?: boolean): void;
    setup(options: IInternalLoggerOptions): Promise<void>;
}
export interface IInternalLoggerOptions {
    consoleMinLogLevel: LogLevel;
    logFilePath?: string;
    prependTimestamp?: boolean;
}
export declare class Logger {
    private _logFilePathFromInit;
    private _currentLogger;
    private _pendingLogQ;
    log(msg: string, level?: LogLevel): void;
    verbose(msg: string): void;
    warn(msg: string): void;
    error(msg: string): void;
    dispose(): Promise<void>;
    /**
     * `log` adds a newline, `write` doesn't
     */
    private _write;
    /**
     * Set the logger's minimum level to log in the console, and whether to log to the file. Log messages are queued before this is
     * called the first time, because minLogLevel defaults to Warn.
     */
    setup(consoleMinLogLevel: LogLevel, _logFilePath?: string | boolean, prependTimestamp?: boolean): void;
    init(logCallback: ILogCallback, logFilePath?: string, logToConsole?: boolean): void;
}
export declare const logger: Logger;
export declare class LogOutputEvent extends OutputEvent {
    constructor(msg: string, level: LogLevel);
}
export declare function trimLastNewline(str: string): string;
