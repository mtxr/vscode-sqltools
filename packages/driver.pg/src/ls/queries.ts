import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import escapeTableName from '../escape-table';
import { IBaseQueries, ContextValue } from '@sqltools/types';

const describeTable: IBaseQueries['describeTable'] = queryFactory`
SELECT * FROM INFORMATION_SCHEMA.COLUMNS
WHERE
  TABLE_NAME = '${p => p.label}'
  AND TABLE_CATALOG = '${p => p.database}'
  AND TABLE_SCHEMA = '${p => p.schema}'`;
const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT
  C.COLUMN_NAME AS label,
  '${ContextValue.COLUMN}' as type,
  C.TABLE_NAME AS table,
  C.DATA_TYPE AS "dataType",
  UPPER(C.DATA_TYPE ||
    CASE
      WHEN C.CHARACTER_MAXIMUM_LENGTH IS NOT NULL
        THEN '(' || C.CHARACTER_MAXIMUM_LENGTH || ')'
      WHEN C.DATETIME_PRECISION IS NOT NULL
        THEN '(' || C.DATETIME_PRECISION || ')'
      WHEN C.DATA_TYPE IN ('decimal', 'numeric', 'money')
        THEN '(' || C.NUMERIC_PRECISION || ', ' || C.NUMERIC_SCALE || ')'
      ELSE ''
    END
  ) || ', ' || CASE WHEN C.IS_NULLABLE = 'YES' THEN 'NULL' ELSE 'NOT NULL' END AS "detail",
  C.CHARACTER_MAXIMUM_LENGTH::INT AS size,
  C.TABLE_CATALOG AS database,
  C.TABLE_SCHEMA AS schema,
  C.COLUMN_DEFAULT AS "defaultValue",
  C.IS_NULLABLE AS "isNullable",
  (CASE WHEN LOWER(TC.constraint_type) = 'primary key' THEN TRUE ELSE FALSE END) as "isPk",
  (CASE WHEN LOWER(TC.constraint_type) = 'foreign key' THEN TRUE ELSE FALSE END) as "isFk"
FROM
  INFORMATION_SCHEMA.COLUMNS C
LEFT JOIN information_schema.key_column_usage KC ON KC.table_name = C.table_name
  AND KC.table_schema = C.table_schema
  AND KC.column_name = C.column_name
LEFT JOIN information_schema.table_constraints TC ON KC.table_name = TC.table_name
  AND KC.table_schema = TC.table_schema
  AND KC.constraint_name = TC.constraint_name
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

const fetchRecords: IBaseQueries['fetchRecords'] = queryFactory`
SELECT *
FROM ${p => escapeTableName(p.table)}
LIMIT ${p => p.limit || 50}
OFFSET ${p => p.offset || 0};
`;
const countRecords: IBaseQueries['countRecords'] = queryFactory`
SELECT count(1) AS total
FROM ${p => escapeTableName(p.table)};
`;

// NOTE this remains for backward compatibility
const fetchFunctions: IBaseQueries['fetchFunctions'] = queryFactory`
SELECT
  '${ContextValue.FUNCTION}' as type,
  f.proname AS name,
  f.proname AS label,
  quote_ident(f.proname) || '(' || oidvectortypes(f.proargtypes)::TEXT || ')' AS detail,
  n.nspname AS schema,
  current_database() AS database,
  quote_ident(n.nspname) || '.' || quote_ident(f.proname) AS signature,
  format_type(f.prorettype, null) AS "resultType",
  oidvectortypes(f.proargtypes) AS args,
  proargnames AS "argsNames",
  f.prosrc AS source,
  'function' as "iconName",
  '${ContextValue.NO_CHILD}' as "childType"
FROM
  pg_catalog.pg_proc AS f
INNER JOIN pg_catalog.pg_namespace AS n on n.oid = f.pronamespace
WHERE
  n.nspname = '${p => p.schema}'
ORDER BY name
;`;

