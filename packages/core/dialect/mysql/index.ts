import {
  ConnectionDialect,
  ConnectionInterface,
} from '@sqltools/core/interface';
import GenericDialect from '@sqltools/core/dialect/generic';
import Queries from './queries';
import MySQLX from './xprotocol';
import MySQLDefault from './default';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
export default class MySQL extends GenericDialect<any> implements ConnectionDialect {
  queries = Queries;
  private driver: GenericDialect<any>;

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

  private version55Older: boolean;

  public async getFunctions(): Promise<DatabaseInterface.Function[]> {
    let functions;
    if (this.version55Older === true) {
      functions = await this.driver.query(this.queries.fetchFunctionsV55Older);
    } else {
      try {
        functions = await this.driver.query(this.queries.fetchFunctions);
      } catch (error) {
        functions = await this.driver.query(this.queries.fetchFunctionsV55Older);
        this.version55Older = true;
      }
    }

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
}
