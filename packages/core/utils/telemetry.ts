import Analytics from 'universal-analytics';
import uuidv4 from 'uuid/v4';
import { LoggerInterface } from '../interface';
import { get, set } from './persistence';
import { GA_CODE, VERSION, RB, ENV } from './../constants';
import Timer from './timer';
import Rollbar from 'rollbar';

const metaData = {
  platform: {
    os: process.platform,
    arch: process.arch,
  }
};

const opts: Rollbar.Configuration = {
  enabled: false,
  accessToken: RB,
  captureUncaught: true,
  captureUnhandledRejections: true,
  captureIp: false,
  captureEmail: false,
  captureUsername: false,
  captureLambdaTimeouts: false,
  environment: ENV,
  codeVersion: VERSION,
  payload: {
    ...metaData,
  },
  checkIgnore: () => {
    return !Telemetry.shouldSend();
  },
  transform: (payload: any) => {
    if (Telemetry.extensionUUID)
      payload.person = { id: Telemetry.extensionUUID }
  }
};
const rollbar = new Rollbar(opts);
type Product = 'core' | 'extension' | 'language-server' | 'ui';

namespace Telemetry {
  let isEnabled: Boolean = true;
  let logger: LoggerInterface = console;
  let analytics: Analytics.Visitor;
  export let extensionUUID: string;

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
      registerException(error, { message });
    }
  }

  export function enable(): void {
    isEnabled = true;
    logger.info('Telemetry enabled!');
    if (RB)
      rollbar.configure({
        ...opts,
        enabled: true,
      });
  }
  export function disable(): void {
    isEnabled = false;
    logger.info('Telemetry disabled!');
    if (RB)
      rollbar.configure({
        ...opts,
        enabled: false,
      });
  }
  export function setLogger(useLogger: LoggerInterface = console) {
    logger = useLogger;
  }
  export function registerSession(evt: string) {
    if (!isEnabled) return;
    analytics.screenview(evt, `vscode-sqltools`, VERSION, errorHandler('screenview', { evt }));
  }
  export function registerMessage(type: string, message: string, value: string = 'Dismissed'): void {
    registerEvent(`msg:${type}`, message, value);
  }
  export function registerEvent(category: string, event: string, label?: string): void {
    if (!isEnabled) return;
    analytics.event(category, event, label || event, errorHandler('event', { category, event, label }));
  }

  export function registerException(error: Error, meta: { [key: string]: any } = {}) {
    if (!isEnabled) return;
    errorHandler('registeredException', meta)(error);
    let exceptionDescription = error.toString();
    if (error.message) {
      exceptionDescription = `${error.name}:${error.message}`;
    }
    analytics.exception(
      {
        exceptionDescription,
        isExceptionFatal: false,
      },
      errorHandler('analyticsException', meta),
    );
  }

  export function registerTime(timeKey: string, timer: Timer) {
    analytics.timing(timeKey, timer.elapsed().toString(), errorHandler('timer', { timeKey }));
  }

  function start() {
    analytics = Analytics(GA_CODE, extensionUUID, { strictCidFormat: false });
    analytics.set('uid', extensionUUID);
    analytics.set('cid', extensionUUID);
    analytics.set('applicationVersion', VERSION);
  }

  function errorHandler(definedType: string, meta: { [key: string]: any } = {}) {
    return (error?: Error) => {
      if (!error) return;
      rollbar.error(error, {
        ...metaData,
        definedType,
        from: 'errorHandler',
        ...meta,
      });
      logger.error(`Telemetry:${definedType} error`, error);
    };
  }
  export function shouldSend() {
    return !!isEnabled;
  }
}

export default Telemetry;
export { Telemetry };
