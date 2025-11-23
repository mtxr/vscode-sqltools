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
  UPPER(C.DATA_TYPE +
    CASE
      WHEN C.CHARACTER_MAXIMUM_LENGTH = -1
        THEN IIF(C.DATA_TYPE = 'XML', '', '(MAX)')
      WHEN C.CHARACTER_MAXIMUM_LENGTH IS NOT NULL
        THEN '(' + CONVERT(VARCHAR, C.CHARACTER_MAXIMUM_LENGTH) + ')'
      WHEN C.DATETIME_PRECISION IS NOT NULL
        THEN '(' + CONVERT(VARCHAR, C.DATETIME_PRECISION) + ')'
      WHEN C.DATA_TYPE IN ('decimal', 'numeric', 'money')
        THEN '(' + CONVERT(VARCHAR, C.NUMERIC_PRECISION) + ', ' + CONVERT(VARCHAR, C.NUMERIC_SCALE) + ')'
      ELSE ''
    END
  ) + ', ' + IIF(C.IS_NULLABLE = 'YES', 'NULL', 'NOT NULL') AS "detail",
  C.CHARACTER_MAXIMUM_LENGTH AS size,
  C.TABLE_CATALOG AS "database",
  C.TABLE_SCHEMA AS "schema",
  C.COLUMN_DEFAULT AS "defaultValue",
  C.IS_NULLABLE AS "isNullable",
  (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'primary key' THEN 1 ELSE 0 END) as "isPk",
  (CASE WHEN LOWER(TC.CONSTRAINT_TYPE) = 'foreign key' THEN 1 ELSE 0 END) as "isFk"
FROM
  ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "COLUMNS" })}` : 'INFORMATION_SCHEMA.COLUMNS'} C
  LEFT JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "KEY_COLUMN_USAGE" })}` : 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE'} AS KCU ON (
    C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.TABLE_NAME = KCU.TABLE_NAME
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
  )
  LEFT JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "TABLE_CONSTRAINTS" })}` : 'INFORMATION_SCHEMA.TABLE_CONSTRAINTS'} AS TC ON (
    TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
    AND TC.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND TC.TABLE_CATALOG = KCU.TABLE_CATALOG
  )
  JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "TABLES" })}` : 'INFORMATION_SCHEMA.TABLES'} AS T ON C.TABLE_NAME = T.TABLE_NAME
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
FROM ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "TABLES" })}` : 'INFORMATION_SCHEMA.TABLES'} AS T
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
FROM ${p => p.database ? `${escapeTableName({ database: p.database, schema: "information_schema", label: "schemata" })}` : 'information_schema.schemata'}
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
FROM sys.databases
/* WHERE name NOT IN ('master', 'model', 'msdb', 'tempdb') */
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
FROM ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "TABLES" })}` : 'INFORMATION_SCHEMA.TABLES'} AS T
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
  ${p => p.tables[0].database ? `${escapeTableName({ database: p.tables[0].database, schema: "INFORMATION_SCHEMA", label: "COLUMNS" })}` : 'INFORMATION_SCHEMA.COLUMNS'} C
  LEFT JOIN ${p => p.tables[0].database ? `${escapeTableName({ database: p.tables[0].database, schema: "INFORMATION_SCHEMA", label: "KEY_COLUMN_USAGE" })}` : 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE'} AS KCU ON (
    C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.TABLE_NAME = KCU.TABLE_NAME
    AND C.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND C.TABLE_CATALOG = KCU.TABLE_CATALOG
    AND C.COLUMN_NAME = KCU.COLUMN_NAME
  )
  LEFT JOIN ${p => p.tables[0].database ? `${escapeTableName({ database: p.tables[0].database, schema: "INFORMATION_SCHEMA", label: "TABLE_CONSTRAINTS" })}` : 'INFORMATION_SCHEMA.TABLE_CONSTRAINTS'} AS TC ON (
    TC.CONSTRAINT_NAME = KCU.CONSTRAINT_NAME
    AND TC.TABLE_SCHEMA = KCU.TABLE_SCHEMA
    AND TC.TABLE_CATALOG = KCU.TABLE_CATALOG
  )
  JOIN ${p => p.tables[0].database ? `${escapeTableName({ database: p.tables[0].database, schema: "INFORMATION_SCHEMA", label: "TABLES" })}` : 'INFORMATION_SCHEMA.TABLES'} AS T ON C.TABLE_NAME = T.TABLE_NAME
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

