/**
 * This is an example of a fake driver.
 * You can base on this file to create a new one.
 *
 * The functions have signatures for result object, try to keep it as short as possible and stick to the result interface.
 * If you need, feel free to create all internal functions you need, just mark it as private.
 */

import {
  ConnectionDriver,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import AbstractDriver from '@sqltools/drivers/abstract';
import queries from './queries';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

/**
 * you can use this or the deps prop to work with the driver.
 *
 * If your driver is not pure JS, consider using deps prop instead.
 */
import ExampleDriverLib from 'exmaple-driver-lib';


export default class ExampleDriver extends AbstractDriver<ExampleDriver.Connection> implements ConnectionDriver {

  /**
   * If you set this prop, the driver will be installed by the user on first run.
   * If your driver is pure JS, you can just import it and pack it together with the extension
   */
  public static deps: typeof AbstractDriver['deps'] = [{
    type: 'package',
    name: 'exmaple-driver-lib',
    version: '1.0.0',
  }];


  queries = queries;

  private get lib() {
    return __non_webpack_require__('exmaple-driver-driver');
  }

  public async open() {
    // if connection is already open, reuse
    if (this.connection) {
      return this.connection;
    }

    this.needToInstallDependencies();

    const conn = await this.lib.connect();
    // const conn = await this.lib.createPool();
    // const conn = await this.lib.open();
    this.connection = Promise.resolve(conn);
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    const conn = await this.connection
    await this.close();
    // await this.destroy();
    // await this.finish();
    this.connection = null;
  }

  /**
   * This method should run queries even with multiple statements. Eg.: SELECT 1; SELECT 2;
   */
  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    const conn = await this.open();
    const results: DatabaseInterface.QueryResults[] = [];

    const res = await conn.query(query);

    // base on `res`, add items on results array and return
    return results;
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.tablename,
              isView: !!obj.isview,
              numberOfColumns: parseInt(obj.numberofcolumns, 10),
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableSchema: obj.tableschema,
              tree: obj.tree,
            } as DatabaseInterface.Table;
          });
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.query(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              columnName: obj.columnname,
              defaultValue: obj.defaultvalue,
              isNullable: !!obj.isnullable ? obj.isnullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableName: obj.tablename,
              tableSchema: obj.tableschema,
              isPk: (obj.keytype || '').toLowerCase() === 'primary key',
              isFk: (obj.keytype || '').toLowerCase() === 'foreign key',
              type: obj.type,
              tree: obj.tree,
            } as DatabaseInterface.TableColumn;
          });
      });
  }

  public getFunctions(): Promise<DatabaseInterface.Function[]> {
    return this.query(this.queries.fetchFunctions)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              ...obj,
              args: obj.args ? obj.args.split(/, */g) : [],
            } as DatabaseInterface.TableColumn;
          });
      });
  }

  public describeTable(prefixedTable: string) {
    const [ catalog, schema, table ] = prefixedTable.split('.');
    return this.query(Utils.replacer(this.queries.describeTable, { catalog, schema, table }));
  }
}