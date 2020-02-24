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
    table: string;
  }) => IExpectedResult<{
    total: number;
  }>;
  fetchSchemas?: (params: NSDatabase.IDatabase) => IExpectedResult<NSDatabase.ISchema>;
  fetchTables: (params: NSDatabase.ISchema) => IExpectedResult<NSDatabase.ITable>;
  // old api
  describeTable: (params: NSDatabase.ITable) => IExpectedResult<any>;
  fetchColumns: (params: NSDatabase.ITable) => IExpectedResult<NSDatabase.IColumn>;
  fetchFunctions?: (params: NSDatabase.ISchema) => IExpectedResult<NSDatabase.IFunction>;
  [id: string]: string | ((params: any) => (string | IExpectedResult));
}
