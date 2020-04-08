import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider,
  PagingState,
  CustomPaging,
  PagingStateProps,
  SelectionState,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  Table as MTable,
  TableColumnResizing,
  PagingPanel,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import { toRegEx } from '@sqltools/plugins/connection-manager/ui/lib/utils';
import { TableProps } from '../../interfaces';
import { availableFilterOperations, MenuActions } from '../../constants';
import { clipboardInsert } from '@sqltools/plugins/connection-manager/ui/lib/utils';
import Menu from '../../../../components/Menu';
import ErrorIcon from '../../../../components/ErrorIcon';
import TableFilterRowCell from './TableFilterRowCell';
import PagingPanelContainer from './PagingPanelContainer';
import FilterIcon from './FilterIcon';
import TableCell from './TableCell';
import GridRoot from './GridRoot';
import generateColumnExtensions from './generateColumnExtensions';
import { IQueryOptions } from '@sqltools/types';
import { initialState, TableState } from './state';
import sendMessage from '../../../../lib/messages';
import TableRow from './TableRow';

export default class Table extends React.PureComponent<TableProps, TableState> {
  state = initialState;

  changeFilters = (filters = []) => {
    filters = filters.map(filter => {
      if (filter.operation === 'regex')
        filter.regex = toRegEx(filter.value);
      return filter;
    });
    this.setState({ filters });
  };

  openContextMenu = (
    e: React.MouseEvent<HTMLElement> = undefined,
    row: any,
    column: MTable.DataCellProps['column'],
    index: number,
  ) => {
    const options = this.tableContextOptions(row, column);
    if (!options || options.length === 0) return;
    this.setState({
      contextMenu: {
        row,
        column,
        options,
        anchorEl: e.currentTarget,
        position: {
          x: e.clientX,
          y: e.clientY,
        },
      },
      selection: this.state.selection.includes(index) ? this.state.selection : [index],
    });
  };

  closeContextMenu = () => {
    this.setState({ contextMenu: initialState.contextMenu });
  }
  onMenuSelect = (choice: string) => {
    const { contextMenu } = this.state;
    let selectedRows: any[] | any = this.state.selection.map(index => this.props.rows[index]);
    selectedRows = selectedRows.length === 1 ? selectedRows[0] : selectedRows;
    const cellValue = contextMenu.row[contextMenu.column.name];
    switch (choice) {
      case MenuActions.FilterByValueOption:
        const { filters = [] } = this.state;
        const filterIndex = filters.findIndex(filter => filter.columnName === contextMenu.column.name);
        if (filterIndex !== -1) filters.splice(filterIndex, 1);
        filters.push({
          columnName: contextMenu.column.name,
          operation: 'equal',
          value: contextMenu.row[contextMenu.column.name],
        });
        return this.setState({
          filters,
          contextMenu: initialState.contextMenu,
          selection: [],
        });
      case MenuActions.CopyCellOption:
      case MenuActions.CopyRowOption:
        clipboardInsert(choice === MenuActions.CopyCellOption ? cellValue : selectedRows);
        return this.setState({ contextMenu: initialState.contextMenu });
      case MenuActions.ClearFiltersOption:
        return this.setState({ filters: [], contextMenu: initialState.contextMenu, selection: [] });
      case MenuActions.ClearSelection:
        return this.setState({ contextMenu: initialState.contextMenu, selection: [] });
      case MenuActions.OpenEditorWithValueOption:
      case MenuActions.OpenEditorWithRowOption:
        sendMessage('call', {
          command: `${process.env.EXT_NAMESPACE}.insertText`,
          args: [choice === MenuActions.OpenEditorWithValueOption ? `${cellValue}` : JSON.stringify(selectedRows, null, 2)],
        });
        return this.setState({ contextMenu: initialState.contextMenu });
      case MenuActions.ReRunQueryOption:
        if (this.props.queryType) {
          sendMessage('call', {
            command: `${process.env.EXT_NAMESPACE}.${this.props.queryType}`,
            args: [this.props.queryParams, { ...this.props.queryOptions, page: this.props.page, pageSize: this.props.pageSize || 50 }],
          });
        } else {
          sendMessage('call', {
            command: `${process.env.EXT_NAMESPACE}.executeQuery`,
            args: [
              this.props.query,
              this.props.queryOptions as IQueryOptions
            ],
          });
        }
        return this.setState({ contextMenu: initialState.contextMenu });
      case MenuActions.SaveCSVOption:
      case MenuActions.SaveJSONOption:
        sendMessage('call', {
          command: `${process.env.EXT_NAMESPACE}.saveResults`,
          args: [{
            ...this.props.queryOptions,
            fileType: choice === MenuActions.SaveJSONOption ? 'json' : 'csv'
          }],
        });
        return this.setState({ contextMenu: initialState.contextMenu });
    }
  };

  updateWidths = (columnExtensions) => {
    this.setState({ columnExtensions });
  }

