import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import JSZip = require('jszip');
import {
  CellRange,
  ColumnarPanelResult,
  ExportFormat,
  TextExportFormat,
  VisibleIndexRange,
  allCellsRange,
  applyColumnarRowOrder,
  cellValueToText,
  clampCellRange,
  filterColumnarPanelResult,
  rowIndexColumnName,
  sortedColumnarRowOrder,
} from './kdb-results';
import { endPerfSpan, perfSpan } from './perf';

export interface KdbPanelResult {
  table: ColumnarPanelResult;
  query: string;
  connectionName: string;
  elapsedMs: number;
  messages: string[];
  error?: boolean;
}

interface LoadingState {
  query: string;
  connectionName: string;
}

interface KdbPanelMetadata {
  columns: string[];
  allColumns: string[];
  hiddenColumnCount: number;
  hiddenColumnNames: string[];
  rowCount: number;
  query: string;
  connectionName: string;
  elapsedMs: number;
  messages: string[];
  error?: boolean;
  version: number;
  settings: KdbPanelSettings;
  sort: KdbPanelSortState | null;
}

type KdbPanelDensity = 'compact' | 'standard' | 'comfortable';
type KdbPanelSortDirection = 'asc' | 'desc';

interface KdbPanelSortState {
  columnName: string;
  direction: KdbPanelSortDirection;
}

interface KdbPanelSettings {
  cellWidth: number;
  rowHeight: number;
  fontSize: number;
  density: KdbPanelDensity;
  showRowIndex: boolean;
  includeHeaders: boolean;
  includeRowIndex: boolean;
}

const COPY_WARNING_BYTES = 15 * 1024 * 1024;
const SORT_CONFIRM_ROW_THRESHOLD = 250000;
const SEARCH_MATCH_CAP = 1000;
const SEARCH_YIELD_CELL_INTERVAL = 10000;
const SEARCH_SCAN_CELL_LIMIT = 2000000;
const SEARCH_SCAN_MS_LIMIT = 1500;
const DEFAULT_PANEL_SETTINGS: KdbPanelSettings = {
  cellWidth: 160,
  rowHeight: 28,
  fontSize: 0,
  density: 'standard',
  showRowIndex: true,
  includeHeaders: true,
  includeRowIndex: true,
};

export class KdbResultsPanel {
  private static current: KdbResultsPanel | undefined;
  private panel: vscode.WebviewPanel;
  private ready = false;
  private result: KdbPanelResult | undefined;
  private loading: LoadingState | undefined;
  private version = 0;
  private firstSliceVersion = 0;
  private hiddenColumnNames: string[] = [];
  private rowOrder: number[] | undefined;
  private sortState: KdbPanelSortState | undefined;
  private baseVisibleTableCache: { version: number; source: ColumnarPanelResult; table: ColumnarPanelResult } | undefined;
  private visibleTableCache: { version: number; source: ColumnarPanelResult; table: ColumnarPanelResult } | undefined;
  private activeSearchId = 0;

  public static showLoading(context: vscode.ExtensionContext, state: LoadingState): KdbResultsPanel {
    const panel = KdbResultsPanel.ensure(context);
    panel.version += 1;
    panel.firstSliceVersion = 0;
    panel.rowOrder = undefined;
    panel.sortState = undefined;
    panel.baseVisibleTableCache = undefined;
    panel.visibleTableCache = undefined;
    panel.loading = state;
    panel.result = undefined;
    panel.panel.reveal(vscode.ViewColumn.Beside);
    panel.post({ type: 'loading', state: { ...state, version: panel.version, settings: panelSettings() } });
    return panel;
  }

  public static showResult(context: vscode.ExtensionContext, result: KdbPanelResult): KdbResultsPanel {
    const panel = KdbResultsPanel.ensure(context);
    panel.version += 1;
    panel.firstSliceVersion = 0;
    panel.rowOrder = undefined;
    panel.sortState = undefined;
    panel.baseVisibleTableCache = undefined;
    panel.visibleTableCache = undefined;
    panel.loading = undefined;
    panel.result = result;
    panel.panel.reveal(vscode.ViewColumn.Beside);
    panel.postResultMetadata();
    return panel;
  }

  private static ensure(context: vscode.ExtensionContext): KdbResultsPanel {
    if (KdbResultsPanel.current) {
      return KdbResultsPanel.current;
    }

    KdbResultsPanel.current = new KdbResultsPanel(context);
    return KdbResultsPanel.current;
  }

