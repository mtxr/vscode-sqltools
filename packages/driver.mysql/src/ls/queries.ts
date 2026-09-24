import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import { IBaseQueries, ContextValue, NSDatabase } from '@sqltools/types';

function escapeTableName(table: Partial<NSDatabase.ITable> | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <NSDatabase.ITable>{ label: table } : table;
  tableObj.schema && items.push(`\`${tableObj.schema}\``);
  items.push(`\`${tableObj.label}\``);
  return items.join('.');
}

export const describeTable: IBaseQueries['describeTable'] = queryFactory`
  DESCRIBE ${p => escapeTableName(p)}
`;

export const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory/*sql*/`
SELECT
  C.COLUMN_NAME AS label,
  '${ContextValue.COLUMN}' as "type",
  C.TABLE_NAME AS "table",
  C.DATA_TYPE AS "dataType",
  CAST(C.CHARACTER_MAXIMUM_LENGTH AS UNSIGNED) AS size,
  CAST(UPPER(
    CONCAT(
      C.DATA_TYPE,
      CASE
        WHEN C.DATA_TYPE NOT LIKE '%text' AND C.CHARACTER_MAXIMUM_LENGTH IS NOT NULL
          THEN CONCAT('(', CONVERT(C.CHARACTER_MAXIMUM_LENGTH, CHAR), ')')
        WHEN C.DATETIME_PRECISION IS NOT NULL
          THEN CONCAT('(', CONVERT(C.DATETIME_PRECISION, CHAR), ')')
        WHEN C.DATA_TYPE IN ('decimal')
          THEN CONCAT('(', CONVERT(C.NUMERIC_PRECISION, CHAR), ', ', CONVERT(C.NUMERIC_SCALE, CHAR), ')')
        ELSE ''
      END,
      ', ',
      CASE WHEN C.IS_NULLABLE = 'YES' THEN 'NULL' ELSE 'NOT NULL' END
    )
  ) AS CHAR CHARACTER SET utf8) AS "detail",
  C.TABLE_CATALOG AS "catalog",
  C.TABLE_SCHEMA AS "database",
  C.TABLE_SCHEMA AS "schema",
  C.COLUMN_DEFAULT AS "defaultValue",
  C.IS_NULLABLE AS "isNullable",
  (CASE WHEN C.COLUMN_KEY = 'PRI' THEN 1 ELSE 0 END) AS "isPk",
  (CASE WHEN KCU.REFERENCED_COLUMN_NAME IS NULL THEN 0 ELSE 1 END) AS "isFk"
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ON (
    C.TABLE_NAME = KCU.TABLE_NAME
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    ${p => p.catalog ? 'AND C.TABLE_CATALOG = KCU.TABLE_CATALOG' : ''}
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
  )
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  ${p => p.catalog ? 'AND C.TABLE_CATALOG = T.TABLE_CATALOG' : ''}
WHERE
  C.TABLE_SCHEMA = '${p => p.schema}'
  AND C.TABLE_NAME = '${p => p.label}'
  ${p => p.catalog ? `AND C.TABLE_CATALOG = '${p.catalog}'` : ''}
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
`;

export const fetchRecords: IBaseQueries['fetchRecords'] = queryFactory`
SELECT *
FROM ${p => escapeTableName(p.table)}
LIMIT ${p => p.limit || 50}
OFFSET ${p => p.offset || 0};
`;

export const countRecords: IBaseQueries['countRecords'] = queryFactory`
SELECT count(1) AS total
FROM ${p => escapeTableName(p.table)}
`;

export const fetchFunctions: IBaseQueries['fetchFunctions'] = queryFactory`
;`;

const fetchTablesAndViews = (type: ContextValue, tableType = 'BASE TABLE'): IBaseQueries['fetchTables'] => queryFactory`
SELECT
  T.TABLE_NAME AS label,
  '${type}' as type,
  T.TABLE_SCHEMA AS "schema",
  T.TABLE_SCHEMA AS "database",
  T.TABLE_CATALOG AS "catalog",
  ${type === ContextValue.VIEW ? 1 : 0} AS isView
FROM
  INFORMATION_SCHEMA.TABLES AS T
WHERE
  T.TABLE_SCHEMA = '${p => p.database}'
  ${p => p.catalog ? `AND T.TABLE_CATALOG = '${p.catalog}'` : ''}
  AND UPPER(T.TABLE_TYPE) = '${tableType.toUpperCase()}'
ORDER BY
  T.TABLE_NAME
`;

export const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
export const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW, 'VIEW');

export const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
SELECT
  schema_name as "label",
  schema_name as "database",
  catalog_name as "catalog",
  '${ContextValue.DATABASE}' as "type",
  'database' as "detail"
