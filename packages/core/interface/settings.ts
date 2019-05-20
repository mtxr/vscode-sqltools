import { ConnectionInterface } from '@sqltools/core/interface/connection';

export type CompletionLanguages = string[];
export type FormatLanguages = string[];
export type CodelensLanguages = string[];

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
   * Extension ID
   * @type {string}
   * @default null
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

}
