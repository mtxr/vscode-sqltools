import { DialectQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants';

export default {
  describeTable: 'SELECT * FROM pragma_table_info(\':table\') ORDER BY cid ASC',
  fetchColumns: `
SELECT
  M.type || 's' || '${TREE_SEP}' || M.name || '${TREE_SEP}' || C.name AS tree,
  C.*
FROM
  pragma_table_info(':table') AS C
  JOIN sqlite_master M ON M.name = ':table'
ORDER BY
  cid ASC`,
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  fetchTables: `
SELECT
  name AS tableName,
  type,
  type || 's' || '${TREE_SEP}' || name AS tree
FROM
  sqlite_master
WHERE
  (
    type = 'table'
    OR type = 'view'
  )
  AND tableName NOT LIKE 'sqlite_%'
ORDER BY
  name;`,
  listFks: `PRAGMA foreign_key_list(:table);`
} as DialectQueries;