export interface DialectQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchFunctions?: string;
  [id: string]: string;
}

export enum DatabaseDialect {
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
