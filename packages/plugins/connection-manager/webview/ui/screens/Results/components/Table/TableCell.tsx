import React from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';
import { CellValue } from './CellValue';
import style from './style.m.scss';

const boolOrNull = (v: any) => v === true || v === false || v === null;
const isObjOrArray = (v: any) => typeof v === 'object' || Array.isArray(v);

const TableCell = (props: MTable.DataCellProps & { className?: string }) => {
  const displayAsCode = isObjOrArray(props.value);

  const classes = [style.tableCell];

  let value = props.value;

  if (displayAsCode) {
    classes.push(style.tableCellSyntax);
    value = JSON.stringify(props.value, null, 2);
  }
  if (boolOrNull(props.value)) classes.push(style.centered);
  if (props.className) classes.push((props as any).className);

  return (
    <MTable.Cell
      {...props}
      data-rowindex={props.tableRow.rowId}
      data-colname={props.column.name}
      className={classes.join(' ')}
    >
      <CellValue value={props.value} isCode={displayAsCode} />
    </MTable.Cell>
  );
};
export default TableCell;
