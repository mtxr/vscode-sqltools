import DatabaseInterface from './../interface/database-interface';
export interface ConnectionDialect {
  connection: any;
  open(): Promise<any>;
  close(): Promise<any>;
  getTables(): Promise<DatabaseInterface.Table[]>;
  getColumns(): Promise<DatabaseInterface.TableColumn[]>;
  describeTable(tableName: string): Promise<any>;
  showRecords(tableName: string, limit: number): Promise<any>;
  query(query: string): Promise<any>;
}
