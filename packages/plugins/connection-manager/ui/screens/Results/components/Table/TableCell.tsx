import React from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';
import { ValueRender } from './ValueRender';
import styled from 'styled-components';

const CustomCell = styled(MTable.Cell)`
white-space: pre;
position: relative;
&.td-syntax {
  padding: 0 !important;
  font-family: var(--vscode-editor-font-family, monospace);
  white-space: nowrap;
}

.cell-value {
  padding: 2px !important;
  display: inline-block;
}

.value-bool {
  border-radius: 2px;
  &.true {
    background: var(--vscode-editorGutter-addedBackground);
  }
  &.false {
    background: var(--vscode-editorGutter-deletedBackground);
  }
}
`;

const TableCell = (openContextMenu: ((...args: any[]) => void)) => (props: MTable.DataCellProps) => (
  <CustomCell
    {...props}
    className={`${(props as any).className || ''} ${typeof props.value === 'object' || Array.isArray(props.value) ? 'td-syntax' : ''}`}
    onContextMenu={e => openContextMenu(e, props.row, props.column, props.tableRow.rowId)}
    title={(typeof props.value === 'object' || Array.isArray(props.value) ? JSON.stringify(props.value, null, 2) : `${props.value}`)}
  >
    <ValueRender value={props.value} />
  </CustomCell>
);
export default TableCell;