  private constructor(private readonly context: vscode.ExtensionContext) {
    this.panel = vscode.window.createWebviewPanel(
      'kdbSqltoolsResults',
      'kdb Results',
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [],
      }
    );
    this.panel.webview.html = this.html(this.panel.webview);
    this.panel.onDidDispose(() => {
      KdbResultsPanel.current = undefined;
    }, undefined, this.context.subscriptions);
    this.panel.webview.onDidReceiveMessage(message => this.onMessage(message), undefined, this.context.subscriptions);
  }

  private async onMessage(message: any): Promise<void> {
    if (!message || typeof message.type !== 'string') {
      return;
    }

    if (message.type === 'ready') {
      this.ready = true;
      if (this.result) {
        this.postResultMetadata();
      } else if (this.loading) {
        this.post({ type: 'loading', state: { ...this.loading, version: this.version, settings: panelSettings() } });
      }
      return;
    }

    if (message.type === 'requestSlice') {
      this.postSlice(message);
      return;
    }

    if (message.type === 'searchRows') {
      await this.searchRows(message);
      return;
    }

    if (message.type === 'updateSetting') {
      await this.updateSetting(message);
      return;
    }

    if (message.type === 'hideColumn' || message.type === 'showColumn' || message.type === 'resetHiddenColumns') {
      this.updateColumnVisibility(message);
      return;
    }

    if (message.type === 'sortColumn') {
      await this.sortColumn(message);
      return;
    }

    if (message.type === 'copyRange') {
      await this.copyRange(
        message.range,
        textExportFormat(message.format),
        message.includeHeaders === true,
        message.includeRowIndex === true
      );
      return;
    }

    if (message.type === 'exportRange') {
      await this.exportRange(
        message.range,
        exportFormat(message.format),
        message.includeHeaders === true,
        message.includeRowIndex === true
      );
      return;
    }
  }

  private postResultMetadata(): void {
    if (!this.result) {
      return;
    }
    const span = perfSpan('results-panel.metadata.post', {
      version: this.version,
      rows: this.result.table.rowCount,
      columns: this.visibleColumnNames(this.result).length,
      totalColumns: this.result.table.columns.length,
      ready: this.ready,
    });
    try {
      this.post({ type: 'resultMeta', result: this.metadataForResult(this.result) });
    } finally {
      endPerfSpan(span, { posted: this.ready });
    }
  }

  private metadataForResult(result: KdbPanelResult): KdbPanelMetadata {
    const columns = this.visibleColumnNames(result);
    const hiddenColumnNames = this.activeHiddenColumnNames(result);
    return {
      columns,
      allColumns: result.table.columns.slice(),
      hiddenColumnCount: result.table.columns.length - columns.length,
      hiddenColumnNames,
      rowCount: result.table.rowCount,
      query: result.query,
      connectionName: result.connectionName,
      elapsedMs: result.elapsedMs,
      messages: result.messages,
      error: result.error,
      version: this.version,
      settings: panelSettings(),
      sort: this.visibleSortState(result),
    };
  }

  private baseVisibleTable(): ColumnarPanelResult | null {
    if (!this.result) {
      return null;
    }

    if (
      this.baseVisibleTableCache &&
      this.baseVisibleTableCache.version === this.version &&
      this.baseVisibleTableCache.source === this.result.table
    ) {
      return this.baseVisibleTableCache.table;
    }

    const table = filterColumnarPanelResult(this.result.table, this.visibleColumnNames(this.result));
    this.baseVisibleTableCache = { version: this.version, source: this.result.table, table };
    return table;
  }

  private visibleTable(): ColumnarPanelResult | null {
    if (!this.result) {
      return null;
    }

    const table = this.baseVisibleTable();
    if (!table || !this.rowOrder) {
      return table;
    }

    if (
      this.visibleTableCache &&
      this.visibleTableCache.version === this.version &&
      this.visibleTableCache.source === this.result.table
    ) {
      return this.visibleTableCache.table;
    }

    const orderedTable = applyColumnarRowOrder(table, this.rowOrder);
    this.visibleTableCache = { version: this.version, source: this.result.table, table: orderedTable };
    return orderedTable;
  }

  private visibleSortState(result: KdbPanelResult): KdbPanelSortState | null {
    if (!this.sortState) {
      return null;
    }

    return this.visibleColumnNames(result).indexOf(this.sortState.columnName) === -1
      ? null
      : { ...this.sortState };
  }

  private visibleColumnNames(result: KdbPanelResult): string[] {
    const hidden = columnNameLookup(this.hiddenColumnNames);
    return result.table.columns.filter(column => !hidden[column]);
  }

  private activeHiddenColumnNames(result: KdbPanelResult): string[] {
    const hidden = columnNameLookup(this.hiddenColumnNames);
    const names: string[] = [];
    result.table.columns.forEach(column => {
      if (hidden[column] && names.indexOf(column) === -1) {
        names.push(column);
      }
    });
    return names;
  }

  private postSlice(message: any): void {
    const requestId = Number(message.requestId || 0);
    const requestSpan = perfSpan('results-panel.requestSlice', {
      version: Number(message.version),
      currentVersion: this.version,
      requestId,
    });
    if (!this.result || Number(message.version) !== this.version) {
      endPerfSpan(requestSpan, { skipped: true });
      return;
    }

    const table = this.visibleTable();
    if (!table) {
      endPerfSpan(requestSpan, { skipped: true });
      return;
    }

    const rowRange = messageRange(message.rows, table.rowCount);
    const columnRange = messageRange(message.columns, table.columns.length);
    const firstSlice = this.firstSliceVersion !== this.version;
    const sliceSpan = perfSpan('results-panel.slice.generate', {
      version: this.version,
      requestId,
      firstSlice,
      rowsRequested: rowRange.end - rowRange.start + 1,
      columnsRequested: columnRange.end - columnRange.start + 1,
      totalRows: table.rowCount,
      totalColumns: table.columns.length,
    });
    const firstSliceSpan = firstSlice ? perfSpan('results-panel.firstSlice', {
      version: this.version,
      requestId,
      rowsRequested: rowRange.end - rowRange.start + 1,
      columnsRequested: columnRange.end - columnRange.start + 1,
      totalRows: table.rowCount,
      totalColumns: table.columns.length,
    }) : null;
    try {
      const slice = table.cellWindow(rowRange, columnRange);
      const sliceDetails = {
        rows: slice.endRow >= slice.startRow ? slice.endRow - slice.startRow + 1 : 0,
        columns: slice.endColumn >= slice.startColumn ? slice.endColumn - slice.startColumn + 1 : 0,
        cells: slice.cells.reduce((count, row) => count + row.length, 0),
      };
      endPerfSpan(sliceSpan, sliceDetails);
      endPerfSpan(firstSliceSpan, sliceDetails);
      if (firstSlice) {
        this.firstSliceVersion = this.version;
      }
      this.post({
        type: 'slice',
        version: this.version,
        requestId,
        slice,
      });
      endPerfSpan(requestSpan, { skipped: false, posted: this.ready });
    } catch (error) {
      endPerfSpan(sliceSpan, { error: true, errorName: toError(error).name });
      endPerfSpan(firstSliceSpan, { error: true, errorName: toError(error).name });
      endPerfSpan(requestSpan, { skipped: false, error: true, errorName: toError(error).name });
      throw error;
    }
  }

  private async searchRows(message: any): Promise<void> {
    const requestVersion = integerOrNull(message.version);
    const searchId = integerOrNull(message.searchId);
    const query = typeof message.query === 'string' ? message.query : '';
    if (requestVersion === null || searchId === null || !this.result || requestVersion !== this.version) {
      return;
    }

    this.activeSearchId = searchId;
    const table = this.visibleTable();
    if (!table) {
      return;
    }

    const span = perfSpan('results-panel.searchRows', {
      version: requestVersion,
      searchId,
      rows: table.rowCount,
      columns: table.columns.length,
      queryChars: query.length,
      matchCap: SEARCH_MATCH_CAP,
    });
    const matchedRows: number[] = [];
    let totalScanned = 0;
    let scannedCells = 0;
    let capped = false;
    let partial = false;
    let cancelled = false;

    try {
      const needle = query.toLocaleLowerCase();
      if (needle.length > 0 && table.rowCount > 0 && table.columns.length > 0) {
        const startedMs = Date.now();
        for (let rowIndex = 0; rowIndex < table.rowCount; rowIndex++) {
          let rowMatched = false;
          for (let columnIndex = 0; columnIndex < table.columns.length; columnIndex++) {
            scannedCells += 1;
            if (table.cellText(rowIndex, columnIndex).toLocaleLowerCase().indexOf(needle) !== -1) {
              rowMatched = true;
              break;
            }

            if (scannedCells % SEARCH_YIELD_CELL_INTERVAL === 0) {
              if (Date.now() - startedMs >= SEARCH_SCAN_MS_LIMIT || scannedCells >= SEARCH_SCAN_CELL_LIMIT) {
                partial = true;
                break;
              }
              await yieldToEventLoop();
              if (this.activeSearchId !== searchId || this.version !== requestVersion) {
                cancelled = true;
                return;
              }
            }
          }

          totalScanned += 1;
          if (rowMatched) {
            matchedRows.push(rowIndex);
            if (matchedRows.length >= SEARCH_MATCH_CAP) {
              capped = true;
              partial = rowIndex < table.rowCount - 1;
              break;
            }
          }
          if (partial) {
            break;
          }
        }
      }

      if (this.activeSearchId !== searchId || this.version !== requestVersion) {
        cancelled = true;
        return;
      }

      this.post({
        type: 'searchResults',
        version: requestVersion,
        searchId,
        query,
        matchedRows,
        totalScanned,
        scannedCells,
        capped,
        partial,
        matchCap: SEARCH_MATCH_CAP,
      });
    } finally {
      endPerfSpan(span, {
        matches: matchedRows.length,
        totalScanned,
        scannedCells,
        capped,
        partial,
        cancelled,
      });
    }
  }

  private async sortColumn(message: any): Promise<void> {
    const requestVersion = integerOrNull(message.version);
    const columnIndex = integerOrNull(message.columnIndex);
    const columnName = typeof message.columnName === 'string' ? message.columnName : '';
    if (requestVersion === null || columnIndex === null || !this.result || requestVersion !== this.version) {
      return;
    }

    const table = this.baseVisibleTable();
    if (!table || columnIndex < 0 || columnIndex >= table.columns.length || table.columns[columnIndex] !== columnName) {
      return;
    }

    const nextSort = nextSortState(this.sortState, columnName);
    if (!nextSort) {
      this.rowOrder = undefined;
      this.sortState = undefined;
      this.refreshResultView();
      return;
    }

    if (table.rowCount >= SORT_CONFIRM_ROW_THRESHOLD) {
      const choice = await vscode.window.showWarningMessage(
        `Sort ${formatCount(table.rowCount)} rows by ${columnName}? This may take a moment.`,
        'Sort',
        'Cancel'
      );
      if (choice !== 'Sort') {
        this.post({ type: 'sortSkipped' });
        return;
      }
      if (!this.result || this.version !== requestVersion) {
        return;
      }
    }

    const span = perfSpan('results-panel.sort', {
      version: requestVersion,
      rows: table.rowCount,
      columns: table.columns.length,
      columnName,
      direction: nextSort.direction,
    });
    let sortedRowOrder: number[] | undefined;
    let cancelled = false;
    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Window,
        title: `Sorting ${formatCount(table.rowCount)} rows`,
        cancellable: false,
      }, async () => {
        await yieldToEventLoop();
        sortedRowOrder = sortedColumnarRowOrder(table, columnIndex, nextSort.direction);
      });

      if (!this.result || this.version !== requestVersion || !sortedRowOrder) {
        cancelled = true;
        return;
      }

      this.rowOrder = sortedRowOrder;
      this.sortState = nextSort;
      this.refreshResultView();
    } finally {
      endPerfSpan(span, {
        sorted: !!sortedRowOrder && !cancelled,
        cancelled,
      });
    }
  }

  private async copyRange(
    range: any,
    format: TextExportFormat,
    includeHeaders: boolean,
    includeRowIndex: boolean
  ): Promise<void> {
    const table = this.visibleTable();
    if (!table) {
      return;
    }

    const clamped = this.actionRange(range, table);
    if (!clamped) {
      return;
    }

    const text = table.toText(format, clamped, {
      includeHeaders,
      includeRowIndex,
    });
    if (Buffer.byteLength(text, 'utf8') > COPY_WARNING_BYTES) {
      const choice = await vscode.window.showWarningMessage(
        `Copy output is ${formatBytes(Buffer.byteLength(text, 'utf8'))}. Export instead?`,
        'Export',
        'Copy Anyway'
      );
      if (choice === 'Export') {
        await this.exportRange(clamped, format, includeHeaders, includeRowIndex);
        return;
      }
      if (choice !== 'Copy Anyway') {
        this.post({ type: 'copySkipped', format });
        return;
      }
    }

    await vscode.env.clipboard.writeText(text);
    const rows = clamped.endRow - clamped.startRow + 1;
    const columns = clamped.endColumn - clamped.startColumn + 1;
    this.post({ type: 'copied', rows, columns, format, includeHeaders, includeRowIndex });
  }

  private async exportRange(
    range: any,
    format: ExportFormat,
    includeHeaders: boolean,
    includeRowIndex: boolean
  ): Promise<void> {
    const table = this.visibleTable();
    if (!table) {
      return;
    }

    const clamped = this.actionRange(range, table);
    if (!clamped) {
      return;
    }

    const uri = await vscode.window.showSaveDialog({
      defaultUri: defaultExportUri(format),
      filters: saveFilters(format),
      saveLabel: 'Export',
    });
    if (!uri) {
      this.post({ type: 'exportSkipped', format });
      return;
    }

    const content = format === 'xlsx'
      ? await columnarToXlsx(table, clamped, includeHeaders, includeRowIndex)
      : Buffer.from(table.toText(format, clamped, {
        includeHeaders,
        includeRowIndex,
      }), 'utf8');
    await vscode.workspace.fs.writeFile(uri, content);
    const rows = clamped.endRow - clamped.startRow + 1;
    const columns = clamped.endColumn - clamped.startColumn + 1;
    this.post({ type: 'exported', rows, columns, format, includeHeaders, includeRowIndex });
  }

  private actionRange(range: any, table: ColumnarPanelResult): CellRange | null {
    const requested = messageCellRange(range) || allCellsRange(table.rowCount, table.columns.length);
    return clampCellRange(requested, table.rowCount, table.columns.length);
  }

  private updateColumnVisibility(message: any): void {
    if (!this.result) {
      return;
    }

    if (message.type === 'resetHiddenColumns') {
      if (this.hiddenColumnNames.length > 0) {
        this.hiddenColumnNames = [];
        this.refreshResultView();
      }
      return;
    }

    const columnName = typeof message.columnName === 'string' ? message.columnName : '';
    if (!columnName || this.result.table.columns.indexOf(columnName) === -1) {
      return;
    }

    if (message.type === 'hideColumn') {
      if (this.hiddenColumnNames.indexOf(columnName) === -1) {
        this.hiddenColumnNames = this.hiddenColumnNames.concat(columnName);
        if (this.sortState && this.sortState.columnName === columnName) {
          this.rowOrder = undefined;
          this.sortState = undefined;
        }
        this.refreshResultView();
      }
      return;
    }

    if (message.type === 'showColumn') {
      if (this.hiddenColumnNames.indexOf(columnName) !== -1) {
        this.hiddenColumnNames = this.hiddenColumnNames.filter(name => name !== columnName);
        this.refreshResultView();
      }
    }
  }

  private refreshResultView(): void {
    this.version += 1;
    this.firstSliceVersion = 0;
    this.baseVisibleTableCache = undefined;
    this.visibleTableCache = undefined;
    this.postResultMetadata();
  }

  private async updateSetting(message: any): Promise<void> {
    const normalized = normalizePanelSettingUpdate(message && message.key, message && message.value);
    if (!normalized) {
      return;
    }

    const config = vscode.workspace.getConfiguration('kdb-sqltools.results');
    await config.update(normalized.key, normalized.value, vscode.ConfigurationTarget.Global);
    this.post({ type: 'settings', settings: panelSettings() });
  }

  private post(message: any): void {
    if (this.ready) {
      this.panel.webview.postMessage(message);
    }
  }

  private html(webview: vscode.Webview): string {
    const nonce = nonceValue();
    const cspSource = webview.cspSource;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${cspSource} 'nonce-${nonce}' 'unsafe-inline'; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>kdb Results</title>
  <style nonce="${nonce}">
    :root {
      --header-height: 32px;
      --row-height: 28px;
      --index-width: 64px;
      --cell-width: 160px;
      --panel-font-size: var(--vscode-font-size);
      --cell-padding-x: 8px;
    }
    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      font-family: var(--vscode-font-family);
      font-size: var(--panel-font-size);
    }
    body {
      display: flex;
      flex-direction: column;
    }
    .toolbar {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 38px;
      padding: 0 10px;
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
      box-sizing: border-box;
      white-space: nowrap;
      overflow: visible;
    }
    button, select, input[type="number"], input[type="search"] {
      height: 26px;
      font: inherit;
    }
    button {
      padding: 0 10px;
      color: var(--vscode-button-foreground);
      background: var(--vscode-button-background);
      border: 1px solid var(--vscode-button-border, transparent);
      border-radius: 2px;
      cursor: pointer;
    }
    button:hover:not(:disabled) {
      background: var(--vscode-button-hoverBackground);
    }
    button:disabled, select:disabled, input:disabled {
      opacity: 0.5;
      cursor: default;
    }
    select, input[type="number"] {
      color: var(--vscode-dropdown-foreground);
      background: var(--vscode-dropdown-background);
      border: 1px solid var(--vscode-dropdown-border);
      border-radius: 2px;
    }
    input[type="number"] {
      padding: 0 4px;
      box-sizing: border-box;
    }
    input[type="search"] {
      min-width: 110px;
      width: 150px;
      padding: 0 6px;
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
      border: 1px solid var(--vscode-input-border, var(--vscode-dropdown-border));
      border-radius: 2px;
      box-sizing: border-box;
    }
    .checkbox {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      color: var(--vscode-descriptionForeground);
    }
    .settings {
      position: relative;
      flex: 0 0 auto;
      color: var(--vscode-editor-foreground);
    }
    .settings summary {
      height: 26px;
      line-height: 26px;
      padding: 0 8px;
      border: 1px solid var(--vscode-dropdown-border);
      border-radius: 2px;
      background: var(--vscode-dropdown-background);
      cursor: pointer;
      list-style-position: inside;
      box-sizing: border-box;
    }
    .settings-panel {
      position: absolute;
      top: 30px;
      right: 0;
      z-index: 20;
      display: grid;
      gap: 8px;
      width: 280px;
      max-height: calc(100vh - 60px);
      overflow: auto;
      padding: 10px;
      border: 1px solid var(--vscode-panel-border);
      background: var(--vscode-sideBar-background);
      box-shadow: 0 4px 12px var(--vscode-widget-shadow);
      box-sizing: border-box;
    }
    .settings-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 94px;
      gap: 8px;
      align-items: center;
    }
    .settings-row select,
    .settings-row input[type="number"] {
      width: 100%;
      min-width: 0;
    }
    .settings-section {
      display: grid;
      gap: 6px;
      padding-top: 8px;
      border-top: 1px solid var(--vscode-panel-border);
    }
    .settings-heading {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      color: var(--vscode-descriptionForeground);
    }
    .column-list {
      display: grid;
      gap: 2px;
      max-height: 180px;
      overflow: auto;
      border: 1px solid var(--vscode-panel-border);
      padding: 4px;
      box-sizing: border-box;
    }
    .column-row {
      display: flex;
      align-items: center;
      gap: 6px;
      min-height: 22px;
      min-width: 0;
    }
    .column-row span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      min-width: 0;
    }
    .reset-columns {
      width: 100%;
    }
    .search {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      min-width: 0;
      flex: 0 1 auto;
    }
    .search button {
      padding: 0 6px;
    }
    .search-status {
      color: var(--vscode-descriptionForeground);
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      max-width: 160px;
    }
    .summary, .selection, .status {
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
    }
    .status {
      color: var(--vscode-descriptionForeground);
    }
    .selection {
      margin-left: auto;
      color: var(--vscode-descriptionForeground);
    }
    .spinner {
      width: 14px;
      height: 14px;
      border: 2px solid var(--vscode-panel-border);
      border-top-color: var(--vscode-progressBar-background);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      flex: 0 0 auto;
    }
    .spinner[hidden] {
      display: none;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
    .message {
      padding: 10px;
      color: var(--vscode-descriptionForeground);
      border-bottom: 1px solid var(--vscode-panel-border);
      white-space: pre-wrap;
      max-height: 80px;
      overflow: auto;
      box-sizing: border-box;
    }
    .message.error {
      color: var(--vscode-errorForeground);
    }
    #viewport {
      position: relative;
      flex: 1;
      overflow: auto;
      outline: none;
      user-select: none;
    }
    #canvas {
      position: relative;
      min-width: 100%;
    }
    .header {
      position: sticky;
      top: 0;
      z-index: 5;
      height: var(--header-height);
      background: var(--vscode-editorGroupHeader-tabsBackground);
      border-bottom: 1px solid var(--vscode-panel-border);
      box-sizing: border-box;
    }
    .row {
      position: absolute;
      height: var(--row-height);
      box-sizing: border-box;
    }
    .cell {
      position: absolute;
      height: var(--row-height);
      line-height: var(--row-height);
      box-sizing: border-box;
      padding: 0 var(--cell-padding-x);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      border-right: 1px solid var(--vscode-panel-border);
      border-bottom: 1px solid var(--vscode-panel-border);
      background: var(--vscode-editor-background);
    }
    .header .cell {
      height: var(--header-height);
      line-height: var(--header-height);
      font-weight: 600;
      background: var(--vscode-editorGroupHeader-tabsBackground);
    }
    .index {
      color: var(--vscode-descriptionForeground);
      text-align: right;
      background: var(--vscode-sideBar-background);
    }
    .selected {
      background: var(--vscode-list-activeSelectionBackground);
      color: var(--vscode-list-activeSelectionForeground);
    }
    .search-match:not(.selected) {
      background: var(--vscode-editor-findMatchHighlightBackground);
    }
    .search-active {
      box-shadow: inset 0 0 0 1px var(--vscode-editor-findMatchBorder, var(--vscode-focusBorder));
    }
    .empty {
      padding: 16px;
      color: var(--vscode-descriptionForeground);
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <select id="copyFormat" aria-label="Copy format" disabled>
      <option value="csv">CSV</option>
      <option value="tsv">TSV</option>
      <option value="json">JSON</option>
      <option value="ndjson">NDJSON</option>
      <option value="html">HTML</option>
    </select>
    <button id="copy" disabled>Copy</button>
    <select id="exportFormat" aria-label="Export format" disabled>
      <option value="csv">CSV</option>
      <option value="xlsx">XLSX</option>
      <option value="tsv">TSV</option>
      <option value="json">JSON</option>
      <option value="ndjson">NDJSON</option>
      <option value="html">HTML</option>
    </select>
    <button id="export" disabled>Export</button>
    <label class="checkbox"><input id="includeRowIndex" type="checkbox" checked>Row #</label>
    <label class="checkbox"><input id="includeHeaders" type="checkbox" checked>Headers</label>
    <select id="interactionMode" aria-label="Header mode">
      <option value="select">Select</option>
      <option value="sort">Sort</option>
    </select>
    <span id="sortStatus" class="status">Sort: none</span>
    <span class="search">
      <input id="searchInput" type="search" placeholder="Search" aria-label="Search visible cells" disabled>
      <button id="searchPrev" disabled>Prev</button>
      <button id="searchNext" disabled>Next</button>
      <span id="searchStatus" class="search-status"></span>
    </span>
    <details id="settingsMenu" class="settings">
      <summary>Settings</summary>
      <div class="settings-panel">
        <label class="checkbox"><input id="settingsShowRowIndex" type="checkbox">Show row #</label>
        <label class="checkbox"><input id="settingsIncludeHeaders" type="checkbox">Include headers</label>
        <label class="checkbox"><input id="settingsIncludeRowIndex" type="checkbox">Include row #</label>
        <label class="settings-row"><span>Density</span><select id="settingsDensity">
          <option value="compact">Compact</option>
          <option value="standard">Standard</option>
          <option value="comfortable">Comfortable</option>
        </select></label>
        <label class="settings-row"><span>Cell width</span><input id="settingsCellWidth" type="number" min="80" max="600" step="1"></label>
        <label class="settings-row"><span>Row height</span><input id="settingsRowHeight" type="number" min="20" max="80" step="1"></label>
        <label class="settings-row"><span>Font size</span><input id="settingsFontSize" type="number" min="0" max="32" step="1"></label>
        <div class="settings-section">
          <div class="settings-heading"><span>Columns</span><span id="hiddenColumns">All visible</span></div>
          <div id="columnList" class="column-list" role="list"></div>
          <button id="resetColumns" class="reset-columns" disabled>Reset hidden columns</button>
        </div>
      </div>
    </details>
    <span id="spinner" class="spinner" hidden></span>
    <span id="summary" class="summary"></span>
    <span id="status" class="status"></span>
    <span id="selection" class="selection"></span>
  </div>
  <div id="message" class="message" hidden></div>
  <div id="viewport" tabindex="0">
    <div id="canvas">
      <div id="header" class="header" role="row"></div>
      <div id="rows"></div>
      <div id="empty" class="empty" hidden>0 rows</div>
    </div>
  </div>
  <script nonce="${nonce}">
    (function () {
      const vscode = acquireVsCodeApi();
      const INDEX_WIDTH = 64;
      const OVERSCAN_ROWS = 8;
      const OVERSCAN_COLUMNS = 2;
      const DEFAULT_SETTINGS = {
        cellWidth: 160,
        rowHeight: 28,
        fontSize: 0,
        density: 'standard',
        showRowIndex: true,
        includeHeaders: true,
        includeRowIndex: true
      };
      const viewport = document.getElementById('viewport');
      const canvas = document.getElementById('canvas');
      const header = document.getElementById('header');
      const rowsLayer = document.getElementById('rows');
      const copyFormat = document.getElementById('copyFormat');
      const copyButton = document.getElementById('copy');
      const exportFormat = document.getElementById('exportFormat');
      const exportButton = document.getElementById('export');
      const includeRowIndex = document.getElementById('includeRowIndex');
      const includeHeaders = document.getElementById('includeHeaders');
      const interactionMode = document.getElementById('interactionMode');
      const sortStatus = document.getElementById('sortStatus');
      const searchInput = document.getElementById('searchInput');
      const searchPrev = document.getElementById('searchPrev');
      const searchNext = document.getElementById('searchNext');
      const searchStatus = document.getElementById('searchStatus');
      const settingsShowRowIndex = document.getElementById('settingsShowRowIndex');
      const settingsIncludeHeaders = document.getElementById('settingsIncludeHeaders');
      const settingsIncludeRowIndex = document.getElementById('settingsIncludeRowIndex');
      const settingsDensity = document.getElementById('settingsDensity');
      const settingsCellWidth = document.getElementById('settingsCellWidth');
      const settingsRowHeight = document.getElementById('settingsRowHeight');
      const settingsFontSize = document.getElementById('settingsFontSize');
      const hiddenColumns = document.getElementById('hiddenColumns');
      const columnList = document.getElementById('columnList');
      const resetColumns = document.getElementById('resetColumns');
      const spinner = document.getElementById('spinner');
      const summary = document.getElementById('summary');
      const status = document.getElementById('status');
      const selectionLabel = document.getElementById('selection');
      const message = document.getElementById('message');
      const empty = document.getElementById('empty');
      let data = emptyData();
      let slice = emptySlice();
      let dragging = false;
      let dragMode = '';
      let selection = null;
      let renderQueued = false;
      let latestRequestId = 0;
      let pendingRequestKey = '';
      let searchTimer = 0;
      let search = emptySearch();
      let settings = normalizeSettings(DEFAULT_SETTINGS);
      let layout = layoutFromSettings(settings);

      window.addEventListener('message', event => {
        const msg = event.data || {};
        if (msg.type === 'loading') {
          setLoading(msg.state || {});
        } else if (msg.type === 'resultMeta') {
          setResultMeta(msg.result || {});
        } else if (msg.type === 'slice') {
          setSlice(msg);
        } else if (msg.type === 'searchResults') {
          setSearchResults(msg);
        } else if (msg.type === 'settings') {
          applySettings(msg.settings);
          updateActionState();
          updateSelectionLabel();
          renderNow();
        } else if (msg.type === 'copied') {
          status.textContent = 'Copied ' + msg.rows + 'x' + msg.columns + ' ' + String(msg.format || '').toUpperCase();
        } else if (msg.type === 'exported') {
          status.textContent = 'Exported ' + msg.rows + 'x' + msg.columns + ' ' + String(msg.format || '').toUpperCase();
        } else if (msg.type === 'exportSkipped') {
          status.textContent = String(msg.format || '').toUpperCase() + ' export skipped';
        } else if (msg.type === 'copySkipped') {
          status.textContent = 'Copy skipped';
        } else if (msg.type === 'sortSkipped') {
          status.textContent = 'Sort skipped';
        }
      });

      copyButton.addEventListener('click', copySelection);
      exportButton.addEventListener('click', exportSelection);
      includeHeaders.addEventListener('change', () => updateSetting('includeHeaders', !!includeHeaders.checked));
      includeRowIndex.addEventListener('change', () => updateSetting('includeRowIndex', !!includeRowIndex.checked));
      interactionMode.addEventListener('change', () => {
        updateSortStatus();
        renderNow();
      });
      searchInput.addEventListener('input', queueSearchRows);
      searchInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
          event.preventDefault();
          jumpSearch(event.shiftKey ? -1 : 1);
        } else if (event.key === 'Escape') {
          searchInput.value = '';
          queueSearchRows();
        }
      });
      searchPrev.addEventListener('click', () => jumpSearch(-1));
      searchNext.addEventListener('click', () => jumpSearch(1));
      settingsShowRowIndex.addEventListener('change', () => updateSetting('showRowIndex', !!settingsShowRowIndex.checked));
      settingsIncludeHeaders.addEventListener('change', () => updateSetting('includeHeaders', !!settingsIncludeHeaders.checked));
      settingsIncludeRowIndex.addEventListener('change', () => updateSetting('includeRowIndex', !!settingsIncludeRowIndex.checked));
      settingsDensity.addEventListener('change', () => updateSetting('density', String(settingsDensity.value || 'standard')));
      settingsCellWidth.addEventListener('change', () => updateNumberSetting('cellWidth', settingsCellWidth, 80, 600));
      settingsRowHeight.addEventListener('change', () => updateNumberSetting('rowHeight', settingsRowHeight, 20, 80));
      settingsFontSize.addEventListener('change', () => updateNumberSetting('fontSize', settingsFontSize, 0, 32));
      resetColumns.addEventListener('click', () => vscode.postMessage({ type: 'resetHiddenColumns' }));
      viewport.addEventListener('scroll', requestRender);
      window.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'c' && hasTableCells()) {
          event.preventDefault();
          copySelection();
        }
      });
      window.addEventListener('mouseup', () => {
        dragging = false;
        dragMode = '';
      });
      window.addEventListener('resize', requestRender);

      function setLoading(state) {
        applySettings(state.settings);
        data = emptyData();
        data.version = toNonNegativeInteger(state.version, data.version + 1);
        data.query = state.query || '';
        data.connectionName = state.connectionName || '';
        data.sort = null;
        resetWindowState();
        summary.textContent = 'Running on ' + (state.connectionName || 'kdb');
        status.textContent = '';
        updateSortStatus();
        resetSearch(false);
        selectionLabel.textContent = '';
        spinner.hidden = false;
        setActionsDisabled(true);
        renderColumnSettings();
        showMessage('', false);
        renderNow();
      }

      function setResultMeta(result) {
        applySettings(result.settings);
        data = {
          version: toNonNegativeInteger(result.version, data.version + 1),
          columns: Array.isArray(result.columns) ? result.columns.map(String) : [],
          allColumns: Array.isArray(result.allColumns) ? result.allColumns.map(String) : [],
          hiddenColumnNames: Array.isArray(result.hiddenColumnNames) ? result.hiddenColumnNames.map(String) : [],
          hiddenColumnCount: toNonNegativeInteger(result.hiddenColumnCount, 0),
          rowCount: toNonNegativeInteger(result.rowCount, 0),
          messages: Array.isArray(result.messages) ? result.messages.map(String) : [],
          query: result.query || '',
          connectionName: result.connectionName || '',
          elapsedMs: toNonNegativeInteger(result.elapsedMs, 0),
          error: !!result.error,
          sort: normalizeSortState(result.sort)
        };
        if (data.allColumns.length === 0) {
          data.allColumns = data.columns.slice();
        }
        resetWindowState();
        summary.textContent = data.rowCount + ' rows x ' + data.columns.length + ' columns' +
          (data.hiddenColumnCount > 0 ? ' (' + data.hiddenColumnCount + ' hidden)' : '') +
          (data.connectionName ? ' | ' + data.connectionName : '') +
          ' | ' + data.elapsedMs + ' ms';
        status.textContent = '';
        updateSortStatus();
        resetSearch(false);
        spinner.hidden = true;
        updateActionState();
        updateSelectionLabel();
        renderColumnSettings();
        showMessage(data.messages.join('\\n'), data.error);
        renderNow();
        if (String(searchInput.value || '').length > 0) {
          queueSearchRows();
        }
      }

      function setSlice(msg) {
        if (toNonNegativeInteger(msg.version, -1) !== data.version) {
          return;
        }
        if (toNonNegativeInteger(msg.requestId, 0) < latestRequestId) {
          return;
        }
        slice = normalizeSlice(msg.slice || {});
        pendingRequestKey = '';
        renderNow();
      }

      function resetWindowState() {
        slice = emptySlice();
        selection = null;
        dragging = false;
        dragMode = '';
        latestRequestId = 0;
        pendingRequestKey = '';
      }

      function queueSearchRows() {
        if (searchTimer) {
          clearTimeout(searchTimer);
          searchTimer = 0;
        }

        const query = String(searchInput.value || '');
        search.searchId += 1;
        search.query = query;
        search.matches = [];
        search.matchLookup = Object.create(null);
        search.activeIndex = -1;
        search.totalScanned = 0;
        search.scannedCells = 0;
        search.capped = false;
        search.partial = false;
        search.searching = query.length > 0 && hasTableCells();

        if (query.length === 0 || !hasTableCells()) {
          updateSearchStatus();
          updateSearchControls();
          requestRender();
          sendSearchRows(search.searchId, query);
          return;
        }

        updateSearchStatus();
        updateSearchControls();
        const searchId = search.searchId;
        searchTimer = setTimeout(() => sendSearchRows(searchId, query), 250);
      }

      function sendSearchRows(searchId, query) {
        if (searchId !== search.searchId || query !== search.query) {
          return;
        }
        searchTimer = 0;
        vscode.postMessage({
          type: 'searchRows',
          version: data.version,
          searchId,
          query
        });
      }

      function setSearchResults(msg) {
        const version = toNonNegativeInteger(msg.version, -1);
        const searchId = toInteger(msg.searchId, -1);
        const query = String(msg.query || '');
        if (version !== data.version || searchId !== search.searchId || query !== search.query) {
          return;
        }

        search.matches = normalizeMatchedRows(msg.matchedRows);
        search.matchLookup = rowLookup(search.matches);
        search.activeIndex = search.matches.length > 0 ? 0 : -1;
        search.totalScanned = toNonNegativeInteger(msg.totalScanned, 0);
        search.scannedCells = toNonNegativeInteger(msg.scannedCells, 0);
        search.capped = msg.capped === true;
        search.partial = msg.partial === true;
        search.searching = false;
        updateSearchStatus();
        updateSearchControls();
        if (search.activeIndex >= 0) {
          scrollRowIntoView(search.matches[search.activeIndex]);
        }
        requestRender();
      }

      function resetSearch(clearInput) {
        if (searchTimer) {
          clearTimeout(searchTimer);
          searchTimer = 0;
        }
        search.searchId += 1;
        search = {
          searchId: search.searchId,
          query: clearInput ? '' : String(searchInput.value || ''),
          matches: [],
          matchLookup: Object.create(null),
          activeIndex: -1,
          totalScanned: 0,
          scannedCells: 0,
          capped: false,
          partial: false,
          searching: false
        };
        if (clearInput) {
          searchInput.value = '';
        }
        updateSearchStatus();
        updateSearchControls();
      }

      function jumpSearch(direction) {
        if (search.matches.length === 0) {
          return;
        }
        if (search.activeIndex < 0) {
          search.activeIndex = direction < 0 ? search.matches.length - 1 : 0;
        } else {
          search.activeIndex = (search.activeIndex + direction + search.matches.length) % search.matches.length;
        }
        scrollRowIntoView(search.matches[search.activeIndex]);
        updateSearchStatus();
        requestRender();
      }

      function scrollRowIntoView(row) {
        if (row < 0 || row >= data.rowCount) {
          return;
        }
        const top = layout.headerHeight + row * layout.rowHeight;
        const bottom = top + layout.rowHeight;
        const visibleTop = viewport.scrollTop + layout.headerHeight;
        const visibleBottom = viewport.scrollTop + viewport.clientHeight;
        if (top < visibleTop) {
          viewport.scrollTop = Math.max(0, top - layout.headerHeight);
        } else if (bottom > visibleBottom) {
          viewport.scrollTop = Math.max(0, bottom - viewport.clientHeight);
        }
      }

      function updateSearchStatus() {
        if (search.query.length === 0 || !hasTableCells()) {
          searchStatus.textContent = '';
          return;
        }
        if (search.searching) {
          searchStatus.textContent = 'Searching...';
          return;
        }
        if (search.matches.length === 0) {
          searchStatus.textContent = 'No matches';
          return;
        }
        searchStatus.textContent = (search.activeIndex + 1) + '/' + search.matches.length +
          (search.capped ? '+' : '') +
          (search.partial ? ' partial' : '');
      }

      function updateSearchControls() {
        const canSearch = hasTableCells();
        const hasMatches = search.matches.length > 0;
        searchInput.disabled = !canSearch;
        searchPrev.disabled = !hasMatches;
        searchNext.disabled = !hasMatches;
      }

      function normalizeMatchedRows(rows) {
        const matches = [];
        if (!Array.isArray(rows)) {
          return matches;
        }
        rows.forEach(value => {
          const row = toInteger(value, -1);
          if (row >= 0 && row < data.rowCount) {
            matches.push(row);
          }
        });
        return matches;
      }

      function rowLookup(rows) {
        const lookup = Object.create(null);
        rows.forEach(row => {
          lookup[row] = true;
        });
        return lookup;
      }

      function isSearchMatchedRow(row) {
        return search.matchLookup[row] === true;
      }

      function isActiveSearchRow(row) {
        return search.activeIndex >= 0 && search.matches[search.activeIndex] === row;
      }

      function setActionsDisabled(disabled) {
        copyFormat.disabled = disabled;
        copyButton.disabled = disabled;
        exportFormat.disabled = disabled;
        exportButton.disabled = disabled;
        includeRowIndex.disabled = false;
        includeHeaders.disabled = false;
      }

      function updateActionState() {
        setActionsDisabled(!hasTableCells());
      }

      function hasTableCells() {
        return data.rowCount > 0 && data.columns.length > 0;
      }

      function applySettings(value) {
        settings = normalizeSettings(value || {});
        layout = layoutFromSettings(settings);
        syncSettingsControls();
        const root = document.documentElement;
        root.style.setProperty('--cell-width', layout.cellWidth + 'px');
        root.style.setProperty('--row-height', layout.rowHeight + 'px');
        root.style.setProperty('--header-height', layout.headerHeight + 'px');
        root.style.setProperty('--cell-padding-x', layout.cellPaddingX + 'px');
        root.style.setProperty('--panel-font-size', settings.fontSize > 0 ? settings.fontSize + 'px' : 'var(--vscode-font-size)');
      }

      function layoutFromSettings(settings) {
        const densityDelta = settings.density === 'compact' ? -4 : settings.density === 'comfortable' ? 4 : 0;
        const rowHeight = clampInteger(settings.rowHeight + densityDelta, 20, 80);
        return {
          cellWidth: settings.cellWidth,
          rowHeight,
          headerHeight: clampInteger(rowHeight + 4, 24, 88),
          cellPaddingX: settings.density === 'compact' ? 5 : settings.density === 'comfortable' ? 11 : 8,
          indexWidth: settings.showRowIndex ? INDEX_WIDTH : 0,
          showRowIndex: settings.showRowIndex
        };
      }

      function normalizeSettings(value) {
        return {
          cellWidth: boundedSetting(value.cellWidth, DEFAULT_SETTINGS.cellWidth, 80, 600),
          rowHeight: boundedSetting(value.rowHeight, DEFAULT_SETTINGS.rowHeight, 20, 80),
          fontSize: boundedSetting(value.fontSize, DEFAULT_SETTINGS.fontSize, 0, 32),
          density: normalizeDensity(value.density),
          showRowIndex: typeof value.showRowIndex === 'boolean' ? value.showRowIndex : DEFAULT_SETTINGS.showRowIndex,
          includeHeaders: typeof value.includeHeaders === 'boolean' ? value.includeHeaders : DEFAULT_SETTINGS.includeHeaders,
          includeRowIndex: typeof value.includeRowIndex === 'boolean' ? value.includeRowIndex : DEFAULT_SETTINGS.includeRowIndex
        };
      }

      function syncSettingsControls() {
        includeHeaders.checked = settings.includeHeaders;
        includeRowIndex.checked = settings.includeRowIndex;
        settingsShowRowIndex.checked = settings.showRowIndex;
        settingsIncludeHeaders.checked = settings.includeHeaders;
        settingsIncludeRowIndex.checked = settings.includeRowIndex;
        settingsDensity.value = settings.density;
        settingsCellWidth.value = String(settings.cellWidth);
        settingsRowHeight.value = String(settings.rowHeight);
        settingsFontSize.value = String(settings.fontSize);
      }

      function updateSetting(key, value) {
        const next = {
          cellWidth: settings.cellWidth,
          rowHeight: settings.rowHeight,
          fontSize: settings.fontSize,
          density: settings.density,
          showRowIndex: settings.showRowIndex,
          includeHeaders: settings.includeHeaders,
          includeRowIndex: settings.includeRowIndex
        };
        next[key] = value;
        applySettings(next);
        requestRender();
        vscode.postMessage({ type: 'updateSetting', key, value });
      }

      function updateNumberSetting(key, input, min, max) {
        const value = Number(input.value);
        if (!Number.isFinite(value)) {
          syncSettingsControls();
          return;
        }
        updateSetting(key, clampInteger(value, min, max));
      }

      function renderColumnSettings() {
        const hidden = columnNameLookup(data.hiddenColumnNames);
        hiddenColumns.textContent = data.hiddenColumnCount > 0 ? data.hiddenColumnCount + ' hidden' : 'All visible';
        resetColumns.disabled = data.hiddenColumnCount <= 0;
        columnList.textContent = '';
        const fragment = document.createDocumentFragment();
        data.allColumns.forEach(column => {
          const label = document.createElement('label');
          label.className = 'column-row';
          label.setAttribute('role', 'listitem');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = !hidden[column];
          checkbox.addEventListener('change', () => {
            vscode.postMessage({ type: checkbox.checked ? 'showColumn' : 'hideColumn', columnName: column });
          });
          const text = document.createElement('span');
          text.textContent = column;
          text.title = column;
          label.appendChild(checkbox);
          label.appendChild(text);
          fragment.appendChild(label);
        });
        columnList.appendChild(fragment);
      }

      function headerMode() {
        return String(interactionMode.value || 'select') === 'sort' ? 'sort' : 'select';
      }

      function updateSortStatus() {
        sortStatus.textContent = data.sort
          ? 'Sort: ' + data.sort.columnName + ' ' + data.sort.direction
          : 'Sort: none';
      }

      function normalizeSortState(value) {
        if (!value || typeof value.columnName !== 'string') {
          return null;
        }
        const direction = value.direction === 'desc' ? 'desc' : value.direction === 'asc' ? 'asc' : '';
        return direction ? { columnName: value.columnName, direction } : null;
      }

      function columnNameLookup(columnNames) {
        const lookup = Object.create(null);
        columnNames.forEach(column => {
          lookup[column] = true;
        });
        return lookup;
      }

      function boundedSetting(value, fallback, min, max) {
        const number = Number(value);
        return Number.isFinite(number) ? clampInteger(number, min, max) : fallback;
      }

      function normalizeDensity(value) {
        return value === 'compact' || value === 'comfortable' ? value : 'standard';
      }

      function showMessage(text, isError) {
        message.hidden = !text;
        message.textContent = text || '';
        message.className = isError ? 'message error' : 'message';
      }

      function requestRender() {
        if (renderQueued) {
          return;
        }
        renderQueued = true;
        requestAnimationFrame(() => {
          renderQueued = false;
          renderNow();
        });
      }

      function renderNow() {
        const columnCount = data.columns.length;
        const rowCount = data.rowCount;
        const totalWidth = layout.indexWidth + columnCount * layout.cellWidth;
        const totalHeight = layout.headerHeight + rowCount * layout.rowHeight;
        canvas.style.width = Math.max(totalWidth, viewport.clientWidth) + 'px';
        canvas.style.height = Math.max(totalHeight, viewport.clientHeight) + 'px';
        empty.hidden = rowCount !== 0 || columnCount !== 0;
        empty.style.top = layout.headerHeight + 'px';

        const rows = visibleRange(Math.max(0, viewport.scrollTop - layout.headerHeight), viewport.clientHeight, layout.rowHeight, rowCount, OVERSCAN_ROWS);
        const columns = visibleColumns();
        renderHeader(columns);
        requestSlice(rows, columns);
        renderRows(rows, columns);
      }

      function visibleColumns() {
        const offset = Math.max(0, viewport.scrollLeft - layout.indexWidth);
        return visibleRange(offset, viewport.clientWidth, layout.cellWidth, data.columns.length, OVERSCAN_COLUMNS);
      }

      function visibleRange(offset, size, itemSize, count, overscan) {
        if (count <= 0 || size <= 0 || itemSize <= 0) {
          return { start: 0, end: -1 };
        }
        const start = Math.max(0, Math.floor(offset / itemSize) - overscan);
        const end = Math.min(count - 1, Math.ceil((offset + size) / itemSize) + overscan);
        return { start, end };
      }

      function requestSlice(rows, columns) {
        if (rows.end < rows.start || columns.end < columns.start || data.rowCount <= 0 || data.columns.length <= 0) {
          return;
        }
        if (sliceCovers(slice, rows, columns)) {
          return;
        }

        const key = rangeKey(rows, columns);
        if (pendingRequestKey === key) {
          return;
        }

        pendingRequestKey = key;
        latestRequestId += 1;
        vscode.postMessage({
          type: 'requestSlice',
          version: data.version,
          requestId: latestRequestId,
          rows,
          columns
        });
      }

      function renderHeader(columns) {
        const range = normalizedSelection();
        const cells = layout.showRowIndex ? [createCell({
          text: '#',
          row: -1,
          column: -1,
          left: 0,
          top: 0,
          width: layout.indexWidth,
          headerCell: true,
          selected: isAllSelected(range),
          className: 'cell index'
        })] : [];
        replaceChildren(header, cells.concat(headerCells(columns, range)));
      }

      function headerCells(columns, range) {
        const cells = [];
        for (let column = columns.start; column <= columns.end; column++) {
          cells.push(createCell({
            text: data.columns[column],
            row: -1,
            column,
            left: layout.indexWidth + column * layout.cellWidth,
            top: 0,
            width: layout.cellWidth,
            headerCell: true,
            selected: isColumnSelected(column, range),
            className: 'cell'
          }));
        }
        return cells;
      }

      function renderRows(rows, columns) {
        const range = normalizedSelection();
        const hasCells = sliceCovers(slice, rows, columns);
        const fragment = document.createDocumentFragment();
        for (let row = rows.start; row <= rows.end; row++) {
          const rowElement = document.createElement('div');
          rowElement.className = 'row';
          rowElement.setAttribute('role', 'row');
          rowElement.style.top = (layout.headerHeight + row * layout.rowHeight) + 'px';
          rowElement.style.width = canvas.style.width;
          const searchMatched = isSearchMatchedRow(row);
          const searchActive = isActiveSearchRow(row);
          if (layout.showRowIndex) {
            rowElement.appendChild(createCell({
              text: String(row + 1),
              row,
              column: -1,
              left: 0,
              top: 0,
              width: layout.indexWidth,
              headerCell: false,
              selected: isRowSelected(row, range),
              searchMatch: searchMatched,
              searchActive,
              className: 'cell index'
            }));
          }
          for (let column = columns.start; column <= columns.end; column++) {
            const selected = isSelected(row, column, range);
            const value = hasCells ? cellText(row, column) : '';
            rowElement.appendChild(createCell({
              text: value,
              row,
              column,
              left: layout.indexWidth + column * layout.cellWidth,
              top: 0,
              width: layout.cellWidth,
              headerCell: false,
              selected,
              searchMatch: searchMatched,
              searchActive,
              className: 'cell'
            }));
          }
          fragment.appendChild(rowElement);
        }
        rowsLayer.textContent = '';
        rowsLayer.appendChild(fragment);
      }

      function createCell(options) {
        const cell = document.createElement('div');
        cell.className = options.className +
          (options.selected ? ' selected' : '') +
          (options.searchMatch ? ' search-match' : '') +
          (options.searchActive ? ' search-active' : '');
        cell.setAttribute('role', options.row >= 0 && options.column < 0 ? 'rowheader' : options.headerCell ? 'columnheader' : 'cell');
        cell.style.left = options.left + 'px';
        cell.style.top = options.top + 'px';
        cell.style.width = options.width + 'px';
        cell.title = String(options.text || '');
        cell.textContent = String(options.text || '');
        if (options.row >= 0) {
          cell.dataset.row = String(options.row);
        }
        if (options.column >= 0) {
          cell.dataset.column = String(options.column);
        }
        if (options.row >= 0 && options.column >= 0) {
          cell.addEventListener('mousedown', onCellMouseDown);
          cell.addEventListener('mouseenter', onCellMouseEnter);
        } else if (options.row === -1 && options.column === -1) {
          cell.addEventListener('mousedown', onTableMouseDown);
        } else if (options.row === -1 && options.column >= 0) {
          cell.addEventListener('mousedown', onColumnMouseDown);
          cell.addEventListener('mouseenter', onColumnMouseEnter);
        } else if (options.row >= 0 && options.column === -1) {
          cell.addEventListener('mousedown', onRowMouseDown);
          cell.addEventListener('mouseenter', onRowMouseEnter);
        }
        return cell;
      }

      function onCellMouseDown(event) {
        if (event.button !== 0 || !hasTableCells()) {
          return;
        }
        const cell = event.currentTarget;
        const row = Number(cell.dataset.row);
        const column = Number(cell.dataset.column);
        dragging = true;
        dragMode = 'cell';
        if (event.shiftKey && selection) {
          selection.focusRow = row;
          selection.focusColumn = column;
        } else {
          selection = { anchorRow: row, anchorColumn: column, focusRow: row, focusColumn: column };
        }
        viewport.focus();
        updateSelection();
        event.preventDefault();
      }

      function onCellMouseEnter(event) {
        if (!dragging || dragMode !== 'cell' || !selection) {
          return;
        }
        const cell = event.currentTarget;
        selection.focusRow = Number(cell.dataset.row);
        selection.focusColumn = Number(cell.dataset.column);
        updateSelection();
      }

      function onColumnMouseDown(event) {
        if (event.button !== 0 || !hasTableCells()) {
          return;
        }
        const column = Number(event.currentTarget.dataset.column);
        if (headerMode() === 'sort') {
          dragging = false;
          dragMode = '';
          status.textContent = '';
          vscode.postMessage({
            type: 'sortColumn',
            version: data.version,
            columnIndex: column,
            columnName: data.columns[column]
          });
          event.preventDefault();
          return;
        }
        const anchorColumn = event.shiftKey && selection ? selection.anchorColumn : column;
        dragging = true;
        dragMode = 'column';
        selection = { anchorRow: 0, anchorColumn, focusRow: data.rowCount - 1, focusColumn: column };
        viewport.focus();
        updateSelection();
        event.preventDefault();
      }

      function onColumnMouseEnter(event) {
        if (!dragging || dragMode !== 'column' || !selection) {
          return;
        }
        selection.focusRow = data.rowCount - 1;
        selection.focusColumn = Number(event.currentTarget.dataset.column);
        updateSelection();
      }

      function onRowMouseDown(event) {
        if (event.button !== 0 || !hasTableCells()) {
          return;
        }
        const row = Number(event.currentTarget.dataset.row);
        const anchorRow = event.shiftKey && selection ? selection.anchorRow : row;
        dragging = true;
        dragMode = 'row';
        selection = { anchorRow, anchorColumn: 0, focusRow: row, focusColumn: data.columns.length - 1 };
        viewport.focus();
        updateSelection();
        event.preventDefault();
      }

      function onRowMouseEnter(event) {
        if (!dragging || dragMode !== 'row' || !selection) {
          return;
        }
        selection.focusRow = Number(event.currentTarget.dataset.row);
        selection.focusColumn = data.columns.length - 1;
        updateSelection();
      }

      function onTableMouseDown(event) {
        if (event.button !== 0 || !hasTableCells()) {
          return;
        }
        dragging = false;
        dragMode = '';
        selection = { anchorRow: 0, anchorColumn: 0, focusRow: data.rowCount - 1, focusColumn: data.columns.length - 1 };
        viewport.focus();
        updateSelection();
        event.preventDefault();
      }

      function replaceChildren(element, children) {
        element.textContent = '';
        const fragment = document.createDocumentFragment();
        children.forEach(child => fragment.appendChild(child));
        element.appendChild(fragment);
      }

      function cellText(row, column) {
        const rowOffset = row - slice.startRow;
        const columnOffset = column - slice.startColumn;
        const rowCells = slice.cells[rowOffset] || [];
        return rowCells[columnOffset] || '';
      }

      function updateSelection() {
        status.textContent = '';
        updateActionState();
        updateSelectionLabel();
        renderNow();
      }

      function updateSelectionLabel() {
        const range = normalizedSelection();
        selectionLabel.textContent = range ? selectionText(range) : 'No selection (actions use all)';
      }

      function normalizedSelection() {
        if (!selection || !hasTableCells()) {
          return null;
        }
        const maxRow = data.rowCount - 1;
        const maxColumn = data.columns.length - 1;
        const range = {
          startRow: clampInteger(Math.min(selection.anchorRow, selection.focusRow), 0, maxRow),
          endRow: clampInteger(Math.max(selection.anchorRow, selection.focusRow), 0, maxRow),
          startColumn: clampInteger(Math.min(selection.anchorColumn, selection.focusColumn), 0, maxColumn),
          endColumn: clampInteger(Math.max(selection.anchorColumn, selection.focusColumn), 0, maxColumn)
        };
        return range.startRow <= range.endRow && range.startColumn <= range.endColumn ? range : null;
      }

      function isSelected(row, column, range) {
        return !!range &&
          row >= range.startRow &&
          row <= range.endRow &&
          column >= range.startColumn &&
          column <= range.endColumn;
      }

      function isAllSelected(range) {
        return !!range &&
          range.startRow === 0 &&
          range.endRow === data.rowCount - 1 &&
          range.startColumn === 0 &&
          range.endColumn === data.columns.length - 1;
      }

      function isColumnSelected(column, range) {
        return !!range &&
          column >= range.startColumn &&
          column <= range.endColumn &&
          range.startRow === 0 &&
          range.endRow === data.rowCount - 1;
      }

      function isRowSelected(row, range) {
        return !!range &&
          row >= range.startRow &&
          row <= range.endRow &&
          range.startColumn === 0 &&
          range.endColumn === data.columns.length - 1;
      }

      function selectionText(range) {
        const selectedRows = range.endRow - range.startRow + 1;
        const selectedColumns = range.endColumn - range.startColumn + 1;
        const fullRows = range.startRow === 0 && range.endRow === data.rowCount - 1;
        const fullColumns = range.startColumn === 0 && range.endColumn === data.columns.length - 1;
        if (fullRows && fullColumns) {
          return 'All ' + data.rowCount + 'x' + data.columns.length;
        }
        if (fullRows) {
          return selectedColumns === 1
            ? 'Column ' + (range.startColumn + 1)
            : 'Columns ' + (range.startColumn + 1) + '-' + (range.endColumn + 1);
        }
        if (fullColumns) {
          return selectedRows === 1
            ? 'Row ' + (range.startRow + 1)
            : 'Rows ' + (range.startRow + 1) + '-' + (range.endRow + 1);
        }
        return 'Range ' + selectedRows + 'x' + selectedColumns;
      }

      function copySelection() {
        if (!hasTableCells()) {
          return;
        }
        const range = normalizedSelection();
        vscode.postMessage({
          type: 'copyRange',
          range,
          format: String(copyFormat.value || 'csv'),
          includeHeaders: !!includeHeaders.checked,
          includeRowIndex: !!includeRowIndex.checked
        });
      }

      function exportSelection() {
        if (!hasTableCells()) {
          return;
        }
        const range = normalizedSelection();
        vscode.postMessage({
          type: 'exportRange',
          range,
          format: String(exportFormat.value || 'csv'),
          includeHeaders: !!includeHeaders.checked,
          includeRowIndex: !!includeRowIndex.checked
        });
      }

      function sliceCovers(value, rows, columns) {
        return value &&
          rows.start >= value.startRow &&
          rows.end <= value.endRow &&
          columns.start >= value.startColumn &&
          columns.end <= value.endColumn;
      }

      function rangeKey(rows, columns) {
        return rows.start + ':' + rows.end + ':' + columns.start + ':' + columns.end;
      }

      function normalizeSlice(value) {
        const cells = Array.isArray(value.cells) ? value.cells : [];
        return {
          startRow: toNonNegativeInteger(value.startRow, 0),
          endRow: toInteger(value.endRow, -1),
          startColumn: toNonNegativeInteger(value.startColumn, 0),
          endColumn: toInteger(value.endColumn, -1),
          cells: cells.map(row => Array.isArray(row) ? row.map(cell => cell === null || cell === undefined ? '' : String(cell)) : [])
        };
      }

      function emptyData() {
        return {
          version: 0,
          columns: [],
          allColumns: [],
          hiddenColumnNames: [],
          hiddenColumnCount: 0,
          rowCount: 0,
          messages: [],
          query: '',
          connectionName: '',
          elapsedMs: 0,
          error: false,
          sort: null
        };
      }

      function emptySlice() {
        return {
          startRow: 0,
          endRow: -1,
          startColumn: 0,
          endColumn: -1,
          cells: []
        };
      }

      function emptySearch() {
        return {
          searchId: 0,
          query: '',
          matches: [],
          matchLookup: Object.create(null),
          activeIndex: -1,
          totalScanned: 0,
          scannedCells: 0,
          capped: false,
          partial: false,
          searching: false
        };
      }

      function toNonNegativeInteger(value, fallback) {
        return Math.max(0, toInteger(value, fallback));
      }

      function toInteger(value, fallback) {
        const number = Number(value);
        return Number.isFinite(number) ? Math.floor(number) : fallback;
      }

      function clampInteger(value, min, max) {
        return Math.min(Math.max(Math.floor(value), min), max);
      }

      vscode.postMessage({ type: 'ready' });
    }());
  </script>
