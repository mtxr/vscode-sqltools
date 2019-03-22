import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: 'SELECT * FROM pragma_table_info(\':table\') ORDER BY cid ASC',
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  fetchTables: `SELECT
      name AS tableName,
      type
    FROM
      sqlite_master
    WHERE type = 'table' OR type = 'view'
    ORDER BY
      name;`,
  listFks: `PRAGMA foreign_key_list(:table);`
} as DialectQueries;