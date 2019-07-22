import { Column } from '@devexpress/dx-react-grid';
export interface ResultsTableProps {
  columns: Column[];
  columnNames: string[];
  rows: {
    [key: string]: any;
  }[];
  query: string;
  connId: string;
}
