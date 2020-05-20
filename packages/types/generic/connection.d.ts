import { DatabaseDriver } from './../driver';
import { NSDatabase, InternalID } from './database';

export interface IConnection<DriverOptions = any> {
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
  port?: number;
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
   * @default {50}
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



   // WONT BE INCLUDED IN SETTINGS
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
}

export interface IDatabaseFilter {
  show: string[];
  hide: string[];
}

export interface IQueryOptions {
  requestId?: InternalID;
  connId?: string;
  [k: string]: any;
}
export interface IConnectionDriverConstructor {
  new (credentials: IConnection<any>): IConnectionDriver;
}
export interface IConnectionDriver {
  connection: any;
  credentials: IConnection<any>;
  open(): Promise<any>;
  close(): Promise<any>;
  describeTable(table: NSDatabase.ITable, opt?: IQueryOptions): Promise<NSDatabase.IResult[]>;
  showRecords(tableName: NSDatabase.ITable, opt: IQueryOptions & { limit: number, page?: number }): Promise<NSDatabase.IResult[]>;
  query(query: string, opt?: IQueryOptions): Promise<NSDatabase.IResult[]>;
  testConnection?(): Promise<void>;
  getChildrenForItem?(params: { item: NSDatabase.SearchableItem, parent?: NSDatabase.SearchableItem }): Promise<MConnectionExplorer.IChildItem[]>;
  searchItems?(itemType: ContextValue, search: string, extraParams: any): Promise<NSDatabase.SearchableItem[]>;
  getStaticCompletions?(): Promise<{ [w: string]: NSDatabase.IStaticCompletion }>;
}

export declare enum ContextValue {
  CONNECTION = 'connection',
  CONNECTED_CONNECTION = 'connectedConnection',
  COLUMN = 'connection.column',
  FUNCTION = 'connection.function',
  SCHEMA = 'connection.schema',
  RESOURCE_GROUP = 'connection.resource_group',
  DATABASE = 'connection.database',
  TABLE = 'connection.table',
  VIEW = 'connection.view',
  MATERIALIZED_VIEW = 'connection.materializedView',
  NO_CHILD = 'NO_CHILD',
  KEYWORDS = 'KEYWORDS',
}

export module MConnectionExplorer {
  export interface IChildItem {
    type: ContextValue;
    label: string;
    schema: string;
    database: string;
    /**
     * Text that goes in front of the label
     */
    detail?: string;
    /**
     * Icon id from https://microsoft.github.io/vscode-codicons/dist/codicon.html
     */
     iconId?: string;
     /**
      * sqltools icons
      */
     iconName?: string;
     /**
     * for resource_groups
     */
    childType?: ContextValue;
  }
}

