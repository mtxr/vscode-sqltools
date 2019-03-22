export interface DialectQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns?: string;
  fetchRecords: string;
  [id: string]: string;
}

export enum DatabaseDialect {
  MSSQL = 'MSSQL',
  MySQL = 'MySQL',
  PostgreSQL = 'PostgreSQL',
  SQLite = 'SQLite',
  OracleDB = 'OracleDB'
}
