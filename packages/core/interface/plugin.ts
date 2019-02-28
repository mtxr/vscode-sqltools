import { IConnection } from 'vscode-languageserver';
import { LanguageClient, ErrorHandler as LanguageClientErrorHandler, } from 'vscode-languageclient';
import { LoggerInterface } from './logger';
import { Telemetry } from '../utils';
export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export type Arg0<T> = ArgsType<T>[0];

export interface LanguageServerPlugin<T = SQLToolsLanguageServerInterface> {
  register: (server: T) => void;
}

export interface LanguageClientPlugin<T = SQLToolsLanguageClientInterface> {
  register: (client: T) => void;
}

export interface SQLToolsLanguageServerInterface {
  listen(): void;
  registerPlugin(plugin: LanguageServerPlugin): this;
  sendNotification: IConnection['sendNotification'];
  onNotification: IConnection['onNotification'];
  onRequest: IConnection['onRequest'];
  sendRequest: IConnection['sendRequest'];
  addOnInitializeHook(hook: Arg0<IConnection['onInitialize']>): SQLToolsLanguageServerInterface;
  addOnInitializedHook(hook: Arg0<IConnection['onInitialized']>): SQLToolsLanguageServerInterface;
  log: LoggerInterface;
  logger: Telemetry;
}

export interface SQLToolsLanguageClientInterface {
  client: LanguageClient;
  clientErrorHandler: LanguageClientErrorHandler;
  start: LanguageClient['start'];
  sendRequest: LanguageClient['sendRequest'];
  onRequest: LanguageClient['onRequest'];
  sendNotification: LanguageClient['sendNotification'];
  onNotification: LanguageClient['onNotification'];
  registerPlugin(plugin: LanguageClientPlugin): this;
  log: LoggerInterface;
  logger: Telemetry;
}