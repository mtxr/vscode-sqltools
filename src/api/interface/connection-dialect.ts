export interface ConnectionDialect {
  connection: any;
  open(): Promise<any>;
  close(): Promise<any>;
  getTables(): Promise<any>;
  describeTable(tableName: string): Promise<any>;
  query(query: string): Promise<any>;
}
