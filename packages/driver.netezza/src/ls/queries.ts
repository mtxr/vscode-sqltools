import queryFactory from '@sqltools/base-driver/dist/lib/factory';
import escapeTableName from '../escape-table';
import { IBaseQueries, ContextValue } from '@sqltools/types';

const describeTable: IBaseQueries['describeTable'] = queryFactory`
SELECT
  c.ATTNAME AS "column_name",
  c.TYPE AS "data_type",
  c.FORMAT_TYPE AS "column_type",
  c.COLDEFAULT AS "column_default",
  CASE WHEN c.ATTNOTNULL = 't' THEN 'NO' ELSE 'YES' END AS "is_nullable",
  c.ATTNUM AS "ordinal_position"
FROM _v_relation_column c
WHERE
  c.NAME = '${p => p.label}'
  AND c.SCHEMA = '${p => p.schema}'
  AND c.DATABASE = '${p => p.database}'
ORDER BY c.ATTNUM`;
const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT
  c.ATTNAME AS "label",
  '${ContextValue.COLUMN}' as "type",
  c.NAME AS "table",
  c.TYPE AS "dataType",
  UPPER(c.FORMAT_TYPE) AS "detail",
  CASE WHEN c.FORMAT_TYPE LIKE '%(%' THEN
    CAST(SUBSTRING(c.FORMAT_TYPE FROM POSITION('(' IN c.FORMAT_TYPE) + 1 FOR POSITION(')' IN c.FORMAT_TYPE) - POSITION('(' IN c.FORMAT_TYPE) - 1) AS INT)
  ELSE NULL END AS "size",
  c.DATABASE AS "database",
  c.SCHEMA AS "schema",
  c.COLDEFAULT AS "defaultValue",
  CASE WHEN c.ATTNOTNULL = 't' THEN 'NO' ELSE 'YES' END AS "isNullable",
  FALSE as "isPk",
  FALSE as "isFk"
FROM
  _v_relation_column c
WHERE
  c.SCHEMA = '${p => p.schema}'
  AND c.NAME = '${p => p.label}'
  AND c.DATABASE = '${p => p.database}'
ORDER BY
  c.ATTNUM
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
  '${ContextValue.FUNCTION}' as "type",
  f.FUNCTION AS "name",
  f.FUNCTION AS "label",
  f.FUNCTION || '()' AS "detail",
  f.SCHEMA AS "schema",
  f.DATABASE AS "database",
  f.SCHEMA || '.' || f.FUNCTION AS "signature",
  'function' as "iconName",
  '${ContextValue.NO_CHILD}' as "childType"
FROM
  _v_function f
WHERE
  f.SCHEMA = '${p => p.schema}'
  AND f.DATABASE = '${p => p.database}'
ORDER BY f.FUNCTION
;`;

const fetchTablesAndViews = (type: ContextValue, tableType = 'TABLE'): IBaseQueries['fetchTables'] => queryFactory`
SELECT
  t.TABLENAME AS "label",
  '${type}' as "type",
  t.SCHEMA AS "schema",
  t.DATABASE AS "database",
  ${type === ContextValue.VIEW ? 'TRUE' : 'FALSE'} AS "isView"
FROM _v_table t
WHERE
  t.SCHEMA = '${p => p.schema}'
  AND t.DATABASE = '${p => p.database}'
  AND t.OBJTYPE = '${tableType}'
ORDER BY
  t.TABLENAME;
`;

const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT
  t.TABLENAME AS "label",
  (CASE WHEN t.OBJTYPE = 'TABLE' THEN '${ContextValue.TABLE}' ELSE '${ContextValue.VIEW}' END) as "type",
  t.SCHEMA AS "schema",
  t.DATABASE AS "database",
  (CASE WHEN t.OBJTYPE = 'TABLE' THEN FALSE ELSE TRUE END) AS "isView",
  (CASE WHEN t.OBJTYPE = 'TABLE' THEN 'table' ELSE 'view' END) AS "description",
  ('"' || t.SCHEMA || '"."' || t.TABLENAME || '"') as "detail"
FROM _v_table t
WHERE
  t.SCHEMA NOT LIKE 'PG_%'
  AND t.SCHEMA <> 'DEFINITION_SCHEMA'
  ${p => p.search ? `AND (
    (t.SCHEMA || '.' || t.TABLENAME) ILIKE '%${p.search}%'
    OR ('"' || t.SCHEMA || '"."' || t.TABLENAME || '"') ILIKE '%${p.search}%'
    OR t.TABLENAME ILIKE '%${p.search}%'
  )` : ''}
ORDER BY
  t.TABLENAME
LIMIT ${p => p.limit || 100};
`;

