import { IBaseQueries, IExpectedResult, NSDatabase, ContextValue, QueryBuilder } from '@sqltools/types';

type Query<P, R> = QueryBuilder<P, R>;

export interface NamespaceParams {
  namespace?: string;
  database?: string;
  schema?: string;
}

export interface TableParams extends NamespaceParams {
  table?: NSDatabase.ITable | string;
  label?: string;
}

export function normalizeNamespace(value?: string): string {
  const namespace = (value || '.').trim();
  if (!namespace || namespace === '.') {
    return '.';
  }
  return namespace.startsWith('.') ? namespace : `.${namespace}`;
}

export function qString(value?: string | number): string {
  const text = String(value === undefined || value === null ? '' : value);
  return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

export function qSymbolExpression(value: string): string {
  return `\`$${qString(value)}`;
}

export function tableNameFromParams(params: TableParams): string {
  const table = params.table;
  if (typeof table === 'string') {
    return table;
  }
  return table && table.label ? table.label : (params.label || '');
}

export function namespaceFromParams(params?: NamespaceParams & { table?: NSDatabase.ITable | string }): string {
  const directNamespace = params && (params.namespace || params.database || params.schema);
  if (directNamespace) {
    return normalizeNamespace(directNamespace);
  }

  const table = params && params.table;
  if (table && typeof table !== 'string') {
    return normalizeNamespace(table.database || table.schema);
  }

  return normalizeNamespace();
}

function expected<T>(query: string): IExpectedResult<T> {
  return query as IExpectedResult<T>;
}

function query<P, R>(builder: (params: P) => string): Query<P, R> {
  return ((params?: P) => expected<R>(builder((params || {}) as P))) as Query<P, R>;
}

const tablePathExpression = '$[ns~".";table;ns,".",table]';

const fetchTables: IBaseQueries['fetchTables'] = query<NamespaceParams, NSDatabase.ITable>((params) => {
  const namespace = namespaceFromParams(params);
  return `{[ns]
  tbls:@[tables;\`$ns;{\`symbol$()}];
  rowCount:count tbls;
  \`label\`type\`schema\`database\`isView\`childType xcol ([] label:tbls;
      typ:rowCount#enlist ${qString(ContextValue.TABLE)};
      schema:rowCount#enlist ns;
      database:rowCount#enlist ns;
      isView:rowCount#0b;
      childType:rowCount#enlist ${qString(ContextValue.COLUMN)})
}[${qString(namespace)}]`;
});

const fetchViews: IBaseQueries['fetchTables'] = query<NamespaceParams, NSDatabase.ITable>((params) => {
  const namespace = namespaceFromParams(params);
  return `{[ns]
  viewNames:$[ns~".";@[views;(::);{\`symbol$()}];@[system;"b ",ns;{\`symbol$()}]];
  rowCount:count viewNames;
  \`label\`type\`schema\`database\`isView\`childType xcol ([] label:viewNames;
      typ:rowCount#enlist ${qString(ContextValue.VIEW)};
      schema:rowCount#enlist ns;
      database:rowCount#enlist ns;
      isView:rowCount#1b;
      childType:rowCount#enlist ${qString(ContextValue.COLUMN)})
}[${qString(namespace)}]`;
});

const fetchFunctions: IBaseQueries['fetchFunctions'] = query<NamespaceParams, NSDatabase.IFunction>((params) => {
  const namespace = namespaceFromParams(params);
  return `{[ns]
  fnNames:@[system;"f ",ns;{\`symbol$()}];
  rowCount:count fnNames;
  \`label\`name\`type\`schema\`database\`signature\`args\`resultType\`childType\`iconName xcol ([] label:fnNames;
      name:fnNames;
      typ:rowCount#enlist ${qString(ContextValue.FUNCTION)};
      schema:rowCount#enlist ns;
      database:rowCount#enlist ns;
      signature:string fnNames;
      args:rowCount#enlist "";
      resultType:rowCount#enlist "function";
      childType:rowCount#enlist ${qString(ContextValue.NO_CHILD)};
      iconName:rowCount#enlist "function")
}[${qString(namespace)}]`;
});

const fetchColumns: IBaseQueries['fetchColumns'] = query<TableParams, NSDatabase.IColumn>((params) => {
  const namespace = namespaceFromParams(params);
  const table = tableNameFromParams(params);
  return `{[ns;table]
  tbl:\`$ ${tablePathExpression};
  metaRows:0!meta tbl;
  rowCount:count metaRows;
  \`label\`dataType\`type\`table\`schema\`database\`isNullable\`childType\`c\`t\`f\`a xcol ([] label:metaRows\`c;
    dataType:metaRows\`t;
    typ:rowCount#enlist ${qString(ContextValue.COLUMN)};
    table:rowCount#enlist table;
    schema:rowCount#enlist ns;
    database:rowCount#enlist ns;
    isNullable:rowCount#1b;
    childType:rowCount#enlist ${qString(ContextValue.NO_CHILD)};
    c:metaRows\`c;
    t:metaRows\`t;
    f:metaRows\`f;
    a:metaRows\`a)
}[${qString(namespace)};${qString(table)}]`;
});

const describeTable: IBaseQueries['describeTable'] = fetchColumns;

const fetchRecords: IBaseQueries['fetchRecords'] = query<TableParams & { limit: number; offset: number }, any>((params) => {
  const namespace = namespaceFromParams(params);
  const table = tableNameFromParams(params);
  const limit = Number(params.limit || 50);
  const offset = Number(params.offset || 0);
  return `{[ns;table;limit;offset]
  tbl:\`$ ${tablePathExpression};
  (offset;limit) sublist value tbl
}[${qString(namespace)};${qString(table)};${limit};${offset}]`;
});

const countRecords: IBaseQueries['countRecords'] = query<TableParams, { total: number }>((params) => {
  const namespace = namespaceFromParams(params);
  const table = tableNameFromParams(params);
  return `{[ns;table]
  tbl:\`$ ${tablePathExpression};
  ([] total:enlist count value tbl)
}[${qString(namespace)};${qString(table)}]`;
});

const searchTables: IBaseQueries['searchTables'] = query<{ search: string; namespace?: string }, NSDatabase.ITable>((params) => {
  return fetchTables(params as any).toString();
});

const searchColumns: IBaseQueries['searchColumns'] = query<{ search: string; tables: NSDatabase.ITable[]; namespace?: string }, NSDatabase.IColumn>((params) => {
  const table = params.tables && params.tables.length ? params.tables[0] : undefined;
  return table ? fetchColumns({ ...params, table } as any).toString() : '()';
});

const searchFunctions: IBaseQueries['searchFunctions'] = query<{ search: string; namespace?: string }, NSDatabase.IFunction>((params) => {
  return fetchFunctions(params as any).toString();
});

export default {
  describeTable,
  countRecords,
  fetchColumns,
  fetchFunctions,
  fetchRecords,
  fetchTables,
  fetchViews,
  searchColumns,
  searchFunctions,
  searchTables,
};
