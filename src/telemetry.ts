/// <reference path="./../node_modules/@types/node/index.d.ts" />

import Analytics from 'electron-google-analytics';
import {
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import { Logger } from './api';
import Constants from './constants';

// tslint:disable-next-line:no-var-requires
const uuidv4 = require('uuid/v4');
import * as ConfigManager from './api/config-manager';

export default class Telemetry {
  public static register(logger: any): any {
    Telemetry.setLogger(logger);
    if (ConfigManager.get('telemetry', true)) {
      Telemetry.enable();
    } else {
      Telemetry.disable();
    }
    Telemetry.analytics = new Analytics(Telemetry.uaCode);
    Telemetry.extensionUUID = Telemetry.extensionUUID || ConfigManager.get('telemetryUUID', null) as string;
    Telemetry.logger.info(`Telemetry UUID: ${Telemetry.extensionUUID}`);
    if (Telemetry.extensionUUID === null) {
      Telemetry.extensionUUID = uuidv4();
      Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase())
        .update('telemetryUUID', Telemetry.extensionUUID, true)
        .then(
          (ok) => {
            Telemetry.registerEvent('install', Constants.version, 'installed');
            Telemetry.logger.info('New install registerd', ok);
          },
          (err) => Telemetry.logger.error('Register pageview error', err),
        );
      Telemetry.logger.info(`Telemetry random UUID generated: ${Telemetry.extensionUUID}`);
    }
    Telemetry.analytics.pageview('vscode', '/', 'Started', Telemetry.extensionUUID)
      .catch((err) => Telemetry.logger.error('Register pageview error', err));
  }

  public static registerCommandUsage(command: string) {
    Telemetry.registerEvent(command, Constants.version);
  }
  public static infoMessage(message, value = 'Dismissed') {
    Telemetry.registerEvent('info-message', message, value);
  }

  public static errorMessage(message, value = 'Dismissed') {
    Telemetry.registerEvent('error-message', message, value);
  }

  public static enable(): void {
    Telemetry.isEnabled = true;
    Telemetry.logger.info('Telemetry enabled!');
  }
  public static disable(): void {
    Telemetry.isEnabled = false;
    Telemetry.logger.info('Telemetry disabled!');
  }
  public static setLogger(logger: any = Logger) {
    Telemetry.logger = logger;
  }

  private static isEnabled: Boolean = true;
  private static logger: any = console;
  private static config: WorkspaceConfiguration;
  private static extensionUUID: string;
  private static analytics: Analytics;
  private static uaCode: string = 'UA-110380775-2';

  private static registerEvent(category: string, event: string, label?: string): void {
    if (!Telemetry.isEnabled) return;
    // tslint:disable:object-literal-sort-keys
    const params = {
      ec: category,
      ea: event,
      el: label || event,
    };
    Telemetry.analytics.send('event', params, Telemetry.extensionUUID)
      .catch((err) => Telemetry.logger.error('Register event error', err));
  }
}
