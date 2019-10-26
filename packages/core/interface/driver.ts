export interface DriverQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchFunctions?: string;
  [id: string]: string;
}

export enum DatabaseDriver {
  DB2 = 'DB2',
  MSSQL = 'MSSQL',
  MySQL = 'MySQL',
  MariaDB = 'MariaDB',
  PostgreSQL = 'PostgreSQL',
  'AWS Redshift' = 'AWS Redshift',
  SQLite = 'SQLite',
  OracleDB = 'OracleDB',
  SAPHana = 'SAPHana',
  Cassandra = 'Cassandra',
}
