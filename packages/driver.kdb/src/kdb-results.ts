export interface CellPosition {
  row: number;
  column: number;
}

export interface CellRange {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
}

export interface VisibleIndexRange {
  start: number;
  end: number;
}

export interface CellWindow {
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
  cells: string[][];
}

export type RowValue = { [key: string]: unknown };
export interface ExportOptions {
  includeHeaders?: boolean;
  includeRowIndex?: boolean;
}

export interface ColumnarPanelResult {
  columns: string[];
  rowCount: number;
  cellValue(rowIndex: number, columnIndex: number): unknown;
  cellText(rowIndex: number, columnIndex: number): string;
  cellWindow(rowRange: VisibleIndexRange, columnRange: VisibleIndexRange): CellWindow;
  toText(format: TextExportFormat, range: CellRange, optionsOrIncludeHeaders?: boolean | ExportOptions): string;
}

export type TextExportFormat = 'tsv' | 'csv' | 'json' | 'ndjson' | 'html';
export type ExportFormat = TextExportFormat | 'xlsx';
export type ColumnarSortDirection = 'asc' | 'desc';

export const ROW_INDEX_COLUMN = '#';

export function normalizeCellRange(anchor: CellPosition, focus: CellPosition): CellRange {
  return {
    startRow: Math.min(anchor.row, focus.row),
    endRow: Math.max(anchor.row, focus.row),
    startColumn: Math.min(anchor.column, focus.column),
    endColumn: Math.max(anchor.column, focus.column),
  };
}

export function isCellInRange(row: number, column: number, range: CellRange | null | undefined): boolean {
  return !!range &&
    row >= range.startRow &&
    row <= range.endRow &&
    column >= range.startColumn &&
    column <= range.endColumn;
}

export function clampCellRange(range: CellRange, rowCount: number, columnCount: number): CellRange | null {
  if (rowCount <= 0 || columnCount <= 0) {
    return null;
  }

  const maxRow = rowCount - 1;
  const maxColumn = columnCount - 1;
  const clamped = {
    startRow: clamp(range.startRow, 0, maxRow),
    endRow: clamp(range.endRow, 0, maxRow),
    startColumn: clamp(range.startColumn, 0, maxColumn),
    endColumn: clamp(range.endColumn, 0, maxColumn),
  };

  if (clamped.startRow > clamped.endRow || clamped.startColumn > clamped.endColumn) {
    return null;
  }

  return clamped;
}

export function allCellsRange(rowCount: number, columnCount: number): CellRange {
  return {
    startRow: 0,
    endRow: nonNegativeCount(rowCount) - 1,
    startColumn: 0,
    endColumn: nonNegativeCount(columnCount) - 1,
  };
}

export function rowsToTsv(
  rows: RowValue[],
  columns: string[],
  range: CellRange,
  optionsOrIncludeHeaders: boolean | ExportOptions = false
): string {
  const clamped = clampCellRange(range, rows.length, columns.length);
  if (!clamped) {
    return '';
  }

  const options = normalizeExportOptions(optionsOrIncludeHeaders, false);
  const lines: string[] = [];
  if (options.includeHeaders) {
    const headers: string[] = [];
    if (options.includeRowIndex) {
      headers.push(cellValueToText(rowIndexColumnName(columns, clamped)));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      headers.push(cellValueToText(columns[columnIndex]));
    }
    lines.push(headers.join('\t'));
  }

  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const row = rows[rowIndex] || {};
    const values: string[] = [];
    if (options.includeRowIndex) {
      values.push(String(rowIndex + 1));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      values.push(cellValueToText(row[columns[columnIndex]]));
    }
    lines.push(values.join('\t'));
  }
  return lines.join('\n');
}

