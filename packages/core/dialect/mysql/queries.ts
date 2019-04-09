import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: 'DESCRIBE :table',
  fetchColumns: `
SELECT
  C.TABLE_NAME AS tableName,
  C.COLUMN_NAME AS columnName,
  C.DATA_TYPE AS type,
  C.CHARACTER_MAXIMUM_LENGTH AS size,
  C.TABLE_SCHEMA as tableSchema,
  C.TABLE_CATALOG AS tableCatalog,
  DATABASE() as tableDatabase,
  C.COLUMN_DEFAULT as defaultValue,
  C.IS_NULLABLE as isNullable,
  C.ORDINAL_POSITION,
  (
    CASE
      WHEN C.COLUMN_KEY = 'PRI' THEN TRUE
      ELSE FALSE
    END
  ) as isPk,
  (
    CASE
      WHEN KCU.REFERENCED_COLUMN_NAME IS NULL THEN FALSE
      ELSE TRUE
    END
  ) as isFk,
  CONCAT(
    C.TABLE_SCHEMA,
    '/',
    (
      CASE
        WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
        ELSE 'tables'
      END
    ),
    '/',
    C.TABLE_name,
    '/',
    C.COLUMN_NAME
  ) AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ON (
    C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.TABLE_NAME = KCU.TABLE_NAME
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
  )
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  C.TABLE_SCHEMA = DATABASE()
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION`,
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
  DATABASE() AS dbName,
  COUNT(1) AS numberOfColumns,
  CONCAT(
    T.TABLE_SCHEMA,
    '/',
    (
      CASE
        WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
        ELSE 'tables'
      END
    ),
    '/',
    T.TABLE_name
  ) AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  T.TABLE_SCHEMA = DATABASE()
GROUP BY
  T.TABLE_NAME,
  T.TABLE_SCHEMA,
  T.TABLE_CATALOG,
  T.TABLE_TYPE
ORDER BY
  T.TABLE_NAME;`,
  fetchFunctions: `
SELECT
  f.specific_name AS name,
  f.ROUTINE_SCHEMA,
  f.routine_schema,
  concat(
    case
      WHEN routine_schema REGEXP '[^0-9a-zA-Z$_]' then concat('\`', routine_schema, '\`')
      ELSE routine_schema
    end,
    '.',
    case
      WHEN routine_name REGEXP '[^0-9a-zA-Z$_]' then concat('\`', routine_name, '\`')
      ELSE routine_name
    end,
    concat('(', GROUP_CONCAT(p.data_type), ')')
  ) as signature,
  GROUP_CONCAT(p.data_type) as args,
  f.data_type AS resultType,
  CONCAT(
    f.routine_schema,
    '/functions/',
    f.specific_name
  ) AS tree,
  f.routine_definition AS source
FROM
  information_schema.routines AS f
  LEFT JOIN information_schema.parameters AS p ON (
    f.specific_name = p.specific_name
    AND f.routine_schema = p.specific_schema
    AND f.routine_catalog = p.specific_catalog
  )
WHERE
  f.routine_schema = DATABASE()
GROUP BY
  f.routine_schema,
  f.routine_catalog,
  f.specific_name,
  f.ROUTINE_DEFINITION,
  f.data_type;`,
} as DialectQueries;