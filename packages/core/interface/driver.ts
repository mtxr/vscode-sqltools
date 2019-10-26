export interface DriverQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchFunctions?: string;
  [id: string]: string;
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
