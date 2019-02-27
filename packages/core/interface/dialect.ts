export interface DialectQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchDummy?: string;
}

export enum DatabaseDialect {
  MSSQL = 'MSSQL',
  MySQL = 'MySQL',
  PostgreSQL = 'PostgreSQL',
  SQLite = 'SQLite',
  OracleDB = 'OracleDB'
}
