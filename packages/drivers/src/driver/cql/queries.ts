import { IBaseQueries } from '@sqltools/types';

export default {
  describeTable: `
    SELECT * FROM system_schema.tables
    WHERE keyspace_name = ':keyspace'
    AND table_name = ':table'`,
  fetchColumns: `
    SELECT keyspace_name, table_name,
    column_name, kind, type
    FROM system_schema.columns`,
  fetchRecords: `SELECT * FROM :keyspace.:table LIMIT :limit`,
  fetchTables: `
    SELECT keyspace_name, table_name
    FROM system_schema.tables;
    SELECT keyspace_name, table_name
    FROM system_schema.columns`,
  fetchFunctions: `
    SELECT keyspace_name, function_name,
    argument_names, argument_types,
    return_type, body
    FROM system_schema.functions`,
} as IBaseQueries;
