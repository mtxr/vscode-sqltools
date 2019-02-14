import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';

export interface Deps {
  moduleName: string;
  moduleVersion?: string;
  rebuildRequired?: boolean;
  installArgs?: string[];
}

export default abstract class GenericDialect<ConnectionType extends any> implements ConnectionDialect {
  public static deps: Deps[] = [];
  public connection: Promise<ConnectionType>;
  abstract queries: DialectQueries;
  constructor(public credentials: ConnectionCredentials) { }

  abstract open(): Promise<ConnectionType>;
  abstract close(): Promise<void>;

  abstract query(query: string): Promise<DatabaseInterface.QueryResults[]>;

  abstract getTables(): Promise<DatabaseInterface.Table[]>;

  abstract getColumns(): Promise<DatabaseInterface.TableColumn[]>;

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public showRecords(table: string, limit: number) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }
}
