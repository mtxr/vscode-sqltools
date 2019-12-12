import AbstractDriver from '@lib/abstract';
import Queries from './queries';
import MySQLX from './xprotocol';
import MySQLDefault from './default';
import compareVersions from 'compare-versions';
import { IConnectionDriver, IConnection, NSDatabase } from '@sqltools/types';

export default class MySQL<O = any> extends AbstractDriver<any, O> implements IConnectionDriver {
  queries = Queries;
  private driver: AbstractDriver<any, any>;

  constructor(public credentials: IConnection) {
    // move to diferent drivers
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

  public query(query: string): Promise<NSDatabase.IResult[]> {
    return this.driver.query(query);
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    return this.driver.query<any>(this.queries.fetchTables)
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
            } as NSDatabase.ITable;
          });
      });
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
    return this.driver.query<any>(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return <NSDatabase.IColumn>{
              ...obj,
              isNullable: !!obj.isNullable ? obj.isNullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              isPk: Boolean(obj.isPk),
              isFk: Boolean(obj.isFk),
            };
          });
      });
  }

  public async getFunctions(): Promise<NSDatabase.IFunction[]> {
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
        } as NSDatabase.IFunction;
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
