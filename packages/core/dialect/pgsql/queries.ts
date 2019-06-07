import { DialectQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants';

export default {
  describeTable: `SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE
        TABLE_NAME = ':table'
        AND TABLE_CATALOG = ':catalog'
        AND TABLE_SCHEMA = ':schema'`,
  fetchColumns: `
SELECT
  C.TABLE_NAME AS tableName,
  C.COLUMN_NAME AS columnName,
  C.DATA_TYPE AS type,
  C.CHARACTER_MAXIMUM_LENGTH AS size,
  C.TABLE_CATALOG AS tableCatalog,
  C.TABLE_SCHEMA AS tableSchema,
  current_database() as dbName,
  C.COLUMN_DEFAULT AS defaultValue,
  C.IS_NULLABLE AS isNullable,
  TC.constraint_type AS keytype,
  C.TABLE_CATALOG || '${TREE_SEP}' || C.TABLE_SCHEMA  || '${TREE_SEP}' || (
    CASE
      WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
      ELSE 'tables'
    END
  ) || '${TREE_SEP}' || C.TABLE_name || '${TREE_SEP}' || C.COLUMN_NAME AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS C
  LEFT JOIN information_schema.key_column_usage KC ON KC.table_name = C.table_name
  AND KC.table_schema = C.table_schema
  AND KC.column_name = C.column_name
  LEFT JOIN information_schema.table_constraints TC ON KC.table_name = TC.table_name
  AND KC.table_schema = TC.table_schema
  AND KC.constraint_name = TC.constraint_name
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  C.TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
`,
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  fetchTables: `
SELECT
  T.TABLE_NAME AS tableName,
  T.TABLE_SCHEMA AS tableSchema,
  T.TABLE_CATALOG AS tableCatalog,
  (
    CASE
      WHEN T.TABLE_TYPE = 'VIEW' THEN 1
      ELSE 0
    END
  ) AS isView,
  T.TABLE_CATALOG AS dbName,
  COUNT(1) AS numberOfColumns,
  T.TABLE_CATALOG || '${TREE_SEP}' || T.TABLE_SCHEMA || '${TREE_SEP}' || (
    CASE
      WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
      ELSE 'tables'
    END
  ) ||  '${TREE_SEP}' || T.TABLE_name AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  C.TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')
GROUP by
  T.TABLE_NAME,
  T.TABLE_SCHEMA,
  T.TABLE_CATALOG,
  T.TABLE_TYPE
ORDER BY
  T.TABLE_NAME;`,
  fetchFunctions: `
SELECT
  n.nspname AS schema,
  f.proname AS name,
  current_database() AS database,
  quote_ident(n.nspname) || '.' || quote_ident(f.proname) AS signature,
  format_type(f.prorettype, null) AS "resultType",
  oidvectortypes(f.proargtypes) AS args,
  proargnames AS "argsNames",
  current_database() || '${TREE_SEP}' || n.nspname || '${TREE_SEP}' || 'procedures' || '${TREE_SEP}' || f.proname AS tree,
  f.prosrc AS source
FROM
  pg_catalog.pg_proc AS f
  INNER JOIN pg_catalog.pg_namespace AS n on n.oid = f.pronamespace
WHERE
  n.nspname not in ('pg_catalog', 'information_schema')
ORDER BY name
;`,
} as DialectQueries;