const fetchTablesAndViews = (type: ContextValue, tableType = 'BASE TABLE'): IBaseQueries['fetchTables'] => queryFactory`
SELECT
  T.TABLE_NAME AS label,
  '${type}' as type,
  T.TABLE_SCHEMA AS schema,
  T.TABLE_CATALOG AS database,
  ${type === ContextValue.VIEW ? 'TRUE' : 'FALSE'} AS isView
FROM INFORMATION_SCHEMA.TABLES AS T
WHERE
  T.TABLE_SCHEMA = '${p => p.schema}'
  AND T.TABLE_CATALOG = '${p => p.database}'
  AND T.TABLE_TYPE = '${tableType}'
ORDER BY
  T.TABLE_NAME;
`;

const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT
  T.TABLE_NAME AS label,
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN '${ContextValue.TABLE}' ELSE '${ContextValue.VIEW}' END) as type,
  T.TABLE_SCHEMA AS schema,
  T.TABLE_CATALOG AS database,
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN FALSE ELSE TRUE END) AS "isView",
  (CASE WHEN T.TABLE_TYPE = 'BASE TABLE' THEN 'table' ELSE 'view' END) AS description,
  ('"' || T.TABLE_CATALOG || '"."' || T.TABLE_SCHEMA || '"."' || T.TABLE_NAME || '"') as detail
FROM INFORMATION_SCHEMA.TABLES AS T
WHERE
  T.TABLE_SCHEMA !~ '^pg_'
  AND T.TABLE_SCHEMA <> 'information_schema'
  ${p => p.search ? `AND (
    (T.TABLE_CATALOG || '.' || T.TABLE_SCHEMA || '.' || T.TABLE_NAME) ILIKE '%${p.search}%'
    OR ('"' || T.TABLE_CATALOG || '"."' || T.TABLE_SCHEMA || '"."' || T.TABLE_NAME || '"') ILIKE '%${p.search}%'
    OR T.TABLE_NAME ILIKE '%${p.search}%'
  )` : ''}
ORDER BY
  T.TABLE_NAME
LIMIT ${p => p.limit || 100};
`;

const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT
  C.COLUMN_NAME AS label,
  '${ContextValue.COLUMN}' as type,
  C.TABLE_NAME AS table,
  C.DATA_TYPE AS "dataType",
  C.CHARACTER_MAXIMUM_LENGTH::INT AS size,
  C.TABLE_CATALOG AS database,
  C.TABLE_SCHEMA AS schema,
  C.COLUMN_DEFAULT AS defaultValue,
  C.IS_NULLABLE AS isNullable,
  (CASE WHEN LOWER(TC.constraint_type) = 'primary key' THEN TRUE ELSE FALSE END) as "isPk",
  (CASE WHEN LOWER(TC.constraint_type) = 'foreign key' THEN TRUE ELSE FALSE END) as "isFk"
FROM
  INFORMATION_SCHEMA.COLUMNS C
LEFT JOIN information_schema.key_column_usage KC ON KC.table_name = C.table_name
  AND KC.table_schema = C.table_schema
  AND KC.column_name = C.column_name
LEFT JOIN information_schema.table_constraints TC ON KC.table_name = TC.table_name
  AND KC.table_schema = TC.table_schema
  AND KC.constraint_name = TC.constraint_name
JOIN INFORMATION_SCHEMA.TABLES AS T ON C.TABLE_NAME = T.TABLE_NAME
  AND C.TABLE_SCHEMA = T.TABLE_SCHEMA
  AND C.TABLE_CATALOG = T.TABLE_CATALOG
WHERE
  C.TABLE_SCHEMA !~ '^pg_'
  AND C.TABLE_SCHEMA <> 'information_schema'
  ${p => p.tables.filter(t => !!t.label).length
    ? `AND LOWER(C.TABLE_NAME) IN (${p.tables.filter(t => !!t.label).map(t => `'${t.label}'`.toLowerCase()).join(', ')})`
    : ''
  }
  ${p => p.search
    ? `AND (
      (C.TABLE_NAME || '.' || C.COLUMN_NAME) ILIKE '%${p.search}%'
      OR C.COLUMN_NAME ILIKE '%${p.search}%'
    )`
    : ''
  }
ORDER BY
  C.TABLE_NAME,
  C.ORDINAL_POSITION
LIMIT ${p => p.limit || 100}
`;

