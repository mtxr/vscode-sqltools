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

// NOTE partitioned index not supported
export const fetchTableDefinition: IBaseQueries['fetchTableDefinition'] = queryFactory`
${item => {
  const database = item.database ? `[${item.database}].` : '';
  return `
SELECT
  N'CREATE TABLE ' + ns.label + N' (' + CHAR(10)
  + replace(c.def, '&#x0D;', CHAR(10))
  + replace(isnull(ct.def, ''), '&#x0D;', CHAR(10))
  + isnull(h.system_period_row, '')
  + N')'
  + iif(t.temporal_type = 2,
    ' WITH (' + CHAR(10) + CHAR(9) 
      + 'SYSTEM_VERSIONING = ON (HISTORY_TABLE = ' + h.history_label + ')' + CHAR(10)
      + ')',
    '')
  + ' ON ' + quotename(isnull(fgt.name, 'PRIMARY'))
  + IIF(isnull(fgb.name, 'PRIMARY') != 'PRIMARY', ' TEXTIMAGE_ON ' + quotename(fgb.name), '')
  AS definition
FROM ${database}sys.tables AS t
JOIN ${database}sys.schemas AS s
  ON s.schema_id = t.schema_id
left JOIN ${database}sys.filegroups AS fgb
  ON fgb.data_space_id = t.lob_data_space_id
left JOIN ${database}sys.indexes AS i
  ON i.object_id = t.object_id
  AND i.type = 1  /* clustered index */
left JOIN ${database}sys.filegroups AS fgt
  ON fgt.data_space_id = i.data_space_id
