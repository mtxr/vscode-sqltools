import { ConnectionInterface } from '@sqltools/core/interface/connection';

export type CompletionLanguages = string[];
export type FormatLanguages = string[];
export type CodelensLanguages = string[];

export interface DependencyManagerSettings {
  /**
   * Package mangaer name or path. Eg. yarn, npm or absolute paths like /usr/bin/npm
   *
   * @type {string}
   * @default npm
   * @memberof DependencyManagerSettings
   */
  packageManager: string;
  /**
   * Array of args passed when installing. If you use yarn, this shoud be set to `[\"add\"]`
   *
   * @type {string[]}
   * @default ["install"]
   * @memberof DependencyManagerSettings
   */
  installArgs: string[];
  /**
   * Array of args passed when runnning npm scripts.
   *
   * @type {string[]}
   * @default ["run"]
   * @memberof DependencyManagerSettings
   */
  runScriptArgs: string[];
  /**
   * Ignore confirmation requests to install or updagre dependencies.
   *
   * @type {boolean}
   * @memberof DependencyManagerSettings
   */
  autoAccept: boolean;
}

export interface FormatOptions {
  /**
   * Indent Size
   * @type {number}
   * @default 2
   * @memberof FormatOptions
   */
  indentSize: number;

  /**
   * Reserverd word case
   * @type {string}
   * @default null
   * @memberof FormatOptions
   */
  reservedWordCase?: 'upper' | 'lower' | null;
}

export interface ResultsOptions {
  /**
   * Global show records limit
   * @type {number}
   * @default 50
   * @memberof ResultsOptions
   */
  limit: number;

  /**
   * Define where the results should show up. Use the defined strings or any number defined in https://code.visualstudio.com/api/references/vscode-api#ViewColumn
   * @type {string}
   * @default 'next'
   * @memberof ResultsOptions
   */
  location?: 'current' | 'next' | 'end' | number;
  /**
   * Customize results screen CSS
   *
   * @type {{ [varible: string]: string }}
   * @memberof ResultsOptions
   */
  customization?: {
    'font-family'?: string;
    'font-size'?: string;
    'table-cell-padding'?: string;
   };
}

export interface Settings {
  /**
   * Disable new release notifications.
   * @default false
   * @type {boolean}
   * @memberof Settings
   */
  disableReleaseNotifications?: boolean;
  /**
   * Name of the connection to auto connect on start
   * @type {string | string[]}
   * @default null
   * @memberof Settings
   */
  autoConnectTo?: string | string[];
  /**
   * Help SQLTools development.
   * @type {boolean}
   * @default true
   * @memberof Settings
   */
  telemetry?: boolean;
  /**
   * Toggle statusbar visibility.
   * @type {boolean}
   * @default true
   * @memberof Settings
   */
  showStatusbar?: boolean;
  /**
   * Number of queries to keep on History.
   * @type {number}
   * @default 100
   * @memberof Settings
   */
   historySize?: number;
  /**
   * Languages with SQL completion enabled.
   * @type {CompletionLanguages}
   * @default ["sql"]
   * @memberof Settings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  completionLanguages?: CompletionLanguages;
  /**
   * Languages with SQL formatting enabled.
   * @type {FormatLanguages}
   * @default ["sql"]
   * @memberof Settings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  formatLanguages?: FormatLanguages;
  /**
   * Languages with SQL CodeLens enabled.
   * @type {CodelensLanguages}
   * @default ["sql"]
   * @memberof Settings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  codelensLanguages?: CodelensLanguages;
  /**
   * Format document/selection options
   * @type {FormatOptions}
   * @memberof Settings
   */
  format?: FormatOptions;

  /**
   * Results view options
   * @type {ResultsOptions}
   * @memberof Settings
   */
  results?: ResultsOptions;

  /**
   * Connections
   * @type {ConnectionInterface[]}
   * @default []
   * @memberof Settings
   */
  connections?: ConnectionInterface[];

  /**
   * Default export results mode
   * @default "prompt"
   * @type {string}
   * @memberof Settings
   */
  defaultExportType?: 'prompt' | 'csv' | 'json';
  /**
   * Enable node runtime usage.
   * @default false
   * @type {null | boolean | string}
   * @memberof Settings
   */
  useNodeRuntime?: null | boolean | string;

  /**
   * Columns sort order
   * @default 'name'
   * @type {null | string}
   * @memberof Settings
   */
  sortColumns?: 'name' | 'ordinalnumber' | null;

  /**
   * Flatten groups with has only one child
   * @default false
   * @type {boolean}
   * @memberof Settings
   */
  flattenGroupsIfOne?: boolean;

  /**
   * Auto open session file when connect
   * @default true
   * @type {boolean}
   * @memberof Settings
   */
  autoOpenSessionFiles?: boolean;
  /**
   * Set environment variables to be passed to language server. Eg: ORACLE_HOME, PATH...
   * @default {}
   * @type {{ [id: string]: string }}
   * @memberof Settings
   */
  languageServerEnv?: { [id: string]: string };

  queryParams?: {
    /**
     * Enables query parameter checking
     * @memberof Settings['queryParams']
     * @default true
     * @type {boolean}
     */
    enableReplace: boolean;
    /**
     * RegEx used to identify query parameters
     * @memberof Settings['queryParams']
     * @default "\\$[\\d]+|\\$\\[[\\d\\w]+\\]"
     * @type {string}
     */
    regex: string;
  };

  /**
   * Dependency manager settings
   *
   * @type {DependencyManagerSettings}
   * @memberof Settings
   */
  dependencyManager?: DependencyManagerSettings;

  /**
   * SQLTools debug settings
   * 
   * @type {{ namespaces?: string }}
   * @memberof Settings
   */
  debug?: { namespaces?: string };
}