export function rowsToCsv(
  rows: RowValue[],
  columns: string[],
  range: CellRange,
  optionsOrIncludeHeaders: boolean | ExportOptions = true
): string {
  const clamped = clampCellRange(range, rows.length, columns.length);
  if (!clamped) {
    return '';
  }

  const options = normalizeExportOptions(optionsOrIncludeHeaders, true);
  const lines: string[] = [];
  if (options.includeHeaders) {
    const headers: string[] = [];
    if (options.includeRowIndex) {
      headers.push(escapeCsvCell(cellValueToExportText(rowIndexColumnName(columns, clamped))));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      headers.push(escapeCsvCell(cellValueToExportText(columns[columnIndex])));
    }
    lines.push(headers.join(','));
  }

  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const row = rows[rowIndex] || {};
    const values: string[] = [];
    if (options.includeRowIndex) {
      values.push(String(rowIndex + 1));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      values.push(escapeCsvCell(cellValueToExportText(row[columns[columnIndex]])));
    }
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

export function rowsToJson(
  rows: RowValue[],
  columns: string[],
  range: CellRange,
  optionsOrIncludeHeaders: boolean | ExportOptions = {}
): string {
  const clamped = clampCellRange(range, rows.length, columns.length);
  if (!clamped) {
    return '[]';
  }

  const options = normalizeExportOptions(optionsOrIncludeHeaders, false);
  return stringifyJson(selectedRows(rows, columns, clamped, options.includeRowIndex));
}

export function rowsToNdjson(
  rows: RowValue[],
  columns: string[],
  range: CellRange,
  optionsOrIncludeHeaders: boolean | ExportOptions = {}
): string {
  const clamped = clampCellRange(range, rows.length, columns.length);
  if (!clamped) {
    return '';
  }

  const options = normalizeExportOptions(optionsOrIncludeHeaders, false);
  return selectedRows(rows, columns, clamped, options.includeRowIndex).map(row => stringifyJson(row)).join('\n');
}

export function rowsToHtml(
  rows: RowValue[],
  columns: string[],
  range: CellRange,
  optionsOrIncludeHeaders: boolean | ExportOptions = true
): string {
  const clamped = clampCellRange(range, rows.length, columns.length);
  if (!clamped) {
    return '';
  }

  const options = normalizeExportOptions(optionsOrIncludeHeaders, true);
  const parts: string[] = ['<table>'];
  if (options.includeHeaders) {
    parts.push('<thead><tr>');
    if (options.includeRowIndex) {
      parts.push('<th>', escapeHtml(cellValueToExportText(rowIndexColumnName(columns, clamped))), '</th>');
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      parts.push('<th>', escapeHtml(cellValueToExportText(columns[columnIndex])), '</th>');
    }
    parts.push('</tr></thead>');
  }

  parts.push('<tbody>');
  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const row = rows[rowIndex] || {};
    parts.push('<tr>');
    if (options.includeRowIndex) {
      parts.push('<td>', String(rowIndex + 1), '</td>');
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      parts.push('<td>', escapeHtml(cellValueToExportText(row[columns[columnIndex]])), '</td>');
    }
    parts.push('</tr>');
  }
  parts.push('</tbody></table>');
  return parts.join('');
}

export function rowsToTextFormat(
  rows: RowValue[],
  columns: string[],
  range: CellRange,
  format: TextExportFormat,
  optionsOrIncludeHeaders: boolean | ExportOptions = true
): string {
  const options = normalizeExportOptions(optionsOrIncludeHeaders, true);
  switch (format) {
    case 'tsv':
      return rowsToTsv(rows, columns, range, options);
    case 'csv':
      return rowsToCsv(rows, columns, range, options);
    case 'json':
      return rowsToJson(rows, columns, range, options);
    case 'ndjson':
      return rowsToNdjson(rows, columns, range, options);
    case 'html':
      return rowsToHtml(rows, columns, range, options);
  }

  throw new Error(`Unsupported text export format: ${format}`);
}

