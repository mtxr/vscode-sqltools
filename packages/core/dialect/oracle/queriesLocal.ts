import { DialectQueries } from '@sqltools/core/interface';
import { TREE_SEP } from '../../constants';

export default {
  describeTable: `select * from user_tab_columns where table_name = ':table'`,
  fetchColumns: `SELECT c.table_name AS tablename, c.column_name AS columnname, c.data_type AS TYPE, c.data_length AS "size",
      c.data_default AS defaultvalue, c.nullable AS isnullable,
      (SELECT MAX(constraint_Type) FROM user_constraints n, user_cons_columns M
      WHERE n.constraint_name = m.constraint_name  AND n.CONSTRAINT_TYPE IN ('P', 'R')
        AND n.table_name = c.table_name AND m.column_name = c.column_name) AS keytype,
        CASE WHEN EXISTS (SELECT * FROM user_tables T WHERE t.table_name = c.table_name) THEN 'tables' ELSE 'views' END
      || '${TREE_SEP}' || C.TABLE_name || '${TREE_SEP}' || C.COLUMN_NAME AS tree
      FROM user_tab_columns c ORDER BY c.table_name, c.column_id`,
  fetchRecords: "select * from :table where rownum <= :limit",
  fetchTables: `SELECT table_name AS tableName, DECODE(TYPE, 'V', 1, 0)  AS isView, 
  (SELECT COUNT(*) FROM cols WHERE table_name = a.table_name) AS numberOfColumns,
    DECODE(TYPE, 'V', 'views', 'tables') || '${TREE_SEP}' || table_name AS tree
  FROM ( SELECT t.table_name, 'T' AS TYPE FROM USER_TABLES T
      UNION SELECT v.view_name AS table_name, 'V' AS TYPE FROM user_views v) a`,
  fetchFunctions: `SELECT NVL(procedure_name, p.object_name) AS NAME,
  SYS_CONTEXT('userenv', 'current_schema') AS dbschema, SYS_CONTEXT ('USERENV', 'DB_NAME') AS dbname,
  SYS_CONTEXT('userenv', 'current_schema') ||'.'||p.object_name || DECODE(procedure_name, NULL, NULL,  '.'||procedure_name) signature,
  LISTAGG(CASE WHEN argument_name IS NULL THEN
        CASE WHEN a.type_name IS NOT NULL THEN
          a.type_owner || '.' || a.type_name || DECODE(a.type_subname, NULL, '', '.' || a.type_subname)
        ELSE
          NVL(a.pls_type, a.data_type) END
        END,',') WITHIN GROUP (ORDER BY position)   AS resulttype,
  LISTAGG(CASE WHEN argument_name IS NOT NULL THEN argument_name || '=>' ||
        CASE WHEN a.type_name IS NOT NULL THEN 
          a.type_owner || '.' || a.type_name || DECODE(a.type_subname, NULL, '', '.' || a.type_subname)
        ELSE
          NVL(a.pls_type, a.data_type)
        END
        END,',') WITHIN GROUP (ORDER BY position)  AS args,
     DECODE(object_type, 'PACKAGE', 'packages', 'FUNCTION', 'functions', 'PROCEDURE', 'procedures')
    || '${TREE_SEP}' || p.object_name 
    || CASE WHEN procedure_name IS NOT NULL THEN '${TREE_SEP}' || procedure_name  ELSE NULL END
  AS tree,
  '' AS SOURCE
  FROM user_procedures P, user_arguments a
  WHERE p.object_type IN ('FUNCTION','PROCEDURE','PACKAGE')
  AND NOT (p.object_type = 'PACKAGE' AND p.procedure_name IS NULL)
  AND a.object_name (+) = p.object_name
  GROUP BY p.procedure_name, p.object_name, p.object_type, a.pls_type, a.data_Type, 
  a.type_subname, a.type_owner, a.type_name, a.argument_name`
} as DialectQueries;