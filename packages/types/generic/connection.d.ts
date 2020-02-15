import { DatabaseDriver } from '@sqltools/types/driver';
import { NSDatabase } from '@sqltools/types/generic/database';

export declare interface IConnection<DriverOptions = any> {
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
  port: number;
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
   * Connection flag. This is not a settings. It's generated in runtime
   * @type {boolean}
   * @memberof IConnection
   */
  isConnected: boolean;
  /**
   * Connection flag. This is not a settings. It's generated in runtime
   * @type {boolean}
   * @memberof IConnection
   */
  isActive: boolean;

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
   * Allow user to select databases to be shown or not on explorer. Default is to show connected database only. Set to null to show all
   *
   * @type {IDatabaseFilter}
   * @memberof IConnection
   */
   databaseFilter?: IDatabaseFilter;
}

export declare interface IDatabaseFilter {
  show: string[];
  hide: string[];
}

export declare interface IConnectionDriver {
  connection: any;
  credentials: IConnection;
  open(): Promise<any>;
  close(): Promise<any>;
  getTables(): Promise<NSDatabase.ITable[]>;
  getColumns(): Promise<NSDatabase.IColumn[]>;
  getFunctions(): Promise<NSDatabase.IFunction[]>;
  describeTable(tableName: string): Promise<NSDatabase.IResult[]>;
  showRecords(tableName: string, limit: number, page?: number): Promise<NSDatabase.IResult[]>;
  query(query: string): Promise<NSDatabase.IResult[]>;
  testConnection?(): Promise<void>;
  getChildrenForItem?(params: { item: MConnectionExplorer.IChildItem }): Promise<MConnectionExplorer.IChildItem[]>;
}

export enum ContextValue {
  CONNECTION ='connection',
  CONNECTED_CONNECTION ='connectedConnection',
  TABLEORVIEW ='connection.tableOrView',
  COLUMN ='connection.column',
  FUNCTION ='connection.function',
  RESOURCE_GROUP ='connection.resource_group',
  DATABASE ='connection.database'
}

export module MConnectionExplorer {
  type TreeItemType = ContextValue;
  interface IChildItem {
    type: TreeItemType;
    id: string;
    label: string;
    /**
     * Text that goes in front of the label
     */
    detail?: string;
  }
}

