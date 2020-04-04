import React from 'react';
import { Table as MTable } from '@devexpress/dx-react-grid-material-ui';

const TableRow = selectedRow => (props: MTable.DataRowProps) => (<MTable.Row {...props} className={selectedRow === props.tableRow.key ? 'selected-row' : undefined} />);

export default TableRow;