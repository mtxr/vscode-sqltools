export declare interface IExpectedResult<T = any> extends String {
  resultsIn?: T;
}
export declare interface IBaseQueries {
  fetchRecordsV2?: (params: {
    limit: number;
    offset: number;
    table: string;
  }) => string;
  countRecordsV2?: (params: {
    table: string;
  }) => IExpectedResult<{
    total: number;
  }>;
  // old api
  fetchTables: string;
  describeTable: string;
  fetchColumns: string;
  fetchRecords: string;
  fetchFunctions?: string;
  [id: string]: string | ((params: any) => (string | IExpectedResult));
}
