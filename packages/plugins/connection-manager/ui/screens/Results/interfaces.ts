import { Column } from '@devexpress/dx-react-grid';
import { NSDatabase, IQueryOptions } from '@sqltools/types';
import { ReactNode } from 'react';

export interface TableProps {
  error: boolean;
  columns: Column[];
  columnNames: string[];
  rows: {
    [key: string]: any;
  }[];
  query: string;
  queryType?: string; // for pagination
  queryParams?: { [k: string]: any };
  queryOptions: IQueryOptions;
  pageSize: number;
  page?: number;
  total?: number;
  focusMessagesButton: ReactNode;
  showPagination: boolean;
  changePage?: (page: number) => void;
}

export interface QueryResultsState {
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
