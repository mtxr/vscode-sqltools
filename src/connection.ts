import Dialects from './api/dialect';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import { ConnectionDialect } from './api/interface/connection-dialect';
export default class Connection {
  private tables: string[] = [];
  private connection: ConnectionDialect;
  constructor(public credentials: ConnectionCredentials) {
    const dialectClass = Dialects.getClass(this.credentials.dialect);
    this.connection = new Dialects[dialectClass](credentials);
  }

  public close() {
    return this.connection.close();
  }

  public open() {
    return this.connection.open();
  }

  public getTables(cached: boolean = false) {
    if (cached && this.tables.length > 0) {
      return Promise.resolve(this.tables);
    }
    return this.connection.getTables().then((tables) => {
      this.tables = tables;
      return tables;
    });
  }

  public describeTable(tableName: string): Promise<any> {
    return this.connection.describeTable(tableName);
  }

  public query(query: string): Promise<any> {
    return this.connection.query(query);
  }
}
