import DatabaseInterface from './database';
import { DatabaseDialect } from './dialect';

export type SerializedConnection =  {
  id: string;
  isConnected: boolean;
} & ConnectionCredentials;

export interface ConnectionCredentials {
  /**
   * Connection name
   * @type {string}
   * @memberof ConnectionSettings
   */
  name: string;
  /**
   * Server address
   * @type {string}
   * @default "127.0.0.1
   * @memberof ConnectionSettings
   */
  server: string;
  /**
   * Port for connection
   * @type {number}
   * @memberof ConnectionSettings
   */
  port: number;
  /**
   * Database name
   * @type {string}
   * @memberof ConnectionSettings
   */
  database: string;
  /**
   * Database username
   * @type {string}
   * @memberof ConnectionSettings
   */
  username: string;
  /**
   * Connection password. You can use option askForPassword to prompt password before connect
   * @type {string}
   * @default null
   * @memberof ConnectionSettings
   */
  password?: string;
  /**
   * Ask for password instead of set it in your settings"
   * @type {boolean}
   * @default false
   * @memberof ConnectionSettings
   */
  askForPassword?: boolean;
  /**
   * Connection Dialect"
   * @type {DatabaseDialect}
   * @memberof ConnectionSettings
   */
  dialect: DatabaseDialect;
  /**
   * Connection timeout in seconds"
   * @type {number}
   * @default 1
   * @memberof ConnectionSettings
   */
  connectionTimeout?: number;
  /**
   * Connection show records limit
   * @type {string}
   * @memberof ConnectionSettings
   */
  previewLimit?: number;
  /**
   * Dialect driver options. See more on https://github.com/mtxr/vscode-sqltools/wiki/connection-driver-options
   * @type {any}
   * @memberof ConnectionSettings
   */
  dialectOptions?: { encrypt: boolean };
  /**
   * Connection domain (for MSSQL/Azure only)
   * @type {string}
   * @memberof ConnectionSettings
   */
  domain?: string;
}

export interface ConnectionDialect {
  connection: any;
  credentials: ConnectionCredentials;
  open(): Promise<any>;
  close(): Promise<any>;
  getTables(): Promise<DatabaseInterface.Table[]>;
  getColumns(): Promise<DatabaseInterface.TableColumn[]>;
  describeTable(tableName: string): Promise<any>;
  showRecords(tableName: string, limit: number): Promise<any>;
  query(query: string): Promise<any>;
  getDummy?(): Promise<any>;
}