FROM information_schema.schemata
WHERE schema_name NOT IN ('information_schema', 'performance_schema', 'sys', 'mysql')
    OR schema_name = '${p => p.database}'
ORDER BY
  schema_name <> '${p => p.database}', 
  schema_name
`;

export const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT
  T.TABLE_NAME AS label,
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN '${ContextValue.TABLE}' ELSE '${ContextValue.VIEW}' END) as type,
  T.TABLE_SCHEMA AS "schema",
  T.TABLE_SCHEMA AS "database",
  T.TABLE_CATALOG AS "catalog",
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN 0 ELSE 1 END) AS "isView",
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN 'table' ELSE 'view' END) AS description,
  CONCAT(T.TABLE_SCHEMA, '.', T.TABLE_NAME) AS detail
FROM
  INFORMATION_SCHEMA.TABLES AS T
WHERE
  T.TABLE_SCHEMA NOT IN ('information_schema', 'performance_schema', 'sys', 'mysql')
  ${p => p.search ? `AND (
    CONCAT(T.TABLE_SCHEMA, '.', T.TABLE_NAME) LIKE '%${p.search}%'
    OR CONCAT('"', T.TABLE_SCHEMA, '"."', T.TABLE_NAME, '"') LIKE '%${p.search}%'
    OR T.TABLE_NAME LIKE '%${p.search}%'
  )` : ''}
ORDER BY
  T.TABLE_NAME
LIMIT ${p => p.limit || 100};
`;

export const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT
  C.COLUMN_NAME AS label,
  '${ContextValue.COLUMN}' as "type",
  C.TABLE_NAME AS "table",
  C.DATA_TYPE AS "dataType",
  CAST(C.CHARACTER_MAXIMUM_LENGTH AS UNSIGNED) AS size,
  C.TABLE_CATALOG AS "catalog",
  C.TABLE_SCHEMA AS "database",
  C.TABLE_SCHEMA AS "schema",
  C.COLUMN_DEFAULT AS "defaultValue",
  C.IS_NULLABLE AS "isNullable",
  (CASE WHEN C.COLUMN_KEY = 'PRI' THEN 1 ELSE 0 END) AS "isPk",
  (CASE WHEN KCU.REFERENCED_COLUMN_NAME IS NULL THEN 0 ELSE 1 END) AS "isFk"
FROM
  INFORMATION_SCHEMA.COLUMNS AS C
  LEFT JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU ON (
    C.TABLE_NAME = KCU.TABLE_NAME
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
    AND (C.TABLE_CATALOG IS NULL OR C.TABLE_CATALOG = KCU.TABLE_CATALOG)
  )
  JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND (C.TABLE_CATALOG IS NULL OR C.TABLE_CATALOG = T.TABLE_CATALOG)
WHERE
  C.TABLE_SCHEMA NOT IN ('information_schema', 'performance_schema', 'sys', 'mysql')
  ${p => p.tables.filter(t => !!t.label).length
    ? `AND LOWER(C.TABLE_NAME) IN (${p.tables.filter(t => !!t.label).map(t => `'${t.label}'`.toLowerCase()).join(', ')})`
    : ''
  }
  ${p => p.search
    ? `AND (
      CONCAT(C.TABLE_NAME, '.', C.COLUMN_NAME) LIKE '%${p.search}%'
      OR C.COLUMN_NAME LIKE '%${p.search}%'
    )`
    : ''
  }
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
LIMIT ${p => p.limit || 100}

`;

const searchFunctionsAndProcedures = (type: ContextValue.FUNCTION | ContextValue.PROCEDURE): IBaseQueries['searchFunctions'] => queryFactory`
SELECT
  '${type}' AS "type",
  f.ROUTINE_NAME AS "name",
  f.ROUTINE_NAME AS "label",
  '' AS "schema",
  f.ROUTINE_SCHEMA AS "database",
  f.ROUTINE_NAME AS signature,
  p.args AS "args",
  f.data_type AS "resultType",
  CONCAT('(', IFNULL(p.args, ''), ')')  AS "detail",
  '${type.slice(11)}' AS "iconName",
  '${ContextValue.NO_CHILD}' AS "childType"
FROM INFORMATION_SCHEMA.ROUTINES AS f
LEFT JOIN (
	SELECT
	  SPECIFIC_SCHEMA,
    SPECIFIC_NAME,
    TRIM(GROUP_CONCAT(' ', DATA_TYPE)) AS "args"
	FROM INFORMATION_SCHEMA.PARAMETERS
  WHERE ORDINAL_POSITION > 0
	GROUP BY
      SPECIFIC_SCHEMA,
      SPECIFIC_NAME
) AS p
  ON p.SPECIFIC_SCHEMA = f.ROUTINE_SCHEMA
  AND p.SPECIFIC_NAME = f.ROUTINE_NAME
