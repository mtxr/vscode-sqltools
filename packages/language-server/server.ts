import {
  createConnection,
  IConnection,
  InitializeParams,
  ProposedFeatures,
  InitializedParams,
  InitializeResult,
  CancellationToken,
} from 'vscode-languageserver';

import Logger from '@sqltools/core/utils/logger';
import { Telemetry } from '@sqltools/core/utils';
import { LanguageServerPlugin, Arg0, SQLToolsLanguageServerInterface } from '@sqltools/core/interface/plugin';

class SQLToolsLanguageServer implements SQLToolsLanguageServerInterface {
  private _logger = new Telemetry({
    enableTelemetry: false,
    product: 'language-server',
    useLogger: Logger,
  });
  private server: IConnection;
  private onInitializeHooks: Arg0<IConnection['onInitialize']>[] = [];
  private onInitializedHooks: Arg0<IConnection['onInitialized']>[] = [];

  constructor() {
    this.server = createConnection(ProposedFeatures.all);
    this.server.onInitialized(this.onInitialized);
    this.server.onInitialize(this.onInitialize);
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

    return this.onInitializeHooks
      .reduce<InitializeResult>(
        (opts, hook) => {
          const result = hook(params, token) as InitializeResult;
          return { ...result, capabilities: { ...opts.capabilities, ...result.capabilities } };
        },
        { capabilities: {} }
      );
  };

  public listen() {
    this.server.listen();
    return this;
  }

  public registerPlugin(plugin: LanguageServerPlugin<SQLToolsLanguageServer>) {
    plugin.register(this);
    return this;
  }

  public get sendNotification(): IConnection['sendNotification'] {
    return this.sendNotification;
  }
  public get onNotification(): IConnection['onNotification'] {
    return this.onNotification;
  }

  public get onRequest(): IConnection['onRequest'] {
    return this.onRequest;
  }

  public get sendRequest(): IConnection['sendRequest'] {
    return this.sendRequest;
  }

  public addOnInitializeHook(hook: Arg0<IConnection['onInitialize']>) {
    this.onInitializeHooks.push(hook);
    return this;
  }

  public addOnInitializedHook(hook: Arg0<IConnection['onInitialized']>) {
    this.onInitializedHooks.push(hook);
    return this;
  }

  public get log() {
    return this._logger.log;
  }

  public get logger() {
    return this._logger;
  }
}

export default SQLToolsLanguageServer;
