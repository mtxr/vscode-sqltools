import { ITimer } from './timer';

export interface ITelemetryArgs {
  enableTelemetry?: boolean;
  extraInfo?: {
    uniqId?: string;
    sessId?: string;
    version?: string;
  };
}

export abstract class ATelemetry {
  public static enabled: Boolean;

  public static extraInfo: ITelemetryArgs['extraInfo'];

  abstract updateOpts(opts: ITelemetryArgs): void;

  abstract enable(): void;

  abstract disable(): void;

  abstract registerException(error: Error, data?: { [key: string]: any }): void;

  abstract registerMessage(
    severity: 'info' | 'warn' | 'debug' | 'error' | 'critical' | 'fatal',
    message: string,
    value?: string,
  ): void;

  abstract registerEvent(
    name: string,
    properties?: { [key: string]: any }
  ): void;

  abstract registerTime(timeKey: string, timer: ITimer): void;
}