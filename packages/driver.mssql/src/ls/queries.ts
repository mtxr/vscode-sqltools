import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue, NSDatabase } from '@sqltools/types';

function escapeTableName(table: Partial<NSDatabase.ITable> | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <NSDatabase.ITable>{ label: table } : table;
  tableObj.database && items.push(`[${tableObj.database}]`);
  tableObj.schema && items.push(`[${tableObj.schema}]`);
  items.push(`[${tableObj.label}]`);
  return items.join('.');
}

export const describeTable: IBaseQueries['describeTable'] = queryFactory`
SP_COLUMNS @table_name = [${p => p.label}],
  @table_owner = [${p => p.schema}],
  @table_qualifier = [${p => p.database}]
`;
export const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT
  C.COLUMN_NAME AS label,
  '${ContextValue.COLUMN}' as "type",
  C.TABLE_NAME AS "table",
  C.DATA_TYPE AS "dataType",
  UPPER(C.DATA_TYPE + (
    CASE WHEN C.CHARACTER_MAXIMUM_LENGTH > 0 THEN (
      '(' + CONVERT(VARCHAR, C.CHARACTER_MAXIMUM_LENGTH) + ')'
    ) ELSE '' END
  )) AS "detail",
  C.CHARACTER_MAXIMUM_LENGTH AS size,
  C.TABLE_CATALOG AS "database",
  C.TABLE_SCHEMA AS "schema",
  C.COLUMN_DEFAULT AS "defaultValue",
  C.IS_NULLABLE AS "isNullable",
  (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'primary key' THEN 1 ELSE 0 END) as "isPk",
  (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'foreign key' THEN 1 ELSE 0 END) as "isFk"
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
  C.TABLE_SCHEMA = '${p => p.schema}'
  AND C.TABLE_NAME = '${p => p.label}'
  AND C.TABLE_CATALOG = '${p => p.database}'
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
`;

export const fetchRecords: IBaseQueries['fetchRecords'] = queryFactory`
SELECT *
FROM ${p => escapeTableName(p.table)}
ORDER BY ${p => p.orderCol} ASC
OFFSET ${p => p.offset || 0} ROWS
FETCH NEXT ${p => p.limit || 50} ROWS ONLY;
`;

export const countRecords: IBaseQueries['countRecords'] = queryFactory`
SELECT COUNT(1) AS total
FROM ${p => escapeTableName(p.table)}
`;

const fetchTablesAndViews = (type: ContextValue, tableType = 'BASE TABLE'): IBaseQueries['fetchTables'] => queryFactory`
SELECT
  T.TABLE_NAME AS label,
  '${type}' as "type",
  T.TABLE_SCHEMA AS "schema",
  T.TABLE_CATALOG AS "database",
  CONVERT(BIT, CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN 0 ELSE 1 END) AS "isView"
FROM INFORMATION_SCHEMA.TABLES AS T
WHERE
  T.TABLE_SCHEMA = '${p => p.schema}'
  AND T.TABLE_CATALOG = '${p => p.database}'
  AND T.TABLE_TYPE = '${tableType}'
ORDER BY
  T.TABLE_NAME;
`;

export const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
export const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW, 'VIEW');

export const fetchSchemas: IBaseQueries['fetchSchemas'] = queryFactory`
SELECT
  schema_name AS label,
  schema_name AS "schema",
  '${ContextValue.SCHEMA}' as "type",
  'group-by-ref-type' as "iconId",
  catalog_name as "database"
FROM information_schema.schemata
WHERE
  LOWER(schema_name) NOT IN ('information_schema', 'sys', 'guest')
  AND LOWER(schema_name) NOT LIKE 'db\\_%' ESCAPE '\\'
  AND catalog_name = '${p => p.database}'
ORDER BY
  schema_name;
`;
export const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
SELECT name AS label,
  name AS "database",
  '${ContextValue.DATABASE}' AS "type",
  'database' AS "detail"
FROM MASTER.dbo.sysdatabases
WHERE name NOT IN ('master', 'model', 'msdb', 'tempdb')
`;
export const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT
  T.TABLE_NAME AS label,
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN '${ContextValue.TABLE}' ELSE '${ContextValue.VIEW}' END) as type,
  T.TABLE_SCHEMA AS "schema",
  T.TABLE_CATALOG AS "database",
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN 0 ELSE 1 END) AS "isView",
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN 'table' ELSE 'view' END) AS description,
  ('[' + T.TABLE_CATALOG + '].[' + T.TABLE_SCHEMA + '].[' + T.TABLE_NAME + ']') as detail
