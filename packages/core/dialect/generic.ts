import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from '@sqltools/core/interface';
import Dialects from '@sqltools/core/dialect';
import * as Utils from '@sqltools/core/utils';
import { MissingModule } from '../exception';

export interface Deps {
  type: 'package' | 'npmscript';
  name: string;
  version?: string;
  env?: { [id: string]: string };
}

export default abstract class GenericDialect<ConnectionType extends any> implements ConnectionDialect {
  public static deps: Deps[] = [];

  protected get deps() {
    return Dialects[this.constructor.name].deps;
  }
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

  protected needToInstallDependencies() {
    if (this.deps && this.deps.length > 0) {
      this.deps.forEach(dep => {
        switch (dep.type) {
          case 'package':
            try {
              __non_webpack_require__(dep.name);
              const { version } = __non_webpack_require__(dep.name + '/package.json');
              if (dep.version && version !== dep.version) {
                throw new Error('Version not matching');
              }
            } catch(e) {
              throw new MissingModule(dep.name, dep.version);
            }
            break;
        }
      });
    }
    return false
  }
}
