/// <reference path="../node_modules/@types/universal-analytics/index.d.ts" />

import Analytics = require('universal-analytics');
import {
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import { Logger } from './api';
import Utils from './api/utils';
import Constants from './constants';

// tslint:disable-next-line:no-var-requires
const uuidv4 = require('uuid/v4');
import ConfigManager = require('./api/config-manager');

export default class Telemetry {
  public static register(logger: any): any {
    Telemetry.setLogger(logger);
    if (ConfigManager.get('telemetry', true)) {
      Telemetry.enable();
    } else {
      Telemetry.disable();
    }
    Telemetry.extensionUUID = Telemetry.extensionUUID || ConfigManager.get('telemetryUUID', null) as string;
    Telemetry.logger.debug(`Telemetry UUID: ${Telemetry.extensionUUID}`);
    if (Telemetry.extensionUUID === null) {
      Telemetry.extensionUUID = uuidv4();
      Telemetry.start();
      Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase())
        .update('telemetryUUID', Telemetry.extensionUUID, true)
        .then(
          (ok) => {
            Telemetry.registerEvent('evt:install', Constants.version, 'installed');
            Telemetry.logger.debug('New install registerd', ok);
          }, Telemetry.errorHandler('save UUID'),
        );
      Telemetry.logger.debug(`Telemetry random UUID generated: ${Telemetry.extensionUUID}`);
    } else {
      Telemetry.start();
    }
    Telemetry.registerSession('started');
  }

  public static registerCommand(command: string) {
    Telemetry.registerEvent(`cmd:${command}`, Constants.version);
  }
  public static registerInfoMessage(message, value = 'Dismissed') {
    Telemetry.registerMessage('info', message, value);
  }

  public static registerErrorMessage(message, error?: Error, value: string = 'Dismissed') {
    Telemetry.registerMessage('error', message, value);
    if (error) {
      Telemetry.registerException(error);
    }
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
  public static registerSession(evt: string) {
    if (!Telemetry.isEnabled) return;
    Telemetry.analytics.screenview(evt, `vscode-sqltools`, Constants.version, Telemetry.errorHandler('screenview'));
  }
  public static registerMessage(type: string, message: string, value: string = 'Dismissed'): void {
    Telemetry.registerEvent(`msg:${type}`, message, value);
  }
  public static registerEvent(category: string, event: string, label?: string): void {
    if (!Telemetry.isEnabled) return;
    Telemetry.analytics.event(category, event, label || event, Telemetry.errorHandler('event'));
  }

  public static registerException(error: Error) {
    if (!Telemetry.isEnabled) return;
    let exceptionDescription = error.toString();
    if (error.message) {
      exceptionDescription = `${error.name}:${error.message}`;
    }
    Telemetry.analytics.exception(
      {
        exceptionDescription,
        isExceptionFatal: false,
      },
      Telemetry.errorHandler('exception'),
    );
  }

  public static registerTime(timeKey: string, timer: Utils.Timer) {
    Telemetry.analytics.timing(timeKey, timer.elapsed().toString(), Telemetry.errorHandler('timer'));
  }

  private static isEnabled: Boolean = true;
  private static logger: any = console;
  private static config: WorkspaceConfiguration;
  private static extensionUUID: string;
  private static analytics: Analytics.Visitor;
  private static uaCode: string = Constants.gaCode;

  private static start() {
    Telemetry.analytics = Analytics(Telemetry.uaCode, Telemetry.extensionUUID, { strictCidFormat: false });
    Telemetry.analytics.set('uid', Telemetry.extensionUUID);
    Telemetry.analytics.set('cid', Telemetry.extensionUUID);
    Telemetry.analytics.set('applicationVersion', Constants.version);
  }

  private static errorHandler(type: string) {
    return (error?: Error) => {
      if (!error) return;
      Telemetry.logger.error(`Telemetry:${type} error`, error);
    };
  }
}
