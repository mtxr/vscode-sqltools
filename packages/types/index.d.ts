import { ErrorHandler as LanguageClientErrorHandler, LanguageClient } from 'vscode-languageclient';
import { IConnection as LSIConnection, TextDocuments } from 'vscode-languageserver';
import { RequestType, RequestType0 } from 'vscode-languageserver-protocol';

export declare namespace NodeJS {
  interface ProcessEnv {
    PRODUCT: 'ext' | 'ls' | 'ui';
    NODE_ENV: 'development' | 'production';
    IS_NODE_RUNTIME: string;
    EXT_NAMESPACE: string;
    AUTHOR: string;
    DEBUG: string;
    DEBUG_HIDE_DATE: string;
    DISPLAY_NAME: string;
    DSN_KEY: string;
    EXT_CONFIG_NAMESPACE: string;
    HOME: string;
    USERPROFILE: string;
    VERSION: string;
  }
}

export type DatabaseDriver = string;

export interface IExpectedResult<T = any> extends String {
  resultsIn?: T;
}


export interface QueryBuilder<P, R> {
  (params?: P & { [k: string]: any }): IExpectedResult<R>;
  raw?: string;
}

export interface IBaseQueries {
  fetchRecords: QueryBuilder<{ limit: number; offset: number; table: NSDatabase.ITable; }, any>;
  countRecords: QueryBuilder<{ table: NSDatabase.ITable; }, { total: number; }>;
  fetchSchemas?: QueryBuilder<NSDatabase.IDatabase, NSDatabase.ISchema>;
  fetchDatabases?: QueryBuilder<never | MConnectionExplorer.IChildItem, NSDatabase.IDatabase>;
  fetchTables: QueryBuilder<NSDatabase.ISchema, NSDatabase.ITable>;
  searchTables: QueryBuilder<{ search: string, limit?: number }, NSDatabase.ITable>;
  searchColumns: QueryBuilder<{ search: string, tables: NSDatabase.ITable[], limit?: number }, NSDatabase.IColumn>;
  // old api
  describeTable: QueryBuilder<NSDatabase.ITable, any>;
  fetchColumns: QueryBuilder<NSDatabase.ITable, NSDatabase.IColumn>;
  fetchFunctions?: QueryBuilder<NSDatabase.ISchema, NSDatabase.IFunction>;
  [id: string]: string | ((params: any) => (string | IExpectedResult));
}

export interface IConnection<DriverOptions = any> {
  /**
   * Connection name
   * @type {string}
   * @memberof IConnection
   */
  name: string;
  /**
   * Connection group name
   * @type {string}
   * @memberof IConnection
   */
  group?: string;
  /**
   * Server address
   * @type {string}
   * @default "127.0.0.1"
   * @memberof IConnection
   */
  server?: string;
  /**
   * Port for connection
   * @type {number}
   * @memberof IConnection
   */
  port?: number;
  /**
   * Path of socket file to connect using UNIX sockets
   * @type {string}
   * @memberof IConnection
   */
  socketPath?: string;
  /**
   * Database name
   * @type {string}
   * @memberof IConnection
   */
  database?: string;
  /**
   * Database username
   * @type {string}
   * @memberof IConnection
   */
  username: string;
  /**
   * Connection password. You can use option askForPassword to prompt password before connect
   * @type {string}
   * @default null
   * @memberof IConnection
   */
  password?: string;
  /**
   * Ask for password instead of set it in your settings
   * @type {boolean}
   * @default false
   * @memberof IConnection
   */
  askForPassword?: boolean;
  /**
   * Connection driver
   * @type {DatabaseDriver}
   * @memberof IConnection
   */
  driver: DatabaseDriver;
  /**
   * Connection timeout in seconds
   * @type {number}
   * @default 30
   * @memberof IConnection
   */
  connectionTimeout?: number;
  /**
   * Connection show records limit
   * @type {number}
   * @default {50}
   * @memberof IConnection
   */
  previewLimit?: number;
  /**
   * Oracle specific driver options. See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#createpoolpoolattrsconnectstring
   * @type {string}
   * @default null
   * @memberof IConnection
   */
  connectString?: string;
  /**
   * MSSQL specific driver options. See https://vscode-sqltools.mteixeira.dev/connections/mssql#1-1-specific-options
   * @type {any}
   * @memberof IConnection
   */
  mssqlOptions?: { encrypt?: boolean };

