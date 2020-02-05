import { IBaseQueries } from '@sqltools/types';
import { TREE_SEP } from '@sqltools/util/constants';

export default {
  describeTable: `
  SELECT *
  FROM
    TABLE_COLUMNS C
  WHERE
    C.SCHEMA_NAME = ? and C.TABLE_NAME = ?`,
  describeView: `
    SELECT *
    FROM
      VIEW_COLUMNS C
    WHERE
      C.SCHEMA_NAME = ? and C.VIEW_NAME = ?`,
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
  'Table' as constraintType,
  CONCAT( CONCAT( CONCAT(
  'Tables${TREE_SEP}',
    C.TABLE_NAME),
  '${TREE_SEP}'),
    C.COLUMN_NAME)
   AS tree
FROM
  TABLE_COLUMNS C
WHERE
  C.SCHEMA_NAME = ?
  UNION
  SELECT
  D.VIEW_NAME AS tableName,
  D.COLUMN_NAME AS columnName,
  D.CS_DATA_TYPE_NAME AS type,
  D.LENGTH AS size,
  '' as tableSchema,
  '' AS tableCatalog,
  '' as dbName,
  D.DEFAULT_VALUE as defaultValue,
  D.IS_NULLABLE as isNullable,
  'View' as constraintType,
  CONCAT( CONCAT( CONCAT(
  'Views${TREE_SEP}',
    D.VIEW_NAME),
  '${TREE_SEP}'),
    D.COLUMN_NAME)
    AS tree
FROM
  VIEW_COLUMNS D
WHERE
  D.SCHEMA_NAME = ?`,

  fetchRecords: 'SELECT TOP :limit * FROM :table',
  fetchTables: `
  
SELECT
  A.TABLE_NAME AS tableName,
  '' AS tableSchema,
  '' AS tableCatalog,
  0 AS isView,
  '' AS dbName,
  COUNT(1) AS numberOfColumns,
  CONCAT('Tables${TREE_SEP}', A.TABLE_NAME) AS tree
FROM
  TABLE_COLUMNS A
WHERE 
  A.SCHEMA_NAME = ? 
GROUP BY 
  A.TABLE_NAME  
UNION
SELECT
  B.VIEW_NAME AS tableName,
  '' AS tableSchema,
  '' AS tableCatalog,
  1 AS isView,
  '' AS dbName,
  COUNT(1) AS numberOfColumns,
  CONCAT('Views${TREE_SEP}', B.VIEW_NAME) AS tree
FROM
  VIEW_COLUMNS B
WHERE 
  B.SCHEMA_NAME = ? 
GROUP BY 
  B.VIEW_NAME  

`
  
/*  `
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
  A.TABLE_NAME`*/
} as IBaseQueries;