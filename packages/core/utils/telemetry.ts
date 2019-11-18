import { AI_KEY, ENV, EXT_NAME, VERSION } from '@sqltools/core/constants';
import { runIfPropIsDefined } from '@sqltools/core/utils/decorators';
import Timer from '@sqltools/core/utils/timer';
import * as AI from 'applicationinsights';
import { version as AIVersion } from 'applicationinsights/package.json';
import SQLTools from '@sqltools/core/plugin-api';
import { numericVersion } from '.';

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

export class Telemetry implements SQLTools.TelemetryInterface {
  public static SeveriryLevel = AI.Contracts.SeverityLevel;
  public static enabled: Boolean;
  public static vscodeInfo: SQLTools.VSCodeInfo;
  private client: AI.TelemetryClient;
  private product: SQLTools.Product;
  private logger: Console;
  private prefixed(key: string) {
    return `${this.product}:${key}`;
  }

  private createClient = () => {
    AI.setup(AI_KEY)
      .setAutoCollectConsole(false)
      .setAutoCollectDependencies(false)
      .setAutoCollectExceptions(false)
      .setAutoCollectPerformance(false)
      .setAutoCollectRequests(false)
      .setAutoDependencyCorrelation(false)
      .setInternalLogging(false, false)
      .setUseDiskRetryCaching(true);

    AI.defaultClient.config.samplingPercentage = 50;
    this.client = AI.defaultClient;

    const aiCtx = this.client.context;
    aiCtx.tags[aiCtx.keys.applicationVersion] = `${EXT_NAME}-${
      this.product
      }@${VERSION}`;
    aiCtx.tags[aiCtx.keys.internalSdkVersion] = `node:${AIVersion}`;
    aiCtx.tags[aiCtx.keys.deviceType] = this.product;

    if (Telemetry.vscodeInfo) {
      aiCtx.tags[aiCtx.keys.userId] = Telemetry.vscodeInfo.uniqId;
      aiCtx.tags[aiCtx.keys.deviceId] = Telemetry.vscodeInfo.uniqId;
      aiCtx.tags[aiCtx.keys.sessionId] = Telemetry.vscodeInfo.sessId;

    }

    // __GDPR__COMMON__ "common.os" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.arch" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.channel" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extname" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.extversion" : { "classification": "PublicNonPersonalData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodeuniqid" : { "endPoint": "MacAddressHash", "classification": "EndUserPseudonymizedInformation", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodesessid" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    // __GDPR__COMMON__ "common.vscodeversion" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
    this.client.commonProperties = {
      'common.os': process.platform,
      'common.arch': process.arch,
      'common.channel': ENV,
      'common.extname': EXT_NAME,
      'common.extversion': VERSION,
      'common.extversionnum': numericVersion(VERSION).toString(),
      'common.nodeversion': process.version,
      ...(Telemetry.vscodeInfo
        ? {
            'common.vscodeuniqid': Telemetry.vscodeInfo.uniqId,
            'common.vscodesessid': Telemetry.vscodeInfo.sessId,
            'common.vscodeversion': Telemetry.vscodeInfo.version
          }
        : {})
    };

    AI.start();
    this.registerSession();
  }
  constructor(opts: SQLTools.TelemetryArgs) {
    this.logger = opts.logger || console;
    this.updateOpts(opts);
  }

  public updateOpts = (opts: SQLTools.TelemetryArgs) => {
    this.product = opts.product || this.product;
    Telemetry.vscodeInfo = opts.vscodeInfo || Telemetry.vscodeInfo || {};
    this.disable();
  }

  public enable = (): void => {
    return this.disable();
    // if (Telemetry.enabled) return;
    // Telemetry.enabled = true;
    // this.logger.info('Telemetry enabled!');
    // this.createClient();
  }

  public disable = (): void => {
    if (!Telemetry.enabled) return;
    Telemetry.enabled = false;
    AI.dispose();
    // this.logger.info('Telemetry disabled!');
    this.client = undefined;
  }

  @runIfPropIsDefined('client')
  public registerCommand(command: string) {
    this.registerEvent(`cmd:${command}`);
  }

  @runIfPropIsDefined('client')
  public registerInfoMessage(message, value = 'Dismissed') {
    this.registerMessage(Telemetry.SeveriryLevel.Information, message, value);
  }

  @runIfPropIsDefined('client')
  public registerException(error: Error, data: { [key: string]: any } = {}) {
    if (!error) return;
    const errStr = (error && error.message ? error.message : '').toLowerCase();
    if (IGNORE_ERRORS_REGEX.test(errStr)) return;

    this.sendException(error, { ...((<any>error).data || {}), ...data });
  }

  @runIfPropIsDefined('client')
  public registerSession() {
    this.registerEvent(`sessionStarted:${this.product}`);
  }

  @runIfPropIsDefined('client')
  public registerMessage(
    severity: AI.Contracts.SeverityLevel,
    message: string,
    value: string = 'Dismissed'
  ): void {
    this.logger.log(`Message: ${message}`);
    this.client.trackTrace({ message: this.prefixed(message), severity, properties: { value } });
  }

  @runIfPropIsDefined('client')
  public registerEvent(
    name: string,
    properties?: { [key: string]: string }
  ): void {
    this.logger.log(`Event: ${name}`, properties || '');
    this.client.trackEvent({ name: this.prefixed(name), properties });
  }

  @runIfPropIsDefined('client')
  private sendException(error: Error, properties: { [key: string]: any } = {}) {
    this.logger.error('Error: ', error);
    this.client.trackException({
      exception: error,
      contextObjects: properties,
      properties
    });
  }

  @runIfPropIsDefined('client')
  public registerTime(timeKey: string, timer: Timer) {
    this.logger.log(`${timeKey.charAt(0).toUpperCase()}${timeKey.substr(1).toLowerCase()} time: ${timer.elapsed()}ms`);
    this.registerMetric(this.prefixed(`time:${timeKey}`), timer.elapsed());
  }

  @runIfPropIsDefined('client')
  public registerMetric(name: string, value: number) {
    this.client.trackMetric({
      name,
      value
    });
  }
}

export default Telemetry;