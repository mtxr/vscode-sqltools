import { ConnectionInterface } from '@sqltools/core/interface/connection';
import { LogLevel } from '@sqltools/core/utils/logger';

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
   * Show debugging messages on console.
   * @default true
   * @type {boolean}
   * @memberof Settings
   */
  logging?: boolean;
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
  telemetryUUID?: string;
  /**
   * Toggle statusbar visibility.
   * @type {boolean}
   * @default true
   * @memberof Settings
   */
   showStatusbar?: boolean;
  /**
   * Severity of logged messages.
   * @type {keyof LogLevel}
   * @default DEBUG
   * @memberof Settings
   */
   logLevel?: keyof LogLevel;
  /**
   * Timeout in seconds for killing query process after the timeout.
   * @type {number}
   * @default 300000
   * @memberof Settings
   */
   queryTimeout?: number;
  /**
   * Number of queries to keep on History.
   * @type {number}
   * @default 100
   * @memberof Settings
   */
   historySize?: number;
  /**
   * Show results using new tab.
   * @type {boolean}
   * @default false
   * @memberof Settings
   */
   showResultOnTab?: boolean;
  /**
   * Clear output for new commands.
   * @type {boolean}
   * @default false
   * @memberof Settings
   */
   clearOutput?: boolean;
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
}
