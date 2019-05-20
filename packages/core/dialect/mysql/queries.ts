import { DialectQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants';

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
  C.TABLE_SCHEMA as tableDatabase,
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
    '${TREE_SEP}',
    (
      CASE
        WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
        ELSE 'tables'
      END
    ),
    '${TREE_SEP}',
    C.TABLE_name,
    '${TREE_SEP}',
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
  C.TABLE_SCHEMA NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
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
  T.TABLE_SCHEMA AS dbName,
  COUNT(1) AS numberOfColumns,
  CONCAT(
    T.TABLE_SCHEMA,
    '${TREE_SEP}',
    (
      CASE
        WHEN T.TABLE_TYPE = 'VIEW' THEN 'views'
        ELSE 'tables'
      END
    ),
    '${TREE_SEP}',
    T.TABLE_NAME
  ) AS tree
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  T.TABLE_SCHEMA NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
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
  f.routine_schema AS dbschema,
  f.routine_schema AS dbname,
  concat(
    case
      WHEN f.routine_schema REGEXP '[^0-9a-zA-Z$_]' then concat('\`', f.routine_schema, '\`')
      ELSE f.routine_schema
    end,
    '.',
    case
      WHEN f.routine_name REGEXP '[^0-9a-zA-Z$_]' then concat('\`', f.routine_name, '\`')
      ELSE f.routine_name
    end
  ) as signature,
  GROUP_CONCAT(p.data_type) as args,
  f.data_type AS resultType,
  CONCAT(
    f.routine_schema,
    '${TREE_SEP}',
    'functions',
    '${TREE_SEP}',
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
  f.routine_schema NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
GROUP BY
  f.specific_name,
  f.routine_schema,
  f.routine_name,
  f.data_type,
  f.routine_definition
ORDER BY
  f.specific_name;`,
  fetchFunctionsV55Older: `
SELECT
  f.specific_name AS name,
  f.routine_schema AS dbschema,
  f.routine_schema AS dbname,
  concat(
    case
      WHEN f.routine_schema REGEXP '[^0-9a-zA-Z$_]' then concat('\`', f.routine_schema, '\`')
      ELSE f.routine_schema
    end,
    '.',
    case
      WHEN f.routine_name REGEXP '[^0-9a-zA-Z$_]' then concat('\`', f.routine_name, '\`')
      ELSE f.routine_name
    end
  ) as signature,
  f.data_type AS resultType,
  CONCAT(
    f.routine_schema,
    '${TREE_SEP}',
    'functions',
    '${TREE_SEP}',
    f.specific_name
  ) AS tree,
  f.routine_definition AS source
FROM
  information_schema.routines AS f
WHERE
  f.routine_schema NOT IN ('information_schema', 'performance_schema', 'mysql', 'sys')
GROUP BY
  f.specific_name,
  f.routine_schema,
  f.routine_name,
  f.data_type,
  f.routine_definition
ORDER BY
  f.specific_name;
`
} as DialectQueries;