  /**
   * MySQL specific driver options
   * @type {any}
   * @memberof IConnection
   */
  mysqlOptions?: DriverOptions;

  /**
   * PostgreSQL/Redshift specific driver options. See https://vscode-sqltools.mteixeira.dev/connections/postgresql#1-1-specific-options
   * @type {any}
   * @memberof IConnection
   */
  pgOptions?: DriverOptions;

  /**
   * OracleDB specific driver options (pool). See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#createpoolpoolattrs
   * @type {PoolAttributes}
   * @memberof IConnection
   */
  oracleOptions?: DriverOptions;

  /**
   * Cassandra specific driver options. See https://docs.datastax.com/en/developer/nodejs-driver/4.1/api/type.ClientOptions/
   * @type {CQLClientOptions}
   * @memberof IConnection
   */
  cqlOptions?: DriverOptions;

  /**
   * Connection domain (for MSSQL/Azure only)
   * @type {string}
   * @memberof IConnection
   */
  domain?: string;

  /**
   * Connection generated id. This is not a settings. It's generated in runtime
   * @type {string}
   * @memberof IConnection
   */
  id: string;
  /**
   * Define an icon for this connection. If not specified, use defaults
   *
   * @type {string}
   * @memberof IConnection
   */
  icons?: {
    active?: string;
    connected?: string;
    disconnected?: string;
  };
  /**
   * Connection variables. Use this property with `sqltools.queryParams.enableReplace` to replace the variables without prompting.
   * @type {object}
   * @memberof IConnection
   */
  variables?: {
    [key: string]: string
  }

  // WONT BE INCLUDED IN SETTINGS
  /**
  * Connection flag. This is not a setting. It is determined at runtime
  * @type {boolean}
  * @memberof IConnection
  */
  isConnected: boolean;
  /**
   * Connection flag. This is not a setting. It is determined at runtime
   * @type {boolean}
   * @memberof IConnection
   */
  isActive: boolean;
  /**
  * This is not a setting. It is determined at runtime and indicates whether the `password` property
  * came from the driver's resolveConnection callback (true) or not (false)
  * @type {boolean}
  * @memberof IConnection
  */
  isPasswordResolved?: boolean;

  [id: string]: any;
}

export interface IQueryOptions {
  requestId?: InternalID;
  connId?: string;
  [k: string]: any;
}
export interface IConnectionDriverConstructor {
  new(credentials: IConnection<any>, getWorkspaceFolders?: LSIConnection['workspace']['getWorkspaceFolders']): IConnectionDriver;
}
export interface IConnectionDriver {
  connection: any;
  credentials: IConnection<any>;
  open(): Promise<any>;
  close(): Promise<any>;
  checkDependencies?(): Promise<void>;
  describeTable(table: NSDatabase.ITable, opt?: IQueryOptions): Promise<NSDatabase.IResult[]>;
  showRecords(tableName: NSDatabase.ITable, opt: IQueryOptions & { limit: number, page?: number }): Promise<NSDatabase.IResult[]>;
  query(query: string, opt?: IQueryOptions): Promise<NSDatabase.IResult[]>;
  testConnection?(): Promise<void>;
  getChildrenForItem?(params: { item: NSDatabase.SearchableItem, parent?: NSDatabase.SearchableItem }): Promise<MConnectionExplorer.IChildItem[]>;
  searchItems?(itemType: ContextValue, search: string, extraParams: any): Promise<NSDatabase.SearchableItem[]>;
  getStaticCompletions?(): Promise<{ [w: string]: NSDatabase.IStaticCompletion }>;
  getInsertQuery?(params: { item: NSDatabase.ITable, columns: Array<NSDatabase.IColumn> }): Promise<string>;
}

