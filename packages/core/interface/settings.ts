import { ConnectionInterface } from '@sqltools/core/interface/connection';

export type CompletionLanguages = string[];
export type FormatLanguages = string[];

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
   * Languages with SQL completion activated.
   * @type {CompletionLanguages}
   * @default ["sql", "plaintext"]
   * @memberof Settings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  completionLanguages?: CompletionLanguages;
  /**
   * Languages with SQL formatting activated.
   * @type {FormatLanguages}
   * @default ["sql"]
   * @memberof Settings
   * @see {@link https://code.visualstudio.com/docs/languages/identifiers} for more information.
   */
  formatLanguages?: FormatLanguages;
  /**
   * Format document/selection options
   * @type {FormatOptions}
   * @memberof Settings
   */
  format?: FormatOptions;
  /**
   * Connections
   * @type {ConnectionInterface[]}
   * @default []
   * @memberof Settings
   */
  connections?: ConnectionInterface[];

  /**
   * Global show records limit
   * @type {string}
   * @memberof Settings
   */
  previewLimit?: number;
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
}
