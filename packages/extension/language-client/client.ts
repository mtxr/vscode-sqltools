import logger from '@sqltools/core/log';
import path from 'path';
import fs from 'fs';
import ConfigManager from '@sqltools/core/config-manager';
import { DISPLAY_NAME, EXT_NAME } from '@sqltools/core/constants';
import { commandExists } from '@sqltools/core/utils';
import { env as VSCodeEnv, version as VSCodeVersion, workspace as Wspc, ExtensionContext, window, commands } from 'vscode';
import { CloseAction, ErrorAction, ErrorHandler as LanguageClientErrorHandler, LanguageClient, LanguageClientOptions, NodeModule, ServerOptions, TransportKind } from 'vscode-languageclient';
import ErrorHandler from '../api/error-handler';
import telemetry from '@sqltools/core/utils/telemetry';
import { ILanguageClient, ITelemetryArgs } from '@sqltools/types';

const log = logger.extend('lc');

export class SQLToolsLanguageClient implements ILanguageClient {
  public client: LanguageClient;
  public clientErrorHandler: LanguageClientErrorHandler;

  constructor(public context: ExtensionContext) {
    this.client = new LanguageClient(
      `${DISPLAY_NAME} Language Server`,
      this.getServerOptions(),
      this.getClientOptions(),
      );
    this.clientErrorHandler = this.client.createDefaultErrorHandler();

    this.registerBaseNotifications();

    const useNodeRuntimePrevValue = ConfigManager.useNodeRuntime;
    const languageServerEnvPrevValue = JSON.stringify(ConfigManager.languageServerEnv);
    ConfigManager.addOnUpdateHook(async () => {
      if (ConfigManager.useNodeRuntime !== useNodeRuntimePrevValue) {
        const res = await window.showWarningMessage('Use node runtime setting change. You must reload window to take effect.', 'Reload now');
        if (!res) return;
        commands.executeCommand('workbench.action.reloadWindow');
      }

      if (JSON.stringify(ConfigManager.languageServerEnv) !== languageServerEnvPrevValue) {
        const res = await window.showWarningMessage('New language server environment variables set. You must reload window to take effect.', 'Reload now');
        if (!res) return;
        commands.executeCommand('workbench.action.reloadWindow');
      }
    })
  }

  public start() {
    return this.client.start();
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
    const serverModule = this.context.asAbsolutePath('languageserver.js');
    let runtime: string = undefined;
    const useNodeRuntime = ConfigManager.useNodeRuntime;
    if (useNodeRuntime) {
      if (typeof useNodeRuntime === 'string') {
        const runtimePath = path.normalize(useNodeRuntime);
        if (fs.existsSync(runtimePath)) {
          runtime = runtimePath;
        }
      } else {
        if (commandExists('node')) {
          runtime = 'node';
        }
      }
      if (!runtime) {
        const message = 'Node runtime not found. Using default as a fallback.';
        window.showInformationMessage(message);
        log.extend('info')(message)
      }
    }

    const runOptions: NodeModule = {
      module: serverModule,
      transport: TransportKind.ipc,
      runtime,
      options: {
        env: {
          ...(ConfigManager.languageServerEnv || {}),
          IS_NODE_RUNTIME: useNodeRuntime ? 1 : 0,
        },
      }
    };

    return {
      debug: {
        ...runOptions,
        options: {
          ...runOptions.options,
          execArgv: ['--nolazy', '--inspect=6010']
        }
      },
      run: runOptions,
    };
  }

  private getClientOptions(): LanguageClientOptions {
    const telemetryArgs: ITelemetryArgs = {
      enableTelemetry: ConfigManager.telemetry,
      extraInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    };
    let selector = [];
    if (ConfigManager.completionLanguages){
      selector = selector.concat(ConfigManager.completionLanguages);
    }

    if (ConfigManager.formatLanguages) {
      selector = selector.concat(ConfigManager.formatLanguages);
    }

    selector = selector.reduce((agg, language) => {
        if (typeof language === 'string') {
          agg.push({ language, scheme: 'untitled' });
          agg.push({ language, scheme: 'file' });
          agg.push({ language, scheme: 'sqltools' });
        } else {
          agg.push(language);
        }
        return agg;
      }, [{ scheme: EXT_NAME.toLowerCase(), language: undefined }]);

    return {
      documentSelector: selector,
      initializationOptions: {
        telemetry: telemetryArgs,
        extensionPath: this.context.extensionPath,
        userEnvVars: ConfigManager.languageServerEnv
      },
      synchronize: {
        configurationSection: EXT_NAME.toLowerCase(),
        fileEvents: Wspc.createFileSystemWatcher('**/.sqltoolsrc'),
      },
      initializationFailedHandler: error => {
        telemetry.registerException(error, {
          message: 'Server initialization failed.',
        });
        this.client.error('Server initialization failed.', error);
        this.client.outputChannel.show(true);
        return false;
      },
      errorHandler: {
        error: (error, message, count): ErrorAction => {
          telemetry.registerException(error, {
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
      ErrorHandler.create(message)((errMessage || err.message || err).toString());
    };
    this.client.onNotification(
      'serverError', // @TODO: constant
      onError,
    );
    telemetry.registerMessage('info', 'LanguageClient ready');
    log.extend('info')('LanguageClient ready');
  }
}
