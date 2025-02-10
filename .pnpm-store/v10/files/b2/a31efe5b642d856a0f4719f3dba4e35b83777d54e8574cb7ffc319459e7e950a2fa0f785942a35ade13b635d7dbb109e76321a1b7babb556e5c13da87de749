import { LogLevel, ILogCallback, IInternalLoggerOptions, IInternalLogger } from './logger';
/**
 * Manages logging, whether to console.log, file, or VS Code console.
 * Encapsulates the state specific to each logging session
 */
export declare class InternalLogger implements IInternalLogger {
    private _minLogLevel;
    private _logToConsole;
    /** Log info that meets minLogLevel is sent to this callback. */
    private _logCallback;
    /** Write steam for log file */
    private _logFileStream;
    /** Dispose and allow exit to continue normally */
    private beforeExitCallback;
    /** Dispose and exit */
    private disposeCallback;
    /** Whether to add a timestamp to messages in the logfile */
    private _prependTimestamp;
    constructor(logCallback: ILogCallback, isServer?: boolean);
    setup(options: IInternalLoggerOptions): Promise<void>;
    private logDateTime;
    private setupShutdownListeners;
    private removeShutdownListeners;
    dispose(): Promise<void>;
    log(msg: string, level: LogLevel, prependTimestamp?: boolean): void;
    private sendLog;
}
