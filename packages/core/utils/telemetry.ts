import Analytics from 'universal-analytics';
import uuidv4 from 'uuid/v4';
import { LoggerInterface } from '../interface';
import { get, set } from './persistence';
import { GA_CODE, VERSION, BUGSNAG_API_KEY, ENV } from './../constants';
import Timer from './timer';
import bugsnag from 'bugsnag';

const bugsnagOpts = {
  appVersion: VERSION,
  autoBreadcrumbs: false,
  autoCaptureSessions: false,
  autoNotify: false,
  collectUserIp: false,
  releaseStage: ENV,
};
bugsnag.register(BUGSNAG_API_KEY, bugsnagOpts);

type Product = 'core' | 'extension' | 'language-server' | 'ui';

namespace Telemetry {
  let isEnabled: Boolean = true;
  let logger: LoggerInterface = console;
  let extensionUUID: string;
  let analytics: Analytics.Visitor;

  export function register(product: Product, enableTelemetry: boolean, useLogger?: LoggerInterface): any {
    setLogger(useLogger);
    if (enableTelemetry) {
      enable();
    } else {
      disable();
    }
    extensionUUID = get('telemetryUUID');
    if (!extensionUUID) {
      extensionUUID = uuidv4();
      start();
      set('telemetryUUID', extensionUUID);
      registerEvent('evt:install', VERSION, 'installed');
      logger.log(`Telemetry random UUID generated: ${extensionUUID}`);
    } else {
      start();
    }
    registerSession('started');
  }

  export function registerCommand(command: string) {
    registerEvent(`cmd:${command}`, VERSION);
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
    bugsnag.configure({ ...bugsnagOpts, autoNotify: true });
    logger.info('Telemetry enabled!');
  }
  export function disable(): void {
    isEnabled = false;
    bugsnag.configure({ ...bugsnagOpts, autoNotify: false });
    logger.info('Telemetry disabled!');
  }
  export function setLogger(useLogger: LoggerInterface = console) {
    logger = useLogger;
    bugsnag.configure({ ...bugsnagOpts, logger: logger as any }) ;
  }
  export function registerSession(evt: string) {
    if (!isEnabled) return;
    analytics.screenview(evt, `vscode-sqltools`, VERSION, errorHandler('screenview'));
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

  export function registerTime(timeKey: string, timer: Timer) {
    analytics.timing(timeKey, timer.elapsed().toString(), errorHandler('timer'));
  }

  function start() {
    analytics = Analytics(GA_CODE, extensionUUID, { strictCidFormat: false });
    analytics.set('uid', extensionUUID);
    analytics.set('cid', extensionUUID);
    analytics.set('applicationVersion', VERSION);
  }

  function errorHandler(type: string) {
    return (error?: Error) => {
      if (!error) return;
      bugsnag.notify(error);
      logger.error(`Telemetry:${type} error`, error);
    };
  }
}

export default Telemetry;
export { Telemetry };
