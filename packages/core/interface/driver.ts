export interface DriverQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchRecordsV2: (params: { limit: number; offset: number; table: string }) => string;
  fetchFunctions?: string;
  [id: string]: string | Function;
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
