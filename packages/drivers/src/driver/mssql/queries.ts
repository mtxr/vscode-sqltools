import { IBaseQueries } from '@sqltools/types';
import { TREE_SEP } from '@sqltools/util/constants';

export default {
  describeTable: 'SP_COLUMNS :table',
  fetchColumns: `
SELECT
  C.TABLE_NAME AS tableName,
  C.COLUMN_NAME AS columnName,
  C.DATA_TYPE AS type,
  C.CHARACTER_MAXIMUM_LENGTH AS size,
  C.TABLE_SCHEMA as tableSchema,
  C.TABLE_CATALOG AS tableCatalog,
  DB_NAME() as dbName,
  C.COLUMN_DEFAULT as defaultValue,
  C.IS_NULLABLE as isNullable,
  TC.CONSTRAINT_TYPE as constraintType,
  (
    ISNULL(C.TABLE_CATALOG, '') +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(C.TABLE_SCHEMA, '') +
    ISNULL('${TREE_SEP}', '') +

    (
      CASE
        WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
        ELSE 'tables'
      END
    ) +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(C.TABLE_NAME, '') +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(C.COLUMN_NAME, '')
  ) AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS C
  LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ON (
    C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.TABLE_NAME = KCU.TABLE_NAME
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
  )
  LEFT JOIN INFORMATION_SCHEMA.TABLE_CONSTRAINTS AS TC ON (
    TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
    AND TC.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND TC.TABLE_CATALOG = KCU.TABLE_CATALOG
  )
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  C.TABLE_CATALOG = DB_NAME()
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION`,
  fetchRecords: 'SELECT TOP :limit * FROM :table',
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
  DB_NAME() AS dbName,
  COUNT(1) AS numberOfColumns,
  (
    ISNULL(T.TABLE_CATALOG, '') +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(T.TABLE_SCHEMA, '') +
    ISNULL('${TREE_SEP}', '') +
    (
      CASE
        WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
        ELSE 'tables'
      END
    ) +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(T.TABLE_name, '')
  ) AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
GROUP by
  T.TABLE_NAME,
  T.TABLE_SCHEMA,
  T.TABLE_CATALOG,
  T.TABLE_TYPE
ORDER BY
  T.TABLE_NAME;`,
  fetchFunctions: `
SELECT
  f.specific_name AS name,
  f.routine_schema AS dbSchema,
  f.routine_catalog AS dbName,
  (
    ISNULL(f.routine_schema, '') +
    ISNULL('.', '') +
    ISNULL(f.routine_name, '')
  ) as signature,
  COALESCE(STUFF(
    (ISNULL(', ' + p.data_type, '')), 1, 2, N''
  ), N'') AS args,
  f.data_type AS resultType,
  (
    ISNULL(f.routine_catalog, '') +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(f.routine_schema, '') +
    ISNULL('${TREE_SEP}', '') +
    (
      CASE
        WHEN f.routine_type = 'PROCEDURE' THEN 'procedures'
        ELSE 'functions'
      END
    ) +
    ISNULL('${TREE_SEP}', '') +
    ISNULL(f.specific_name, '')
  ) AS tree
FROM
  information_schema.routines AS f
  LEFT JOIN information_schema.parameters AS p ON (
    f.specific_name = p.specific_name
    AND f.routine_schema = p.specific_schema
    AND f.routine_catalog = p.specific_catalog
  )
WHERE
  f.routine_schema NOT IN (
    'information_schema',
    'performance_schema',
    'mysql',
    'sys'
  )
GROUP BY
  f.routine_catalog,
  f.specific_name,
  f.routine_schema,
  f.routine_name,
  f.data_type,
  f.routine_type,
  p.data_type
ORDER BY
  f.specific_name;
`
} as IBaseQueries;
