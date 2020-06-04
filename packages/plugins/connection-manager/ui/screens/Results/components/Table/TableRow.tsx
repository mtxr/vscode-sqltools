import React from 'react';
import { TableSelection } from '@devexpress/dx-react-grid-material-ui';
import MTableRow from '@material-ui/core/TableRow';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import styled from 'styled-components';

const styles = () => createStyles({
  selected: {
    background: 'var(--vscode-editor-selectionBackground)',
    color: 'var(--vscode-editor-selectionForeground)',
  },
});

const CustomTableRow = styled(MTableRow)`
&.selected-row .td-syntax {
  white-space: pre;
}
`;

type SelectedRowProps = TableSelection.RowProps & WithStyles<typeof styles>;

const Selected = withStyles(styles, { name: 'TableSelectRow' })(({
  children,
  classes,
  onToggle,
  selectByRowClick,
  highlighted,
  tableRow,
  ...restProps
 }: SelectedRowProps & TableSelection.RowProps) => (
  <CustomTableRow
    className={highlighted ? `${classes.selected} selected-row` : undefined}
    onClick={(e) => {
      if (!selectByRowClick) return;
      e.stopPropagation();
      onToggle();
    }}
    {...restProps}
  >
    {children}
  </CustomTableRow>
));
const TableRow = {
  Selected,
}
export default TableRow;