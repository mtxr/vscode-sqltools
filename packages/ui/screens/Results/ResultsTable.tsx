import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import {
  SortingState,
  IntegratedSorting,
  FilteringState,
  IntegratedFiltering,
  DataTypeProvider,
} from '@devexpress/dx-react-grid';
import { Grid, VirtualTable, TableHeaderRow, TableFilterRow, Table } from '@devexpress/dx-react-grid-material-ui';
import Code from '@material-ui/icons/Code';
import { toRegEx } from '@sqltools/ui/lib/utils';
import { ResultsTableProps } from './lib/ResultsTableProps';
import { filterPredicate } from './lib/filterPredicate';
import { availableFilterOperations, MenuActions } from './constants';
import { clipboardInsert } from '@sqltools/ui/lib/utils';
import getVscode from '../../lib/vscode';
import Menu from '../../components/Menu';

const getRowId = row => row.id || JSON.stringify(row);

const FilterIcon = ({ type, ...restProps }) => {
  if (type === 'regex') return <Code {...restProps} />;
  return <TableFilterRow.Icon type={type} {...restProps} />;
};

const TableCell = (openContextMenu: ResultsTable['openContextMenu']) => (props: Table.DataCellProps) => (
  <Table.Cell
    {...props}
    onContextMenu={e => openContextMenu(e, props.row, props.column, props.tableRow.key)}
  />
);

const TableRow = (selectedRow) => (props: Table.DataRowProps) => (
  <Table.Row
    {...props}
    className={selectedRow === props.tableRow.key ? 'selected-row' : undefined}
  />
);

const GridRoot = (props) => <Grid.Root {...props} style={{ width: '100%', overflow: 'auto', height: '100%' }}/>;

const columnExtensions = cols => cols.map(columnName => ({ columnName, predicate: filterPredicate }));

export default class ResultsTable extends React.PureComponent<ResultsTableProps> {
  state = {
    filters: [],
    contextMenu: {
      row: null,
      rowKey: null,
      column: null,
      options: [],
      position: {}
    }
  }

  changeFilters = filters => {
    Object.keys(filters).forEach(k => {
      if (filters[k].operation !== 'regex') return;
      filters[k].regex = toRegEx(filters[k].value);
    });
    this.setState({ filters });
  }

  openContextMenu = (e: React.MouseEvent<HTMLElement> = undefined, row: any, column: Table.DataCellProps['column'], rowKey: any) => {
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
          pageY: e.pageY
        }
      }
    });
  }

  onMenuSelect = (choice: string) => {
    const { contextMenu } = this.state;
    switch(choice) {
      case MenuActions.FilterByValueOption:
        const { filters = [] } = this.state;
        const filterIndex = filters.findIndex(filter => filter.columnName === contextMenu.column.name);
        if (filterIndex !== -1) filters.splice(filterIndex, 1);
        filters.push({
          columnName: contextMenu.column.name,
          operation: 'equal',
          value: contextMenu.row[contextMenu.column.name],
        })
        this.setState({
          filters,
        })
        break;
      case MenuActions.CopyCellOption:
        clipboardInsert(contextMenu.row[contextMenu.column.name]);
        break;
      case MenuActions.CopyRowOption:
        clipboardInsert(contextMenu.row || 'Failed');
        break;
      case MenuActions.ClearFiltersOption:
        this.setState({ filters: [] });
        break;
      case MenuActions.OpenEditorWithValueOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.insertText`,
            args: [contextMenu.row[contextMenu.column.name]]
          }
        });
        break;
      case MenuActions.OpenEditorWithRowOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.insertText`,
            args: [JSON.stringify(contextMenu.row, null, 2)]
          }
        });
        break;
      case MenuActions.ReRunQueryOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.executeQuery`,
            args: [this.props.query, this.props.connId]
          }
        });
        break;
      case MenuActions.SaveCSVOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.saveResults`,
            args: ['csv', this.props.connId]
          }
        });
        break;
      case MenuActions.SaveJSONOption:
        getVscode().postMessage({
          action: 'call',
          payload: {
            command: `${process.env.EXT_NAME}.saveResults`,
            args: ['json', this.props.connId]
          }
        });
        break;
    }
    this.setState({ contextMenu: { } });
  }

  tableContextOptions = (row: any, column: Table.DataCellProps['column']): any[] => {
    const options: any[] = [];
    const cellValue = row[column.name];
    if (typeof cellValue !== 'undefined') {
      options.push({ label: MenuActions.FilterByValueOption.replace('{value}', cellValue), value: MenuActions.FilterByValueOption });
      options.push('sep');
    }
    if (this.state.filters.length > 0) {
      options.push(MenuActions.ClearFiltersOption);
      options.push(MenuActions.Divider);
    }
    return options
    .concat([
      { label: MenuActions.OpenEditorWithValueOption.replace('{value}', cellValue), value: MenuActions.OpenEditorWithValueOption },
      MenuActions.OpenEditorWithRowOption,
      MenuActions.CopyCellOption,
      MenuActions.CopyRowOption,
      MenuActions.Divider,
      MenuActions.ReRunQueryOption,
      MenuActions.SaveCSVOption,
      MenuActions.SaveJSONOption,
    ]);
  }

  render() {
    const { rows, columns, columnNames } = this.props;
    const { filters } = this.state;

    return (
      <Paper square elevation={0} style={{ height: '100%' }}>
        <Grid rows={rows} columns={columns} getRowId={getRowId} rootComponent={GridRoot}>
          <DataTypeProvider
            for={columnNames}
            availableFilterOperations={availableFilterOperations}
          />
          <SortingState />
          <IntegratedSorting />
          <FilteringState
            filters={filters}
            onFiltersChange={this.changeFilters}
          />
          <IntegratedFiltering columnExtensions={columnExtensions(columnNames)} />
          <VirtualTable height="100%" cellComponent={TableCell(this.openContextMenu)} rowComponent={TableRow(this.state.contextMenu.rowKey)}/>
          <TableHeaderRow showSortingControls />
          <TableFilterRow
            showFilterSelector
            iconComponent={FilterIcon}
            messages={{ regex: 'RegEx' } as any}
          />
        </Grid>
        <Menu
          open={Boolean(this.state.contextMenu.row)}
          width={250}
          position={this.state.contextMenu.position}
          onSelect={this.onMenuSelect}
          options={this.state.contextMenu.options}
        />
      </Paper>
    );
  }
}
