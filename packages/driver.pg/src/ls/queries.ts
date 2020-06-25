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
  UPPER(C.DATA_TYPE || (
    CASE WHEN C.CHARACTER_MAXIMUM_LENGTH > 0 THEN (
      '(' || C.CHARACTER_MAXIMUM_LENGTH || ')'
    ) ELSE '' END
  )) AS "detail",
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
};