export function createColumnarPanelResult(
  columns: string[],
  rowCount: number,
  cellValue: (rowIndex: number, columnIndex: number) => unknown
): ColumnarPanelResult {
  const normalizedColumns = columns.map(column => String(column));
  const normalizedRowCount = nonNegativeCount(rowCount);
  const result: ColumnarPanelResult = {
    columns: normalizedColumns,
    rowCount: normalizedRowCount,
    cellValue(rowIndex: number, columnIndex: number): unknown {
      if (rowIndex < 0 || rowIndex >= normalizedRowCount || columnIndex < 0 || columnIndex >= normalizedColumns.length) {
        return undefined;
      }
      return cellValue(rowIndex, columnIndex);
    },
    cellText(rowIndex: number, columnIndex: number): string {
      return cellValueToText(result.cellValue(rowIndex, columnIndex));
    },
    cellWindow(rowRange: VisibleIndexRange, columnRange: VisibleIndexRange): CellWindow {
      return columnarToCellWindow(result, rowRange, columnRange);
    },
    toText(format: TextExportFormat, range: CellRange, optionsOrIncludeHeaders: boolean | ExportOptions = true): string {
      return columnarToTextFormat(result, range, format, optionsOrIncludeHeaders);
    },
  };
  return result;
}

export function rowsToColumnarPanelResult(rows: RowValue[], columns: string[]): ColumnarPanelResult {
  return createColumnarPanelResult(columns, rows.length, (rowIndex, columnIndex) => {
    const row = rows[rowIndex] || {};
    return row[columns[columnIndex]];
  });
}

export function emptyColumnarPanelResult(): ColumnarPanelResult {
  return createColumnarPanelResult([], 0, () => undefined);
}

export function filterColumnarPanelResult(result: ColumnarPanelResult, visibleColumns: string[]): ColumnarPanelResult {
  const visibleColumnNames = new Set(visibleColumns.map(column => String(column)));
  const sourceColumnIndexes: number[] = [];
  const filteredColumns: string[] = [];
  for (let columnIndex = 0; columnIndex < result.columns.length; columnIndex++) {
    const column = result.columns[columnIndex];
    if (visibleColumnNames.has(column)) {
      sourceColumnIndexes.push(columnIndex);
      filteredColumns.push(column);
    }
  }

  return createColumnarPanelResult(filteredColumns, result.rowCount, (rowIndex, columnIndex) => {
    return result.cellValue(rowIndex, sourceColumnIndexes[columnIndex]);
  });
}

export function applyColumnarRowOrder(result: ColumnarPanelResult, rowOrder: number[] | undefined): ColumnarPanelResult {
  if (!rowOrder) {
    return result;
  }

  const sourceRowIndexes = rowOrder
    .map(rowIndex => Math.floor(Number(rowIndex)))
    .filter(rowIndex => Number.isFinite(rowIndex) && rowIndex >= 0 && rowIndex < result.rowCount);
  return createColumnarPanelResult(result.columns, sourceRowIndexes.length, (rowIndex, columnIndex) => {
    return result.cellValue(sourceRowIndexes[rowIndex], columnIndex);
  });
}

export function sortedColumnarRowOrder(
  result: ColumnarPanelResult,
  columnIndex: number,
  direction: ColumnarSortDirection
): number[] {
  if (columnIndex < 0 || columnIndex >= result.columns.length) {
    throw new RangeError(`Column index ${columnIndex} is outside ${result.columns.length} columns`);
  }

  const texts: string[] = [];
  const rowOrder: number[] = [];
  for (let rowIndex = 0; rowIndex < result.rowCount; rowIndex++) {
    texts[rowIndex] = result.cellText(rowIndex, columnIndex);
    rowOrder.push(rowIndex);
  }

  rowOrder.sort((leftRow, rightRow) => {
    const compared = compareColumnarCellText(texts[leftRow], texts[rightRow], direction);
    return compared === 0 ? leftRow - rightRow : compared;
  });
  return rowOrder;
}

