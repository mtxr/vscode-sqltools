import { DialectQueries } from '@sqltools/core/interface';

export default {
  describeTable: `select * from all_tab_columns
    where table_name = ':table'
    and owner = ':schema'`,
  fetchColumns: `select
  c.table_name as tablename,
  c.column_name as columnname,
  c.data_type as type,
  c.data_length as "size",
  user as tablecatalog,
  c.owner as tableschema,
  c.owner as dbname,
  c.data_default as defaultvalue,
  c.nullable as isnullable
  from all_tab_columns c
  join (
  select table_name, owner from all_tables
  union all
  select view_name as table_name, owner from all_views
  ) v on (c.table_name = v.table_name and c.owner = v.owner)
  where c.owner not like '%SYS%'`,
  fetchRecords: 'select * from :table where rownum <= :limit',
  fetchTables: `select
  table_name as tableName,
  owner AS tableSchema,
  user AS tableCatalog,
  isview AS isView,
  owner AS dbName,
  num_rows AS numberOfColumns
  from (
  select t.table_name, t.owner, user, 0 as isview, count(1) as num_rows
  from all_tables t
  join all_tab_columns c on c.table_name = t.table_name and c.owner = t.owner
  group by t.owner, t.table_name, user
  union all
  select v.view_name as table_name, v.owner, user, 1 as isview, count(1) as num_rows
  from all_views v
  join all_tab_columns c on c.table_name = v.view_name and c.owner = v.owner
  group by v.owner, v.view_name, user
  )
  where owner not like '%SYS%'`,
  fetchDummy: 'select 1 from dual'
} as DialectQueries;