export declare enum ContextValue {
  CONNECTION = 'connection',
  CONNECTED_CONNECTION = 'connectedConnection',
  COLUMN = 'connection.column',
  FUNCTION = 'connection.function',
  SCHEMA = 'connection.schema',
  RESOURCE_GROUP = 'connection.resource_group',
  DATABASE = 'connection.database',
  TABLE = 'connection.table',
  VIEW = 'connection.view',
  MATERIALIZED_VIEW = 'connection.materializedView',
  NO_CHILD = 'NO_CHILD',
  KEYWORDS = 'KEYWORDS',
}

export module MConnectionExplorer {
  export interface IChildItem {
    type: ContextValue;
    label: string;
    schema: string;
    database: string;
    /**
     * Text that goes in front of the label
     */
    detail?: string;
    /**
     * Icon id from https://microsoft.github.io/vscode-codicons/dist/codicon.html
     */
    iconId?: string;
    /**
     * sqltools icons
     */
    iconName?: string;
    /**
    * for resource_groups
    */
    childType?: ContextValue;
    /**
     * SnippetString used to insert as text
     */
    snippet?: string;
  }
}

export type InternalID = string;

export namespace NSDatabase {
  export interface IDatabase extends MConnectionExplorer.IChildItem {
    type: ContextValue.DATABASE;
  }

  export interface ISchema extends MConnectionExplorer.IChildItem {
    type: ContextValue.SCHEMA;
    iconId: 'group-by-ref-type';
  }

  export interface ITable extends MConnectionExplorer.IChildItem {
    type: ContextValue.TABLE;

    isView: boolean;
  }
  export interface IColumn extends MConnectionExplorer.IChildItem {
    type: ContextValue.COLUMN;
    size?: number;
    defaultValue?: string;
    dataType: string;
    isNullable: boolean;
    isPartitionKey?: boolean;
    isPk?: boolean;
    isFk?: boolean;
    columnKey?: string;
    extra?: { [k: string]: any; };
    table: ITable | string;
  }

  export interface IFunction extends MConnectionExplorer.IChildItem {
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
     * @memberof IColumn
     */
    tree?: string;
    source?: string;
  }

  export interface IProcedure extends IFunction { }

  export interface IStaticCompletion {
    label: string;
    filterText?: string;
    sortText?: string;
    detail: string;
    documentation: { kind: 'markdown', value: string };
  }

  export interface IResult<T extends { [key: string]: any } = any> {
    /**
     * This id is unique for a single query result
     *
     * @type {InternalID}
     * @memberof IResult
     */
    resultId: InternalID;
    /**
     * This id represents a request to run one/multiple queries. It's used to group all queries in the same webview. Every request has it's own view
     *
     * @type {InternalID}
     * @memberof IResult
     */
    requestId: InternalID;
    label?: string;
    connId: string;
    error?: boolean;
    rawError?: Error;
    results: (T extends { [key: string]: any } ? T : any)[];
    cols: string[];
    query: string;
    baseQuery?: string; // used for extension generated queries
    messages: (string | { message: string; date: Date })[];
    page?: number;
    total?: number;
    pageSize?: number;
    queryType?: 'showRecords' | 'describeTable';
    queryParams?: { [k: string]: any };
  }
  export type SearchableItem = IDatabase | ISchema | ITable | IColumn | IFunction | IProcedure | MConnectionExplorer.IChildItem;
}

export interface INotifyErrorData {
  notification: string; dontNotify?: boolean; args?: any
}

export interface ITimer {
  elapsed(): number;
  start(): void;
  end(): void;
}

export type Arg0<T> = ArgsType<T>[0];
export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export type RequestHandler<T> = T extends RequestType<infer P, infer R, any, any>
  ? (params: P) => R | Promise<R>
  : (T extends RequestType0<infer R, any, any> ? () => R | Promise<R> : never);

