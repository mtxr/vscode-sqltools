import {
  IConnectionDriver,
  IBaseQueries,
  IConnection,
  IDatabaseFilter,
  IExpectedResult,
  NodeDependency,
  ContextValue,
  MConnectionExplorer,
} from '@sqltools/types';
import { getConnectionId } from '@sqltools/util/connection';
import { MissingModuleError, ElectronNotSupportedError } from '@sqltools/util/exception';
import { NSDatabase } from '@sqltools/types';
import sqltoolsRequire from '@sqltools/util/dependencies/require';
import log from '@sqltools/util/log';

export default abstract class AbstractDriver<ConnectionType extends any, DriverOptions extends any> implements IConnectionDriver {
  public log: typeof log;
  public readonly deps: NodeDependency[] = [];

  public getId() {
    return getConnectionId(this.credentials) || 'BROKEN';
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

  public describeTable(metadata: NSDatabase.ITable) {
    return this.query(this.queries.describeTable(metadata));
  }

  public async showRecords(table: NSDatabase.ITable, limit: number, page: number = 0) {
    const params = { limit, table, offset: page * limit };
    if (typeof this.queries.fetchRecords === 'function' && typeof this.queries.countRecords === 'function') {
      const [ records, totalResult ] = await (Promise.all([
        this.singleQuery(this.queries.fetchRecords(params)),
        this.singleQuery(this.queries.countRecords(params)),
      ]));
      records.pageSize = limit;
      records.page = page;
      records.total = Number((totalResult.results[0] as any).total);
      records.queryType = 'showRecords';
      records.queryParams = table;
      return [records];
    }

    return this.query(this.queries.fetchRecords(params));
  }

  protected needToInstallDependencies() {
    if (parseInt(process.env.IS_NODE_RUNTIME || '0') !== 1) {
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
              throw new MissingModuleError(this.deps, this.credentials, mustUpgrade);
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

  public getChildrenForItem(_params: { item: NSDatabase.SearchableItem; parent?: NSDatabase.SearchableItem }): Promise<MConnectionExplorer.IChildItem[]> {
    this.log.extend('error')(`###### Attention ######\getChildrenForItem not implemented for ${this.credentials.driver}\n####################`);
    return Promise.resolve([]);
  }
  public searchItems(_itemType: ContextValue, _search: string): Promise<NSDatabase.SearchableItem[]> {
    this.log.extend('error')(`###### Attention ######\searchItems not implemented for ${this.credentials.driver}\n####################`);
    return Promise.resolve([]);
  }
}
