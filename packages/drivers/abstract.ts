import {
  IConnectionDriver,
  IBaseQueries,
  IConnection,
  IDatabaseFilter,
  IExpectedResult,
} from '@sqltools/types';
import Drivers from '@sqltools/drivers';
import * as Utils from '@sqltools/core/utils';
import { MissingModuleError, ElectronNotSupportedError } from '@sqltools/core/exception';
import { NSDatabase } from '@sqltools/types';
import sqltoolsRequire from '@sqltools/core/utils/sqltools-require';
import log from '@sqltools/core/log';

export interface NodeDependency {
  type: 'package' | 'npmscript';
  name: string;
  version?: string;
  env?: { [id: string]: string };
  args?: string[], // extra arguments to be passaged to packag managers
}

export default abstract class AbstractDriver<ConnectionType extends any, DriverOptions extends any> implements IConnectionDriver {
  public log: typeof log;
  public static deps: NodeDependency[] = [];

  public getId() {
    return Utils.getConnectionId(this.credentials) || 'BROKEN';
  }
  protected get deps(): NodeDependency[] {
    if (!Drivers[this.constructor.name]) {
      return [];
    }
    return Drivers[this.constructor.name].deps;
  }
  public connection: Promise<ConnectionType>;
  abstract queries: IBaseQueries;
  constructor(public credentials: IConnection<DriverOptions>) {
    this.log = log.extend(credentials.driver.toLowerCase());
  }

  abstract open(): Promise<ConnectionType>;
  abstract close(): Promise<void>;

  abstract query<R = any, Q = any>(queryOrQueries: Q | string | String): Promise<NSDatabase.IResult<Q extends IExpectedResult<infer U> ? U : R>[]>;

  public singleQuery<R = any, Q = any>(query: Q | string | String) {
    return this.query<R, Q>(query).then(([ res ]) => res);
  }

  abstract getTables(): Promise<NSDatabase.ITable[]>;

  abstract getColumns(): Promise<NSDatabase.IColumn[]>;

  public getFunctions(): Promise<NSDatabase.IFunction[]> {
    this.log.extend('error')(`###### Attention ######\ngetFunctions not implemented for ${this.credentials.driver}\n####################`);
    return Promise.resolve([]);
  }

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public async showRecords(table: string, limit: number, page: number = 0) {
    const params = { limit, table, offset: page * limit };
    if (typeof this.queries.fetchRecordsV2 === 'function' && typeof this.queries.countRecordsV2 === 'function') {
      const [ records, totalResult ] = await (Promise.all([
        this.singleQuery(this.queries.fetchRecordsV2(params)),
        this.singleQuery(this.queries.countRecordsV2(params)),
      ]));
      records.pageSize = limit;
      records.page = page;
      records.total = Number(totalResult.results[0].total);

      return [records];
    }
    log.extend('debug')('*** DEPRECATION *** needs to be migrated to v2 queries');
    return this.query(Utils.replacer(this.queries.fetchRecords, params));
  }

  protected needToInstallDependencies() {
    if (parseInt(process.env['IS_NODE_RUNTIME'] || '0') !== 1) {
      throw new ElectronNotSupportedError();
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
              throw new MissingModuleError(dep.name, dep.version, this.credentials, mustUpgrade);
            }
            break;
        }
      });
    }
    return false
  }

  public getBaseQueryFilters() {
    const databaseFilter: IDatabaseFilter = this.credentials.databaseFilter || <IDatabaseFilter>{};
    databaseFilter.show = databaseFilter.show || (!databaseFilter.hide ? [this.credentials.database] : []);
    databaseFilter.hide = databaseFilter.hide || [];

    return {
      databaseFilter
    };
  }
}
