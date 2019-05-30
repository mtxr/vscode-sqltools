import {
  ConnectionDialect,
  DialectQueries,
  ConnectionInterface,
} from '@sqltools/core/interface';
import Dialects from '@sqltools/core/dialect';
import * as Utils from '@sqltools/core/utils';
import { MissingModuleException, ElectronNotSupportedException } from '../exception';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

export interface Deps {
  type: 'package' | 'npmscript';
  name: string;
  version?: string;
  env?: { [id: string]: string };
  args?: string[], // extra arguments to be passaged to packag managers
}

export default abstract class GenericDialect<ConnectionType extends any> implements ConnectionDialect {
  public static deps: Deps[] = [];

  public getId() {
    return Utils.getConnectionId(this.credentials) || 'BROKEN';
  }
  protected get deps() {
    if (!Dialects[this.constructor.name]) {
      return [];
    }
    return Dialects[this.constructor.name].deps;
  }
  public connection: Promise<ConnectionType>;
  abstract queries: DialectQueries;
  constructor(public credentials: ConnectionInterface) { }

  abstract open(): Promise<ConnectionType>;
  abstract close(): Promise<void>;

  abstract query(query: string): Promise<DatabaseInterface.QueryResults[]>;

  abstract getTables(): Promise<DatabaseInterface.Table[]>;

  abstract getColumns(): Promise<DatabaseInterface.TableColumn[]>;

  public getFunctions(): Promise<DatabaseInterface.Function[]> {
    console.error(`###### Attention ######\ngetFunctions not implemented for ${this.credentials.dialect}\n####################`);
    return Promise.resolve([]);
  }

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public showRecords(table: string, limit: number) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }

  protected needToInstallDependencies() {
    if (!process.release.sourceUrl.startsWith('https://nodejs.org')) {
      throw new ElectronNotSupportedException();
    }
    if (this.deps && this.deps.length > 0) {
      this.deps.forEach(dep => {
        let mustUpgrade = false;
        switch (dep.type) {
          case 'package':
            try {
              delete __non_webpack_require__.cache[__non_webpack_require__.resolve(dep.name + '/package.json')];
              const { version } = __non_webpack_require__(dep.name + '/package.json');
              if (dep.version && version !== dep.version) {
                mustUpgrade = true;
                throw new Error(`Version not matching. We need to upgrade ${dep.name}`);
              }
              __non_webpack_require__(dep.name);
            } catch(e) {
              throw new MissingModuleException(dep.name, dep.version, this.credentials, mustUpgrade);
            }
            break;
        }
      });
    }
    return false
  }
}