export function compareColumnarCellText(
  left: string,
  right: string,
  direction: ColumnarSortDirection = 'asc'
): number {
  const leftText = String(left);
  const rightText = String(right);
  const leftEmpty = leftText.trim().length === 0;
  const rightEmpty = rightText.trim().length === 0;
  if (leftEmpty || rightEmpty) {
    if (leftEmpty && rightEmpty) {
      return 0;
    }
    return leftEmpty ? 1 : -1;
  }

  const compared = compareNonEmptyCellText(leftText, rightText);
  return direction === 'desc' ? -compared : compared;
}

export function columnarToCellWindow(
  result: ColumnarPanelResult,
  rowRange: VisibleIndexRange,
  columnRange: VisibleIndexRange
): CellWindow {
  const clamped = clampCellRange(
    {
      startRow: rowRange.start,
      endRow: rowRange.end,
      startColumn: columnRange.start,
      endColumn: columnRange.end,
    },
    result.rowCount,
    result.columns.length
  );

  if (!clamped) {
    return emptyCellWindow();
  }

  const cells: string[][] = [];
  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const values: string[] = [];
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      values.push(result.cellText(rowIndex, columnIndex));
    }
    cells.push(values);
  }

  return {
    startRow: clamped.startRow,
    endRow: clamped.endRow,
    startColumn: clamped.startColumn,
    endColumn: clamped.endColumn,
    cells,
  };
}

export function columnarToTextFormat(
  result: ColumnarPanelResult,
  range: CellRange,
  format: TextExportFormat,
  optionsOrIncludeHeaders: boolean | ExportOptions = true
): string {
  const options = normalizeExportOptions(optionsOrIncludeHeaders, true);
  switch (format) {
    case 'tsv':
      return columnarToTsv(result, range, options);
    case 'csv':
      return columnarToCsv(result, range, options);
    case 'json':
      return columnarToJson(result, range, options);
    case 'ndjson':
      return columnarToNdjson(result, range, options);
    case 'html':
      return columnarToHtml(result, range, options);
  }

  throw new Error(`Unsupported text export format: ${format}`);
}

function columnarToTsv(result: ColumnarPanelResult, range: CellRange, options: NormalizedExportOptions): string {
  const clamped = clampCellRange(range, result.rowCount, result.columns.length);
  if (!clamped) {
    return '';
  }

  const lines: string[] = [];
  if (options.includeHeaders) {
    const headers: string[] = [];
    if (options.includeRowIndex) {
      headers.push(cellValueToText(rowIndexColumnName(result.columns, clamped)));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      headers.push(cellValueToText(result.columns[columnIndex]));
    }
    lines.push(headers.join('\t'));
  }

  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const values: string[] = [];
    if (options.includeRowIndex) {
      values.push(String(rowIndex + 1));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      values.push(cellValueToText(result.cellValue(rowIndex, columnIndex)));
    }
    lines.push(values.join('\t'));
  }
  return lines.join('\n');
}