export type CompletionLanguages = string[];
export type FormatLanguages = string[];
export type CodelensLanguages = string[];

export interface IDependencyManagerSettings {
  /**
   * Package mangaer name or path. Eg. yarn, npm or absolute paths like /usr/bin/npm
   *
   * @type {string}
   * @default npm
   * @memberof IDependencyManagerSettings
   */
  packageManager: string;
  /**
   * Array of args passed when installing. If you use yarn, this shoud be set to `[\"add\"]`
   *
   * @type {string[]}
   * @default ["install"]
   * @memberof IDependencyManagerSettings
   */
  installArgs: string[];
  /**
   * Array of args passed when runnning npm scripts.
   *
   * @type {string[]}
   * @default ["run"]
   * @memberof IDependencyManagerSettings
   */
  runScriptArgs: string[];
  /**
   * Ignore confirmation requests to install or updagre dependencies.
   *
   * @type {boolean}
   * @memberof IDependencyManagerSettings
   */
  autoAccept: boolean;
}

export interface IFormatOptions {
  /**
   * Reserverd word case
   * @type {string}
   * @default null
   * @memberof IFormatOptions
   */
  reservedWordCase?: 'upper' | 'lower' | null;
  /**
   * Language of formating
   * @type {string}
   * @default 'sql'
   * @memberof IFormatOptions
   */
  language?: 'sql' | 'db2' | 'n1ql' | 'pl/sql';
  /**
   * Format line between queries
   * @type {number | 'preserve'}
   * @default 1
   * @memberof IFormatOptions
   */
  linesBetweenQueries?: number | 'preserve';
}

export interface IResultsOptions {
  /**
   * Global show records limit
   * @type {number}
   * @default 50
   * @memberof IResultsOptions
   */
  limit: number;

  /**
   * Defines how results tabs are or are not reused
   * @type {string}
   * @default 'never'
   * @memberof IResultsOptions
   */
  reuseTabs?: 'never' | 'connection';

  /**
   * Defines where the results should show up. Use the defined strings or any number defined in https://code.visualstudio.com/api/references/vscode-api#ViewColumn
   * @type {string}
   * @default 'next'
   * @memberof IResultsOptions
   */
  location?: 'current' | 'next' | 'end' | number;

  /**
   * Customize results screen CSS
   *
   * @type {{ [varible: string]: string }}
   * @memberof IResultsOptions
   */
  customization?: {
    'font-family'?: string;
    'font-size'?: string;
    'table-cell-padding'?: string;
  };
}

export interface ISettings {
  /**
   * Disable new release notifications.
   * @default false
   * @type {boolean}
   * @memberof ISettings
   */
  disableReleaseNotifications?: boolean;
  /**
   * Name of the connection to auto connect on start
   * @type {string | string[]}
   * @default null
   * @memberof ISettings
   */
  autoConnectTo?: string | string[];
  /**
   * Help SQLTools development.
   * @type {boolean}
   * @default true
   * @memberof ISettings
   */
  showStatusbar?: boolean;
  /**
   * Number of queries to keep on History.
   * @type {number}
   * @default 100
   * @memberof ISettings
   */
  historySize?: number;
  /**
   * Languages with SQL completion enabled.
   * @type {CompletionLanguages}
   * @default ["sql"]
   * @memberof ISettings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  completionLanguages?: CompletionLanguages;
  /**
   * Languages with SQL formatting enabled.
   * @type {FormatLanguages}
   * @default ["sql"]
   * @memberof ISettings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  formatLanguages?: FormatLanguages;
  /**
   * Languages with SQL CodeLens enabled.
   * @type {CodelensLanguages}
   * @default ["sql"]
   * @memberof ISettings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  codelensLanguages?: CodelensLanguages;
  /**
   * Languages with SQL CodeLens enabled.
   * @type {boolean}
   * @default true
   * @memberof ISettings
   */
  highlightQuery?: boolean;
  /**
   * Format document/selection options
   * @type {IFormatOptions}
   * @memberof ISettings
   */
  format?: IFormatOptions;

