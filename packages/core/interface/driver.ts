export interface QueryThatResults<T = any> extends String {
  resultsIn?: T;
}
export interface DriverQueries {
  fetchRecordsV2?: (params: { limit: number; offset: number; table: string }) => string;
  countRecordsV2?: (params: { table: string }) => QueryThatResults<{ total: number }>;

  // old api
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchFunctions?: string;
  [id: string]: string | ((params: any ) => (string | QueryThatResults));
}

export enum DatabaseDriver {
  'AWS Redshift' = 'AWS Redshift',
  Cassandra = 'Cassandra',
  DB2 = 'DB2',
  MariaDB = 'MariaDB',
  MSSQL = 'MSSQL',
  MySQL = 'MySQL',
  OracleDB = 'OracleDB',
  PostgreSQL = 'PostgreSQL',
  SAPHana = 'SAPHana',
  SQLite = 'SQLite',
}
