import { IConnection, TextDocuments } from 'vscode-languageserver';
import { Arg0 } from '../generic/utils';

export interface ILanguageServer {
  listen(): void;
  registerPlugin(plugin: ILanguageServerPlugin): this;
  sendNotification: IConnection['sendNotification'];
  onRequest: IConnection['onRequest'];
  onNotification: IConnection['onNotification'];
  onCompletion: IConnection['onCompletion'];
  onCompletionResolve: IConnection['onCompletionResolve'];
  onDocumentFormatting: IConnection['onDocumentFormatting'];
  onDocumentRangeFormatting: IConnection['onDocumentRangeFormatting'];
  sendRequest: IConnection['sendRequest'];
  addOnDidChangeConfigurationHooks(hook: () => void): this;
  addOnInitializeHook(hook: Arg0<IConnection['onInitialize']>): this;
  addOnInitializedHook(hook: Arg0<IConnection['onInitialized']>): this;
  notifyError(message: string, error?: any): any;
  client: IConnection['client'];
  server: IConnection;
  docManager: TextDocuments<any>;
}

export interface ILanguageServerPlugin<T = ILanguageServer> {
  register: (server: T) => void;
}