function columnarToCsv(result: ColumnarPanelResult, range: CellRange, options: NormalizedExportOptions): string {
  const clamped = clampCellRange(range, result.rowCount, result.columns.length);
  if (!clamped) {
    return '';
  }

  const lines: string[] = [];
  if (options.includeHeaders) {
    const headers: string[] = [];
    if (options.includeRowIndex) {
      headers.push(escapeCsvCell(cellValueToExportText(rowIndexColumnName(result.columns, clamped))));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      headers.push(escapeCsvCell(cellValueToExportText(result.columns[columnIndex])));
    }
    lines.push(headers.join(','));
  }

  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const values: string[] = [];
    if (options.includeRowIndex) {
      values.push(String(rowIndex + 1));
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      values.push(escapeCsvCell(cellValueToExportText(result.cellValue(rowIndex, columnIndex))));
    }
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

function columnarToJson(result: ColumnarPanelResult, range: CellRange, options: NormalizedExportOptions): string {
  const clamped = clampCellRange(range, result.rowCount, result.columns.length);
  if (!clamped) {
    return '[]';
  }

  return stringifyJson(selectedColumnarRows(result, clamped, options.includeRowIndex));
}

function columnarToNdjson(result: ColumnarPanelResult, range: CellRange, options: NormalizedExportOptions): string {
  const clamped = clampCellRange(range, result.rowCount, result.columns.length);
  if (!clamped) {
    return '';
  }

  return selectedColumnarRows(result, clamped, options.includeRowIndex).map(row => stringifyJson(row)).join('\n');
}

function columnarToHtml(result: ColumnarPanelResult, range: CellRange, options: NormalizedExportOptions): string {
  const clamped = clampCellRange(range, result.rowCount, result.columns.length);
  if (!clamped) {
    return '';
  }

  const parts: string[] = ['<table>'];
  if (options.includeHeaders) {
    parts.push('<thead><tr>');
    if (options.includeRowIndex) {
      parts.push('<th>', escapeHtml(cellValueToExportText(rowIndexColumnName(result.columns, clamped))), '</th>');
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      parts.push('<th>', escapeHtml(cellValueToExportText(result.columns[columnIndex])), '</th>');
    }
    parts.push('</tr></thead>');
  }

  parts.push('<tbody>');
  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    parts.push('<tr>');
    if (options.includeRowIndex) {
      parts.push('<td>', String(rowIndex + 1), '</td>');
    }
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      parts.push('<td>', escapeHtml(cellValueToExportText(result.cellValue(rowIndex, columnIndex))), '</td>');
    }
    parts.push('</tr>');
  }
  parts.push('</tbody></table>');
  return parts.join('');
}

export function rowsToCellWindow(
  rows: RowValue[],
  columns: string[],
  rowRange: VisibleIndexRange,
  columnRange: VisibleIndexRange
): CellWindow {
  const clamped = clampCellRange(
    {
      startRow: rowRange.start,
      endRow: rowRange.end,
      startColumn: columnRange.start,
      endColumn: columnRange.end,
    },
    rows.length,
    columns.length
  );

  if (!clamped) {
    return emptyCellWindow();
  }

  const cells: string[][] = [];
  for (let rowIndex = clamped.startRow; rowIndex <= clamped.endRow; rowIndex++) {
    const row = rows[rowIndex] || {};
    const values: string[] = [];
    for (let columnIndex = clamped.startColumn; columnIndex <= clamped.endColumn; columnIndex++) {
      values.push(cellValueToText(row[columns[columnIndex]]));
    }
    cells.push(values);
  }

  return {
    startRow: clamped.startRow,
    endRow: clamped.endRow,
    startColumn: clamped.startColumn,
    endColumn: clamped.endColumn,
    cells,
  };
}

export function cellValueToText(value: unknown): string {
  return sanitizeTsvCell(cellValueToExportText(value));
}

export function visibleIndexRange(
  scrollOffset: number,
  viewportSize: number,
  itemSize: number,
  itemCount: number,
  overscan = 4
): VisibleIndexRange {
  if (itemCount <= 0 || itemSize <= 0 || viewportSize <= 0) {
    return { start: 0, end: -1 };
  }

  const safeOverscan = Math.max(0, Math.floor(overscan));
  const start = clamp(Math.floor(scrollOffset / itemSize) - safeOverscan, 0, itemCount - 1);
  const end = clamp(Math.ceil((scrollOffset + viewportSize) / itemSize) + safeOverscan, 0, itemCount - 1);
  return { start, end };
}

function compareNonEmptyCellText(left: string, right: string): number {
  const leftBoolean = booleanSortValue(left);
  const rightBoolean = booleanSortValue(right);
  if (leftBoolean !== null && rightBoolean !== null) {
    return leftBoolean - rightBoolean;
  }

  const leftNumber = numericSortValue(left);
  const rightNumber = numericSortValue(right);
  if (leftNumber !== null && rightNumber !== null) {
    if (leftNumber < rightNumber) {
      return -1;
    }
    if (leftNumber > rightNumber) {
      return 1;
    }
    return 0;
  }

  if (left < right) {
    return -1;
  }
  if (left > right) {
    return 1;
  }
  return 0;
}

