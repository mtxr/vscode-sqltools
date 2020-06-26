import React from 'react';
import { TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import { Column } from '@devexpress/dx-react-grid';
import styled from 'styled-components';

const TooltipTextContainer = styled.span`
font-size: 0.9rem;
`;

const getMessage = (column: Column) => () => {
  return <TooltipTextContainer>Sort <strong>{column.title || column.name}</strong></TooltipTextContainer> as any;
}

const SortLabel: typeof TableHeaderRow.SortLabel = (props) => (
  <TableHeaderRow.SortLabel
    {...props}
    getMessage={getMessage(props.column)}
  >

  </TableHeaderRow.SortLabel>
);
export default SortLabel;