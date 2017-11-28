/// <reference path="./../node_modules/@types/node/index.d.ts" />

import * as request from 'request';
import Constants from './constants';

export default class Telemetry {
  public static regiterEvent(event: string, ...extra: any[]): void {
    if (!Telemetry.isEnabled) return;
    // tslint:disable:object-literal-sort-keys
    request({
      json: {
        version: Constants.version,
        date: (new Date()).toISOString().substr(0, 10),
        event,
        extra,
      },
      method: 'POST',
      url: `${Telemetry.server}/registerEvent`,
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
  private static server: string = 'https://us-central1-sqltools-telemetry-api.cloudfunctions.net';
  private static isEnabled: Boolean = true;
  private static logger: any = console;
}
