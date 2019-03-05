import ConfigManager from '@sqltools/core/config-manager';
import { Arg0, LanguageServerPlugin, SQLToolsLanguageServerInterface } from '@sqltools/core/interface/plugin';
import { Telemetry } from '@sqltools/core/utils';
import Logger from '@sqltools/core/utils/logger';
import { CancellationToken, createConnection, IConnection, InitializedParams, InitializeParams, InitializeResult, ProposedFeatures, TextDocuments } from 'vscode-languageserver';
import store from './store';

class SQLToolsLanguageServer implements SQLToolsLanguageServerInterface {
  private _logger = new Telemetry({
    enableTelemetry: false,
    product: 'language-server',
    useLogger: new Logger(),
  });
  private _server: IConnection;
  private _docManager = new TextDocuments();
  private onInitializeHooks: Arg0<IConnection['onInitialize']>[] = [];
  private onInitializedHooks: Arg0<IConnection['onInitialized']>[] = [];
  private onDidChangeConfigurationHooks: Function[] = [];

  constructor() {
    this._server = createConnection(ProposedFeatures.all);
    this._server.onInitialized(this.onInitialized);
    this._server.onInitialize(this.onInitialize);
    this._server.onDidChangeConfiguration(this.onDidChangeConfiguration);
    this._docManager.listen(this._server);
  }

  private onInitialized: Arg0<IConnection['onInitialized']> = (params: InitializedParams) => {
    this._logger.registerInfoMessage(`Initialized with node version:${process.version}`);

    this.onInitializedHooks.forEach(hook => hook(params));
  };

  private onInitialize: Arg0<IConnection['onInitialize']> = (params: InitializeParams, token: CancellationToken) => {
    if (params.initializationOptions.telemetry) {
      this._logger.updateOpts({
        product: 'language-server',
        ...params.initializationOptions.telemetry,
      });
    }

    return this.onInitializeHooks.reduce<InitializeResult>(
      (opts, hook) => {
        const result = hook(params, token) as InitializeResult;
        return { ...result, capabilities: { ...opts.capabilities, ...result.capabilities } };
      },
      {
        capabilities: {
          documentFormattingProvider: false,
          documentRangeFormattingProvider: false,
          textDocumentSync: this.docManager.syncKind,
        },
      }
    );
  };

  private onDidChangeConfiguration: Arg0<IConnection['onDidChangeConfiguration']> = changes => {
    ConfigManager.update(changes.settings.sqltools);
    if (ConfigManager.telemetry && !Telemetry.enabled) this.logger.enable();
    else if (Telemetry.enabled) this.logger.disable();

    this.onDidChangeConfigurationHooks.forEach(hook => hook());
  };
  public get onDocumentFormatting() {
    return this._server.onDocumentFormatting;
  }
  public get onDocumentRangeFormatting() {
    return this._server.onDocumentRangeFormatting;
  }

  public listen() {
    this._server.listen();
    return this;
  }

  public registerPlugin(plugin: LanguageServerPlugin<SQLToolsLanguageServer>) {
    plugin.register(this);
    return this;
  }

  public get sendNotification(): IConnection['sendNotification'] {
    return this._server.sendNotification;
  }
  public get onNotification(): IConnection['onNotification'] {
    return this._server.onNotification;
  }

  public get onRequest(): IConnection['onRequest'] {
    return this._server.onRequest;
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

  public get client() {
    return this._server.client;
  }

  public get docManager() {
    return this._docManager;
  }

  public get log() {
    return this._logger.log;
  }

  public get logger() {
    return this._logger;
  }

  public notifyError(message: string, error?: any): any {
    const cb = (err: any = '') => {
      this.logger.registerException(err, { message, languageServer: true });
      this._server.sendNotification('serverError', { err, message, errMessage: (err.message || err).toString() }); // @TODO: constant
    };
    if (typeof error !== 'undefined') return cb(error);
    return cb;
  }

  public get store() {
    return store;
  }
}

export default SQLToolsLanguageServer;
