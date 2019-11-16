import {
  ConnectionDriver,
  ConnectionInterface,
} from '@sqltools/core/interface';
import AbstractDriver from '@sqltools/drivers/abstract';
import Queries from './queries';
import MySQLX from './xprotocol';
import MySQLDefault from './default';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
import compareVersions from 'compare-versions';

export default class MySQL extends AbstractDriver<any> implements ConnectionDriver {
  queries = Queries;
  private driver: AbstractDriver<any>;

  constructor(public credentials: ConnectionInterface) {
    super(credentials);
    if (this.credentials.mysqlOptions && this.credentials.mysqlOptions.authProtocol === 'xprotocol') {
      this.driver = new MySQLX(credentials);
    } else {
      this.driver = new MySQLDefault(credentials);
    }
  }
  public open() {
    return this.driver.open();
  }

  public close() {
    return this.driver.close();
  }

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.driver.query(query);
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.driver.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.tableName,
              isView: !!obj.isView,
              numberOfColumns: parseInt(obj.numberOfColumns, 10),
              tableCatalog: obj.tableCatalog,
              tableDatabase: obj.dbName,
              tableSchema: obj.tableSchema,
              tree: obj.tree,
            } as DatabaseInterface.Table;
          });
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.driver.query(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return <DatabaseInterface.TableColumn>{
              ...obj,
              isNullable: !!obj.isNullable ? obj.isNullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              isPk: Boolean(obj.isPk),
              isFk: Boolean(obj.isFk),
            };
          });
      });
  }

  public async getFunctions(): Promise<DatabaseInterface.Function[]> {
    const functions = await (
      await this.is55OrNewer()
        ? this.driver.query(this.queries.fetchFunctions)
        : this.driver.query(this.queries.fetchFunctionsV55Older)
    );

    return functions[0].results
      .reduce((prev, curr) => prev.concat(curr), [])
      .map((obj) => {
        return {
          ...obj,
          args: obj.args ? obj.args.split(/, */g) : [],
          database: obj.dbname,
          schema: obj.dbschema,
        } as DatabaseInterface.Function;
      })
  }

  mysqlVersion: string = null;

  private async getVersion() {
    if (this.mysqlVersion) return Promise.resolve(this.mysqlVersion);
    this.mysqlVersion = await this.query(`SHOW variables WHERE variable_name = 'version'`).then(([res]) => res.results[0].Value);
    return this.mysqlVersion;
  }

  private async is55OrNewer() {
    try {
      await this.getVersion();
      return compareVersions.compare(this.mysqlVersion, '5.5.0', '>=');
    } catch (error) {
      return true;
    }
  }
}
