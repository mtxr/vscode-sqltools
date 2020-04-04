import React from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';
import { ValueRender } from './ValueRender';

const TableCell = (openContextMenu: ((...args: any[]) => void)) => (props: MTable.DataCellProps) => (
  <MTable.Cell {...props} onContextMenu={e => openContextMenu(e, props.row, props.column, props.tableRow.rowId)}>
    <ValueRender value={props.value} />
  </MTable.Cell>
);
export default TableCell;