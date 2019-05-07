import { DialectQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants';

export default {
  describeTable: `
  SELECT *
  FROM
    TABLE_COLUMNS C
  WHERE
    C.SCHEMA_NAME = ? and C.TABLE_NAME = ?`,
  fetchColumns: `
SELECT
  C.TABLE_NAME AS tableName,
  C.COLUMN_NAME AS columnName,
  C.CS_DATA_TYPE_NAME AS type,
  C.LENGTH AS size,
  '' as tableSchema,
  '' AS tableCatalog,
  '' as dbName,
  C.DEFAULT_VALUE as defaultValue,
  C.IS_NULLABLE as isNullable,
  'table' as constraintType,
  CONCAT( CONCAT( CONCAT(
  'tables${TREE_SEP}',
    C.TABLE_NAME),
  '${TREE_SEP}'),
    C.COLUMN_NAME)
   AS tree
FROM
  TABLE_COLUMNS C
WHERE
  C.SCHEMA_NAME = ?
ORDER BY
  C.TABLE_NAME`,

  fetchRecords: 'SELECT TOP :limit * FROM :table',
  fetchTables: `
SELECT
  A.TABLE_NAME AS tableName,
  '' AS tableSchema,
  '' AS tableCatalog,
  0 AS isView,
  '' AS dbName,
  COUNT(1) AS numberOfColumns,
  CONCAT('tables${TREE_SEP}', A.TABLE_name) AS tree
FROM
  M_CS_TABLES A 
    INNER JOIN 
  M_CS_COLUMNS B 
    ON (A.TABLE_NAME = B.TABLE_NAME AND A.SCHEMA_NAME = B.SCHEMA_NAME)
WHERE 
  A.SCHEMA_NAME = ? 
GROUP BY 
  A.TABLE_NAME`
} as DialectQueries;