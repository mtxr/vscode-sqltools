import { History, Logger } from './api';
import Dialects from './api/dialect';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import { ConnectionDialect } from './api/interface/connection-dialect';
import DatabaseInterface from './api/interface/database-interface';
import errorHandler from './error-handler';

export default class Connection {
  private tables: DatabaseInterface.Table[] = [];
  private columns: DatabaseInterface.TableColumn[] = [];
  private connected: boolean = false;
  private connection: ConnectionDialect;
  constructor(private credentials: ConnectionCredentials, private logger: Logger) {
    this.connection = new Dialects[this.credentials.dialect](credentials);
  }

  public needsPassword() {
    return this.connection.credentials.askForPassword;
  }

  public connect() {
    return this.query('SELECT 1;')
      .then(() => {
        this.connected = true;
        return true;
      });
  }

  public setPassword(password: string) {
    this.connection.credentials.password = password;
  }

  public isConnected() {
    return this.connected;
  }

  public close() {
    this.connected = false;
    return this.connection.close()
      .catch((e) => {
        errorHandler(this.logger, 'Error closing connection.', e);
      });
  }

  public open() {
    return this.connection.open()
      .catch((e) => {
        errorHandler(this.logger, 'Error connecting to database.', e);
      });
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
