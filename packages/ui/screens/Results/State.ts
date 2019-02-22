import { DatabaseInterface } from '@sqltools/core/interface';
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