const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW, 'VIEW');
const fetchMaterializedViews: IBaseQueries['fetchTables'] = queryFactory`
SELECT
  '${ContextValue.MATERIALIZED_VIEW}' as type,
  (current_database())::information_schema.sql_identifier AS database,
  (nc.nspname)::information_schema.sql_identifier AS schema,
  (c.relname)::information_schema.sql_identifier AS label,
  'view' AS "iconName",
  '${ContextValue.NO_CHILD}' as "childType"
FROM pg_namespace nc,
  pg_class c
WHERE
  nc.nspname = '${p => p.schema}'
  AND (
    (c.relnamespace = nc.oid)
    AND (c.relkind = 'm'::"char")
    AND (NOT pg_is_other_temp_schema(nc.oid))
    AND (
      pg_has_role(c.relowner, 'USAGE'::text)
      OR has_table_privilege(
        c.oid,
        'SELECT, INSERT, UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER'::text
      )
      OR has_any_column_privilege(
        c.oid,
        'SELECT, INSERT, UPDATE, REFERENCES'::text
      )
    )
  );
`;
const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
SELECT
  db.*,
  db.datname as "label",
  db.datname as "database",
  '${ContextValue.DATABASE}' as "type",
  'database' as "detail"
FROM pg_catalog.pg_database db
WHERE
  datallowconn
  AND NOT datistemplate
  AND db.datname = CURRENT_DATABASE()
ORDER BY
  db.datname;
`;
const fetchSchemas: IBaseQueries['fetchSchemas'] = queryFactory`
SELECT
  schema_name AS label,
  schema_name AS schema,
  '${ContextValue.SCHEMA}' as "type",
  'group-by-ref-type' as "iconId",
  catalog_name as database
FROM information_schema.schemata
WHERE
  schema_name !~ '^pg_'
  AND schema_name <> 'information_schema'
  AND catalog_name = '${p => p.database}'
ORDER BY
  schema_name;
`;

const searchFunctionsAndProcedures = (type: ContextValue.FUNCTION | ContextValue.PROCEDURE): IBaseQueries['searchFunctions'] => queryFactory`
SELECT
  '${type}' as type,
  f.proname AS name,
  f.proname AS label,
  n.nspname AS schema,
  current_database() AS database,
  quote_ident(n.nspname) || '.' || quote_ident(f.proname) AS signature,
  oidvectortypes(f.proargtypes) AS args,
  format_type(f.prorettype, null) AS "resultType",
  '(' || oidvectortypes(f.proargtypes)::text || ')' AS detail,
  proargnames AS "argsNames",
  f.prosrc AS source,
  '${type.slice(11)}' AS "iconName",
  '${ContextValue.NO_CHILD}' AS "childType"
FROM
  pg_catalog.pg_proc AS f
INNER JOIN pg_catalog.pg_namespace AS n on n.oid = f.pronamespace
WHERE f.prokind = '${type[11]}'
  ${p => p.parent ? `AND n.nspname = '${p.parent.schema}'` : ''}
  ${p => p.search ? `AND lower(f.proname) LIKE '%${p.search.toLowerCase()}%'` : 
    p.parent ? `AND n.nspname = '${p.parent.schema}'` : ''
  }
ORDER BY
  f.proname
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

const searchFunctions: IBaseQueries['searchFunctions'] = searchFunctionsAndProcedures(ContextValue.FUNCTION);
const searchProcedures: IBaseQueries['searchFunctions'] = searchFunctionsAndProcedures(ContextValue.PROCEDURE);

const searchIndexes: IBaseQueries['searchIndexes'] = queryFactory`
SELECT
  '${ContextValue.INDEX}' AS "type",
  i.indexrelid::regclass::name AS "name",
  i.indexrelid::regclass::name AS "label",
  '(' || CASE WHEN i.indisunique THEN '' ELSE 'non-' END || 'unique)' AS "detail",
  CASE
    WHEN i.indisprimary THEN 'pk'
    WHEN i.indisunique THEN 'index-uq'
    ELSE 'index'
  END AS "iconName",
  '${ContextValue.NO_CHILD}' AS "childType"
FROM pg_catalog.pg_class AS c
INNER JOIN pg_catalog.pg_namespace AS n
  ON n.oid = c.relnamespace
JOIN pg_catalog.pg_index AS i
  ON i.indrelid = c.oid
WHERE 1=1
  ${p => p.search ?
    `AND LOWER(i.indexrelid::regclass::name) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ?
      `AND c.relname = '${p.parent.label}'
      AND n.nspname = '${p.parent.schema}'`
      : ''
  }
