import logger from '@sqltools/util/log';
import path from 'path';
import fs from 'fs';
import Config from '@sqltools/util/config-manager';
import { DISPLAY_NAME, EXT_NAMESPACE, EXT_CONFIG_NAMESPACE, ServerErrorNotification } from '@sqltools/util/constants';
import commandExists from '@sqltools/util/dependencies/command-exists';
import { env as VSCodeEnv, version as VSCodeVersion, workspace as Wspc, window, commands, ConfigurationTarget, workspace } from 'vscode';
import { CloseAction, ErrorAction, ErrorHandler as LanguageClientErrorHandler, LanguageClient, LanguageClientOptions, NodeModule, ServerOptions, TransportKind } from 'vscode-languageclient';
import ErrorHandler from '../api/error-handler';
import telemetry from '@sqltools/util/telemetry';
import { ILanguageClient, ITelemetryArgs } from '@sqltools/types';
import Context from '@sqltools/vscode/context';
import uniq from 'lodash/uniq';
import { ElectronNotSupportedNotification } from '@sqltools/base-driver/dist/lib/notification';

const log = logger.extend('lc');

export class SQLToolsLanguageClient implements ILanguageClient {
  public client: LanguageClient;
  public clientErrorHandler: LanguageClientErrorHandler;

  constructor() {
    this.client = new LanguageClient(
      EXT_CONFIG_NAMESPACE,
      `${DISPLAY_NAME} Language Server`,
      this.getServerOptions(),
      this.getClientOptions(),
      );
    this.clientErrorHandler = this.client.createDefaultErrorHandler();

    this.registerBaseNotifications();

    Config.addOnUpdateHook(async ({ event }) => {
      if (event.affectsConfig('useNodeRuntime')) {
        const res = await window.showWarningMessage('Use node runtime setting change. You must reload window to take effect.', 'Reload now');
        if (!res) return;
        commands.executeCommand('workbench.action.reloadWindow');
      }

      if (event.affectsConfig('languageServerEnv')) {
        const res = await window.showWarningMessage('New language server environment variables set. You must reload window to take effect.', 'Reload now');
        if (!res) return;
        commands.executeCommand('workbench.action.reloadWindow');
      }
    });
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
    const serverModule = Context.asAbsolutePath('languageserver.js');
    let runtime: string = undefined;
    const useNodeRuntime = Config.useNodeRuntime;
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
          ...(Config.languageServerEnv || {}),
          IS_NODE_RUNTIME: useNodeRuntime ? 1 : 0,
        },
      }
    };
    const debugOptions = runOptions;

    if (process.env.NODE_ENV !== 'production') {
      debugOptions.options = {
        ...runOptions.options,
        execArgv: ['--nolazy', '--inspect=6010']
      }
    }

    return {
      debug: debugOptions,
      run: runOptions,
    };
  }

  private getClientOptions(): LanguageClientOptions {
    const telemetryArgs: ITelemetryArgs = {
      enableTelemetry: workspace.getConfiguration().get('telemetry.enableTelemetry') || false,
      extraInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    };
    let selector = [];
    if (Config.completionLanguages){
      selector = selector.concat(Config.completionLanguages);
    }

    if (Config.formatLanguages) {
      selector = selector.concat(Config.formatLanguages);
    }
    selector = uniq(selector);
    selector = selector.reduce((agg, language) => {
      if (typeof language === 'string') {
        agg.push({ language, scheme: 'untitled' });
        agg.push({ language, scheme: 'file' });
        agg.push({ language, scheme: EXT_NAMESPACE });
      } else {
        agg.push(language);
      }
      return agg;
    }, [{ scheme: EXT_NAMESPACE, language: undefined }]);

    log.extend('debug')('registered for languages %O', selector);
    return {
      documentSelector: selector,
      initializationOptions: {
        telemetry: telemetryArgs,
        extensionPath: Context.extensionPath,
        userEnvVars: Config.languageServerEnv
      },
      synchronize: {
        configurationSection: [EXT_CONFIG_NAMESPACE, 'telemetry'],
        fileEvents: Wspc.createFileSystemWatcher(`**/.${EXT_NAMESPACE}rc`),
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
    this.client.onNotification(ServerErrorNotification, onError);
    this.client.onNotification(ElectronNotSupportedNotification, this.electronNotSupported);

    telemetry.registerMessage('info', 'LanguageClient ready');
    log.extend('info')('LanguageClient ready');
  }

  private electronNotSupported = async () => {
    const r = await window.showInformationMessage(
      `VSCode engine is not supported. You should enable \'${EXT_CONFIG_NAMESPACE}.useNodeRuntime\' and have NodeJS installed to continue.`,
      'Enable now',
    );
    if (!r) return;
    await Wspc.getConfiguration(EXT_CONFIG_NAMESPACE).update('useNodeRuntime', true, ConfigurationTarget.Global);
    try { await Wspc.getConfiguration(EXT_CONFIG_NAMESPACE).update('useNodeRuntime', true, ConfigurationTarget.Workspace) } catch(e) {}
    try { await Wspc.getConfiguration(EXT_CONFIG_NAMESPACE).update('useNodeRuntime', true, ConfigurationTarget.WorkspaceFolder) } catch(e) {}
    const res = await window.showInformationMessage(
      `\'${EXT_NAMESPACE}.useNodeRuntime\' enabled. You must reload VSCode to take effect.`, 'Reload now');
    if (!res) return;
    commands.executeCommand('workbench.action.reloadWindow');
  }
}
