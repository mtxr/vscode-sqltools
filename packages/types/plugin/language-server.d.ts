import { IConnection, TextDocuments } from 'vscode-languageserver';
import { Arg0 } from '@sqltools/types/generic/utils';

export declare interface ILanguageServer<S = any> {
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
  docManager: TextDocuments;
}

export declare interface ILanguageServerPlugin<T = ILanguageServer<any>> {
  register: (server: T) => void;
}