</body>
</html>`;
  }
}

function yieldToEventLoop(): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, 0));
}

function nonceValue(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let text = '';
  for (let i = 0; i < 32; i++) {
    text += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return text;
}

function panelSettings(): KdbPanelSettings {
  const config = vscode.workspace.getConfiguration('kdb-sqltools.results');
  return {
    cellWidth: boundedSettingNumber(config.get<number>('cellWidth'), DEFAULT_PANEL_SETTINGS.cellWidth, 80, 600),
    rowHeight: boundedSettingNumber(config.get<number>('rowHeight'), DEFAULT_PANEL_SETTINGS.rowHeight, 20, 80),
    fontSize: boundedSettingNumber(config.get<number>('fontSize'), DEFAULT_PANEL_SETTINGS.fontSize, 0, 32),
    density: panelDensity(config.get<string>('density')),
    showRowIndex: booleanSetting(config.get<boolean>('showRowIndex'), DEFAULT_PANEL_SETTINGS.showRowIndex),
    includeHeaders: booleanSetting(config.get<boolean>('includeHeaders'), DEFAULT_PANEL_SETTINGS.includeHeaders),
    includeRowIndex: booleanSetting(config.get<boolean>('includeRowIndex'), DEFAULT_PANEL_SETTINGS.includeRowIndex),
  };
}

type PanelSettingUpdateValue = string | number | boolean;
type PanelSettingUpdateValidator = (value: any) => PanelSettingUpdateValue | null;

const RESULT_SETTING_UPDATE_ALLOWLIST: { [key: string]: PanelSettingUpdateValidator } = {
  cellWidth: value => numberSettingUpdate(value, 80, 600),
  rowHeight: value => numberSettingUpdate(value, 20, 80),
  fontSize: value => numberSettingUpdate(value, 0, 32),
  density: densitySettingUpdate,
  showRowIndex: booleanSettingUpdate,
  includeHeaders: booleanSettingUpdate,
  includeRowIndex: booleanSettingUpdate,
};

function normalizePanelSettingUpdate(key: any, value: any): { key: string; value: PanelSettingUpdateValue } | null {
  if (typeof key !== 'string') {
    return null;
  }

  const validator = RESULT_SETTING_UPDATE_ALLOWLIST[key];
  if (!validator) {
    return null;
  }

  const normalized = validator(value);
  return normalized === null ? null : { key, value: normalized };
}

function boundedSettingNumber(value: any, fallback: number, min: number, max: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(Math.max(Math.floor(number), min), max);
}

function booleanSetting(value: any, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}

function panelDensity(value: any): KdbPanelDensity {
  return value === 'compact' || value === 'comfortable' ? value : 'standard';
}

function numberSettingUpdate(value: any, min: number, max: number): number | null {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return null;
  }

  const integer = Math.floor(number);
  return integer >= min && integer <= max ? integer : null;
}

function densitySettingUpdate(value: any): string | null {
  return value === 'compact' || value === 'standard' || value === 'comfortable' ? value : null;
}

function booleanSettingUpdate(value: any): boolean | null {
  return typeof value === 'boolean' ? value : null;
}

function columnNameLookup(columnNames: string[]): { [name: string]: boolean } {
  const lookup: { [name: string]: boolean } = Object.create(null);
  columnNames.forEach(column => {
    lookup[column] = true;
  });
  return lookup;
}

function nextSortState(current: KdbPanelSortState | undefined, columnName: string): KdbPanelSortState | undefined {
  if (!current || current.columnName !== columnName) {
    return { columnName, direction: 'asc' };
  }

  if (current.direction === 'asc') {
    return { columnName, direction: 'desc' };
  }

  return undefined;
}

function messageRange(value: any, itemCount: number): VisibleIndexRange {
  if (itemCount <= 0) {
    return { start: 0, end: -1 };
  }

  const max = itemCount - 1;
  const start = boundedInteger(value && value.start, 0, max);
  const end = boundedInteger(value && value.end, 0, max);
  if (start > end) {
    return { start: 0, end: -1 };
  }

  return { start, end };
}

function boundedInteger(value: any, min: number, max: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return min;
  }
  return Math.min(Math.max(Math.floor(number), min), max);
}

function messageCellRange(value: any): CellRange | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const startRow = integerOrNull(value.startRow);
  const endRow = integerOrNull(value.endRow);
  const startColumn = integerOrNull(value.startColumn);
  const endColumn = integerOrNull(value.endColumn);
  if (startRow === null || endRow === null || startColumn === null || endColumn === null) {
    return null;
  }

  return { startRow, endRow, startColumn, endColumn };
}

function integerOrNull(value: any): number | null {
  const number = Number(value);
  return Number.isFinite(number) ? Math.floor(number) : null;
}

function textExportFormat(value: any): TextExportFormat {
  switch (value) {
    case 'csv':
    case 'json':
    case 'ndjson':
    case 'html':
    case 'tsv':
      return value;
  }
  return 'csv';
}

function exportFormat(value: any): ExportFormat {
  switch (value) {
    case 'csv':
    case 'xlsx':
    case 'json':
    case 'ndjson':
    case 'html':
    case 'tsv':
      return value;
  }
  return 'csv';
}

function saveFilters(format: ExportFormat): { [name: string]: string[] } {
  switch (format) {
    case 'csv':
      return { CSV: ['csv'] };
    case 'xlsx':
      return { XLSX: ['xlsx'] };
    case 'json':
      return { JSON: ['json'] };
    case 'ndjson':
      return { NDJSON: ['ndjson'] };
    case 'html':
      return { HTML: ['html', 'htm'] };
    case 'tsv':
      return { TSV: ['tsv'] };
  }
}

function defaultExportUri(format: ExportFormat): vscode.Uri {
  const folder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
    ? vscode.workspace.workspaceFolders[0].uri.fsPath
    : os.homedir();
  return vscode.Uri.file(path.join(folder, `kdb-results.${format}`));
}

function formatBytes(bytes: number): string {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatCount(count: number): string {
  return String(Math.floor(count)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

async function columnarToXlsx(
  result: ColumnarPanelResult,
  range: CellRange,
  includeHeaders: boolean,
  includeRowIndex: boolean
): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file('[Content_Types].xml', xmlDeclaration() +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    '</Types>');
  zip.file('_rels/.rels', xmlDeclaration() +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' +
    '</Relationships>');
  zip.file('xl/workbook.xml', xmlDeclaration() +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    '<sheets><sheet name="Results" sheetId="1" r:id="rId1"/></sheets>' +
    '</workbook>');
  zip.file('xl/_rels/workbook.xml.rels', xmlDeclaration() +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
    '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '</Relationships>');
  zip.file('xl/styles.xml', stylesXml());
  zip.file('xl/worksheets/sheet1.xml', sheetXml(result, range, includeHeaders, includeRowIndex));
  return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
}

function sheetXml(
  result: ColumnarPanelResult,
  range: CellRange,
  includeHeaders: boolean,
  includeRowIndex: boolean
): string {
  const selectedRows = range.endRow - range.startRow + 1;
  const selectedColumns = range.endColumn - range.startColumn + 1 + (includeRowIndex ? 1 : 0);
  const outputRows = selectedRows + (includeHeaders ? 1 : 0);
  const dimension = `A1:${excelColumnName(selectedColumns - 1)}${Math.max(outputRows, 1)}`;
  return xmlDeclaration() +
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    `<dimension ref="${dimension}"/>` +
    '<sheetData>' +
    sheetRowsXml(result, range, includeHeaders, includeRowIndex) +
    '</sheetData>' +
    '</worksheet>';
}

function sheetRowsXml(
  result: ColumnarPanelResult,
  range: CellRange,
  includeHeaders: boolean,
  includeRowIndex: boolean
): string {
  const parts: string[] = [];
  let outputRow = 1;
  if (includeHeaders) {
    const headers: string[] = [];
    if (includeRowIndex) {
      headers.push(cellValueToText(rowIndexColumnName(result.columns, range)));
    }
    for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex++) {
      headers.push(cellValueToText(result.columns[columnIndex]));
    }
    parts.push(sheetRowXml(outputRow, headers));
    outputRow += 1;
  }

  for (let rowIndex = range.startRow; rowIndex <= range.endRow; rowIndex++) {
    const values: string[] = [];
    if (includeRowIndex) {
      values.push(String(rowIndex + 1));
    }
    for (let columnIndex = range.startColumn; columnIndex <= range.endColumn; columnIndex++) {
      values.push(result.cellText(rowIndex, columnIndex));
    }
    parts.push(sheetRowXml(outputRow, values));
    outputRow += 1;
  }
  return parts.join('');
}

function sheetRowXml(rowNumber: number, values: string[]): string {
  const parts = [`<row r="${rowNumber}">`];
  for (let columnIndex = 0; columnIndex < values.length; columnIndex++) {
    parts.push(textCellXml(excelCellRef(columnIndex, rowNumber), values[columnIndex]));
  }
  parts.push('</row>');
  return parts.join('');
}

function textCellXml(ref: string, value: string): string {
  return `<c r="${ref}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function excelCellRef(columnIndex: number, rowNumber: number): string {
  return `${excelColumnName(columnIndex)}${rowNumber}`;
}

function excelColumnName(columnIndex: number): string {
  let value = columnIndex + 1;
  let name = '';
  while (value > 0) {
    const modulo = (value - 1) % 26;
    name = String.fromCharCode(65 + modulo) + name;
    value = Math.floor((value - modulo) / 26);
  }
  return name;
}

function stylesXml(): string {
  return xmlDeclaration() +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>' +
    '<fills count="1"><fill><patternFill patternType="none"/></fill></fills>' +
    '<borders count="1"><border/></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>' +
    '</styleSheet>';
}

function xmlDeclaration(): string {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
}

function escapeXml(value: string): string {
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
        return '&apos;';
    }
    return char;
  });
}
