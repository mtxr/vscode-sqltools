import { IInternalLogger, IInternalLoggerOptions, LogLevel } from "../logger";
/**
 * In a browser/web worker we use a NOP-logger for now.
 */
export declare class InternalLogger implements IInternalLogger {
    dispose(): Promise<void>;
    log(msg: string, level: LogLevel, prependTimestamp?: boolean): void;
    setup(options: IInternalLoggerOptions): Promise<void>;
}
