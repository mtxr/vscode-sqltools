import React from 'react';
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui';
import style from './style.m.scss';

const TableFilterRowCell = (props: TableFilterRow.CellProps) => (
  <TableFilterRow.Cell
    {...props}
    className={style.filterCell + (props.filter && typeof props.filter.value !== 'undefined' ? style.filterCellActive : style.filterCell)}
    />
  );

export default TableFilterRowCell;