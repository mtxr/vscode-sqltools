import {
  LanguageClient,
  ServerOptions,
  TransportKind,
  LanguageClientOptions,
  ErrorAction,
  CloseAction,
  ErrorHandler as LanguageClientErrorHandler,
  RequestType0,
  CancellationToken,
  RequestType,
  Disposable,
  RequestHandler0,
  RequestHandler,
  GenericRequestHandler,
  NotificationType0,
  NotificationType,
  NotificationHandler0,
  NotificationHandler,
  GenericNotificationHandler,
  NodeModule,
} from 'vscode-languageclient';
import {
  ExtensionContext,
  env as VSCodeEnv,
  version as VSCodeVersion,
  workspace as Wspc,
} from 'vscode';
import { TelemetryArgs, Telemetry, commandExists } from '@sqltools/core/utils';
import ConfigManager from '@sqltools/core/config-manager';
import Notification from '@sqltools/core/contracts/notifications';
import DepInstaller from './dep-installer';
import { ErrorHandler } from '../api';

export class SQLToolsLanguageClient {
  public client: LanguageClient;
  private clientErrorHandler: LanguageClientErrorHandler;
  private avoidRestart: boolean;
  private depInstaller: DepInstaller;

  constructor(private context: ExtensionContext, public telemetry: Telemetry) {
    this.client = new LanguageClient(
      'SQLTools Language Server',
      this.getServerOptions(),
      this.getClientOptions(),
      );
    this.clientErrorHandler = this.client.createDefaultErrorHandler();
    this.depInstaller = new DepInstaller(this, telemetry);

    this.registerBaseNotifications();
  }

  public start(): Disposable {
    return this.client.start();
  }

  public sendRequest<R, E, RO>(type: RequestType0<R, E, RO>, token?: CancellationToken): Thenable<R>;
  public sendRequest<P, R, E, RO>(type: RequestType<P, R, E, RO>, params: P, token?: CancellationToken): Thenable<R>;
  public sendRequest<R>(method: string, token?: CancellationToken): Thenable<R>;
  public sendRequest<R>(method: string, param: any, token?: CancellationToken): Thenable<R>;
  public async sendRequest() {
    await this.client.onReady();
    return this.client.sendRequest.apply(this.client, arguments);
  }

  public onRequest<R, E, RO>(type: RequestType0<R, E, RO>, handler: RequestHandler0<R, E>): void;
  public onRequest<P, R, E, RO>(type: RequestType<P, R, E, RO>, handler: RequestHandler<P, R, E>): void;
  public onRequest<R, E>(method: string, handler: GenericRequestHandler<R, E>): void;
  public async onRequest() {
    await this.client.onReady();
    return this.client.onRequest.apply(this.client, arguments);
  }

  public sendNotification<RO>(type: NotificationType0<RO>): void;
  public sendNotification<P, RO>(type: NotificationType<P, RO>, params?: P): void;
  public sendNotification(method: string): void;
  public sendNotification<T = any>(method: string, params: T): void;
  public async sendNotification() {
    await this.client.onReady();
    return this.client.sendNotification.apply(this.client, arguments);
  }
  public onNotification<RO>(type: NotificationType0<RO>, handler: NotificationHandler0): void;
  public onNotification<P, RO>(type: NotificationType<P, RO>, handler: NotificationHandler<P>): void;
  public onNotification(method: string, handler: GenericNotificationHandler): void;
  public async onNotification() {
    await this.client.onReady();
    return this.client.onNotification.apply(this.client, arguments);
  }

  private getServerOptions(): ServerOptions {
    const serverModule = this.context.asAbsolutePath('languageserver.js');
    const runOptions: NodeModule = {
      module: serverModule,
      transport: TransportKind.ipc,
      runtime: commandExists('node') ? 'node' : undefined, // use node id possible, otherwise use VSCode electron
    };

    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] };

    return {
      debug: { ...runOptions, options: debugOptions },
      run: runOptions,
    };
  }

  private getClientOptions(): LanguageClientOptions {
    const telemetryArgs: TelemetryArgs = {
      product: 'language-server',
      enableTelemetry: ConfigManager.telemetry,
      vscodeInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    };
    const selector = ConfigManager.completionLanguages
      .concat(ConfigManager.formatLanguages)
      .reduce((agg, language) => {
        if (typeof language === 'string') {
          agg.push({ language, scheme: 'untitled' });
          agg.push({ language, scheme: 'file' });
        } else {
          agg.push(language);
        }
        return agg;
      }, []);

    return {
      documentSelector: selector,
      initializationOptions: {
        telemetry: telemetryArgs,
        extensionPath: this.context.extensionPath,
      },
      synchronize: {
        configurationSection: 'sqltools',
        fileEvents: Wspc.createFileSystemWatcher('**/.sqltoolsrc'),
      },
      initializationFailedHandler: error => {
        this.telemetry.registerException(error, {
          message: 'Server initialization failed.',
        });
        this.client.error('Server initialization failed.', error);
        this.client.outputChannel.show(true);
        return false;
      },
      errorHandler: {
        error: (error, message, count): ErrorAction => {
          this.telemetry.registerException(error, {
            message: 'Language Server error.',
            givenMessage: message,
            count,
          });
          return this.clientErrorHandler.error(error, message, count);
        },
        closed: (): CloseAction => {
          if (this.avoidRestart) {
            return CloseAction.DoNotRestart;
          }

          return this.clientErrorHandler.closed();
        },
      },
    };
  }

  private async registerBaseNotifications() {
    await this.client.onReady();
    const onError = ({ err = '', errMessage, message }: Partial<{ err: any, [id: string]: any }>) => {
      ErrorHandler.create(
        message,
        () => this.client.outputChannel.show(),
      )((errMessage || err.message || err).toString());
    };
    this.telemetry.registerInfoMessage('LanguageClient ready');
    this.client.onNotification(Notification.ExitCalled, () => {
      this.avoidRestart = true;
    });
    this.client.onNotification(
      Notification.OnError,
      onError,
    );
  }
}