const searchFunctionsAndProcedures = (type: ContextValue.FUNCTION | ContextValue.PROCEDURE): IBaseQueries['searchFunctions'] => queryFactory`
SELECT
  ${p => p.search ? `TOP ${p.limit || 100}` : ''}
  '${type}' AS "type",
  f.specific_name AS "name",
  f.specific_name AS "label",
  f.specific_schema AS "schema",
  f.specific_catalog AS "database",
  calc.quoted_signature AS "signature",
  COALESCE(STUFF(p.args, 1, 2, N''), N'') AS "args",
  f.data_type AS "resultType",
  '(' + COALESCE(STUFF(p.args, 1, 2, N''), N'') + ')' AS "detail",
  '${type.slice(11)}' AS "iconName",
  '${ContextValue.NO_CHILD}' AS "childType"
FROM ${p => p.parent ? `${escapeTableName({ database: p.parent.database, schema: "INFORMATION_SCHEMA", label: "ROUTINES" })}` : 'INFORMATION_SCHEMA.ROUTINES'} AS f
  CROSS APPLY (SELECT
    CONCAT(
      f.specific_catalog, '.',
      f.specific_schema, '.',
      f.specific_name
    ) AS "signature",
    CONCAT(
      QUOTENAME(f.specific_catalog), '.',
      QUOTENAME(f.specific_schema), '.',
      QUOTENAME(f.specific_name)
    ) AS "quoted_signature"
  ) AS calc
  OUTER APPLY (
    SELECT ', ' + pm.data_type
    FROM ${p => p.parent ? `${escapeTableName({ database: p.parent.database, schema: "INFORMATION_SCHEMA", label: "PARAMETERS" })}` : 'INFORMATION_SCHEMA.PARAMETERS'} AS pm
    WHERE pm.specific_name = f.specific_name
      AND pm.specific_schema = f.specific_schema
      AND pm.specific_catalog = f.specific_catalog
    ORDER BY pm.ORDINAL_POSITION
    FOR XML PATH('')
  ) AS p (args)
WHERE
  f.routine_schema NOT IN (
    'information_schema',
    'performance_schema',
    'mysql',
    'sys'
  )
  AND CHARINDEX(LOWER(f.routine_type), '${type}') > 0 
  ${p => p.search ? `AND LOWER(f.specific_name) LIKE '%${p.search}%'` : 
    p.parent ? `AND f.specific_schema = '${p.parent.schema}'` : ''
  }
ORDER BY
  f.specific_name;
`;

export const searchFunctions: IBaseQueries['searchFunctions'] = searchFunctionsAndProcedures(ContextValue.FUNCTION);
export const searchProcedures: IBaseQueries['searchFunctions'] = searchFunctionsAndProcedures(ContextValue.PROCEDURE);

export const searchIndexes: IBaseQueries['searchIndexes'] = queryFactory`
SELECT
  ${p => p.search ? `TOP ${p.limit || 100}` : ''}
  '${ContextValue.INDEX}' AS "type",
  ix.name AS "name",
  ix.name AS "label",
  CONCAT(
    '(', LOWER(ix.type_desc COLLATE database_default), ', ',
    IIF(ix.is_unique = 1, '', 'non-'), 'unique)'
  ) AS "detail",
  CASE
    WHEN ix.is_primary_key = 1 THEN 'pk'
    WHEN ix.is_unique = 1 THEN 'index-uq'
    ELSE 'index'
  END AS "iconName"
FROM ${p => p.parent ? escapeTableName({ database: p.parent.database, schema: 'sys', label: 'indexes' }) : 'sys.indexes'} AS ix
JOIN ${p => p.parent ? escapeTableName({ database: p.parent.database, schema: 'sys', label: 'tables' }) : 'sys.tables'} AS tb
  ON tb.object_id = ix.object_id
WHERE ix.name IS NOT NULL
  ${p => p.search ?
    `AND LOWER(ix.name) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ?
      `AND OBJECT_NAME(ix.object_id, db_id('${p.parent.database}')) = '${p.parent.label}'
      AND OBJECT_SCHEMA_NAME(ix.object_id, db_id('${p.parent.database}')) = '${p.parent.schema}'`
      : ''
  }
ORDER BY
  ix.name
`;

export const searchTriggers: IBaseQueries['searchTriggers'] = queryFactory`
SELECT
  ${p => p.search ? `TOP ${p.limit || 100}` : ''}
  '${ContextValue.TRIGGER}' AS "type",
  tr.name AS "name",
  tr.name AS "label"
FROM (
  SELECT name COLLATE DATABASE_DEFAULT AS "name", parent_class, parent_id
  FROM ${p => p.parent ? escapeTableName({ database: p.parent.database, schema: 'sys', label: 'triggers' }) : 'sys.triggers'}
  UNION
  SELECT name COLLATE DATABASE_DEFAULT AS "name", parent_class, parent_id
  FROM sys.server_triggers
) AS tr
WHERE 1=1
  ${p => p.search ?
    `AND LOWER(tr.name) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ?
      (p.parent.type === ContextValue.DATABASE ? 'AND tr.parent_class = 0' :
        `AND OBJECT_NAME(tr.parent_id, db_id('${p.parent.database}')) = '${p.parent.label}'
        AND OBJECT_SCHEMA_NAME(tr.parent_id, db_id('${p.parent.database}')) = '${p.parent.schema}'`) :
      'AND tr.parent_class = 100'
  }
ORDER BY
  tr.name
`;