  /**
   * Results view options
   * @type {IResultsOptions}
   * @memberof ISettings
   */
  results?: IResultsOptions;

  /**
   * Connections
   * @type {IConnection[]}
   * @default []
   * @memberof ISettings
   */
  connections?: IConnection[];

  /**
   * Table columns should be expanded on load?
   *
   * @type {boolean}
   * @memberof ISettings
   */
  tableTreeItemsExpanded?: boolean;

  /**
   * Default export results mode
   * @default "prompt"
   * @type {string}
   * @memberof ISettings
   */
  defaultExportType?: 'prompt' | 'csv' | 'json';


  /**
   * Default open results mode
   * @default "prompt"
   * @type {string}
   * @memberof ISettings
   */
  defaultOpenType?: 'prompt' | 'csv' | 'json';

  /**
   * Enable node runtime usage.
   * @default false
   * @type {null | boolean | string}
   * @memberof ISettings
   */
  useNodeRuntime?: null | boolean | string;

    /**
   * Disable node runtime detection notifications.
   * @default false
   * @type {boolean}
   * @memberof ISettings
   */
    disableNodeDetectNotifications?: boolean;

  /**
   * Columns sort order
   * @default 'name'
   * @type {null | string}
   * @memberof ISettings
   */
  sortColumns?: 'name' | 'ordinalnumber' | null;

  /**
   * Flatten groups with has only one child
   * @default false
   * @type {boolean}
   * @memberof ISettings
   */
  flattenGroupsIfOne?: boolean;

  /**
   * Auto open session file when connect
   * @default true
   * @type {boolean}
   * @memberof ISettings
   */
  autoOpenSessionFiles?: boolean;
  /**
   * Folder for session files to be saved in
   * @default ''
   * @type {string}
   * @memberof ISettings
   */
  sessionFilesFolder?: string;
  /**
   * Set environment variables to be passed to language server. Eg: ORACLE_HOME, PATH...
   * @default {}
   * @type {{ [id: string]: string }}
   * @memberof ISettings
   */
  languageServerEnv?: { [id: string]: string };

  /**
   * Enables query parameter checking
   * @default true
   * @type {boolean}
   */
  'queryParams.enableReplace'?: boolean;
  /**
   * RegEx used to identify query parameters
   * @default "\\$[\\d]+|\\$\\[[\\d\\w]+\\]"
   * @type {string}
   */
  'queryParams.regex'?: string;

  /**
   * Dependency manager settings
   *
   * @type {IDependencyManagerSettings}
   * @memberof ISettings
   */
  dependencyManager?: IDependencyManagerSettings;

  /**
   * SQLTools debug settings
   *
   * @type {{ namespaces?: string }}
   * @memberof ISettings
   */
  debug?: { namespaces?: string };

  'connectionExplorer.groupConnected'?: boolean;
}

export interface IConfig extends ISettings {
  get: <K extends KeysOfSettings = KeysOfSettings, V = IConfig[K]>(configKey: K, defaultValue?: V | any) => V;
  update: <K extends KeysOfSettings = KeysOfSettings, V = IConfig[K]>(configKey: KeysOfSettings, value: V) => Promise<void>;
  addOnUpdateHook: (handler: OnUpdateConfigHandler) => void;
  replaceAll: (newSettings: IConfig) => void;
}

export type OnUpdateConfigHandler = (data: { event?: ConfigChangeEvent; settings?: ISettings }) => any;

export type KeysOfSettings = (keyof ISettings);

export interface ConfigChangeEvent {
  affectsConfig(section: KeysOfSettings, resource?: any): boolean;
  /**
   * VS Code config
   *
   * @param {string} section
   * @param {any} [resource]
   * @returns {boolean}
   * @memberof ConfigChangeEvent
   */
  affectsConfiguration(section: string, resource?: any): boolean;
}

