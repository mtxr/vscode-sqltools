import { ENV, EXT_NAME, VERSION } from '@sqltools/core/constants';
import { runIfPropIsDefined } from '@sqltools/core/utils/decorators';
import SQLTools from '@sqltools/core/plugin-api';
import { numericVersion, Timer } from '@sqltools/core/utils';
import logger from '@sqltools/core/log';
import ConfigManager from '@sqltools/core/config-manager';
import * as Sentry from '@sentry/node';

const IGNORE_ERRORS_REGEX = new RegExp(`(${[
  'aggregate function',
  'already exists',
  'authentication failed',
  'cannot drop',
  'cross-database references',
  'does not exist',
  'econnrefused',
  'econnreset',
  'enotfound',
  'enotfound',
  'er_access_denied_error',
  'er_bad_db_error',
  'er_bad_field_error',
  'er_cannot_load_from_table_v2',
  'er_dup_fieldname',
  'er_no_referenced_row_2',
  'er_no_such_table',
  'er_not_supported_auth_mode',
  'er_parse_error',
  'etimedout',
  'failed to connect',
  'is ambiguous',
  'key constraint',
  'login failed',
  'no such table',
  'ora-[0-9]+',
  'sqlite_cantopen',
  'syntax error',
  'unknown_code_please_report',
  'violates',
].join('|')})`, 'g');

const product = process.env.PRODUCT as SQLTools.Product;
const log = logger.extend('telemetry');

Sentry.init({
  maxBreadcrumbs: 5,
  enabled: false,
  sampleRate: 1,
  release: `${product}@${VERSION}`,
  environment: ENV,
  attachStacktrace: true,
  dsn: process.env.DSN_KEY,
  beforeSend(event, hint) {
    if (!Telemetry.enabled) {
      return null;
    }
    return event;
  }
});

class Telemetry {
  public static enabled: Boolean;
  public static extraInfo: SQLTools.VSCodeInfo;
  private prefixed(key: string) {
    return `${product}:${key}`;
  }

  private createClient = () => {
    Sentry.getCurrentHub().getClient().getOptions().enabled = true;

    Sentry.setTags({
      product,
      os: process.platform,
      arch: process.arch,
      version: VERSION,
      extversionnum: numericVersion(VERSION).toString(),
      nodeversion: process.version,
    });
    if (Telemetry.extraInfo) {
      Sentry.setUser({
        id: Telemetry.extraInfo.uniqId, // vscode install id
        deviceId: Telemetry.extraInfo.uniqId,
        sessionId: Telemetry.extraInfo.sessId,
      });
    }
  }
  constructor(opts: SQLTools.TelemetryArgs) {
    this.updateOpts(opts);
  }

  public updateOpts = (opts: SQLTools.TelemetryArgs) => {
    Telemetry.extraInfo = opts.extraInfo || Telemetry.extraInfo || {};
    this.disable();
  }

  public enable = (): void => {
    if (Telemetry.enabled) return;
    Telemetry.enabled = true;
    this.createClient();
    log.extend('debug')('Telemetry enabled!');
  }

  public disable = (): void => {
    if (!Telemetry.enabled) return;
    Telemetry.enabled = false;
    Sentry.getCurrentHub().getClient().getOptions().enabled = false;
    log.extend('debug')('Telemetry disabled!');
  }

  @runIfPropIsDefined('client')
  public registerException(error: Error, data: { [key: string]: any } = {}) {
    if (!error) return;
    const errStr = (error && error.message ? error.message : '').toLowerCase();
    if (IGNORE_ERRORS_REGEX.test(errStr)) return;

    const properties = { ...((<any>error).data || {}), ...data };
    log.extend('error')(`Exception:%O\n\tData: %j`, error, properties);
    Sentry.configureScope(scope => {
      scope.setExtras({
        exception: error,
        properties
      });
      Sentry.captureException(error);
    })
  }

  @runIfPropIsDefined('client')
  public registerMessage(
    severity: 'info' | 'warn' | 'debug' | 'error' | 'critical' | 'fatal',
    message: string,
    value: string = 'Dismissed'
  ): void {
    log.extend(severity.substr(0, 5).toLowerCase())(`Message: %s, value: %s`, message, value);
    let sev: Sentry.Severity;
    switch (severity) {
      case 'debug':
        sev = Sentry.Severity.Debug;
        break;
      case 'info':
        sev = Sentry.Severity.Info;
        break;
      case 'warn':
        sev = Sentry.Severity.Warning;
        break;
      case 'error':
      case 'fatal':
      case 'critical':
        sev = Sentry.Severity.Error;
        break;
      default:
        sev = Sentry.Severity.Info;
        break;
    }
    Sentry.captureMessage(this.prefixed(message), Sentry.Severity[sev]);
  }

  @runIfPropIsDefined('client')
  public registerEvent(
    name: string,
    properties?: { [key: string]: any }
  ): void {
    log.extend('debug')(`Event: %s\n%j`, name,  properties || '');
    Sentry.captureEvent({
      event_id: this.prefixed(name),
      message: name,
      extra: properties,
      timestamp: +new Date(),
    });
  }

  @runIfPropIsDefined('client')
  public registerTime(timeKey: string, timer: Timer) {
    const elapsed = timer.elapsed();
    log.extend('debug')('Time: %s %d ms', timeKey, elapsed);
    this.registerEvent(this.prefixed(`time:${timeKey}`), {
      value: elapsed,
    });
  }
}

const telemetry = new Telemetry({
  enableTelemetry: false,
});

export default telemetry;

ConfigManager.addOnUpdateHook(() => {
  if (ConfigManager.telemetry) telemetry.enable();
  else telemetry.disable();
});