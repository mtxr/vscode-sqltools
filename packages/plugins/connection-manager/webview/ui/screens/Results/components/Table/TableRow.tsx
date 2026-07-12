import React from 'react';
import { TableSelection } from '@devexpress/dx-react-grid-material-ui';
import MTableRow from '@material-ui/core/TableRow';
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles';
import style from './style.m.scss';

const styles = () => createStyles({
  selected: {
    background: 'var(--vscode-editor-selectionBackground)',
    color: 'var(--vscode-editor-selectionForeground)',
  },
});

type SelectedRowProps = TableSelection.RowProps & WithStyles<typeof styles> & {
  /**
   * When provided, called instead of onToggle() so the parent can implement
   * custom selection logic (e.g. shift+click range selection).
   * Receives the original mouse event and the row's rowId.
   */
  onRowClick?: (e: React.MouseEvent<HTMLTableRowElement>, rowId: number | string) => void;
};

const Selected = withStyles(styles, { name: 'TableSelectRow' })(({
  classes,
  onToggle,
  selectByRowClick,
  highlighted,
  tableRow,
  onRowClick,
  ...restProps
 }: SelectedRowProps & TableSelection.RowProps) => (
  <MTableRow
    {...restProps}
    className={highlighted ? `${classes.selected} ${style.selectedRow}` : undefined}
    onMouseDown={(e) => {
      // dx-react-grid may pass onMouseDown in restProps and handle any mouse
      // button as a selection trigger.  Block non-left-clicks here so that
      // right-click (button 2) never toggles or clears the row selection.
      if (e.button !== 0) { e.stopPropagation(); return; }
      (restProps as any).onMouseDown?.(e);
    }}
    onClick={(e) => {
      if (!selectByRowClick) return;
      e.stopPropagation();
      if (onRowClick) {
        onRowClick(e, tableRow.rowId);
      } else {
        onToggle();
      }
    }}
  />
));
const TableRow = {
  Selected,
}
export default TableRow;