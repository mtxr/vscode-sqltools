import { IBaseQueries, ContextValue, NSDatabase } from '@sqltools/types';
import queryFactory from '@sqltools/base-driver/dist/lib/factory';

function escapeTableName(table: Partial<NSDatabase.ITable>) {
  return `"${table.label || table.toString()}"`;
}

const describeTable: IBaseQueries['describeTable'] = queryFactory`
  SELECT C.*
  FROM pragma_table_info('${p => p.label}') AS C
  ORDER BY C.cid ASC
`;

const fetchColumns: IBaseQueries['fetchColumns'] = queryFactory`
SELECT C.name AS label,
  C.*,
  C.type AS dataType,
  C."notnull" AS isNullable,
  C.pk AS isPk,
  UPPER(
    CONCAT(
      C.type, ', ', 
      CASE WHEN "NOTNULL" THEN 'NOT ' ELSE '' END, 'NULL'
    )
  ) AS detail,
  '${ContextValue.COLUMN}' as type
FROM pragma_table_info('${p => p.label}') AS C
ORDER BY cid ASC
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

const fetchTablesAndViews = (type: ContextValue, tableType = 'table'): IBaseQueries['fetchTables'] => queryFactory`
SELECT name AS label,
  '${type}' AS type
FROM sqlite_master
WHERE LOWER(type) LIKE '${tableType.toLowerCase()}'
  AND name NOT LIKE 'sqlite_%'
ORDER BY name
`;

const fetchTables: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.TABLE);
const fetchViews: IBaseQueries['fetchTables'] = fetchTablesAndViews(ContextValue.VIEW , 'view');

const searchTables: IBaseQueries['searchTables'] = queryFactory`
SELECT name AS label,
  type
FROM sqlite_master
${p => p.search ? `WHERE LOWER(name) LIKE '%${p.search.toLowerCase()}%'` : ''}
ORDER BY name
`;
const searchColumns: IBaseQueries['searchColumns'] = queryFactory`
SELECT C.name AS label,
  T.name AS "table",
  C.type AS dataType,
  C."notnull" AS isNullable,
  C.pk AS isPk,
  '${ContextValue.COLUMN}' as type
FROM sqlite_master AS T
LEFT OUTER JOIN pragma_table_info((T.name)) AS C ON 1 = 1
WHERE 1 = 1
${p => p.tables.filter(t => !!t.label).length
  ? `AND LOWER(T.name) IN (${p.tables.filter(t => !!t.label).map(t => `'${t.label}'`.toLowerCase()).join(', ')})`
  : ''
}
${p => p.search
  ? `AND (
    LOWER(T.name || '.' || C.name) LIKE '%${p.search.toLowerCase()}%'
    OR LOWER(C.name) LIKE '%${p.search.toLowerCase()}%'
  )`
  : ''
}
ORDER BY C.name ASC,
  C.cid ASC
LIMIT ${p => p.limit || 100}
`;

const fetchForeignKeys: IBaseQueries['fetchForeignKeys'] = queryFactory`
SELECT
  '' AS "constraintName",
  '' AS "sourceTableSchema",
  m.name AS "sourceTableName",
  fk."from" AS "sourceColumnName",
  '' AS "targetTableSchema",
  fk."table" AS "targetTableName",
  fk."to" AS "targetColumnName"
FROM sqlite_master AS m
JOIN pragma_foreign_key_list(m.name) AS fk ON 1 = 1
WHERE m.type = 'table'
  AND m.name NOT LIKE 'sqlite_%'
ORDER BY m.name, fk.seq
`;

const searchIndexes: IBaseQueries['searchIndexes'] = queryFactory`
SELECT
  '${ContextValue.INDEX}' AS "type",
  ix.name as "name",
  ix.name as "label",
  '(' || CASE WHEN ix."unique" THEN '' ELSE 'non-' END || 'unique' || ')' as detail,
  CASE
    WHEN ix.origin = 'pk' THEN 'pk'
    WHEN NOT ix.origin = 'u' THEN 'index-uq'
    ELSE 'index'
  END AS "iconName",
  '${ContextValue.NO_CHILD}' AS "childType"  
FROM
  sqlite_schema AS sc,
  pragma_index_list(sc.name) AS ix
WHERE 1=1
  ${p => p.search ?
    `AND LOWER(ix.name) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ? `AND sc.tbl_name = '${p.parent.label}'` : ''
  }
ORDER BY
  ix.name
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

const searchTriggers: IBaseQueries['searchTriggers'] = queryFactory`
SELECT
  '${ContextValue.TRIGGER}' AS "type",
  tr.name AS "name",
  tr.name AS "label"
FROM sqlite_master AS tr
WHERE tr.type = 'trigger'
  ${p => p.search ? `AND LOWER(tr.name) LIKE '%${p.search.toLowerCase()}%'` :
    p.parent ? `AND tr.tbl_name = '${p.parent.label}'` : ''
  }
ORDER BY
  tr.name
${p => p.search ? `LIMIT ${p.limit || 100}` : ''}
`;

const fetchTableDefinition: IBaseQueries['fetchTableDefinition'] = queryFactory`
SELECT sql AS "definition"
FROM sqlite_schema
WHERE type = 'table'
  AND name = '${item => item.label}'
`;

const fetchViewDefinition: IBaseQueries['fetchViewDefinition'] = queryFactory`
SELECT sql AS "definition"
FROM sqlite_schema
WHERE type = 'view'
  AND name = '${item => item.label}'
`;

const fetchIndexDefinition: IBaseQueries['fetchIndexDefinition'] = queryFactory`
SELECT
  COALESCE(
    (SELECT sql FROM sqlite_schema WHERE type = 'index' AND name = '${item => item.label}'),
    (SELECT sql FROM sqlite_schema WHERE type = 'table' AND name = '${item => item.parent.label}')
  ) AS "definition"
`;

const fetchTriggerDefinition: IBaseQueries['fetchTriggerDefinition'] = queryFactory`
SELECT sql AS "definition"
FROM sqlite_schema
WHERE type = 'trigger'
  AND name = '${item => item.label}'
`;

export default {
  describeTable,
  countRecords,
  fetchColumns,
  fetchRecords,
  fetchTables,
  fetchViews,
  searchTables,
  searchColumns,
  searchIndexes,
  searchTriggers,
  fetchTableDefinition,
  fetchViewDefinition,
  fetchIndexDefinition,
  fetchTriggerDefinition,
  fetchForeignKeys
}

// export default {
//   listFks: `PRAGMA foreign_key_list(\':table\');`
// } as IBaseQueries;