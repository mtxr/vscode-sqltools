import { ErrorHandler as LanguageClientErrorHandler, LanguageClient } from 'vscode-languageclient';
import { IConnection, TextDocuments } from 'vscode-languageserver';
import { RequestType, RequestType0 } from 'vscode-languageserver-protocol';
import { ExtensionContext } from 'vscode';
import { Store } from 'redux';
import { Contracts } from 'applicationinsights';
export declare type ArgsType<T> = T extends (...args: infer U) => any ? U : never;
export declare type Arg0<T> = ArgsType<T>[0];
export declare type RequestHandler<T> = T extends RequestType<infer P, infer R, any, any>
  ? (params: P) => R | Promise<R>
  : (T extends RequestType0<infer R, any, any> ? () => R | Promise<R> : never);
export declare namespace SQLTools {
  interface Timer {
    elapsed(): number;
    start(): void;
    end(): void;
  }
  type Product = 'core' | 'ext' | 'ls' | 'lc' | 'ui';
  interface VSCodeInfo {
    uniqId?: string;
    sessId?: string;
    version?: string;
  }
  interface TelemetryArgs {
    enableTelemetry?: boolean;
    vscodeInfo?: VSCodeInfo;
  }

  interface LanguageServerPlugin<T = LanguageServerInterface> {
    register: (server: T) => void;
  }
  interface ExtensionPlugin<T = ExtensionInterface> {
    register: (extension: T) => void;
  }
  type CommandEvent = {
    command: string;
    args: any[];
  };
  type CommandSuccessEvent<T = any> = {
    command: string;
    args: any[];
    result: T;
  };
  type CommandEventHandler<T> = (evt: T) => void;
  interface ExtensionInterface {
    client: LanguageClientInterface;
    context: ExtensionContext;
    activate(): void;
    deactivate(): void;
    registerPlugin(plugin: ExtensionPlugin): this;
    addBeforeCommandHook(command: string, handler: CommandEventHandler<CommandEvent>): this;
    addAfterCommandSuccessHook(command: string, handler: CommandEventHandler<CommandSuccessEvent>): this;
    registerCommand(command: string, handler: Function): this;
    registerTextEditorCommand(command: string, handler: Function): this;
    errorHandler(message: string, error: any): any;
  }
  interface LanguageServerInterface<S = Store> {
    listen(): void;
    registerPlugin(plugin: LanguageServerPlugin): this;
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
    store: S;
  }
  interface LanguageClientInterface {
    client: LanguageClient;
    clientErrorHandler: LanguageClientErrorHandler;
    start: LanguageClient['start'];
    sendRequest: LanguageClient['sendRequest'];
    onRequest: LanguageClient['onRequest'];
    sendNotification: LanguageClient['sendNotification'];
    onNotification: LanguageClient['onNotification'];
  }
}

export namespace DatabaseInterface {
  export interface Database {
    name: string;
  }

  export interface Table {
    tableSchema?: string;
    tableCatalog?: string;
    tableDatabase?: string;
    name: string;
    isView: boolean;
    numberOfColumns?: number;
    /**
     * This is used to build the connections explorer tree
     *
     * @type {string}
     * @memberof TableColumn
     */
     tree?: string;
  }
  export interface TableColumn {
    tableName: string;
    columnName: string;
    type: string;
    size?: number;
    tableSchema?: string;
    tableDatabase?: string;
    tableCatalog?: string;
    defaultValue?: string;
    isNullable: boolean;
    isPartitionKey?: boolean;
    isPk?: boolean;
    isFk?: boolean;
    columnKey?: string;
    extra?: string;
    /**
     * This is used to build the connections explorer tree
     *
     * @type {string}
     * @memberof TableColumn
     */
    tree?: string;
  }

  export interface Function {
    name: string;
    schema: string;
    database: string;
    signature: string;
    args: string[];
    resultType: string;
    /**
     * This is used to build the connections explorer tree
     *
     * @type {string}
     * @memberof TableColumn
     */
    tree?: string;
    source?: string;
  }

  export type Procedure = Function;
  export interface QueryResults<T extends { [key: string]: any } = any> {
    label?: string;
    connId: string;
    error?: boolean;
    results: (T extends { [key: string]: any } ? T : any)[];
    cols: string[];
    query: string;
    messages: string[];
    page?: number;
    total?: number;
    pageSize?: number;
  }
}

export default SQLTools;
