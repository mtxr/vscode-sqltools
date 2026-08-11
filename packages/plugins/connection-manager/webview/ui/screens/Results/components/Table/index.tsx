import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

/** Convert an array of row objects to a CSV string. */
function rowsToCSV(rows: any[]): string {
  if (!rows || rows.length === 0) return '';
  const cols = Object.keys(rows[0]);
  const escape = (v: any) => {
    const s = v === null || v === undefined ? '' : String(typeof v === 'object' ? JSON.stringify(v) : v);
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [cols.join(','), ...rows.map(r => cols.map(c => escape(r[c])).join(','))].join('\n');
}

const Table = ({ setContextState }) => {
  const [filters, setFilters] = useState<(Filter & { regex?: RegExp })[]>([]);
  const [selection, setSelection] = useState<Array<number | string>>([]);
  // Tracks the last row clicked without Shift — used as the start of a
  // Shift+click range selection.  A ref (not state) so it never triggers
  // re-renders on its own.
  const anchorIndexRef = useRef<number | null>(null);
  // Last cell the user clicked (left or right click) — the target for
  // Ctrl+C.  A ref since it never needs to trigger a re-render.
  const activeCellRef = useRef<{ rowindex: number; colname: string } | null>(null);
  const { exportResults } = useContextAction();
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

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  // Esc         → clear selection
  // Ctrl+A      → select all rows
  // Ctrl+C      → copy the active cell's value (skipped if the user has an
  //               actual text selection — let the browser copy that instead)
  // Ctrl+Shift+C → copy the whole selected row(s) as CSV
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Ignore when focus is inside an input/textarea (e.g. filter row).
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      // e.code (physical key) is used alongside e.key so the shortcut still
      // matches regardless of Caps Lock state or Shift-driven letter case
      // (Caps Lock/Shift turn e.key 'c' into 'C', which e.key alone would miss).
      const isKeyC = e.code === 'KeyC' || e.key.toLowerCase() === 'c';

      if (e.key === 'Escape') {
        e.preventDefault();
        setSelection([]);
        anchorIndexRef.current = null;
      } else if ((e.ctrlKey || e.metaKey) && (e.code === 'KeyA' || e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        setSelection(rows.map((_, i) => i));
      } else if ((e.ctrlKey || e.metaKey) && e.shiftKey && isKeyC) {
        if (selection.length === 0) return;
        e.preventDefault();
        const selectedRows = (selection as number[]).map(i => rows[i]).filter(Boolean);
        clipboardInsert(rowsToCSV(selectedRows));
      } else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && isKeyC) {
        // Don't hijack a real text selection made by the user (e.g. dragging
        // across part of a cell's value) — let the native copy handle that.
        if (window.getSelection()?.toString()) return;
        const active = activeCellRef.current;
        if (!active) return;
        const row = rows[active.rowindex];
        if (!row) return;
        e.preventDefault();
        clipboardInsert(row[active.colname]);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [rows, selection]);

  // Track the last-clicked cell (left or right click) so Ctrl+C knows what
  // to copy.  Runs on mousedown, which — unlike click — isn't stopped from
  // bubbling up by the row's selection handler.
  const onCellMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-rowindex][data-colname]');
    if (!cell || !cell.dataset.colname) return;
    activeCellRef.current = { rowindex: Number(cell.dataset.rowindex), colname: cell.dataset.colname };
  }, []);

  const onMenuOpen = useCallback(({ rowindex, colname }) => {
    rowindex = Number(rowindex);
    if (isNaN(rowindex) || rowindex < 0) return;
    if (colname) activeCellRef.current = { rowindex, colname };
    // Preserve any existing selection on right-click so the user never loses
    // a multi-row selection just by opening the context menu.
    // Only auto-select the right-clicked row as a fallback when nothing is
    // currently selected (gives the menu something to operate on).
    if (selection.length === 0) {
      setSelection([rowindex]);
    }
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

  const onMenuSelect = useCallback((choice: string, { rowindex, colname }) => {
    rowindex = Number(rowindex);
    const newSelection = selection.length > 0 ? selection : (rowindex >= 0 ? [rowindex] : []);
    const selectedRows = newSelection.map(index => rows[index as number]);
    const cellValue = (rows[rowindex] ?? {})[colname];

    switch (choice) {
      case MenuActions.FilterByValueOption:
        const newFilters = [...filters];
        const filterIndex = newFilters.findIndex(filter => filter.columnName === colname);
        if (filterIndex !== -1) newFilters.splice(filterIndex, 1);
        newFilters.push({ columnName: colname, operation: 'equal', value: cellValue });
        setFilters(newFilters);
        return setSelection([]);

      case MenuActions.CopyCellOption:
        return clipboardInsert(cellValue);

      case MenuActions.CopyColumnName:
        return clipboardInsert(colname);

      case MenuActions.CopyColumnNames:
        return clipboardInsert(cols.join(', '));

      case MenuActions.CopySelectedCSV:
        return clipboardInsert(rowsToCSV(selectedRows));

      case MenuActions.CopySelectedJSON:
        return clipboardInsert(JSON.stringify(
          selectedRows.length === 1 ? selectedRows[0] : selectedRows,
          null, 2
        ));

      case MenuActions.ClearFiltersOption:
        setFilters([]);
        return setSelection([]);

      case MenuActions.ClearSelection:
        return setSelection([]);

      case MenuActions.SaveCSVOption:
      case MenuActions.SaveJSONOption:
        return exportResults(choice);
    }
  }, [JSON.stringify(selection), JSON.stringify(filters), rows, rows.length, cols]);

  const getMenuOptions = useCallback(({ colname, rowindex }) => {
    rowindex = Number(rowindex);
    const row = rows[rowindex];
    // Use the live selection; fall back to the right-clicked row only when
    // nothing is selected (mirrors onMenuOpen fallback logic above).
    const newSelection = selection.length > 0 ? selection : (rowindex >= 0 ? [rowindex] : []);
    const isMultiSelection = newSelection.length > 1;

    // ── Cell-level options ─────────────────────────────────────────────────
    // Copy Value comes FIRST, Filter By comes second.
    const cellOptions = [];
    if (row) {
      const cellValue = row[colname];
      const cellValueIsObject = cellValue && (Array.isArray(cellValue) || cellValue.toString() === '[object Object]');
      const replaceString = cellValueIsObject ? 'Cell Value' : `'${cellValue}'`;

      cellOptions.push({
        label: MenuActions.CopyCellOption.replace('{contextAction}', replaceString),
        value: MenuActions.CopyCellOption,
      });

      if (typeof cellValue !== 'undefined' && !cellValueIsObject) {
        cellOptions.push({
          label: MenuActions.FilterByValueOption.replace('{contextAction}', replaceString),
          value: MenuActions.FilterByValueOption,
        });
      }

      cellOptions.push(MenuActions.CopyColumnName);
    }

    // Copy Column Names is always available (requires at least one column)
    if (cols.length > 0) {
      cellOptions.push(MenuActions.CopyColumnNames);
    }

    // ── Selection-level copy options ───────────────────────────────────────
    const selectionOptions = [];
    if (newSelection.length > 0) {
      selectionOptions.push(MenuActions.CopySelectedCSV);
      selectionOptions.push(MenuActions.CopySelectedJSON);
    }

    // ── Filter / selection management ─────────────────────────────────────
    const filterOptions = [];
    if (filters.length > 0) filterOptions.push(MenuActions.ClearFiltersOption);
    if (isMultiSelection)   filterOptions.push(MenuActions.ClearSelection);

    // ── Save to file ──────────────────────────────────────────────────────
    const resultOptions = newSelection.length > 0
      ? [MenuActions.SaveCSVOption, MenuActions.SaveJSONOption]
      : [];

    // ── Assemble with dividers, drop trailing divider ─────────────────────
    const sections = [cellOptions, selectionOptions, filterOptions, resultOptions].filter(s => s.length > 0);
    const options: any[] = [];
    sections.forEach((section, i) => {
      options.push(...section);
      if (i < sections.length - 1) options.push(MenuActions.Divider);
    });
    return options;
  }, [JSON.stringify(selection), JSON.stringify(filters), rows, rows.length, cols]);

  // ── Row component with Shift+click range selection ───────────────────────
  // Created once (useMemo with []) — setSelection is stable (React guarantee)
  // and anchorIndexRef is always current via the ref, so no deps needed.
  const rowComponent = useMemo(() => {
    const RowWithRangeSelect = (props: any) => (
      <TableRow.Selected
        {...props}
        onRowClick={(e: React.MouseEvent, rowId: number | string) => {
          const rowIndex = Number(rowId);
          if (e.shiftKey && anchorIndexRef.current !== null) {
            // Extend selection from anchor to clicked row (inclusive).
            const start = Math.min(anchorIndexRef.current, rowIndex);
            const end   = Math.max(anchorIndexRef.current, rowIndex);
            setSelection(Array.from({ length: end - start + 1 }, (_, i) => start + i));
            // Anchor stays fixed — multiple consecutive Shift+clicks keep
            // extending from the same origin, same as Excel / file explorers.
          } else if (e.ctrlKey || e.metaKey) {
            // Ctrl+click (Cmd+click on macOS): toggle this row without
            // affecting the rest of the selection.
            // Functional update avoids stale-closure issues inside useMemo([]).
            setSelection(prev =>
              (prev as number[]).includes(rowIndex)
                ? (prev as number[]).filter(i => i !== rowIndex)
                : [...prev, rowIndex]
            );
            // Anchor intentionally not updated — Shift+click after Ctrl+click
            // still extends from the original anchor.
          } else {
            // Regular click: select only this row, update anchor.
            setSelection([rowIndex]);
            anchorIndexRef.current = rowIndex;
          }
        }}
      />
    );
    RowWithRangeSelect.displayName = 'RowWithRangeSelect';
    return RowWithRangeSelect;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  let pagingProps: PagingStateProps = {};
  if (typeof page === 'number') {
    pagingProps = { currentPage: page, onCurrentPageChange: changePage };
  } else {
    pagingProps = { defaultCurrentPage: 0 };
  }
  if (!result) return null;

  return (
    <MenuProvider
      onOpen={onMenuOpen}
      getOptions={getMenuOptions}
      onSelect={onMenuSelect}
    >
      <Paper square elevation={0} className="result" onMouseDown={onCellMouseDown}>
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
            rowComponent={rowComponent}
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