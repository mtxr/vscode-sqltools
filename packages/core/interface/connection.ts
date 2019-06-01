import { DatabaseDialect } from './dialect';
import { ClientConfig } from 'pg';
import { ConnectionConfig } from 'mysql';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
import { PoolAttributes } from 'oracledb';

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
  server?: string;
  /**
   * Port for connection
   * @type {number}
   * @memberof ConnectionInterface
   */
  port: number;
  /**
   * Path of socket file to connect using UNIX sockets
   * @type {string}
   * @memberof ConnectionInterface
   */
  socketPath?: string;
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
   * Oracle specific driver options. See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#createpoolpoolattrsconnectstring
   * @type {string}
   * @default null
   * @memberof ConnectionInterface
   */
  connectString?: string;
  /**
   * MSSQL specific driver options. See https://vscode-sqltools.mteixeira.dev/connections/mssql#1-1-specific-options
   * @deprecated replaced by mssqlOptions
   * @type {any}
   * @memberof ConnectionInterface
   */
  mssqlOptions?: { encrypt?: boolean };

  /**
   * MySQL specific driver options
   * @type {any}
   * @memberof ConnectionInterface
   */
  mysqlOptions?: {
    authProtocol?: 'xprotocol' | 'default'
    /**
     * If using xprotocol, must be boolean
     *
     * @type {ConnectionConfig['ssl'] | boolean}
     */
    ssl?: ConnectionConfig['ssl'] | boolean;
  }

  /**
   * PostgreSQL specific driver options. See https://vscode-sqltools.mteixeira.dev/connections/postgresql#1-1-specific-options
   * @type {any}
   * @memberof ConnectionInterface
   */
  pgOptions?: {
    ssl?: ClientConfig['ssl'];
  }

  /**
   * OracleDB specific driver options (pool). See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#createpoolpoolattrs
   * @type {PoolAttributes}
   * @memberof ConnectionInterface
   */
  oracleOptions?: PoolAttributes

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

  /**
   * Define an icon for this connection. If not specified, use defaults
   *
   * @type {string}
   * @memberof ConnectionInterface
   */
  icons?: {
    active?: string;
    connected?: string;
    disconnected?: string;
  };
}

export interface ConnectionDialect {
  connection: any;
  credentials: ConnectionInterface;
  open(): Promise<any>;
  close(): Promise<any>;
  getTables(): Promise<DatabaseInterface.Table[]>;
  getColumns(): Promise<DatabaseInterface.TableColumn[]>;
  getFunctions(): Promise<DatabaseInterface.Function[]>;
  describeTable(tableName: string): Promise<DatabaseInterface.QueryResults[]>;
  showRecords(tableName: string, limit: number): Promise<DatabaseInterface.QueryResults[]>;
  query(query: string): Promise<DatabaseInterface.QueryResults[]>;
  testConnection?(): Promise<void>;
}

