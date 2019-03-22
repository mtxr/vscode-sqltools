import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: 'DESCRIBE :table',
  fetchColumns: `SELECT
  DISTINCT
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
  ) as isFk
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ON (
    C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
  )
WHERE
  C.TABLE_SCHEMA = DATABASE()
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION`,
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  fetchTables: `SELECT
        C.TABLE_NAME AS tableName,
        C.TABLE_SCHEMA AS tableSchema,
        C.TABLE_CATALOG AS tableCatalog,
        (CASE WHEN T.TABLE_TYPE = 'VIEW' THEN 1 ELSE 0 END) AS isView,
        DATABASE() AS dbName,
        COUNT(1) AS numberOfColumns
      FROM
        INFORMATION_SCHEMA.COLUMNS AS C
        JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
        AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
        AND C.TABLE_CATALOG = T.TABLE_CATALOG
      WHERE T.TABLE_SCHEMA = DATABASE()
      GROUP by
        C.TABLE_NAME,
        C.TABLE_SCHEMA,
        C.TABLE_CATALOG,
        T.TABLE_TYPE
      ORDER BY
        C.TABLE_NAME;`,
} as DialectQueries;