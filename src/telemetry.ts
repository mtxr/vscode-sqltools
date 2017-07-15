/// <reference path="./../node_modules/@types/node/index.d.ts" />

import * as request from 'request';

function getFunctionName(): string | null {
  try {
    return (new Error()).stack.match(/at (\S+)/g)[2].slice(3);
  } catch (error) {
    return null;
  }
}

export default class Telemetry {
  public static registerCall(fnName?: string): void {
    if (!Telemetry.isEnabled) return;
    const fn = fnName || getFunctionName();
    if (!fn) return;
    request({
      json: {
        date: (new Date()).toISOString().substr(0, 10),
        fn,
      },
      method: 'POST',
      url: `${Telemetry.server}/registerCall`,
    });
  }

  public static enable(): void {
    Telemetry.isEnabled = true;
    Telemetry.logger.info('Telemetry enabled!');
  }
  public static disable(): void {
    Telemetry.isEnabled = false;
    Telemetry.logger.info('Telemetry disabled!');
  }
  public static setLogger(logger: any = console) {
    Telemetry.logger = logger;
  }
  private static server: string = 'https://us-central1-sqltools-a541d.cloudfunctions.net';
  private static isEnabled: Boolean = true;
  private static logger: any = console;
}
