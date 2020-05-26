import AbstractDriver from '@sqltools/base-driver';
import queries from './queries';
// import sqltoolsRequire from '@sqltools/base-driver/dist/lib/require';
import { IConnectionDriver, MConnectionExplorer, NSDatabase, ContextValue, Arg0 } from '@sqltools/types';
import { v4 as generateId } from 'uuid';

/**
 * set Driver lib to the type of your connection.
 * Eg for postgres:
 * import { Pool, PoolConfig } from 'pg';
 * ...
 * type DriverLib = Pool;
 * type DriverOptions = PoolConfig;
 *
 * This will give you completions iside of the library
 */
type DriverLib = any;
type DriverOptions = any;

export default class YourDriverClass extends AbstractDriver<DriverLib, DriverOptions> implements IConnectionDriver {

  /**
   * If you driver depends on node packages, list it below on `deps` prop.
   * It will be installed automatically on first use of your driver.
   */
  // public readonly deps: typeof AbstractDriver.prototype['deps'] = [{
  //   type: AbstractDriver.CONSTANTS.DEPENDENCY_PACKAGE,
  //   name: 'node-packge-name',
  //   version: 'x.x.x',
  // }];


  queries = queries;

  /** if you need to require your lib in runtime */
  // private get lib() {
  //   return sqltoolsRequire('node-packge-name') as DriverLib;
  // }

  public async open() {
    if (this.connection) {
      return this.connection;
    }

    this.needToInstallDependencies();
    /**
     * open your connection here!!!
     */

    // this.connection = Promise.resolve(connection);
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    /**
     * cose you connection here!!
     */
    this.connection = null;
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = async (query, opt = {}) => {
    // const db = await this.open();
    /**
     * write the method to execute queries here!!
     */
    let resultsAgg: NSDatabase.IResult[] = [];
    return resultsAgg;
  }

  /** if you need a different way to test your connection, you can set it here.
   * Otherwise by default we open and close the connection only
   */
  // public async testConnection() {
  //   await this.open()
  //   await this.query('SELECT 1', {});
  // }

  /**
   * This method is a helper to generate the connection explorer tree.
   * it gets the child items based on current item
   */
  public async getChildrenForItem({ item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
    //   case ContextValue.CONNECTION:
    //   case ContextValue.CONNECTED_CONNECTION:
    //     return <MConnectionExplorer.IChildItem[]>[
    //       { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
    //       { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
    //     ];
    //   case ContextValue.TABLE:
    //   case ContextValue.VIEW:
    //     return this.queryResults(this.queries.fetchColumns(item as NSDatabase.ITable));
    //   case ContextValue.RESOURCE_GROUP:
    //     return this.getChildrenForGroup({ item, parent });
    }
    return [];
  }

  /**
   * This method is a helper to generate the connection explorer tree.
   * It gets the child based on child types
   */
  // private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
  //   switch (item.childType) {
  //     case ContextValue.TABLE:
  //       return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema));
  //     case ContextValue.VIEW:
  //       return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema));
  //   }
  //   return [];
  // }

  /**
   * This method is a helper for intellisense and quick picks.
   */
  public async searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    // switch (itemType) {
    //   case ContextValue.TABLE:
    //     return this.queryResults(this.queries.searchTables({ search }));
    //   case ContextValue.COLUMN:
    //     return this.queryResults(this.queries.searchColumns({ search, ...extraParams }));
    // }
    return [];
  }

  public getStaticCompletions: IConnectionDriver['getStaticCompletions'] = async () => {
    return {};
  }
}
