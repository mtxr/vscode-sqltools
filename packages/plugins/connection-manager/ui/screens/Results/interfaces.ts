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
  loading: boolean;
  error: any;
  resultTabs: NSDatabase.IResult[];
  activeTab: number;
}
