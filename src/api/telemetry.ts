import Analytics = require('universal-analytics');
import uuidv4 from 'uuid/v4';
import Constants from './../constants';
import ConfigManager = require('./config-manager');
import LoggerInterface from './interface/logger';
import Logger from './logger';
import Utils from './utils';

namespace Telemetry {
  let isEnabled: Boolean = true;
  let logger: LoggerInterface = console;
  let extensionUUID: string;
  let analytics: Analytics.Visitor;
  const uaCode: string = Constants.gaCode;

  export function register(useLogger?: LoggerInterface): any {
    setLogger(useLogger);
    if (ConfigManager.get('telemetry', true)) {
      enable();
    } else {
      disable();
    }
    const localInfo = Utils.localSetupInfo();
    extensionUUID = extensionUUID || localInfo.telemetryUUID;
    if (!extensionUUID) {
      extensionUUID = uuidv4();
      start();
      localInfo.telemetryUUID = extensionUUID;
      Utils.writeLocalSetupInfo(localInfo);
      registerEvent('evt:install', Constants.version, 'installed');
      logger.log(`Telemetry random UUID generated: ${extensionUUID}`);
    } else {
      start();
    }
    registerSession('started');
  }

  export function registerCommand(command: string) {
    registerEvent(`cmd:${command}`, Constants.version);
  }
  export function registerInfoMessage(message, value = 'Dismissed') {
    registerMessage('info', message, value);
  }

  export function registerErrorMessage(message, error?: Error, value: string = 'Dismissed') {
    registerMessage('error', message, value);
    if (error) {
      registerException(error);
    }
  }

  export function enable(): void {
    isEnabled = true;
    logger.info('Telemetry enabled!');
  }
  export function disable(): void {
    isEnabled = false;
    logger.info('Telemetry disabled!');
  }
  export function setLogger(useLogger: LoggerInterface = console) {
    logger = useLogger;
  }
  export function registerSession(evt: string) {
    if (!isEnabled) return;
    analytics.screenview(evt, `vscode-sqltools`, Constants.version, errorHandler('screenview'));
  }
  export function registerMessage(type: string, message: string, value: string = 'Dismissed'): void {
    registerEvent(`msg:${type}`, message, value);
  }
  export function registerEvent(category: string, event: string, label?: string): void {
    if (!isEnabled) return;
    analytics.event(category, event, label || event, errorHandler('event'));
  }

  export function registerException(error: Error) {
    if (!isEnabled) return;
    let exceptionDescription = error.toString();
    if (error.message) {
      exceptionDescription = `${error.name}:${error.message}`;
    }
    analytics.exception(
      {
        exceptionDescription,
        isExceptionFatal: false,
      },
      errorHandler('exception'),
    );
  }

  export function registerTime(timeKey: string, timer: Utils.Timer) {
    analytics.timing(timeKey, timer.elapsed().toString(), errorHandler('timer'));
  }

  function start() {
    analytics = Analytics(uaCode, extensionUUID, { strictCidFormat: false });
    analytics.set('uid', extensionUUID);
    analytics.set('cid', extensionUUID);
    analytics.set('applicationVersion', Constants.version);
  }

  function errorHandler(type: string) {
    return (error?: Error) => {
      if (!error) return;
      logger.error(`Telemetry:${type} error`, error);
    };
  }
}

export default Telemetry;
