import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: `SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE table_name = ':table'
        AND TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')`,
  fetchColumns: `SELECT TABLE_NAME AS tableName,
        COLUMN_NAME AS columnName,
        DATA_TYPE AS type,
        CHARACTER_MAXIMUM_LENGTH AS size,
        TABLE_CATALOG AS tableCatalog,
        TABLE_SCHEMA AS tableSchema,
        current_database() as dbName,
        COLUMN_DEFAULT AS defaultValue,
        IS_NULLABLE AS isNullable
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')`,
  fetchRecords: 'SELECT * FROM :table LIMIT :limit',
  fetchTables: `SELECT
        C.TABLE_NAME AS tableName,
        C.TABLE_SCHEMA AS tableSchema,
        C.TABLE_CATALOG AS tableCatalog,
        (CASE WHEN T.TABLE_TYPE = 'VIEW' THEN 1 ELSE 0 END) AS isView,
        CURRENT_DATABASE() AS dbName,
        COUNT(1) AS numberOfColumns
      FROM
        INFORMATION_SCHEMA.COLUMNS AS C
        JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
        AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
        AND C.TABLE_CATALOG = T.TABLE_CATALOG
      WHERE C.TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')
      GROUP by
        C.TABLE_NAME,
        C.TABLE_SCHEMA,
        C.TABLE_CATALOG,
        T.TABLE_TYPE
      ORDER BY
        C.TABLE_NAME;`
} as DialectQueries;
