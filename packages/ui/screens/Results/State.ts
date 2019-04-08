import { DatabaseInterface } from '@sqltools/core/plugin-api';
export default interface QueryResultsState {
  connId: string;
  activeTab?: string;
  isLoaded: boolean;
  error?: any;
  queries: string[];
  resultMap: {
    [query: string]: DatabaseInterface.QueryResults;
  };
}
