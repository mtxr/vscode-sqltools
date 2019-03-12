import DatabaseInterface from './database';
import { DatabaseDialect } from './dialect';

export interface ConnectionInterface {
  /**
   * Connection name
   * @type {string}
   * @memberof ConnectionInterface
   */
  name: string;
  /**
   * Server address
   * @type {string}
   * @default "127.0.0.1
   * @memberof ConnectionInterface
   */
  server: string;
  /**
   * Port for connection
   * @type {number}
   * @memberof ConnectionInterface
   */
  port: number;
  /**
   * Database name
   * @type {string}
   * @memberof ConnectionInterface
   */
  database: string;
  /**
   * Database username
   * @type {string}
   * @memberof ConnectionInterface
   */
  username: string;
  /**
   * Connection password. You can use option askForPassword to prompt password before connect
   * @type {string}
   * @default null
   * @memberof ConnectionInterface
   */
  password?: string;
  /**
   * Ask for password instead of set it in your settings"
   * @type {boolean}
   * @default false
   * @memberof ConnectionInterface
   */
  askForPassword?: boolean;
  /**
   * Connection Dialect"
   * @type {DatabaseDialect}
   * @memberof ConnectionInterface
   */
  dialect: DatabaseDialect;
  /**
   * Connection timeout in seconds"
   * @type {number}
   * @default 30
   * @memberof ConnectionInterface
   */
  connectionTimeout?: number;
  /**
   * Connection show records limit
   * @type {string}
   * @memberof ConnectionInterface
   */
  previewLimit?: number;
  /**
   * Dialect driver options. See more on https://github.com/mtxr/vscode-sqltools/wiki/connection-driver-options
   * @type {any}
   * @memberof ConnectionInterface
   */
  dialectOptions?: { encrypt?: boolean };

  /**
   * MySQL specific options
   * @type {any}
   * @memberof ConnectionInterface
   */
  mysqlOptions?: {
    authProtocol?: 'xprotocol' | 'default'
  }
  /**
   * Connection domain (for MSSQL/Azure only)
   * @type {string}
   * @memberof ConnectionInterface
   */
  domain?: string;

  /**
   * Connection generated id. This is not a settings. It's generated in runtime
   * @type {string}
   * @memberof ConnectionInterface
   */
  id: string;
  /**
   * Connection flag. This is not a settings. It's generated in runtime
   * @type {boolean}
   * @memberof ConnectionInterface
   */
  isConnected: boolean;
  /**
   * Connection flag. This is not a settings. It's generated in runtime
   * @type {boolean}
   * @memberof ConnectionInterface
   */
  isActive: boolean;
}

export interface ConnectionDialect {
  connection: any;
  credentials: ConnectionInterface;
  open(): Promise<any>;
  close(): Promise<any>;
  getTables(): Promise<DatabaseInterface.Table[]>;
  getColumns(): Promise<DatabaseInterface.TableColumn[]>;
  describeTable(tableName: string): Promise<DatabaseInterface.QueryResults[]>;
  showRecords(tableName: string, limit: number): Promise<DatabaseInterface.QueryResults[]>;
  query(query: string): Promise<DatabaseInterface.QueryResults[]>;
  testConnection?(): Promise<void>;
}

