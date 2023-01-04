import React, { useCallback, useMemo, useState } from 'react';
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
  TableColumnResizingProps,
  Filter,
} from '@devexpress/dx-react-grid';

import {
  Grid,
  VirtualTable,
  TableHeaderRow,
  TableFilterRow,
  TableColumnResizing,
  PagingPanel,
  TableSelection,
} from '@devexpress/dx-react-grid-material-ui';
import { availableFilterOperations, MenuActions } from '../../constants';
import TableFilterRowCell from './TableFilterRowCell';
import PagingPanelContainer from './PagingPanelContainer';
import FilterIcon from './FilterIcon';
import TableCell from './TableCell';
import computeColumnWidths from './computeColumnWidths';
import sendMessage from '../../../../lib/messages';
import TableRow from './TableRow';
import { UIAction } from '../../../Settings/actions';
import { filterPredicate } from '../../lib/filterPredicate';
import SortLabel from './SortLabel';
import { toRegEx, clipboardInsert } from '../../../../lib/utils';
import GridRoot from './GridRoot';
import QueryError from '../QueryError';
import { MenuProvider } from '../../context/MenuContext';
import useCurrentResult from '../../hooks/useCurrentResult';
import useContextAction from '../../hooks/useContextAction';

const Table = ({ setContextState }) => {
  const [filters, setFilters] = useState<(Filter & { regex?: RegExp })[]>([]);
  const [selection, setSelection] = useState<Array<number | string>>([]);
  const { exportResults, reRunQuery } = useContextAction();
  const { result } = useCurrentResult();
  const { results: rows = [], cols = [], error, messages = [], page, pageSize, total, queryType, queryParams, requestId } = result || {};

  const columnExtensions = useMemo(() => cols.map(columnName => ({ columnName, predicate: filterPredicate })), [cols]);

  const showPagination = useMemo(() => Math.max(total ?? 0, rows.length) > pageSize, [total, rows]);

  const { columnObjNames, columnNames } = useMemo(() => {
    const columnNames = cols.length > 0 ? cols : [''];
    return { columnNames, columnObjNames: cols.map(title => ({ name: title, title })) };
  }, [cols]);

  const changePage = (page: number) => {
    setContextState({ loading: true });
    sendMessage(UIAction.CALL, {
      command: `${process.env.EXT_NAMESPACE}.${queryType}`,
      args: [queryParams, { page, pageSize: pageSize ?? 50, requestId }],
    });
  };

  const changeFilters = useCallback((newFilters: typeof filters = []) => {
    newFilters = newFilters.map(filter => {
      if (filter.operation === 'regex')
        filter.regex = toRegEx(filter.value);
      return filter;
    });
    setFilters(newFilters);
  }, [setFilters]);

  const onMenuOpen = useCallback(({ rowindex }) => {
    rowindex = Number(rowindex);
    if (isNaN(rowindex) || rowindex < 0) return;
    setSelection(selection.includes(rowindex) ? selection : (rowindex >= 0 ? [rowindex] : []));
  }, [JSON.stringify(selection)]);

  const defaultColumnWidths = useMemo(() => computeColumnWidths(cols ?? [], rows ?? []), [...cols, rows && rows.length]);
  const [columnWidthOverrides, setColumnWidthOverrides] = useState<Record<string, string | number>>({});
  const updateWidths: TableColumnResizingProps["onColumnWidthsChange"] = useCallback((newColsInfo) =>
    setColumnWidthOverrides(oldOverrides => {
      const newOverrides = { ...oldOverrides };
      for (const { columnName, width } of newColsInfo) {
        if (width !== defaultColumnWidths[columnName] || columnName in oldOverrides)
          newOverrides[columnName] = width;
      }
      return newOverrides;
    }), [defaultColumnWidths]);
  const columnWidths = Object.entries({ ...defaultColumnWidths, ...columnWidthOverrides })
    .map(([columnName, width]) => ({ columnName, width }));

  const menuActions = {
    [MenuActions.ReRunQueryOption]: reRunQuery,
    [MenuActions.SaveCSVOption]: exportResults,
    [MenuActions.SaveJSONOption]: exportResults,
  }

  const onMenuSelect = useCallback((choice: string, { rowindex, colname }) => {
    rowindex = Number(rowindex);
    let selectedRows: any[] | any = selection.map(index => rows[index]);
    selectedRows = selectedRows.length === 1 ? selectedRows[0] : selectedRows;
    const cellValue = (rows[rowindex] ?? {})[colname];
    switch (choice) {
      case MenuActions.FilterByValueOption:
        const newFilters = [...filters];
        const filterIndex = newFilters.findIndex(filter => filter.columnName === colname);
        if (filterIndex !== -1) newFilters.splice(filterIndex, 1);
        newFilters.push({
          columnName: colname,
          operation: 'equal',
          value: cellValue,
        });
        setFilters(newFilters);
        return setSelection([]);
      case MenuActions.CopyCellOption:
      case MenuActions.CopyRowOption:
        return clipboardInsert(choice === MenuActions.CopyCellOption ? cellValue : selectedRows);
      case MenuActions.ClearFiltersOption:
        setFilters([]);
      case MenuActions.ClearSelection:
        return setSelection([]);
      case MenuActions.OpenEditorWithValueOption:
      case MenuActions.OpenEditorWithRowOption:
        return sendMessage(UIAction.CALL, {
          command: `${process.env.EXT_NAMESPACE}.insertText`,
          args: [choice === MenuActions.OpenEditorWithValueOption ? `${cellValue}` : JSON.stringify(selectedRows, null, 2)],
        });
      case MenuActions.ReRunQueryOption:
      case MenuActions.SaveCSVOption:
      case MenuActions.SaveJSONOption:
        return menuActions[choice](choice);
    }
  }, [JSON.stringify(selection), JSON.stringify(filters), rows, rows.length]);

  const getMenuOptions = useCallback(({ colname, rowindex }) => {
    rowindex = Number(rowindex);
    const row = rows[rowindex];
    const cellOptions = [];
    const filterOptions = [];
    const queryOptions = [MenuActions.ReRunQueryOption];
    const newSelection = selection.includes(rowindex) ? selection : (rowindex >= 0 ? [rowindex] : []);
    const isMultiSelection = newSelection.length > 1;
    const rowOptions = row ? [
      MenuActions.CopyRowOption,
      MenuActions.OpenEditorWithRowOption,
    ] : [];
    const resultOptions = newSelection.length > 0 ? [
      MenuActions.SaveCSVOption,
      MenuActions.SaveJSONOption,
    ] : [];

    if (row) {
      let cellValue = row[colname];
      const cellValueIsObject = cellValue && (Array.isArray(cellValue) ?? cellValue.toString() === '[object Object]');
      const replaceString = cellValueIsObject ? 'Cell Value' : `'${cellValue}'`;
      if (typeof cellValue !== 'undefined' && !cellValueIsObject) {
        cellOptions.push({
          label: MenuActions.FilterByValueOption.replace('{contextAction}', replaceString),
          value: MenuActions.FilterByValueOption,
        });
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
    }
    if (filters.length > 0) {
      filterOptions.push(MenuActions.ClearFiltersOption);
    }
    if (isMultiSelection) {
      filterOptions.push(MenuActions.ClearSelection);
    }

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
    if (options[options.length - 1] === MenuActions.Divider) {
      options.pop()
    }
    return options;
  }, [JSON.stringify(selection), JSON.stringify(filters), rows, rows.length]);

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
  if (!result) return null;

  return (
    <MenuProvider
      onOpen={onMenuOpen}
      getOptions={getMenuOptions}
      onSelect={onMenuSelect}
    >
      <Paper square elevation={0} className="result">
        {error && <QueryError messages={messages} />}
        {!error && <Grid rows={rows} columns={columnObjNames} rootComponent={GridRoot}>
          <DataTypeProvider for={columnNames} availableFilterOperations={availableFilterOperations} />
          <SortingState />
          <IntegratedSorting />
          <FilteringState filters={filters} onFiltersChange={changeFilters} />
          <IntegratedFiltering columnExtensions={columnExtensions} />
          <PagingState pageSize={pageSize ?? 50} {...pagingProps} />
          <CustomPaging totalCount={total ?? rows.length} />
          <SelectionState selection={selection} onSelectionChange={setSelection} />
          <VirtualTable cellComponent={TableCell} />
          <TableColumnResizing columnWidths={columnWidths} onColumnWidthsChange={updateWidths} />
          <TableHeaderRow showSortingControls sortLabelComponent={SortLabel} />
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
          {<PagingPanel containerComponent={PagingPanelContainer(showPagination)} />}
        </Grid>}
      </Paper>
    </MenuProvider>
  );
}


export default Table;