ORDER BY
  i.indexrelid::regclass::name
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

const searchTriggers: IBaseQueries['searchTriggers'] = queryFactory`
SELECT
  '${ContextValue.TRIGGER}' AS "type",
  tr.tgname AS "name",
  tr.tgname AS "label"
FROM (
  SELECT oid, tgrelid, tgfoid, tgname FROM pg_catalog.pg_trigger
  UNION ALL
  SELECT oid, null, evtfoid, evtname FROM pg_catalog.pg_event_trigger
) AS tr
LEFT JOIN pg_catalog.pg_class AS c
  ON c.oid = tr.tgrelid
WHERE 1=1
  ${p => p.search ?
    `AND LOWER(tr.tgname) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ?
      (p.parent.type === ContextValue.DATABASE ? 'AND tr.tgrelid IS NULL' :
        `AND tr.tgrelid::regclass::name = '${p.parent.label}'
        AND c.relnamespace::regnamespace::name = '${p.parent.schema}'`) :
      'AND tr.tgrelid IS NOT NULL'
  }
ORDER BY
  tr.tgname
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

const fetchTableDefinition: IBaseQueries['fetchTableDefinition'] = queryFactory`
SELECT
  'CREATE '
  || (SELECT
      CASE
        WHEN cl.relpersistence = 'u' THEN 'UNLOGGED '
        ELSE ''
      END
    FROM pg_class cl
    WHERE cl.oid = ns.oid
    )
  || 'TABLE ' || ns.label || ' (' || chr(13)
  || c.def
  || COALESCE(cs.def, '')
  || chr(13)
  || ')' AS "definition"
FROM information_schema.tables AS t
INNER JOIN LATERAL (
  SELECT
    FORMAT('%I.%I', t.table_schema, t.table_name) AS label,
    to_regclass(format('%I.%I', t.table_schema, t.table_name))::oid AS oid
) AS ns ON true
LEFT JOIN LATERAL (
  SELECT
    STRING_AGG(
      chr(9) || quote_ident(col.column_name) || ' '
      /* column type */
      || CASE
        WHEN col.column_default like 'nextval(%::regclass)' THEN replace(col.udt_name, 'int', 'serial')
        ELSE col.udt_name
      end
      || CASE
        WHEN col.udt_name IN ('numeric', 'decimal') THEN CONCAT('(', col.numeric_precision, ', ', col.numeric_scale, ')')
        WHEN col.udt_name IN ('char', 'varchar', 'varbit') THEN CONCAT('(', col.character_maximum_length, ')')
        WHEN col.udt_name IN ('time', 'timestamp') THEN CONCAT('(', col.datetime_precision, ')')
        WHEN col.udt_name IN ('interval') THEN CONCAT(' ', col.interval_type)
        ELSE ''
      end
      /* default */
      || CASE
        WHEN col.column_default is null or col.column_default like 'nextval(%::regclass)' THEN ''
        ELSE ' DEFAULT ' || col.column_default
      end
      /* generated */
      || coalesce(' GENERATED ' || col.identity_generation
      || ' AS IDENTITY (INCREMENT ' || col.identity_increment
      || ' MINVALUE ' || col.identity_minimum
      || ' MAXVALUE ' || col.identity_maximum
      || CASE
          WHEN col.identity_cycle = 'NO' THEN ' NO'
          ELSE ''
        end
      || ' CYCLE START ' || col.identity_start
      || ')', '')
      /* nullable */
      || CASE
          WHEN col.is_nullable = 'NO' THEN ' NOT'
          ELSE ''
        end || ' NULL'
      /* rows separator */
      , ',' || chr(13)
    ) AS def
  FROM information_schema.columns AS col
  WHERE 1=1
    AND col.table_catalog = t.table_catalog
    AND col.table_schema = t.table_schema
    AND col.table_name = t.table_name
  group by col.table_catalog
    ,col.table_schema
    ,col.table_name
) AS c ON true
LEFT JOIN lateral (
  SELECT ',' || chr(13) 
    || string_agg(chr(9) || 'CONSTRAINT ' || quote_ident(con.conname) || ' '
    || pg_get_constraintdef(oid), ','
    || chr(13)) AS def
  FROM pg_catalog.pg_constraint AS con
  WHERE con.conrelid = ns.oid
    AND con.contype NOT IN ('n')
  group by con.conrelid 
) AS cs ON true
WHERE 1=1
  ${item => `
    ${item.database ? `and t.table_catalog = '${item.database}'` : ''}
    AND t.table_schema = '${item.schema}'
    AND t.table_name = '${item.label}'
  `}
`;