CROSS APPLY (
  SELECT
    concat('${database}', quotename(s.name), '.', quotename(t.name)) AS label
) AS ns
/* collect columns details */
CROSS APPLY (
  SELECT CHAR(9)
    /* column name */
    + quotename(col.name) + ' '
    + CASE
        WHEN col.is_computed = 1 THEN 'AS ' + cpc.definition + iif(cpc.is_persisted = 1, ' PERSISTED', '')
        WHEN col.is_column_set = 1 THEN 'XML COLUMN_SET FOR ALL_SPARSE_COLUMNS'
        else
          /* column type */
          + typ.name
          + CASE
              WHEN typ.name in ('binary', 'varbinary', 'char', 'varchar', 'text')
              THEN '(' + iif(col.max_length = -1, 'max', cast(col.max_length AS varCHAR(5))) + ')'
              WHEN typ.name in ('nchar', 'nvarchar', 'ntext')
              THEN '(' + iif(col.max_length = -1, 'max', cast(col.max_length / 2 AS varCHAR(5))) + ')'
              WHEN typ.name in ('time2', 'datetime2', 'datetimeoffset')
              THEN '(' + cast(col.scale AS varCHAR(5)) + ')'
              WHEN typ.name in ('decimal', 'numeric')
              THEN '(' + cast(col.precision AS varCHAR(5)) + ',' + cast(col.scale AS varCHAR(5)) + ')'
              else ''
            END
          /* collate */
          + isnull(' COLLATE ' + col.collation_name, '')
          /* filestream */
          + iif(col.is_filestream = 1, ' FILESTREAM', '')
          /* sparse */
          + iif(col.is_sparse = 1, ' SPARSE', '')
          /* masked with function */
          + iif(col.is_masked = 1, ' MASKED WITH (FUNCTION = ''' + msc.masking_function + ''')', '')
          /* default */
          + iif(col.generated_always_type = 0, isnull(' DEFAULT ' + dfc.definition, ''), '')
          /* identity */
          + iif(col.is_identity = 1, ' IDENTITY(' + cast(idc.seed_value AS varchar(max)) + ', ' + cast(idc.increment_value AS varchar(max)) + ')', '')
          /* not for replication */
          + iif(idc.is_not_for_replication = 1, ' NOT FOR REPLICATION', '')
          /* generated always */
          + CASE
              WHEN col.generated_always_type = 1 THEN ' GENERATED ALWAYS AS ROW START'
              WHEN col.generated_always_type = 2 THEN ' GENERATED ALWAYS AS ROW END'
              WHEN col.generated_always_type = 5 THEN ' GENERATED ALWAYS AS TRANSACTION ID START'
              WHEN col.generated_always_type = 6 THEN ' GENERATED ALWAYS AS TRANSACTION ID END'
              WHEN col.generated_always_type = 7 THEN ' GENERATED ALWAYS AS SEQUENCE NUMBER START'
              WHEN col.generated_always_type = 8 THEN ' GENERATED ALWAYS AS SEQUENCE NUMBER END'
              else ''
            END
          /* hidden */
          + iif(col.is_hidden = 1, ' HIDDEN', '')
          /* nullable */
          + iif(col.is_nullable = 1, ' NULL', ' NOT NULL')
          /* rowguidcol */
          + iif(col.is_rowguidcol = 1, ' ROWGUIDCOL', '')
          /* encrypted */
          + isnull(' ENCRYPTED WITH (COLUMN_ENCRYPTION_KEY = ' + cek.name + ', ENCRYPTION_TYPE = ' + col.encryption_type_desc + ', ALGORITHM = ''' + col.encryption_algorithm_name + ''')', '')
      END
    /* check constraint */
    + isnull(' CHECK ' + chc.definition, '')
    /* finalize column definition */
    + ',' + CHAR(10)
  FROM ${database}sys.columns AS col
  JOIN ${database}sys.types AS typ
    ON typ.user_type_id = col.user_type_id
  left JOIN ${database}sys.identity_columns AS idc
    ON idc.object_id = col.object_id
    AND idc.column_id = col.column_id
  left JOIN ${database}sys.computed_columns AS cpc
    ON cpc.object_id = col.object_id
    AND cpc.column_id = col.column_id
  left JOIN ${database}sys.masked_columns AS msc
    ON msc.object_id = col.object_id
    AND msc.column_id = col.column_id
  left JOIN ${database}sys.default_constraints AS dfc
    ON dfc.object_id = col.default_object_id
  left JOIN ${database}sys.check_constraints AS chc
    ON chc.parent_object_id = col.object_id
    AND chc.parent_column_id = col.column_id
  left JOIN ${database}sys.column_encryption_keys AS cek
    ON cek.column_encryption_key_id = col.column_encryption_key_id
  WHERE col.object_id = t.object_id
  ORDER BY col.column_id
  FOR XML PATH('')
) AS c (def)
/* collect key constraint details */
OUTER APPLY (
  SELECT CHAR(9)
    + 'CONSTRAINT ' + quotename(kc.name)
    + CASE
        WHEN ix.is_primary_key = 1 THEN ' PRIMARY KEY '
        WHEN ix.is_unique_constraint = 1 THEN ' UNIQUE '
      END + ix.type_desc collate database_default
    + ' (' + stuff(used.columns, 1, 2, '') + ') ' + CHAR(10) + CHAR(9) + CHAR(9)
    + 'WITH ('
    + 'PAD_INDEX = ' + iif(ix.is_padded = 1, 'ON, FILLFACTOR = ' + cast(ix.fill_factor AS varchar(max)), 'OFF') + ', '
    + 'STATISTICS_NORECOMPUTE = ' + iif(st.no_recompute = 1, 'ON', 'OFF') + ', '
    + 'IGNORE_DUP_KEY = ' + iif(ix.ignore_dup_key = 1, 'ON', 'OFF') + ', '
    + 'ALLOW_ROW_LOCKS = ' + iif(ix.allow_row_locks = 1, 'ON', 'OFF') + ', '
    + 'ALLOW_PAGE_LOCKS = ' + iif(ix.allow_page_locks = 1, 'ON', 'OFF')
    + ')' + CHAR(10) + CHAR(9) + CHAR(9)
    + 'ON ' + quotename(fg.name)
    + ',' + CHAR(10)
  FROM ${database}sys.key_constraints AS kc
  JOIN ${database}sys.indexes AS ix
    ON ix.object_id = kc.parent_object_id
    AND ix.index_id = kc.unique_index_id
  JOIN ${database}sys.stats AS st
    ON st.object_id  = ix.object_id 
    AND st.stats_id = ix.index_id
  JOIN ${database}sys.filegroups AS fg
    ON fg.data_space_id = ix.data_space_id
  CROSS APPLY (SELECT
    /* used columns */
    (SELECT
      ', ' + quotename(col.name) + iif(ic.is_descending_key = 1, ' DESC', ' ASC')
    FROM ${database}sys.index_columns AS ic
    JOIN ${database}sys.columns AS col
      ON col.object_id = ic.object_id
      AND col.column_id = ic.column_id
    WHERE ic.object_id = ix.object_id
      AND ic.index_id = ix.index_id
      AND ic.is_included_column = 0
    ORDER BY ic.key_ordinal
    FOR XML PATH(''))
  ) AS used (columns)
  WHERE kc.parent_object_id = t.object_id
  FOR XML PATH('')
) AS ct (def)
/* collect temporal details */
OUTER APPLY (SELECT
  (SELECT CHAR(9)
    + 'PERIOD FOR SYSTEM_TIME (' + quotename(cols.name) + ', ' + quotename(cole.name) + ')' + ',' + CHAR(10)
  FROM ${database}sys.periods AS per
  JOIN ${database}sys.columns AS cols
    ON cols.object_id = per.object_id
    AND cols.column_id = per.start_column_id
  JOIN ${database}sys.columns AS cole
    ON cole.object_id = per.object_id
    AND cole.column_id = per.end_column_id
  WHERE per.object_id = t.object_id) AS system_period_row,
  (SELECT
    concat(quotename(hs.name), '.', quotename(ht.name))
  FROM ${database}sys.tables AS ht
  JOIN ${database}sys.schemas AS hs
    ON hs.schema_id = ht.schema_id
  WHERE ht.object_id = t.history_table_id) AS history_label
) AS h
/* collect foreign keys details */
OUTER APPLY (
  SELECT CHAR(9)
    + 'CONSTRAINT ' + quotename(fk.name) + ' FOREIGN KEY (' + quotename(pcol.name) + ')' +
    + ' REFERENCES ' + quotename(rs.name) + '.' + quotename(rt.name)
    + ' (' + quotename(rcol.name) + ')'
    + ' ON UPDATE ' + replace(fk.update_referential_action_desc, '_', ' ')
    + ' ON DELETE ' + replace(fk.delete_referential_action_desc, '_', ' ')
    + ',' + CHAR(10)
  FROM ${database}sys.foreign_keys AS fk
  JOIN ${database}sys.tables AS rt
    ON rt.object_id = fk.referenced_object_id
  JOIN ${database}sys.schemas AS rs
    ON rs.schema_id = rt.schema_id
  JOIN ${database}sys.foreign_key_columns AS fkc
    ON fkc.constraint_object_id = fk.object_id 
  JOIN ${database}sys.columns AS pcol
    ON pcol.object_id = fkc.parent_object_id 
    AND pcol.column_id = fkc.parent_column_id
  JOIN ${database}sys.columns AS rcol
    ON rcol.object_id = fkc.referenced_object_id 
    AND rcol.column_id = fkc.referenced_column_id
  WHERE fk.parent_object_id = t.object_id
  FOR XML PATH('')
) AS f (def)
WHERE 1=1
  AND s.name = '${item.schema}'
  AND t.name = '${item.label}'
`;}}
`;

export const fetchViewDefinition: IBaseQueries['fetchViewDefinition'] = queryFactory`
SELECT
  VIEW_DEFINITION AS "definition"
FROM ${item => escapeTableName({ database: item.database, schema: 'INFORMATION_SCHEMA', label: 'VIEWS' }) }
WHERE 1=1
  AND TABLE_SCHEMA = '${item => item.schema}'
  AND TABLE_NAME = '${item => item.label}'
`;

const fetchFunctionOrProcedureDefinition: IBaseQueries['fetchFunctionDefinition' | 'fetchFunctionDefinition'] = queryFactory`
SELECT
  ROUTINE_DEFINITION AS "definition"
FROM ${item => escapeTableName({ database: item.database, schema: 'INFORMATION_SCHEMA', label: 'ROUTINES' }) }
WHERE 1=1
  AND ROUTINE_SCHEMA = '${item => item.schema}'
  AND ROUTINE_NAME = '${item => item.label}'
`;
export const fetchFunctionDefinition: IBaseQueries['fetchFunctionDefinition'] = fetchFunctionOrProcedureDefinition;
export const fetchProcedureDefinition: IBaseQueries['fetchProcedureDefinition'] = fetchFunctionOrProcedureDefinition;

export const fetchIndexDefinition: IBaseQueries['fetchIndexDefinition'] = queryFactory`
${item => {
  const database = item.database ? `[${item.database}].` : '';
  return `

SELECT 'CREATE '
  + CASE
      WHEN ix.type = 3 THEN IIF(xmli.xml_index_type = 0, 'PRIMARY ', '')
      ELSE IIF(ix.is_unique = 1, 'UNIQUE ', '')
    END
  + ix.type_desc COLLATE DATABASE_DEFAULT + ' INDEX ' + QUOTENAME(ix.name)
  + ' ON ' + ns.TABLE_PATH + ' '
  + CASE
    /* XML */
    WHEN ix.type = 3 THEN '(' + STUFF(calc.keys, 1, 2, '') + ')'
      + ISNULL(CHAR(10) + 'USING XML INDEX ' + QUOTENAME(xmlu.name) + ' FOR ' + xmli.secondary_type_desc, '')
    /* clustered columnstore */
      WHEN ix.type = 5 THEN ''
      /* nonclustered columnstore */
      WHEN ix.type = 6 THEN '(' + STUFF(calc.includes, 1, 2, '') + ')'
      ELSE '(' + STUFF(calc.keys, 1, 2, '') + ')'
        + ISNULL(' INCLUDE (' + STUFF(calc.includes, 1, 2, '') + ')', '')
  END
  + CHAR(10) + 'WITH ('
  /* options */
  + CASE
      WHEN ix.type = 3 THEN ''
        + 'PAD_INDEX = ' + iif(ix.is_padded = 1, 'ON, FILLFACTOR = ' + cast(ix.fill_factor AS varchar(max)), 'OFF') + ', '
        + 'IGNORE_DUP_KEY = ' + iif(ix.ignore_dup_key = 1, 'ON', 'OFF') + ', '
        + 'ALLOW_ROW_LOCKS = ' + iif(ix.allow_row_locks = 1, 'ON', 'OFF') + ', '
        + 'ALLOW_PAGE_LOCKS = ' + iif(ix.allow_page_locks = 1, 'ON', 'OFF')
      WHEN ix.type IN (5, 6) THEN ''
        + 'COMPRESSION_DELAY = ' + CAST(ix.compression_delay AS VARCHAR(25))
      ELSE ''
        + 'PAD_INDEX = ' + iif(ix.is_padded = 1, 'ON, FILLFACTOR = ' + cast(ix.fill_factor AS varchar(max)), 'OFF') + ', '
        + 'IGNORE_DUP_KEY = ' + iif(ix.ignore_dup_key = 1, 'ON', 'OFF') + ', '
        + 'ALLOW_ROW_LOCKS = ' + iif(ix.allow_row_locks = 1, 'ON', 'OFF') + ', '
        + 'ALLOW_PAGE_LOCKS = ' + iif(ix.allow_page_locks = 1, 'ON', 'OFF') + ', '
        + 'STATISTICS_NORECOMPUTE = ' + iif(st.no_recompute = 1, 'ON', 'OFF') + ', '
        + 'STATISTICS_INCREMENTAL = ' + iif(st.is_incremental = 1, 'ON', 'OFF') + ', '
        + 'OPTIMIZE_FOR_SEQUENTIAL_KEY = ' + iif(ix.optimize_for_sequential_key = 1, 'ON', 'OFF')
    END
  + ')' + CHAR(10)
  /* filegroup */
  + IIF(ix.type != 3, 'ON ' + QUOTENAME(fc.name), '')
  + ISNULL(CHAR(10) + ft.definition, '')
  AS "definition"
FROM ${database}sys.indexes AS ix
JOIN ${database}sys.objects ob ON ob.object_id = ix.object_id
JOIN ${database}sys.filegroups fc ON ix.data_space_id = fc.data_space_id
LEFT JOIN ${database}sys.stats AS st
  ON st.object_id  = ix.object_id 
  AND st.stats_id = ix.index_id
CROSS APPLY (SELECT
  OBJECT_SCHEMA_NAME(ix.object_id, db_id('${item.database}')) AS TABLE_SCHEMA
  ,OBJECT_NAME(ix.object_id, db_id('${item.database}')) AS TABLE_NAME
  ,CONCAT(
      '${database}',
      QUOTENAME(OBJECT_SCHEMA_NAME(ix.object_id, db_id('${item.database}'))), '.',
      QUOTENAME(OBJECT_NAME(ix.object_id, db_id('${item.database}')))
  ) AS TABLE_PATH
) ns
CROSS APPLY (SELECT
  (SELECT ', ' + col.name
    + CASE
      WHEN ix.type IN (3, 5, 6) THEN ''
      ELSE IIF(ic.is_descending_key = 0, ' ASC', ' DESC')
    END
  FROM ${database}sys.index_columns ic
  JOIN ${database}sys.columns col
    ON col.object_id = ic.object_id
    AND col.column_id = ic.column_id
  WHERE ic.is_included_column = 0
    AND ic.object_id = ix.object_id
    AND ic.index_id = ix.index_id
  ORDER BY ic.key_ordinal
  FOR XML PATH('')
  ),
  (SELECT ', ' + col.name
  FROM ${database}sys.index_columns ic
  JOIN ${database}sys.columns col
    ON col.object_id = ic.object_id
    AND col.column_id = ic.column_id
  WHERE ic.is_included_column = 1
    AND ic.object_id = ix.object_id
    AND ic.index_id = ix.index_id
  ORDER BY ic.key_ordinal
  FOR XML PATH('')
  )
) calc (keys, includes)
LEFT JOIN ${database}sys.xml_indexes AS xmli
  ON xmli.index_id = ix.index_id
LEFT JOIN ${database}sys.xml_indexes AS xmlu
  ON xmlu.index_id = xmli.using_xml_index_id
/* FullText */
LEFT JOIN (
  SELECT
    idx.object_id,
    idx.unique_index_id AS "index_id",
    N'CREATE FULLTEXT INDEX ON ' + ns.path + ISNULL(N' (' + STUFF(cl.columns, 1, 2, '') + CHAR(10) + N')', '') + CHAR(10)
      + N'KEY INDEX ' + QUOTENAME(uqx.name)
      + N' ON (' + QUOTENAME(cat.name) + ', FILEGROUP ' + QUOTENAME(fg.name) + N')' + CHAR(10)
      + N'WITH (CHANGE_TRACKING = ' + idx.change_tracking_state_desc
      + N', STOPLIST = '
      + CASE
          WHEN idx.stoplist_id IS NULL THEN N'OFF'
          WHEN idx.stoplist_id = 0 THEN N'SYSTEM'
          ELSE sl.name
      END
      + ISNULL(N', SEARCH PROPERTY LIST = ' + [pl].[name], N'')
      + N')' COLLATE DATABASE_DEFAULT AS "definition"
  FROM ${database}sys.fulltext_indexes AS idx
  JOIN ${database}sys.filegroups AS fg
    ON fg.data_space_id = idx.data_space_id
  JOIN ${database}sys.indexes AS uqx
    ON uqx.object_id = idx.object_id
    AND uqx.index_id = idx.unique_index_id
  JOIN sys.fulltext_catalogs AS cat
    ON cat.fulltext_catalog_id = idx.fulltext_catalog_id
  LEFT JOIN sys.fulltext_stoplists AS sl
    ON sl.stoplist_id = idx.stoplist_id
  LEFT JOIN sys.registered_search_property_lists AS pl
    ON pl.property_list_id = idx.property_list_id
  CROSS APPLY (SELECT
    CONCAT(
      QUOTENAME('${item.parent.database}'), '.'
      ,QUOTENAME(OBJECT_SCHEMA_NAME(idx.object_id, db_id('${item.parent.database}'))), '.'
      ,QUOTENAME(OBJECT_NAME(idx.object_id, db_id('${item.parent.database}')))
    ) AS "path"
  ) AS ns
  CROSS APPLY (
    SELECT
      N', ' + CHAR(10) + CHAR(9) + QUOTENAME(col.name)
        + ISNULL(N' TYPE COLUMN ' + QUOTENAME(tcol.name), N'')
        + ' LANGUAGE ' + CAST(fic.language_id AS VARCHAR(11))
        + IIF(fic.statistical_semantics = 1, ' STATISTICAL_SEMANTICS', N'')
    FROM ${database}sys.fulltext_index_columns AS fic
    JOIN ${database}sys.columns AS col 
      ON col.object_id = fic.object_id
      AND col.column_id = fic.column_id
    LEFT JOIN ${database}sys.columns AS tcol
      ON tcol.object_id = fic.object_id
      AND tcol.column_id = fic.type_column_id
    WHERE fic.object_id = idx.object_id
    FOR XML PATH('')
  ) AS cl (columns)
) AS ft
  ON ft.object_id = ix.object_id
  AND ft.index_id = ix.index_id
WHERE ix.name = '${item.label}'
  AND OBJECT_NAME(ix.object_id, db_id('${item.parent.database}')) = '${item.parent.label}'
  AND OBJECT_SCHEMA_NAME(ix.object_id, db_id('${item.parent.database}')) = '${item.parent.schema}'
`;}}
`;

export const fetchTriggerDefinition: IBaseQueries['fetchTriggerDefinition'] = queryFactory`
SELECT
  "definition"
FROM ${item => item.parent ? escapeTableName({ database: item.database, schema: 'sys', label: 'triggers' }) : 'sys.server_triggers'} AS tr
JOIN ${item => item.parent ? escapeTableName({ database: item.database, schema: 'sys', label: 'sql_modules' }) : 'sys.server_sql_modules'} AS sm
  ON sm.object_id = tr.object_id
WHERE 1=1
  AND tr.name = '${item => item.label}'
  AND tr.parent_class ${item => item.parent && item.parent.type === ContextValue.DATABASE ? '=' : '!=' } 0
`;

export const fetchForeignKeys: IBaseQueries['fetchForeignKeys'] = queryFactory`
SELECT
  FK.CONSTRAINT_NAME AS "constraintName",
  FK.TABLE_SCHEMA AS "sourceTableSchema",
  FK.TABLE_NAME AS "sourceTableName",
  CU.COLUMN_NAME AS "sourceColumnName",
  PK.TABLE_SCHEMA AS "targetTableSchema",
  PK.TABLE_NAME AS "targetTableName",
  PT.COLUMN_NAME AS "targetColumnName"
FROM
  ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "REFERENTIAL_CONSTRAINTS" })}` : 'INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS'} AS C
  JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "TABLE_CONSTRAINTS" })}` : 'INFORMATION_SCHEMA.TABLE_CONSTRAINTS'} AS FK
    ON C.CONSTRAINT_NAME = FK.CONSTRAINT_NAME AND C.CONSTRAINT_SCHEMA = FK.CONSTRAINT_SCHEMA
  JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "TABLE_CONSTRAINTS" })}` : 'INFORMATION_SCHEMA.TABLE_CONSTRAINTS'} AS PK
    ON C.UNIQUE_CONSTRAINT_NAME = PK.CONSTRAINT_NAME AND C.UNIQUE_CONSTRAINT_SCHEMA = PK.CONSTRAINT_SCHEMA
  JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "KEY_COLUMN_USAGE" })}` : 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE'} AS CU
    ON C.CONSTRAINT_NAME = CU.CONSTRAINT_NAME AND C.CONSTRAINT_SCHEMA = CU.CONSTRAINT_SCHEMA
  JOIN ${p => p.database ? `${escapeTableName({ database: p.database, schema: "INFORMATION_SCHEMA", label: "KEY_COLUMN_USAGE" })}` : 'INFORMATION_SCHEMA.KEY_COLUMN_USAGE'} AS PT
    ON C.UNIQUE_CONSTRAINT_NAME = PT.CONSTRAINT_NAME AND C.UNIQUE_CONSTRAINT_SCHEMA = PT.CONSTRAINT_SCHEMA
WHERE
  FK.TABLE_SCHEMA = '${p => p.schema}'
  AND FK.TABLE_CATALOG = '${p => p.database}'
ORDER BY
  FK.TABLE_NAME,
  CU.COLUMN_NAME
`;