import { IConnection } from '../generic/connection';

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
   * Define where the results should show up. Use the defined strings or any number defined in https://code.visualstudio.com/api/references/vscode-api#ViewColumn
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
   * Enable node runtime usage.
   * @default false
   * @type {null | boolean | string}
   * @memberof ISettings
   */
  useNodeRuntime?: null | boolean | string;

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
   * VSCode config
   *
   * @param {string} section
   * @param {any} [resource]
   * @returns {boolean}
   * @memberof ConfigChangeEvent
   */
  affectsConfiguration(section: string, resource?: any): boolean;
}