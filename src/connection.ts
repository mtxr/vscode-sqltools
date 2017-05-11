import { History } from './api';
import Dialects from './api/dialect';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import { ConnectionDialect } from './api/interface/connection-dialect';
import DatabaseInterface from './api/interface/database-interface';
export default class Connection {
  private tables: DatabaseInterface.Table[] = [];
  private columns: DatabaseInterface.TableColumn[] = [];
  private connection: ConnectionDialect;
  constructor(private credentials: ConnectionCredentials) {
    this.connection = new Dialects[this.credentials.dialect](credentials);
  }

  public close() {
    return this.connection.close();
  }

  public open() {
    return this.connection.open();
  }

  public getTables(cached: boolean = false): Promise<DatabaseInterface.Table[]> {
    if (cached && this.tables.length > 0) {
      return Promise.resolve(this.tables);
    }
    return this.connection.getTables().then((tables: DatabaseInterface.Table[]) => {
      this.tables = tables;
      return this.tables;
    });
  }

  public getColumns(cached: boolean = false): Promise<DatabaseInterface.TableColumn[]> {
    if (cached && this.columns.length > 0) {
      return Promise.resolve(this.columns);
    }
    return this.connection.getColumns().then((columns: DatabaseInterface.TableColumn[]) => {
      this.columns = columns;
      return this.columns;
    });
  }

  public describeTable(tableName: string): Promise<any> {
    return this.connection.describeTable(tableName);
  }
  public showRecords(tableName: string, limit: number = 10): Promise<any> {
    return this.connection.showRecords(tableName, limit);
  }

  public query(query: string): Promise<any> {
    return this.connection.query(query);
  }
  public getName() {
    return this.credentials.name;
  }
}
