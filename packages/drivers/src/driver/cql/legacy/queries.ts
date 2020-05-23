import { IBaseQueries } from '@sqltools/types';

export default {
  describeTable: `
    SELECT * FROM system.schema_columnfamilies
    WHERE keyspace_name = ':keyspace'
    AND columnfamily_name = ':table'`,
  fetchColumns: `
    SELECT keyspace_name, columnfamily_name AS table_name,
    column_name, type AS kind, validator AS type
    FROM system.schema_columns`,
  fetchRecords: `SELECT * FROM :keyspace.:table LIMIT :limit`,
  fetchTables: `
    SELECT keyspace_name, columnfamily_name AS table_name
    FROM system.schema_columnfamilies;
    SELECT keyspace_name, columnfamily_name AS table_name
    FROM system.schema_columns`,
  fetchFunctions: `
    SELECT keyspace_name, function_name,
    argument_names, argument_types,
    return_type, body
    FROM system.schema_functions`,
} as IBaseQueries;
