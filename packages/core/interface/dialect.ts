export interface DialectQueries {
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
}

export enum DatabaseDialect {
  MSSQL,
  MySQL,
  PostgreSQL,
  SQLite
}
