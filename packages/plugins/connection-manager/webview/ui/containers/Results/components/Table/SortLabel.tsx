import React from 'react';
import { TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { Column } from '@devexpress/dx-react-grid';
import style from './style.m.scss';

const getMessage = (column: Column) => () => {
  return <span className={style.sortLabel}>Sort <strong>{column.title || column.name}</strong></span> as any;
}

const SortLabel: typeof TableHeaderRow.SortLabel = (props) => (
  <TableHeaderRow.SortLabel
    {...props}
    getMessage={getMessage(props.column)}
  >

  </TableHeaderRow.SortLabel>
);
export default SortLabel;