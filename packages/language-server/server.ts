import ConfigManager from '@sqltools/core/config-manager';
import SQLTools, { Arg0 } from '@sqltools/core/plugin-api';
import { Telemetry } from '@sqltools/core/utils';
import { CancellationToken, createConnection, IConnection, InitializedParams, InitializeParams, InitializeResult, ProposedFeatures, TextDocuments } from 'vscode-languageserver';
import store from './store';
import { InvalidActionException } from '@sqltools/core/exception';

class SQLToolsLanguageServer implements SQLTools.LanguageServerInterface {
  private _telemetry = new Telemetry({
    enableTelemetry: false,
    product: 'language-server',
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
    this.telemetry.registerInfoMessage(`Initialized with node version:${process.version}`);

    this.onInitializedHooks.forEach(hook => hook(params));
  };

  private onInitialize: Arg0<IConnection['onInitialize']> = (params: InitializeParams, token: CancellationToken) => {
    if (params.initializationOptions.telemetry) {
      this.telemetry.updateOpts({
        product: 'language-server',
        ...params.initializationOptions.telemetry,
      });
    }
    if (params.initializationOptions.userEnvVars && Object.keys(params.initializationOptions.userEnvVars || {}).length > 0) {
      console.log(
        `
===============================
User defined env vars:
${JSON.stringify(params.initializationOptions.userEnvVars, null, 2)}
===============================
`);
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
    if (ConfigManager.telemetry) this.telemetry.enable();
    else this.telemetry.disable();

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
    console.log(
`
===============================
SQLTools Server started!
Using node runtime?: ${parseInt(process.env['IS_NODE_RUNTIME'] || '0') === 1}
ExecPath: ${process.execPath}
===============================
`)
    this._server.listen();
    return this;
  }

  public registerPlugin(plugin: SQLTools.LanguageServerPlugin) {
    plugin.register(this);
    return this;
  }

  public get sendNotification(): IConnection['sendNotification'] {
    return this._server.sendNotification;
  }
  public get onNotification(): IConnection['onNotification'] {
    return this._server.onNotification;
  }
  public onRequest: IConnection['onRequest'] = (req, handler?: any) => {
    if (!handler) throw new InvalidActionException('Disabled registration for * handlers');
    return this._server.onRequest(req, async (...args) => {
      console.log(`Request ${req._method || req.toString()} received`);
      let result = handler(...args);
      if (typeof result !== 'undefined' && (typeof result.then === 'function' || typeof result.catch === 'function')) {
        result = await result;
      }
      return result;
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

  public get telemetry() {
    return this._telemetry;
  }

  public notifyError(message: string, error?: any): any {
    const cb = (err: any = '') => {
      this.telemetry.registerException(err, { message, languageServer: true });
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
