import { IConnection } from '@sqltools/types/generic/connection';

export declare type CompletionLanguages = string[];
export declare type FormatLanguages = string[];
export declare type CodelensLanguages = string[];

export declare interface IDependencyManagerSettings {
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

export declare interface IFormatOptions {
  /**
   * Indent Size
   * @type {number}
   * @default 2
   * @memberof IFormatOptions
   */
  indentSize: number;

  /**
   * Reserverd word case
   * @type {string}
   * @default null
   * @memberof IFormatOptions
   */
  reservedWordCase?: 'upper' | 'lower' | null;
}

export declare interface IResultsOptions {
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

export declare interface ISettings {
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
  telemetry?: boolean;
  /**
   * Toggle statusbar visibility.
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
   * Set environment variables to be passed to language server. Eg: ORACLE_HOME, PATH...
   * @default {}
   * @type {{ [id: string]: string }}
   * @memberof ISettings
   */
  languageServerEnv?: { [id: string]: string };

  queryParams?: {
    /**
     * Enables query parameter checking
     * @memberof ISettings['queryParams']
     * @default true
     * @type {boolean}
     */
    enableReplace: boolean;
    /**
     * RegEx used to identify query parameters
     * @memberof ISettings['queryParams']
     * @default "\\$[\\d]+|\\$\\[[\\d\\w]+\\]"
     * @type {string}
     */
    regex: string;
  };

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

  connectionExplorer: {
    groupConnected: boolean
  }
}