const fetchViewDefinition: IBaseQueries['fetchViewDefinition'] = queryFactory`
SELECT pg_get_viewdef('${item => escapeTableName(item)}'::regclass::oid) AS "definition"
`;

const fetchFunctionOrProcedureDefinition: IBaseQueries['fetchFunctionDefinition' | 'fetchFunctionDefinition'] = queryFactory`
SELECT pg_get_functiondef(oid) AS "definition"
FROM pg_proc
WHERE proname = '${item => item.label}';
`;
const fetchFunctionDefinition: IBaseQueries['fetchFunctionDefinition'] = fetchFunctionOrProcedureDefinition;
const fetchProcedureDefinition: IBaseQueries['fetchProcedureDefinition'] = fetchFunctionOrProcedureDefinition;

const fetchIndexDefinition: IBaseQueries['fetchIndexDefinition'] = queryFactory`
SELECT pg_get_indexdef(indexrelid) AS "definition"
FROM pg_index
WHERE indexrelid::regclass::name = '${item => item.label}';
`;

const fetchTriggerDefinition: IBaseQueries['fetchTriggerDefinition'] = queryFactory`
SELECT
${item => item.parent && item.parent.type !== ContextValue.DATABASE ? `
  pg_get_triggerdef(oid) AS "definition"
FROM pg_trigger
WHERE tgname = '${item.label}'
  ` : `
  'CREATE EVENT TRIGGER ' || quote_ident(tr.evtname) || ' ON ' || tr.evtevent || chr(10)
  || COALESCE('WHEN TAG IN (' || array_to_string(tr.evttags, ', ') || ')' || chr(10), '')
  || 'EXECUTE FUNCTION ' || quote_ident(n.nspname) || '.' || quote_ident(f.proname) || '();'
  AS "definition"
FROM pg_catalog.pg_event_trigger AS tr
INNER JOIN pg_catalog.pg_proc AS f ON f.oid = tr.evtfoid
INNER JOIN pg_catalog.pg_namespace AS n ON n.oid = f.pronamespace
WHERE tr.evtname = '${item.label}'
  `
}`;


const fetchForeignKeys: IBaseQueries['fetchForeignKeys'] = queryFactory`
SELECT
  tc.constraint_name AS "constraintName",
  tc.table_schema AS "sourceTableSchema",
  tc.table_name AS "sourceTableName",
  kcu.column_name AS "sourceColumnName",
  ccu.table_schema AS "targetTableSchema",
  ccu.table_name AS "targetTableName",
  ccu.column_name AS "targetColumnName"
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE
  tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = '${p => p.schema}'
  AND tc.table_catalog = '${p => p.database}'
ORDER BY
  tc.table_name,
  kcu.column_name
`;

export default {
  describeTable,
  countRecords,
  fetchColumns,
  fetchRecords,
  fetchTables,
  fetchViews,
  fetchFunctions,
  fetchDatabases,
  fetchSchemas,
  fetchMaterializedViews,
  searchTables,
  searchColumns,
  searchFunctions,
  searchProcedures,
  searchTriggers,
  searchIndexes,
  fetchTableDefinition,
  fetchViewDefinition,
  fetchFunctionDefinition,
  fetchProcedureDefinition,
  fetchIndexDefinition,
  fetchTriggerDefinition,
  fetchForeignKeys
};