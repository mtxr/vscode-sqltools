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
} from '@devexpress/dx-react-grid';

import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  Table as MTable,
  TableColumnResizing,
  PagingPanel,
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
import TableRow from './TableRow';
import GridRoot from './GridRoot';
import generateColumnExtensions from './generateColumnExtensions';
import { IQueryOptions } from '@sqltools/types';
import { initialState, TableState } from './state';
import sendMessage from '../../../../lib/messages';

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
    rowKey: any
  ) => {
    const options = this.tableContextOptions(row, column);
    if (!options || options.length === 0) return;
    this.setState({
      contextMenu: {
        row,
        rowKey,
        column,
        options,
        position: {
          pageX: e.pageX,
          pageY: e.pageY,
        },
      },
    });
  };

  onMenuSelect = (choice: string) => {
    const { contextMenu } = this.state;
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
          contextMenu: initialState.contextMenu
        });
      case MenuActions.CopyCellOption:
        clipboardInsert(contextMenu.row[contextMenu.column.name]);
        return this.setState({ contextMenu: initialState.contextMenu });
      case MenuActions.CopyRowOption:
        clipboardInsert(contextMenu.row || 'Failed');
        return this.setState({ contextMenu: initialState.contextMenu });
      case MenuActions.ClearFiltersOption:
        return this.setState({ filters: [], contextMenu: initialState.contextMenu });
      case MenuActions.OpenEditorWithValueOption:
        sendMessage('call', {
          command: `${process.env.EXT_NAMESPACE}.insertText`,
          args: [`${contextMenu.row[contextMenu.column.name]}`],
        });
        return this.setState({ contextMenu: initialState.contextMenu });
      case MenuActions.OpenEditorWithRowOption:
        sendMessage('call', {
          command: `${process.env.EXT_NAMESPACE}.insertText`,
          args: [JSON.stringify(contextMenu.row, null, 2)],
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
    const options: any[] = [];
    let cellValue = row[column.name];
    const cellValueIsObject = cellValue && (Array.isArray(cellValue) || cellValue.toString() === '[object Object]');
    const replaceString = cellValueIsObject ? 'Cell Value' : `'${cellValue}'`;
    if (typeof cellValue !== 'undefined' && !cellValueIsObject) {
      options.push({
        label: MenuActions.FilterByValueOption.replace('{contextAction}', replaceString),
        value: MenuActions.FilterByValueOption,
      });
      options.push('sep');
    }
    if (this.state.filters.length > 0) {
      options.push(MenuActions.ClearFiltersOption);
      options.push(MenuActions.Divider);
    }
    return options.concat([
      {
        label: MenuActions.OpenEditorWithValueOption.replace('{contextAction}', replaceString),
        value: MenuActions.OpenEditorWithValueOption,
      },
      MenuActions.OpenEditorWithRowOption,
      {
        label: MenuActions.CopyCellOption.replace('{contextAction}', replaceString),
        value: MenuActions.CopyCellOption,
      },
      MenuActions.CopyRowOption,
      MenuActions.Divider,
      MenuActions.ReRunQueryOption,
      MenuActions.SaveCSVOption,
      MenuActions.SaveJSONOption,
    ]);
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

  render() {
    const { rows, columns, columnNames, pageSize, focusMessagesButton, error, showPagination, page, total, changePage } = this.props;
    const { filters } = this.state;
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
              <VirtualTable
                height="100%"
                cellComponent={TableCell(this.openContextMenu)}
                rowComponent={TableRow(this.state.contextMenu.rowKey)}
              />
              <TableColumnResizing columnWidths={columnExtensions} onColumnWidthsChange={this.updateWidths} />
              <TableHeaderRow showSortingControls />
              <TableFilterRow
                cellComponent={TableFilterRowCell}
                showFilterSelector
                iconComponent={FilterIcon}
                messages={{ regex: 'RegEx' } as any}
              />
              {<PagingPanel containerComponent={PagingPanelContainer(focusMessagesButton, showPagination)} />}
            </Grid>
            <Menu
              open={Boolean(this.state.contextMenu.row)}
              width={250}
              position={this.state.contextMenu.position}
              onSelect={this.onMenuSelect}
              options={this.state.contextMenu.options}
            />
          </>
        )}
      </Paper>
    );
  }
}
