import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: 'DESCRIBE :table;',
  fetchColumns: 'DESCRIBE :table;',
  fetchRecords: 'SELECT * FROM :table LIMIT :limit;',
  fetchTables: 'SHOW TABLES IN :database;',
} as DialectQueries;
