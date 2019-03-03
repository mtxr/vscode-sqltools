import {
  LanguageClient,
  ServerOptions,
  TransportKind,
  LanguageClientOptions,
  ErrorAction,
  CloseAction,
  ErrorHandler as LanguageClientErrorHandler,
  NodeModule,
} from 'vscode-languageclient';
import {
  env as VSCodeEnv,
  version as VSCodeVersion,
  workspace as Wspc,
} from 'vscode';
import { TelemetryArgs, Telemetry, commandExists } from '@sqltools/core/utils';
import ConfigManager from '@sqltools/core/config-manager';
import Notification from '@sqltools/core/contracts/notifications';
import { ErrorHandler } from '../api';
import { SQLToolsLanguageClientInterface, LanguageClientPlugin } from '@sqltools/core/interface/plugin';
import ContextManager from './../context';

export class SQLToolsLanguageClient implements SQLToolsLanguageClientInterface {
  public client: LanguageClient;
  public clientErrorHandler: LanguageClientErrorHandler;
  private _logger = new Telemetry({
    product: 'language-client',
    useLogger: console,
  });

  constructor() {
    this.client = new LanguageClient(
      'SQLTools Language Server',
      this.getServerOptions(),
      this.getClientOptions(),
      );
    this.clientErrorHandler = this.client.createDefaultErrorHandler();

    this.registerBaseNotifications();
  }

  public start() {
    return this.client.start();
  }

  public registerPlugin(plugin: LanguageClientPlugin) {
    plugin.register(this);
    return this;
  }
  public sendRequest: LanguageClient['sendRequest'] = async function () {
    await this.client.onReady();
    return this.client.sendRequest.apply(this.client, arguments);
  }

  public onRequest: LanguageClient['onRequest'] = async function () {
    await this.client.onReady();
    return this.client.onRequest.apply(this.client, arguments);
  }

  public sendNotification: LanguageClient['sendNotification'] = async function () {
    await this.client.onReady();
    return this.client.sendNotification.apply(this.client, arguments);
  }
  public onNotification: LanguageClient['onNotification'] = async function () {
    await this.client.onReady();
    return this.client.onNotification.apply(this.client, arguments);
  }

  private getServerOptions(): ServerOptions {
    const serverModule = ContextManager.context.asAbsolutePath('languageserver.js');
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
        extensionPath: ContextManager.context.extensionPath,
      },
      synchronize: {
        configurationSection: 'sqltools',
        fileEvents: Wspc.createFileSystemWatcher('**/.sqltoolsrc'),
      },
      initializationFailedHandler: error => {
        this.logger.registerException(error, {
          message: 'Server initialization failed.',
        });
        this.client.error('Server initialization failed.', error);
        this.client.outputChannel.show(true);
        return false;
      },
      errorHandler: {
        error: (error, message, count): ErrorAction => {
          this.logger.registerException(error, {
            message: 'Language Server error.',
            givenMessage: message,
            count,
          });
          return this.clientErrorHandler.error(error, message, count);
        },
        closed: (): CloseAction => {
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
    this.client.onNotification(
      'serverError', // @TODO: constant
      onError,
    );
    this.logger.registerInfoMessage('LanguageClient ready');
  }

  public get log() {
    return this._logger.log;
  }

  public get logger() {
    return this._logger;
  }
}
