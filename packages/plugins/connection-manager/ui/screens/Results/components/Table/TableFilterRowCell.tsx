import React from 'react';
import { TableFilterRow } from '@devexpress/dx-react-grid-material-ui';

const TableFilterRowCell = (props: TableFilterRow.CellProps) => (<TableFilterRow.Cell {...props} className={'filterCell ' + (props.filter && typeof props.filter.value !== 'undefined' ? 'active' : '')} />);

export default TableFilterRowCell;