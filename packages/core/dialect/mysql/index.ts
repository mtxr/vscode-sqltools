import {
  ConnectionDialect,
  DatabaseInterface,
  ConnectionInterface,
} from '@sqltools/core/interface';
import GenericDialect from '@sqltools/core/dialect/generic';
import Queries from './queries';
import MySQLX from './xprotocol';
import MySQLDefault from './default';
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
    return this.driver.getTables();
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.driver.getColumns();
  }
}
