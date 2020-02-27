import { NSDatabase } from '../generic';

export interface IExpectedResult<T = any> extends String {
  resultsIn?: T;
}
export interface IBaseQueries {
  fetchRecords: (params: {
    limit: number;
    offset: number;
    table: NSDatabase.ITable;
  }) => string;
  countRecords: (params: {
    table: NSDatabase.ITable;
  }) => IExpectedResult<{
    total: number;
  }>;
  fetchSchemas?: (params: NSDatabase.IDatabase) => IExpectedResult<NSDatabase.ISchema>;
  fetchTables: (params: NSDatabase.ISchema) => IExpectedResult<NSDatabase.ITable>;
  searchTables: ({ search: string }) => IExpectedResult<NSDatabase.ITable>;
  // old api
  describeTable: (params: NSDatabase.ITable) => IExpectedResult<any>;
  fetchColumns: (params: NSDatabase.ITable) => IExpectedResult<NSDatabase.IColumn>;
  fetchFunctions?: (params: NSDatabase.ISchema) => IExpectedResult<NSDatabase.IFunction>;
  [id: string]: string | ((params: any) => (string | IExpectedResult));
}
