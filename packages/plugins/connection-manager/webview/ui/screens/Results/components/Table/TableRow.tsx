import { TableSelection } from '@devexpress/dx-react-grid-material-ui';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import MTableRow from '@material-ui/core/TableRow';
import React from 'react';
import style from './style.m.scss';

const styles = () =>
  createStyles({
    selected: {
      background: 'var(--vscode-editor-selectionBackground)',
      color: 'var(--vscode-editor-selectionForeground)',
    },
  });

type SelectedRowProps = TableSelection.RowProps & WithStyles<typeof styles>;

const Selected = withStyles(styles, { name: 'TableSelectRow' })(
  ({
    classes,
    onToggle,
    selectByRowClick,
    highlighted,
    tableRow: _tableRow,
    ...restProps
  }: SelectedRowProps & TableSelection.RowProps) => (
    <MTableRow
      className={
        highlighted ? `${classes.selected} ${style.selectedRow}` : undefined
      }
      onClick={e => {
        if (!selectByRowClick) return;
        e.stopPropagation();
        onToggle();
      }}
      {...restProps}
    />
  )
);
const TableRow = {
  Selected,
};
export default TableRow;