export interface NodeDependency {
  type: 'package' | 'npmscript';
  name: string;
  version?: string;
  env?: { [id: string]: string };
  args?: string[], // extra arguments to be passaged to packag managers
}

export interface ICommandEvent {
  command: string;
  args: any[];
}
export interface ICommandSuccessEvent<T = any> {
  command: string;
  args: any[];
  result: T;
}

export type CommandEventHandler<T> = (evt: T) => void;

export interface IExtension {
  client: ILanguageClient;
  registerPlugin(plugin: IExtensionPlugin | IExtensionPlugin[]): this;
  addBeforeCommandHook(command: string, handler: CommandEventHandler<ICommandEvent>): this;
  addAfterCommandSuccessHook(command: string, handler: CommandEventHandler<ICommandSuccessEvent>): this;
  registerCommand(command: string, handler: Function): this;
  registerTextEditorCommand(command: string, handler: Function): this;
  errorHandler(message: string, error: any): any;
  resourcesMap(): Map<string, any>;
}


export interface IDriverExtensionApi {
  /**
   * Prepare connection settings that will be saved to settings file,
   * and/or resolve settings before passing them to the language server (e.g. call an AuthenticationProvider to retrieve credentials)
   *
   * @param {{ connInfo: IConnection }} arg
   * @returns {(Promise<IConnection> | IConnection)}
   * @memberof IDriverExtensionApi
   */
  parseBeforeSaveConnection?(arg: { connInfo: IConnection }): Promise<IConnection> | IConnection;
  parseBeforeEditConnection?(arg: { connInfo: IConnection }): Promise<IConnection> | IConnection;
  resolveConnection?(arg: { connInfo: IConnection }): Promise<IConnection> | IConnection;
  readonly driverName?: string;
  readonly driverAliases: IDriverAlias[];
}

export interface IDriverAlias {
  /**
   * Driver name
   */
  displayName: string;
  /**
   * Driver id
   */
  value: string;
}

export interface IIcons {
  default: string;
  active?: string;
  inactive: string;
}

export interface IExtensionPlugin<T = IExtension> {
  readonly extensionId?: string;
  readonly type?: 'plugin' | 'driver';
  readonly name: string;
  register: (extension: T) => void;
}

export interface ILanguageClient {
  client: LanguageClient;
  clientErrorHandler: LanguageClientErrorHandler;
  start: LanguageClient['start'];
  sendRequest: LanguageClient['sendRequest'];
  onRequest: LanguageClient['onRequest'];
  sendNotification: LanguageClient['sendNotification'];
  onNotification: LanguageClient['onNotification'];
}

export type LSContextMap = Omit<Map<string, any>, 'clear' | 'delete'> & { drivers: Map<string, IConnectionDriverConstructor> };

export interface ILanguageServer {
  listen(): void;
  getContext(): LSContextMap;
  registerPlugin(plugin: ILanguageServerPlugin | ILanguageServerPlugin[]): Promise<void>;
  sendNotification: LSIConnection['sendNotification'];
  onRequest: LSIConnection['onRequest'];
  onNotification: LSIConnection['onNotification'];
  onCompletion: LSIConnection['onCompletion'];
  onCompletionResolve: LSIConnection['onCompletionResolve'];
  onDocumentFormatting: LSIConnection['onDocumentFormatting'];
  onDocumentRangeFormatting: LSIConnection['onDocumentRangeFormatting'];
  sendRequest: LSIConnection['sendRequest'];
  addOnDidChangeConfigurationHooks(hook: () => void): this;
  addOnInitializeHook(hook: Arg0<LSIConnection['onInitialize']>): this;
  addOnInitializedHook(hook: Arg0<LSIConnection['onInitialized']>): this;
  notifyError(message: string, error?: any): any;
  client: LSIConnection['client'];
  server: LSIConnection;
  docManager: TextDocuments<any>;
}

export interface ILanguageServerPlugin<T = ILanguageServer> {
  register: (server: T) => void;
}

export { LSIConnection };
