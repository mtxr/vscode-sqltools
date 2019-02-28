import * as AI from 'applicationinsights';
import { version as AIVersion } from 'applicationinsights/package.json';
import { VERSION, ENV, AI_KEY, EXT_NAME } from '@sqltools/core/constants';
import Timer from './timer';
import { ifProp } from './decorators';
import { LoggerInterface } from '@sqltools/core/interface';
type Product = 'core' | 'extension' | 'language-server' | 'ui';
export interface VSCodeInfo {
  uniqId?: string;
  sessId?: string;
  version?: string;
}

export interface TelemetryArgs {
  product: Product;
  enableTelemetry?: boolean;
  useLogger?: LoggerInterface;
  vscodeInfo?: VSCodeInfo;
}

export class Telemetry {
  public static SeveriryLevel = AI.Contracts.SeverityLevel;
  private enabled: Boolean;
  private logger: LoggerInterface = console;
  private client: AI.TelemetryClient;
  private product: Product;
  private vscodeInfo: VSCodeInfo;
  private prefixed(key: string) {
    return `${this.product}:${key}`;
  }

  private createClient() {
    AI.setup(AI_KEY)
      .setAutoCollectConsole(false)
      .setAutoCollectDependencies(false)
      .setAutoCollectExceptions(true)
      .setAutoCollectPerformance(false)
      .setAutoCollectRequests(false)
      .setAutoDependencyCorrelation(false)
      .setUseDiskRetryCaching(true);

    this.client = AI.defaultClient;

    const aiCtx = this.client.context;
    aiCtx.tags[aiCtx.keys.applicationVersion] = `${EXT_NAME}-${
      this.product
      }@${VERSION}`;
    aiCtx.tags[aiCtx.keys.internalSdkVersion] = `node:${AIVersion}`;
    aiCtx.tags[aiCtx.keys.deviceType] = this.product;

    if (this.vscodeInfo) {
      aiCtx.tags[aiCtx.keys.userId] = this.vscodeInfo.uniqId;
      aiCtx.tags[aiCtx.keys.deviceId] = this.vscodeInfo.uniqId;
      aiCtx.tags[aiCtx.keys.sessionId] = this.vscodeInfo.sessId;

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
      'common.nodeversion': process.version,
      ...(this.vscodeInfo
        ? {
            'common.vscodeuniqid': this.vscodeInfo.uniqId,
            'common.vscodesessid': this.vscodeInfo.sessId,
            'common.vscodeversion': this.vscodeInfo.version
          }
        : {})
    };

    AI.start();
  }
  constructor(opts: TelemetryArgs) {
    this.updateOpts(opts);
  }

  public updateOpts(opts: TelemetryArgs) {
    this.product = opts.product;
    this.vscodeInfo = opts.vscodeInfo || {};
    const { enableTelemetry, useLogger } = opts;
    this.setLogger(useLogger);
    if (enableTelemetry) this.enable();
    else this.disable();
  }

  public enable(): void {
    if (this.enabled) return;
    this.enabled = true;
    this.logger.info('Telemetry enabled!');
    this.createClient();
    this.registerSession();
  }
  public disable(): void {
    if (!this.enabled) return;
    this.enabled = false;
    AI.dispose();
    this.logger.info('Telemetry disabled!');
    this.client = undefined;
  }
  public setLogger(useLogger: LoggerInterface = console) {
    this.logger = useLogger;
  }

  @ifProp('client')
  public registerCommand(command: string) {
    this.registerEvent(`cmd:${command}`);
  }

  @ifProp('client')
  public registerInfoMessage(message, value = 'Dismissed') {
    this.registerMessage(Telemetry.SeveriryLevel.Information, message, value);
  }

  @ifProp('client')
  public registerException(error: Error, meta: { [key: string]: any } = {}) {
    if (!error) return;
    this.logger.error('Registered exception: ', error, { meta });
    this.sendException(error, meta);
  }

  @ifProp('client')
  public registerErrorMessage(
    message,
    error?: Error,
    value: string = 'Dismissed'
  ) {
    this.registerMessage(Telemetry.SeveriryLevel.Error, message, value);
    if (error) {
      this.registerException(error, { message });
    }
  }

  @ifProp('client')
  public registerSession() {
    this.registerEvent(`sessionStarted:${this.product}`);
  }

  @ifProp('client')
  public registerMessage(
    severity: AI.Contracts.SeverityLevel,
    message: string,
    value: string = 'Dismissed'
  ): void {
    this.client.trackTrace({ message: this.prefixed(message), severity, properties: { value } });
  }

  @ifProp('client')
  public registerEvent(
    name: string,
    properties?: { [key: string]: string }
  ): void {
    this.logger.info(`Event ${name}`);
    this.client.trackEvent({ name: this.prefixed(name), properties });
  }

  @ifProp('client')
  private sendException(error: Error, properties: { [key: string]: any } = {}) {
    this.client.trackException({
      exception: error,
      contextObjects: properties,
      properties
    });
  }

  @ifProp('client')
  public registerTime(timeKey: string, timer: Timer) {
    this.registerMetric(this.prefixed(`time:${timeKey}`), timer.elapsed());
  }

  @ifProp('client')
  public registerMetric(name: string, value: number) {
    this.client.trackMetric({
      name,
      value
    });
  }
}

export default Telemetry;