const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT
  c.ATTNAME AS "label",
  '${ContextValue.COLUMN}' as "type",
  c.NAME AS "table",
  c.TYPE AS "dataType",
  CASE WHEN c.FORMAT_TYPE LIKE '%(%' THEN
    CAST(SUBSTRING(c.FORMAT_TYPE FROM POSITION('(' IN c.FORMAT_TYPE) + 1 FOR POSITION(')' IN c.FORMAT_TYPE) - POSITION('(' IN c.FORMAT_TYPE) - 1) AS INT)
  ELSE NULL END AS "size",
  c.DATABASE AS "database",
  c.SCHEMA AS "schema",
  c.COLDEFAULT AS "defaultValue",
  CASE WHEN c.ATTNOTNULL = 't' THEN 'NO' ELSE 'YES' END AS "isNullable",
  FALSE as "isPk",
  FALSE as "isFk"
FROM _v_relation_column c
WHERE
  c.SCHEMA NOT LIKE 'PG_%'
  AND c.SCHEMA <> 'DEFINITION_SCHEMA'
  ${p => p.tables.filter(t => !!t.label).length
    ? `AND LOWER(c.NAME) IN (${p.tables.filter(t => !!t.label).map(t => `'${t.label}'`.toLowerCase()).join(', ')})`
    : ''
  }
  ${p => p.search
    ? `AND (
      (c.NAME || '.' || c.ATTNAME) ILIKE '%${p.search}%'
      OR c.ATTNAME ILIKE '%${p.search}%'
    )`
    : ''
  }
ORDER BY
  c.NAME,
  c.ATTNUM
LIMIT ${p => p.limit || 100}
`;

const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE, 'TABLE');
const fetchViews: IBaseQueries['fetchTables'] = queryFactory`
SELECT
  v.VIEWNAME AS "label",
  '${ContextValue.VIEW}' as "type",
  v.SCHEMA AS "schema",
  v.DATABASE AS "database",
  TRUE AS "isView"
FROM _v_view v
WHERE
  v.SCHEMA = '${p => p.schema}'
  AND v.DATABASE = '${p => p.database}'
ORDER BY
  v.VIEWNAME;
`;
const fetchMaterializedViews: IBaseQueries['fetchTables'] = queryFactory`
SELECT
  '${ContextValue.MATERIALIZED_VIEW}' as "type",
  t.DATABASE AS "database",
  t.SCHEMA AS "schema",
  t.TABLENAME AS "label",
  'view' AS "iconName",
  '${ContextValue.NO_CHILD}' as "childType"
FROM _v_table t
WHERE
  t.SCHEMA = '${p => p.schema}'
  AND t.DATABASE = '${p => p.database}'
  AND t.OBJTYPE = 'MATERIALIZED VIEW'
ORDER BY t.TABLENAME;
`;
const fetchDatabases: IBaseQueries['fetchDatabases'] = queryFactory`
SELECT
  CURRENT_CATALOG as "label",
  CURRENT_CATALOG as "database",
  '${ContextValue.DATABASE}' as "type",
  'database' as "detail"
`;
const fetchSchemas: IBaseQueries['fetchSchemas'] = queryFactory`
SELECT DISTINCT
  s.SCHEMA AS "label",
  s.SCHEMA AS "schema",
  '${ContextValue.SCHEMA}' as "type",
  'group-by-ref-type' as "iconId",
  s.DATABASE as "database"
FROM _v_schema s
WHERE
  s.SCHEMA NOT LIKE 'PG_%'
  AND s.SCHEMA <> 'DEFINITION_SCHEMA'
  AND s.SCHEMA <> 'INFORMATION_SCHEMA'
  AND s.DATABASE = '${p => p.database}'
ORDER BY
  s.SCHEMA;
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