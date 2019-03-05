import { AI_KEY, ENV, EXT_NAME, VERSION } from '@sqltools/core/constants';
import { runIfPropIsDefined } from '@sqltools/core/utils/decorators';
import Timer from '@sqltools/core/utils/timer';
import * as AI from 'applicationinsights';
import { version as AIVersion } from 'applicationinsights/package.json';

type Product = 'core' | 'extension' | 'language-server' | 'language-client' | 'ui';

export interface VSCodeInfo {
  uniqId?: string;
  sessId?: string;
  version?: string;
}

export interface TelemetryArgs {
  product: Product;
  enableTelemetry?: boolean;
  vscodeInfo?: VSCodeInfo;
}

export class Telemetry {
  public static SeveriryLevel = AI.Contracts.SeverityLevel;
  public static enabled: Boolean;
  public static vscodeInfo: VSCodeInfo;
  private client: AI.TelemetryClient;
  private product: Product;
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
  }
  constructor(opts: TelemetryArgs) {
    this.updateOpts(opts);
  }

  public updateOpts(opts: TelemetryArgs) {
    this.product = opts.product || this.product;
    Telemetry.vscodeInfo = opts.vscodeInfo || Telemetry.vscodeInfo || {};
    const { enableTelemetry } = opts;
    if (enableTelemetry) this.enable();
    else this.disable();
  }

  public enable(): void {
    if (Telemetry.enabled) return;
    Telemetry.enabled = true;
    console.info('Telemetry enabled!');
    this.createClient();
    this.registerSession();
  }
  public disable(): void {
    if (!Telemetry.enabled) return;
    Telemetry.enabled = false;
    AI.dispose();
    console.info('Telemetry disabled!');
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
  public registerException(error: Error, meta: { [key: string]: any } = {}) {
    if (!error) return;
    this.sendException(error, meta);
  }

  @runIfPropIsDefined('client')
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
    console.debug(`Message: ${message}`);
    this.client.trackTrace({ message: this.prefixed(message), severity, properties: { value } });
  }

  @runIfPropIsDefined('client')
  public registerEvent(
    name: string,
    properties?: { [key: string]: string }
  ): void {
    console.debug(`Event: ${name}`, properties || '');
    this.client.trackEvent({ name: this.prefixed(name), properties });
  }

  @runIfPropIsDefined('client')
  private sendException(error: Error, properties: { [key: string]: any } = {}) {
    console.error('Error: ', error);
    this.client.trackException({
      exception: error,
      contextObjects: properties,
      properties
    });
  }

  @runIfPropIsDefined('client')
  public registerTime(timeKey: string, timer: Timer) {
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