  tableContextOptions = (row: any, column: MTable.DataCellProps['column']): any[] => {
    let cellValue = row[column.name];
    const cellValueIsObject = cellValue && (Array.isArray(cellValue) || cellValue.toString() === '[object Object]');
    const replaceString = cellValueIsObject ? 'Cell Value' : `'${cellValue}'`;
    const isMultiSelection = this.state.selection.length > 1;
    const cellOptions = [];
    const filterOptions = [];
    const queryOptions = [MenuActions.ReRunQueryOption];
    const rowOptions = [
      MenuActions.CopyRowOption,
      MenuActions.OpenEditorWithRowOption,
    ];
    const resultOptions = [
      MenuActions.SaveCSVOption,
      MenuActions.SaveJSONOption,
    ];
    if (typeof cellValue !== 'undefined' && !cellValueIsObject) {
      cellOptions.push({
        label: MenuActions.FilterByValueOption.replace('{contextAction}', replaceString),
        value: MenuActions.FilterByValueOption,
      });
    }
    if (this.state.filters.length > 0) {
      filterOptions.push(MenuActions.ClearFiltersOption);
    }
    if (isMultiSelection) {
      filterOptions.push(MenuActions.ClearSelection);
    }

    cellOptions.push(
      {
        label: MenuActions.CopyCellOption.replace('{contextAction}', replaceString),
        value: MenuActions.CopyCellOption,
      },
      {
        label: MenuActions.OpenEditorWithValueOption.replace('{contextAction}', replaceString),
        value: MenuActions.OpenEditorWithValueOption,
      },
    );

    let options = [];
    if (cellOptions.length > 0) {
      options = options.concat(cellOptions);
      options.push(MenuActions.Divider);
    }
    if (filterOptions.length > 0) {
      options = options.concat(filterOptions);
      options.push(MenuActions.Divider);
    }
    if (rowOptions.length > 0) {
      options = options.concat(rowOptions);
      options.push(MenuActions.Divider);
    }
    if (queryOptions.length > 0) {
      options = options.concat(queryOptions);
      options.push(MenuActions.Divider);
    }
    if (resultOptions.length > 0) {
      options = options.concat(resultOptions);
    }
    return options;
  };

  renderError = (focusMessagesButton: React.ReactNode) => (
    <div
      className='queryError'
      style={{
        flexGrow: 1,
        textAlign: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        display: 'flex',
        justifyContent: 'center',
        height: '100%'
      }}
    >
      <div>
        <ErrorIcon />
      </div>
      <div style={{ margin: '30px' }}>Query with errors. Please, check the error below.</div>
      <div>{focusMessagesButton}</div>
    </div>
  );

  setSelection = (selection = []) => this.setState({ selection });
  render() {
    const { rows, columns, columnNames, pageSize, focusMessagesButton, error, showPagination, page, total, changePage } = this.props;
    const { filters, selection, contextMenu } = this.state;
    const columnExtensions = this.state.columnExtensions || generateColumnExtensions(columnNames, rows);
    let pagingProps: PagingStateProps = {};
    if (typeof page === 'number') {
      pagingProps = {
        currentPage: page,
        onCurrentPageChange: changePage
      };
    } else {
      pagingProps = {
        defaultCurrentPage: 0
      };
    }
    return (
      <Paper square elevation={0} style={{ height: '100%' }} className="result">
        {error ? (
          this.renderError(focusMessagesButton)
        ) : (
          <>
            <Grid rows={rows} columns={columns} rootComponent={GridRoot}>
              <DataTypeProvider for={columnNames} availableFilterOperations={availableFilterOperations} />
              <SortingState />
              <IntegratedSorting />
              <FilteringState filters={filters} onFiltersChange={this.changeFilters} />
              <IntegratedFiltering columnExtensions={columnExtensions} />
              <PagingState pageSize={pageSize} {...pagingProps} />
              <CustomPaging totalCount={total || rows.length} />
              <SelectionState selection={selection} onSelectionChange={this.setSelection} />
              <VirtualTable
                height="100%"
                cellComponent={TableCell(this.openContextMenu)}
              />
              <TableColumnResizing columnWidths={columnExtensions} onColumnWidthsChange={this.updateWidths} />
              <TableHeaderRow showSortingControls />
              <TableSelection
                selectByRowClick
                highlightRow
                showSelectionColumn={false}
                rowComponent={TableRow.Selected}
              />
              <TableFilterRow
                cellComponent={TableFilterRowCell}
                showFilterSelector
                iconComponent={FilterIcon}
                messages={{ regex: 'RegEx' } as any}
              />
              {<PagingPanel containerComponent={PagingPanelContainer(focusMessagesButton, showPagination)} />}
            </Grid>
            <Menu
              anchorEl={contextMenu.anchorEl}
              width={300}
              onClose={this.closeContextMenu}
              position={contextMenu.position}
              onSelect={this.onMenuSelect}
              options={contextMenu.options}
            />
          </>
        )}
      </Paper>
    );
  }
}
