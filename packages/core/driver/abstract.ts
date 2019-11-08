import {
  ConnectionDriver,
  DriverQueries,
  ConnectionInterface,
  DatabasesFilterType,
} from '@sqltools/core/interface';
import Drivers from '@sqltools/core/driver';
import * as Utils from '@sqltools/core/utils';
import { MissingModuleException, ElectronNotSupportedException } from '../exception';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
import sqltoolsRequire from '../utils/sqltools-require';

export interface Deps {
  type: 'package' | 'npmscript';
  name: string;
  version?: string;
  env?: { [id: string]: string };
  args?: string[], // extra arguments to be passaged to packag managers
}

export default abstract class AbstractDriver<ConnectionType extends any> implements ConnectionDriver {
  public static deps: Deps[] = [];

  public getId() {
    return Utils.getConnectionId(this.credentials) || 'BROKEN';
  }
  protected get deps(): Deps[] {
    if (!Drivers[this.constructor.name]) {
      return [];
    }
    return Drivers[this.constructor.name].deps;
  }
  public connection: Promise<ConnectionType>;
  abstract queries: DriverQueries;
  constructor(public credentials: ConnectionInterface) { }

  abstract open(): Promise<ConnectionType>;
  abstract close(): Promise<void>;

  abstract query(query: string): Promise<DatabaseInterface.QueryResults[]>;

  abstract getTables(): Promise<DatabaseInterface.Table[]>;

  abstract getColumns(): Promise<DatabaseInterface.TableColumn[]>;

  public getFunctions(): Promise<DatabaseInterface.Function[]> {
    console.error(`###### Attention ######\ngetFunctions not implemented for ${this.credentials.driver}\n####################`);
    return Promise.resolve([]);
  }

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public showRecords(table: string, limit: number) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }

  protected needToInstallDependencies() {
    if (parseInt(process.env['IS_NODE_RUNTIME'] || '0') !== 1) {
      throw new ElectronNotSupportedException();
    }
    if (this.deps && this.deps.length > 0) {
      this.deps.forEach(dep => {
        let mustUpgrade = false;
        switch (dep.type) {
          case 'package':
            try {
              delete sqltoolsRequire.cache[sqltoolsRequire.resolve(dep.name + '/package.json')];
              const { version } = sqltoolsRequire(dep.name + '/package.json');
              if (dep.version && version !== dep.version) {
                mustUpgrade = true;
                throw new Error(`Version not matching. We need to upgrade ${dep.name}`);
              }
              sqltoolsRequire(dep.name);
            } catch(e) {
              throw new MissingModuleException(dep.name, dep.version, this.credentials, mustUpgrade);
            }
            break;
        }
      });
    }
    return false
  }

  public getBaseQueryFilters() {
    const databaseFilter: DatabasesFilterType = this.credentials.databasesFilter || <DatabasesFilterType>{};
    databaseFilter.show = databaseFilter.show || (!databaseFilter.hide ? [this.credentials.database] : []);
    databaseFilter.hide = databaseFilter.hide || [];

    return {
      databaseFilter
    };
  }
}
