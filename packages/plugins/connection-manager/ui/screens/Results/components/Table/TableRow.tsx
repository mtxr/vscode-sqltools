import React from 'react';
import { Table, TableSelection } from '@devexpress/dx-react-grid-material-ui';
import MTableRow from '@material-ui/core/TableRow';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';

const styles = () => createStyles({
  selected: {
    background: 'var(--vscode-editor-selectionBackground)',
    color: 'var(--vscode-editor-selectionForeground)',
  },
});

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
  <MTableRow
    className={highlighted ? classes.selected : undefined}
    onClick={(e) => {
      if (!selectByRowClick) return;
      e.stopPropagation();
      onToggle();
    }}
    {...restProps}
  >
    {children}
  </MTableRow>
));
const TableRow = {
  Selected,
}
export default TableRow;