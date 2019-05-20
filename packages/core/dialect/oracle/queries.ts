import { DialectQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants';

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
  SYS_CONTEXT ('USERENV', 'DB_NAME') as dbname,
  c.data_default as defaultvalue,
  c.nullable as isnullable,
  cols.constraint_type AS keytype,
  SYS_CONTEXT ('USERENV', 'DB_NAME') || '${TREE_SEP}' || C.owner  || '${TREE_SEP}' || (
    CASE
      WHEN v.TYPE = 'V' THEN 'views'
      ELSE 'tables'
    END
  ) || '${TREE_SEP}' || C.TABLE_name || '${TREE_SEP}' || C.COLUMN_NAME AS tree
  from all_tab_columns c
  join (
  select table_name, owner, 'T' as type from all_tables
  union all
  select view_name as table_name, owner, 'V' as type from all_views
  ) v on (c.table_name = v.table_name and c.owner = v.owner)
  left join (
  select cons.CONSTRAINT_TYPE, cols.table_name, cols.column_name, cols.owner
  from all_cons_columns cols
  join all_constraints cons
  on (cons.constraint_name = cols.constraint_name AND cons.owner = cols.owner)
  where cons.CONSTRAINT_TYPE in ('P', 'R')
  ) cols on (cols.table_name = c.table_name and cols.column_name = c.column_name and cols.owner = c.owner)
  where c.owner = user
  ORDER BY c.table_name, c.column_id`,
  fetchRecords: 'select * from :table where rownum <= :limit',
  fetchTables: `select
  table_name as tableName,
  owner AS tableSchema,
  user AS tableCatalog,
  CASE
    WHEN TYPE = 'V' THEN 1
    ELSE 0
  END AS isView,
  SYS_CONTEXT ('USERENV', 'DB_NAME') as dbname,
  num_rows AS numberOfColumns,
  SYS_CONTEXT ('USERENV', 'DB_NAME') || '${TREE_SEP}' || owner  || '${TREE_SEP}' || (
    CASE
      WHEN TYPE = 'V' THEN 'views'
      ELSE 'tables'
    END
  ) || '${TREE_SEP}' || table_name AS tree
  from (
  select t.table_name, t.owner, user, 'T' as type, count(1) as num_rows
  from all_tables t
  join all_tab_columns c on c.table_name = t.table_name and c.owner = t.owner
  group by t.owner, t.table_name, user
  union all
  select v.view_name as table_name, v.owner, user, 'V' as type, count(1) as num_rows
  from all_views v
  join all_tab_columns c on c.table_name = v.view_name and c.owner = v.owner
  group by v.owner, v.view_name, user
  )
  where owner = user`,
  fetchFunctions: `select
  nvl(procedure_name, object_name) as name,
  owner as dbschema,
  sys_context ('USERENV', 'DB_NAME') as dbname,
  owner ||'.'||object_name || case when procedure_name is not null then '.'||procedure_name else null end as signature,
  replace(
  rtrim(xmlagg(case when argument_name is null then null else xmlelement(a, argument_name || '=>' || ora_type, ','
  ).extract('//text()') end order by position).getclobval(), ',' ),
  '=&gt;', '=>') as args,
  listagg(case when argument_name is null then ora_type else null end, ',') within group (order by position) as resulttype,
  sys_context ('USERENV', 'DB_NAME') || '${TREE_SEP}' || owner || '${TREE_SEP}'
    || decode(object_type, 'PACKAGE', 'packages', 'FUNCTION', 'functions', 'PROCEDURE', 'procedures')
    || '${TREE_SEP}' || object_name 
    || case when procedure_name is not null then '${TREE_SEP}' || procedure_name  else null end
  as tree,
  '' as source
from (
  select p.procedure_name, p.object_name, p.owner, p.object_type,
  sys_context ('USERENV', 'DB_NAME') as dbname,
  a.data_type, a.argument_name, a.position,
  case when a.type_name is not null 
    then a.type_owner || '.' || a.type_name 
    || case when a.type_subname is not null
      then '.' || a.type_subname
      end
    when a.pls_type is not null 
      then a.pls_type
    else a.data_type 
  end ora_type  
  from all_procedures p
  join all_arguments a on (a.owner = p.owner and ((a.object_name = p.object_name) or (p.procedure_name = a.object_name and p.object_name = a.package_name)))
  where p.object_type in ('FUNCTION','PROCEDURE','PACKAGE') 
  and not (p.object_type = 'PACKAGE' and p.procedure_name is null) 
  and p.owner = user
)
group by
  owner,
  object_type,
  object_name,
  procedure_name`,
} as DialectQueries;