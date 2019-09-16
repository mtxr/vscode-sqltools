import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: `
    SELECT * FROM system_schema.tables
    WHERE keyspace_name = ':keyspace'
    AND table_name = ':table'`,
  fetchColumns: `SELECT * FROM system_schema.columns`,
  fetchRecords: `SELECT * FROM :keyspace.:table LIMIT :limit`,
  fetchTables: `SELECT * FROM system_schema.tables`,
  fetchFunctions: `SELECT * FROM system_schema.functions`
} as DialectQueries;
