import { NSDatabase } from '@sqltools/types';
export default interface QueryResultsState {
  connId: string;
  activeTab?: string;
  error?: any;
  queries: string[];
  resultMap: {
    [query: string]: NSDatabase.IResult;
  };
  pageSize: number;
  loading: boolean;
}
