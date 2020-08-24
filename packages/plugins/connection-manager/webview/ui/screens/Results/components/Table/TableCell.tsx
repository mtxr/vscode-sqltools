import React from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';
import { CellValue } from './CellValue';
import style from './style.m.scss';

const TableCell = (openContextMenu: ((...args: any[]) => void)) => (props: MTable.DataCellProps) => (
  <MTable.Cell
    {...props}
    className={`${typeof props.value === 'object' || Array.isArray(props.value) ? style.tableCellSyntax : ''} ${props.value === true || props.value === false || props.value === null ? style.centered : ''} ${(props as any).className || ''}`}
    onContextMenu={e => openContextMenu(e, props.row, props.column, props.tableRow.rowId)}
    title={(typeof props.value === 'object' || Array.isArray(props.value) ? JSON.stringify(props.value, null, 2) : `${props.value}`)}
  >
    <CellValue value={props.value} />
  </MTable.Cell>
);
export default TableCell;