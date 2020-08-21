import { Column } from '@devexpress/dx-react-grid';
import { NSDatabase, IQueryOptions } from '@sqltools/types';
import { ReactNode } from 'react';
import { MenuActions } from './constants';

export interface TableProps {
  error: boolean;
  columns: Column[];
  columnNames: string[];
  rows: {
    [key: string]: any;
  }[];
  query: string;
  queryType?: NSDatabase.IResult['queryType']; // for pagination
  queryParams?: { [k: string]: any };
  queryOptions: IQueryOptions;
  pageSize: number;
  page?: number;
  total?: number;
  footerButtons: ReactNode;
  showPagination: boolean;
  changePage?: (page: number) => void;
  menuActions?: Partial<{ [k in MenuActions]: (...args: any[]) => void }>
}

export interface QueryResultsState {
  loading: boolean;
  error: any;
  resultTabs: NSDatabase.IResult[];
  activeTab: number;
}
