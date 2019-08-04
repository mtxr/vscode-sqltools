import { Column } from '@devexpress/dx-react-grid';
import { ReactNode } from 'react';
export interface ResultsTableProps {
  error: boolean;
  columns: Column[];
  columnNames: string[];
  rows: {
    [key: string]: any;
  }[];
  query: string;
  connId: string;
  pageSize: number;
  openDrawerButton: ReactNode;
}
