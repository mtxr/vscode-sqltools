import { DatabaseInterface } from '@sqltools/core/plugin-api';
export default interface QueryResultsState {
  connId: string;
  activeTab?: string;
  error?: any;
  queries: string[];
  resultMap: {
    [query: string]: DatabaseInterface.QueryResults;
  };
  pageSize: number;
}
