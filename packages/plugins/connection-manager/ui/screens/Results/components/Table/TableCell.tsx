import React from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';
import { ValueRender } from './ValueRender';
import style from './style.m.scss';

const TableCell = (openContextMenu: ((...args: any[]) => void)) => (props: MTable.DataCellProps) => (
  <MTable.Cell
    {...props}
    className={`${(props as any).className || ''} ${style.tableCell} ${typeof props.value === 'object' || Array.isArray(props.value) ? ('td-syntax ' + style.tableCellSyntax) : ''}`}
    onContextMenu={e => openContextMenu(e, props.row, props.column, props.tableRow.rowId)}
    title={(typeof props.value === 'object' || Array.isArray(props.value) ? JSON.stringify(props.value, null, 2) : `${props.value}`)}
  >
    <ValueRender value={props.value} />
  </MTable.Cell>
);
export default TableCell;