WHERE
  f.routine_schema NOT IN (
    'information_schema',
    'performance_schema',
    'mysql',
    'sys'
  )
  AND LOCATE(LOWER(f.ROUTINE_TYPE), '${type}') > 0 
  ${p => p.search ? `AND LOWER(f.SPECIFIC_NAME) LIKE '%${p.search}%'` :
    p.parent ? `AND f.ROUTINE_SCHEMA = '${p.parent.database}'` : ''
  }
ORDER BY
  f.ROUTINE_NAME;
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

export const searchFunctions: IBaseQueries['searchFunctions'] = searchFunctionsAndProcedures(ContextValue.FUNCTION);
export const searchProcedures: IBaseQueries['searchFunctions'] = searchFunctionsAndProcedures(ContextValue.PROCEDURE);

export const searchIndexes: IBaseQueries['searchIndexes'] = queryFactory`
SELECT
  DISTINCT
  '${ContextValue.INDEX}' AS "type",
  ix.INDEX_NAME AS "name",
  ix.INDEX_NAME AS "label",
  CONCAT(
    '(',
    CASE WHEN ix.NON_UNIQUE THEN 'non-' ELSE '' END, 'unique',
    ')'
  ) AS "detail",
  CASE
    WHEN ix.INDEX_NAME = 'PRIMARY' THEN 'pk'
    WHEN NOT ix.NON_UNIQUE THEN 'index-uq'
    ELSE 'index'
  END AS "iconName",
  '${ContextValue.NO_CHILD}' AS "childType"
FROM INFORMATION_SCHEMA.STATISTICS AS ix
WHERE 1=1
  ${p => p.search ?
    `AND LOWER(ix.INDEX_NAME) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ?
      `AND ix.TABLE_NAME = '${p.parent.label}'
      AND ix.TABLE_SCHEMA = '${p.parent.database}'`
      : ''
  }
ORDER BY
  "name"
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

export const searchTriggers: IBaseQueries['searchTriggers'] = queryFactory`
SELECT
  '${ContextValue.TRIGGER}' AS "type",
  tr.TRIGGER_NAME AS "name",
  tr.TRIGGER_NAME AS "label"
FROM INFORMATION_SCHEMA.TRIGGERS AS tr
WHERE 1=1
  ${p => p.search ? `AND LOWER(tr.TRIGGER_NAME) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ? `
    AND tr.EVENT_OBJECT_TABLE = '${p.parent.label}'
    AND tr.EVENT_OBJECT_SCHEMA = '${p.parent.database}'` : ''
  }
ORDER BY
  tr.TRIGGER_NAME
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

export const fetchTableDefinition: IBaseQueries['fetchTableDefinition'] = queryFactory`
SHOW CREATE TABLE \`${item => item.label}\`
`;

export const fetchViewDefinition: IBaseQueries['fetchViewDefinition'] = queryFactory`
SHOW CREATE VIEW \`${item => item.label}\`
`;

export const fetchFunctionDefinition: IBaseQueries['fetchFunctionDefinition'] = queryFactory`
SHOW CREATE FUNCTION \`${item => item.label}\`
`;

export const fetchProcedureDefinition: IBaseQueries['fetchProcedureDefinition'] = queryFactory`
SHOW CREATE PROCEDURE \`${item => item.label}\`
`;

export const fetchTriggerDefinition: IBaseQueries['fetchTriggerDefinition'] = queryFactory`
SHOW CREATE TRIGGER \`${item => item.label}\`
`;

export const fetchForeignKeys: IBaseQueries['fetchForeignKeys'] = queryFactory`
SELECT
  KCU.CONSTRAINT_NAME AS "constraintName",
  KCU.TABLE_SCHEMA AS "sourceTableSchema",
  KCU.TABLE_NAME AS "sourceTableName",
  KCU.COLUMN_NAME AS "sourceColumnName",
  KCU.REFERENCED_TABLE_SCHEMA AS "targetTableSchema",
  KCU.REFERENCED_TABLE_NAME AS "targetTableName",
  KCU.REFERENCED_COLUMN_NAME AS "targetColumnName"
FROM
  INFORMATION_SCHEMA.KEY_COLUMN_USAGE AS KCU
WHERE
  KCU.REFERENCED_TABLE_NAME IS NOT NULL
  AND KCU.TABLE_SCHEMA = '${p => p.schema}'
ORDER BY
  KCU.TABLE_NAME,
  KCU.COLUMN_NAME
`;