function booleanSortValue(value: string): number | null {
  const normalized = value.trim().toLocaleLowerCase();
  if (normalized === 'false') {
    return 0;
  }
  if (normalized === 'true') {
    return 1;
  }
  return null;
}

function numericSortValue(value: string): number | null {
  const normalized = value.trim();
  if (!/^[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?$/.test(normalized)) {
    return null;
  }

  const number = Number(normalized);
  return Number.isFinite(number) ? number : null;
}

function cellValueToExportText(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }

  try {
    const json = JSON.stringify(value);
    return json === undefined ? String(value) : json;
  } catch {
    return String(value);
  }
}

export function rowIndexColumnName(columns: string[], range: CellRange): string {
  let name = ROW_INDEX_COLUMN;
  let suffix = 1;
  while (rangeContainsColumn(columns, range, name)) {
    name = `${ROW_INDEX_COLUMN}_${suffix}`;
    suffix += 1;
  }
  return name;
}

function selectedRows(rows: RowValue[], columns: string[], range: CellRange, includeRowIndex = false): RowValue[] {
  const selected: RowValue[] = [];
  const indexColumn = includeRowIndex ? rowIndexColumnName(columns, range) : '';
  for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex++) {
    const row = rows[rowIndex] || {};
    const value: RowValue = {};
    if (includeRowIndex) {
      value[indexColumn] = rowIndex + 1;
    }
    for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex++) {
      const column = columns[columnIndex];
      value[column] = row[column];
    }
    selected.push(value);
  }
  return selected;
}

function selectedColumnarRows(result: ColumnarPanelResult, range: CellRange, includeRowIndex = false): RowValue[] {
  const selected: RowValue[] = [];
  const indexColumn = includeRowIndex ? rowIndexColumnName(result.columns, range) : '';
  for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex++) {
    const value: RowValue = {};
    if (includeRowIndex) {
      value[indexColumn] = rowIndex + 1;
    }
    for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex++) {
      value[result.columns[columnIndex]] = result.cellValue(rowIndex, columnIndex);
    }
    selected.push(value);
  }
  return selected;
}

function rangeContainsColumn(columns: string[], range: CellRange, name: string): boolean {
  for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex++) {
    if (columns[columnIndex] === name) {
      return true;
    }
  }
  return false;
}

interface NormalizedExportOptions {
  includeHeaders: boolean;
  includeRowIndex: boolean;
}

function normalizeExportOptions(
  value: boolean | ExportOptions | undefined,
  defaultIncludeHeaders: boolean
): NormalizedExportOptions {
  if (typeof value === 'boolean') {
    return { includeHeaders: value, includeRowIndex: false };
  }

  return {
    includeHeaders: value && typeof value.includeHeaders === 'boolean' ? value.includeHeaders : defaultIncludeHeaders,
    includeRowIndex: value ? value.includeRowIndex === true : false,
  };
}

function stringifyJson(value: unknown): string {
  const json = JSON.stringify(value, jsonReplacer);
  return json === undefined ? 'null' : json;
}

function jsonReplacer(_key: string, value: unknown): unknown {
  if (typeof value === 'bigint') {
    return String(value);
  }

  if (value === undefined || typeof value === 'function' || typeof value === 'symbol') {
    return null;
  }

  return value;
}

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""');
  return /[",\r\n]/.test(value) ? `"${escaped}"` : escaped;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, char => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case '\'':
        return '&#39;';
    }
    return char;
  });
}

function sanitizeTsvCell(value: string): string {
  return value.replace(/\r\n|\r|\n|\t/g, ' ');
}

function emptyCellWindow(): CellWindow {
  return {
    startRow: 0,
    endRow: -1,
    startColumn: 0,
    endColumn: -1,
    cells: [],
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(Math.floor(value), min), max);
}

function nonNegativeCount(value: number): number {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return Math.max(0, Math.floor(value));
}
