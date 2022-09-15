import ConfigRO from '@sqltools/util/config-manager';
import { createConnection, IConnection, InitializedParams, InitializeResult, ProposedFeatures, TextDocuments, TextDocumentSyncKind } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { InvalidActionError } from '@sqltools/util/exception';
import { ILanguageServer, ILanguageServerPlugin, Arg0, RequestHandler, LSContextMap } from '@sqltools/types';
import { DISPLAY_NAME, EXT_CONFIG_NAMESPACE } from '@sqltools/util/constants';
import { RegisterPlugin } from './contracts';
import LSContext from './context';
import { ExitCalledNotification, ServerErrorNotification } from './notifications';
import { resolve as pathResolve } from 'path';
import { spawnSync } from 'child_process';
import { createLogger } from '@sqltools/log/src';

const log = createLogger();

class SQLToolsLanguageServer implements ILanguageServer {
  private _server: IConnection;
  private _docManager = new TextDocuments(TextDocument);
  private onInitializeHooks: Arg0<IConnection['onInitialize']>[] = [];
  private onInitializedHooks: Arg0<IConnection['onInitialized']>[] = [];
  private onDidChangeConfigurationHooks: Function[] = [];

  constructor() {
    this._server = createConnection(ProposedFeatures.all);
    this._server.onInitialized(this.onInitialized);
    this._server.onInitialize(this.onInitialize);
    this._server.onDidChangeConfiguration(this.onDidChangeConfiguration);
    this._docManager.listen(this._server);
    this.setAutoStart();
    this.onRequest(RegisterPlugin, this.onRegisterPlugin);
  }

  private setAutoStart() {
    const nodeExit = process.exit;
    process.exit = ((code?: number) => {
      const stack = new Error('stack');
      this.sendNotification(ExitCalledNotification, [code ? code : 0, stack.stack]);
      setTimeout(() => nodeExit(code), 500);
    }) as typeof process.exit;
    process.on('uncaughtException', (error: any) => {
      let message: string;
      if (error) {
        if (typeof error.stack === 'string') {
          message = error.stack;
        } else if (typeof error.message === 'string') {
          message = error.message;
        } else if (typeof error === 'string') {
          message = error;
        } else {
          message = (error || '').toString()
        }
      }
      if (message) {
        log.error(message);
      }
    });
  }

  private onRegisterPlugin: RequestHandler<typeof RegisterPlugin> = async ({ path: pluginPath } = { path: '' }) => {
    log.info('request to register plugin: "%s"', pluginPath);
    try {
      let plugin = (__non_webpack_require__ || require)(pathResolve(pluginPath));
      plugin = plugin.default || plugin;
      await this.registerPlugin(plugin);
      log.debug('plugin %s loaded', pluginPath);
    } catch (error) {
      log.error({ error }, 'Error registering plugin: %O', error);
      return Promise.reject(error);
    }
  }

  public getContext = (): LSContextMap => {
    return LSContext;
  }

  private onInitialized: Arg0<IConnection['onInitialized']> = (params: InitializedParams) => {
    log.info(`Initialized with node version:${process.version}`);

    this.onInitializedHooks.forEach(hook => hook(params));
  };

  private onInitialize: Arg0<IConnection['onInitialize']> = (params, token, workDoneProgress, resultProgress) => {
    if (params.initializationOptions.userEnvVars && Object.keys(params.initializationOptions.userEnvVars || {}).length > 0) {
      log.info(`User defined env vars\n===============================\n%O\n===============================:`, params.initializationOptions.userEnvVars);
    }

    return this.onInitializeHooks.reduce<InitializeResult>(
      (opts, hook) => {
        const result = hook(params, token, workDoneProgress, resultProgress) as InitializeResult;
        return { ...result, capabilities: { ...opts.capabilities, ...result.capabilities } };
      },
      {
        capabilities: {
          documentFormattingProvider: true,
          documentRangeFormattingProvider: true,
          textDocumentSync: TextDocumentSyncKind.Incremental,
          workspace: {
            workspaceFolders: {
              supported: true,
              changeNotifications: true
            },
          }
        },
      }
    );
  };

  private onDidChangeConfiguration: Arg0<IConnection['onDidChangeConfiguration']> = changes => {
    ConfigRO.replaceAll(changes.settings[EXT_CONFIG_NAMESPACE]);

    this.onDidChangeConfigurationHooks.forEach(hook => hook());
  };
  public get onDocumentFormatting() {
    return this._server.onDocumentFormatting;
  }
  public get onDocumentRangeFormatting() {
    return this._server.onDocumentRangeFormatting;
  }

  public get onCompletion() {
    return this._server.onCompletion;
  }

  public get onCompletionResolve() {
    return this._server.onCompletionResolve;
  }

  public listen() {
    const isNode = parseInt(process.env.IS_NODE_RUNTIME || '0') === 1;
    let version = '';
    try {
      if (isNode) {
        const { output } = spawnSync(process.execPath, ['-v']);
        version = output.join('');
      }
    } catch (error) { }
    log.info([
      `${DISPLAY_NAME} Server started!`,
      '===============================',
      `Using node runtime?: ${isNode ? 'yes' : 'no'}`,
      `ExecPath: ${process.execPath} ${version.replace(/[\r\n]/g, '').trim()}`,
      '==============================='
    ].filter(Boolean).join('\n'));
    this._server.listen();
    return this;
  }

  public async registerPlugin(plugin: ILanguageServerPlugin | ILanguageServerPlugin[]) {
    await Promise.all(
      (Array.isArray(plugin) ? plugin : [plugin].filter(Boolean))
        .map(p => p.register(this))
    );
  }

  public get sendNotification(): IConnection['sendNotification'] {
    return this._server.sendNotification;
  }
  public get onNotification(): IConnection['onNotification'] {
    return this._server.onNotification;
  }
  public onRequest: IConnection['onRequest'] = (req, handler?: any) => {
    if (!handler) throw new InvalidActionError('Disabled registration for * handlers');
    return this._server.onRequest(req, async (...args) => {
      process.env.NODE_ENV === 'development' && log.info('REQUEST RECEIVED => %s %o', req._method || req.toString(), args);
      process.env.NODE_ENV !== 'development' && log.info('REQUEST RECEIVED => %s', req._method || req.toString());
      return Promise.resolve(handler(...args));
    });
  }

  public get sendRequest(): IConnection['sendRequest'] {
    return this._server.sendRequest;
  }

  public addOnDidChangeConfigurationHooks(hook: Arg0<IConnection['onDidChangeConfiguration']>) {
    this.onDidChangeConfigurationHooks.push(hook);
    return this;
  }

  public addOnInitializeHook(hook: Arg0<IConnection['onInitialize']>) {
    this.onInitializeHooks.push(hook);
    return this;
  }

  public addOnInitializedHook(hook: Arg0<IConnection['onInitialized']>) {
    this.onInitializedHooks.push(hook);
    return this;
  }

  public get server() {
    return this._server;
  }
  public get client() {
    return this._server.client;
  }

  public get docManager() {
    return this._docManager;
  }

  public notifyError(message: string, error?: any): any {
    const cb = (err: any = '') => {
      log.error(err, { message, languageServer: true });
      this._server.sendNotification(ServerErrorNotification, { err, message, errMessage: (err.message || err).toString() });
    };
    if (typeof error !== 'undefined') return cb(error);
    return cb;
  }
}

export default SQLToolsLanguageServer;
