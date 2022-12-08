import { default as logger, createLogger } from '@sqltools/log/src';
import path from 'path';
import fs from 'fs';
import Config from '@sqltools/util/config-manager';
import { DISPLAY_NAME, EXT_NAMESPACE, EXT_CONFIG_NAMESPACE } from '@sqltools/util/constants';
import { sync as commandExists } from 'command-exists';
import { workspace as Wspc, window, commands, ConfigurationTarget } from 'vscode';
import { CloseAction, ErrorAction, ErrorHandler as LanguageClientErrorHandler, LanguageClient, LanguageClientOptions, NodeModule, ServerOptions, TransportKind } from 'vscode-languageclient';
import ErrorHandler from '../api/error-handler';
import { ILanguageClient } from '@sqltools/types';
import Context from '@sqltools/vscode/context';
import uniq from 'lodash/uniq';
import { ElectronNotSupportedNotification } from '@sqltools/base-driver/dist/lib/notification';
import { ExitCalledNotification, ServerErrorNotification } from '@sqltools/language-server/src/notifications';
import detectNodePath from "./detect-node-path";

const log = createLogger('lc');

export class SQLToolsLanguageClient implements ILanguageClient {
  public client: LanguageClient;
  public clientErrorHandler: LanguageClientErrorHandler;

  private avoidRestart = false;
  constructor() {
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

  public async init() {
    const serverOptions = await this.getServerOptions();
    this.client = new LanguageClient(
      EXT_CONFIG_NAMESPACE,
      `${DISPLAY_NAME} Language Server`,
      serverOptions,
      this.getClientOptions(),
    );
    const defaultErrorHandler = this.client.createDefaultErrorHandler();

    this.clientErrorHandler = {
      error: defaultErrorHandler.error,
      closed: (): CloseAction => {
        if (this.avoidRestart) {
          return CloseAction.DoNotRestart;
        }
        return defaultErrorHandler.closed();
      },
    };

    this.onNotification(ExitCalledNotification, () => {
      this.avoidRestart = true;
    });

    this.registerBaseNotifications();
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

  private async getServerOptions(): Promise<ServerOptions> {
    const serverModule = Context.asAbsolutePath('dist/languageserver.js');
    let runtime: string = undefined;
    const useNodeRuntime = Config.useNodeRuntime;

    if (useNodeRuntime) {
      if (typeof useNodeRuntime === 'string') {
        const runtimePath = path.normalize(useNodeRuntime);
        if (fs.existsSync(runtimePath)) {
          runtime = runtimePath;
        }
      } else {
        log.info('Detecting node path (if this stalls check Terminal view for the stuck session and kill it)...');
        const nodePath = await detectNodePath();
        if (nodePath) {
          const message = `Node runtime auto-detected. Using ${nodePath}.`;
          if (!Config.disableNodeDetectNotifications) {
            window.showInformationMessage(message);
          }
          log.info(message)
          runtime = nodePath
        } else {
          if (commandExists('node')) {
            runtime = 'node';
          }
        }
      }
      if (!runtime) {
        const message = 'Node runtime not found. Using default as a fallback.';
        if (!Config.disableNodeDetectNotifications) {
          window.showInformationMessage(message);
        }
        log.info(message)
      }
    }
    const lsCustomEnv = (Config.languageServerEnv || {});
    const runOptions: NodeModule = {
      module: serverModule,
      transport: TransportKind.ipc,
      runtime,
      options: {
        env: {
          ...lsCustomEnv,
          IS_NODE_RUNTIME: useNodeRuntime ? 1 : 0,
        },
      },
    };
    const debugOptions = runOptions;

    if (lsCustomEnv.SQLTOOLS_DEBUG_PORT_LS || process.env.SQLTOOLS_DEBUG_PORT_LS) {
      debugOptions.options = {
        ...runOptions.options,
        execArgv: ['--nolazy', `--inspect=${lsCustomEnv.SQLTOOLS_DEBUG_PORT_LS || process.env.SQLTOOLS_DEBUG_PORT_LS || 6011}`]
      }
    }

    return {
      debug: debugOptions,
      run: runOptions,
    };
  }

  private getClientOptions(): LanguageClientOptions {
    let selector = [];
    if (Config.completionLanguages) {
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

    log.info('Registering client for languages %O', selector);
    return {
      documentSelector: selector,
      initializationOptions: {
        extensionPath: Context.extensionPath,
        userEnvVars: Config.languageServerEnv
      },
      progressOnInitialization: true,
      outputChannel: logger.outputChannel as any,
      synchronize: {
        configurationSection: [EXT_CONFIG_NAMESPACE],
        fileEvents: Wspc.createFileSystemWatcher(`**/.${EXT_NAMESPACE}rc`),
      },
      initializationFailedHandler: error => {
        this.client.error('Server initialization failed.', error);
        this.client.outputChannel.show(true);
        return false;
      },
      errorHandler: {
        error: (error, message, count): ErrorAction => {
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

    log.info('LanguageClient ready');
  }

  private electronNotSupported = async () => {
    const r = await window.showInformationMessage(
      `VS Code engine is not supported. You should enable \'${EXT_CONFIG_NAMESPACE}.useNodeRuntime\' and have NodeJS installed to continue.`,
      'Enable now',
    );
    if (!r) return;
    await Wspc.getConfiguration(EXT_CONFIG_NAMESPACE).update('useNodeRuntime', true, ConfigurationTarget.Global);
    try { await Wspc.getConfiguration(EXT_CONFIG_NAMESPACE).update('useNodeRuntime', true, ConfigurationTarget.Workspace) } catch (e) { }
    try { await Wspc.getConfiguration(EXT_CONFIG_NAMESPACE).update('useNodeRuntime', true, ConfigurationTarget.WorkspaceFolder) } catch (e) { }
    const res = await window.showInformationMessage(
      `\'${EXT_NAMESPACE}.useNodeRuntime\' enabled. You must reload VS Code to take effect.`, 'Reload now');
    if (!res) return;
    commands.executeCommand('workbench.action.reloadWindow');
  }
}
