import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: 'SP_COLUMNS :table',
  fetchColumns: `SELECT TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName,
        DATA_TYPE AS type,
        CHARACTER_MAXIMUM_LENGTH AS size,
        TABLE_SCHEMA as tableSchema,
        TABLE_CATALOG AS tableCatalog,
        DB_NAME() as dbName,
        COLUMN_DEFAULT as defaultValue,
        IS_NULLABLE as isNullable
      FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_CATALOG= DB_NAME()`,
  fetchRecords: 'SELECT TOP :limit * FROM :table',
  fetchTables: `SELECT
        C.TABLE_NAME AS tableName,
        C.TABLE_SCHEMA AS tableSchema,
        C.TABLE_CATALOG AS tableCatalog,
        (CASE WHEN T.TABLE_TYPE = 'VIEW' THEN 1 ELSE 0 END) AS isView,
        DB_NAME() AS dbName,
        COUNT(1) AS numberOfColumns
      FROM
        INFORMATION_SCHEMA.COLUMNS AS C
        JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
        AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
        AND C.TABLE_CATALOG = T.TABLE_CATALOG
      GROUP by
        C.TABLE_NAME,
        C.TABLE_SCHEMA,
        C.TABLE_CATALOG,
        T.TABLE_TYPE
      ORDER BY
        C.TABLE_NAME;`,
} as DialectQueries;