FROM INFORMATION_SCHEMA.TABLES AS T
WHERE
  LOWER(T.TABLE_SCHEMA) NOT IN ('information_schema', 'sys', 'guest')
  AND LOWER(T.TABLE_SCHEMA) NOT LIKE 'db\\_%' ESCAPE '\\'
  ${p => p.search ? `AND (
    LOWER(T.TABLE_CATALOG + '.' + T.TABLE_SCHEMA + '.' + T.TABLE_NAME) LIKE '%${p.search.toLowerCase()}%'
    OR LOWER('[' + T.TABLE_CATALOG + '].[' + T.TABLE_SCHEMA + '].[' + T.TABLE_NAME + ']') LIKE '%${p.search.toLowerCase()}%'
    OR LOWER(T.TABLE_NAME) LIKE '%${p.search}%'
  )` : ''}
ORDER BY
  T.TABLE_NAME
OFFSET 0 ROWS
FETCH NEXT ${p => p.limit || 100} ROWS ONLY
`;

export const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT
  C.COLUMN_NAME AS label,
  '${ContextValue.COLUMN}' as "type",
  C.TABLE_NAME AS "table",
  C.DATA_TYPE AS "dataType",
  C.CHARACTER_MAXIMUM_LENGTH AS size,
  C.TABLE_CATALOG AS "database",
  C.TABLE_SCHEMA AS "schema",
  C.COLUMN_DEFAULT AS "defaultValue",
  C.IS_NULLABLE AS "isNullable",
  (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'primary key' THEN 1 ELSE 0 END) as "isPk",
  (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'foreign key' THEN 1 ELSE 0 END) as "isFk"
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
WHERE LOWER(C.TABLE_SCHEMA) NOT IN ('information_schema', 'sys', 'guest')
  AND LOWER(C.TABLE_SCHEMA) NOT LIKE 'db\\_%' ESCAPE '\\'
  ${p => p.tables.filter(t => !!t.label).length
    ? `AND LOWER(C.TABLE_NAME) IN (${p.tables.filter(t => !!t.label).map(t => `'${t.label}'`.toLowerCase()).join(', ')})`
    : ''
  }
  ${p => p.search
    ? `AND (
      (C.TABLE_NAME + '.' + C.COLUMN_NAME) LIKE '%${p.search}%'
      OR C.COLUMN_NAME LIKE '%${p.search}%'
    )`
    : ''
  }
ORDER BY C.TABLE_NAME,
  C.ORDINAL_POSITION
OFFSET 0 ROWS
FETCH NEXT ${p => p.limit || 100} ROWS ONLY
`;


// export default {
//   fetchFunctions: `
// SELECT
//   f.specific_name AS name,
//   f.routine_schema AS dbSchema,
//   f.routine_catalog AS dbName,
//   (
//     ISNULL(f.routine_schema, '') +
//     ISNULL('.', '') +
//     ISNULL(f.routine_name, '')
//   ) as signature,
//   COALESCE(STUFF(
//     (ISNULL(', ' + p.data_type, '')), 1, 2, N''
//   ), N'') AS args,
//   f.data_type AS resultType,
//   (
//     ISNULL(f.routine_catalog, '') +
//     ISNULL('${TREE_SEP}', '') +
//     ISNULL(f.routine_schema, '') +
//     ISNULL('${TREE_SEP}', '') +
//     (
//       CASE
//         WHEN f.routine_type = 'PROCEDURE' THEN 'procedures'
//         ELSE 'functions'
//       END
//     ) +
//     ISNULL('${TREE_SEP}', '') +
//     ISNULL(f.specific_name, '')
//   ) AS tree
// FROM
//   information_schema.routines AS f
//   LEFT JOIN information_schema.parameters AS p ON (
//     f.specific_name = p.specific_name
//     AND f.routine_schema = p.specific_schema
//     AND f.routine_catalog = p.specific_catalog
//   )
// WHERE
//   f.routine_schema NOT IN (
//     'information_schema',
//     'performance_schema',
//     'mysql',
//     'sys'
//   )
// GROUP BY
//   f.routine_catalog,
//   f.specific_name,
//   f.routine_schema,
//   f.routine_name,
//   f.data_type,
//   f.routine_type,
//   p.data_type
// ORDER BY
//   f.specific_name;
// `
// } as IBaseQueries;
