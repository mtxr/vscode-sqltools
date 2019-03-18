import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: 'PRAGMA table_info(:table)',
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  fetchTables: `SELECT
      name AS tableName,
      type
    FROM
      sqlite_master
    WHERE type = 'table' OR type = 'view'
    ORDER BY
      name;`,
} as DialectQueries;