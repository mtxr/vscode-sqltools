# SQLTools kdb Driver

`kdb-sqltools` is a SQLTools driver extension for connecting VS Code to a kdb+/q process over q IPC.

The driver executes editor text as q, not ANSI SQL. It is intended for qSQL and normal q expressions such as:

```q
select from trade where sym=`AAPL
meta trade
tables `.analytics
```

## Requirements

- VS Code with the `mtxr.sqltools` extension installed.
- A kdb+/q process listening on a TCP port, for example:

```sh
q -p 5000
```

## Connection Settings

Example SQLTools connection:

```json
{
  "name": "local kdb",
  "driver": "KDB",
  "server": "localhost",
  "port": 5000,
  "username": "",
  "password": "",
  "database": ".",
  "connectionTimeout": 30
}
```

The `database` field is used as a q namespace for the object explorer. Use `.` for the root namespace or values such as `.analytics`. Queries are sent exactly as written to the remote q process.

### Persisting Connections

SQLTools stores connections in the VS Code setting `sqltools.connections`. That setting can exist at User/global scope, Workspace scope, or Workspace Folder scope. User-scope connections follow you across VS Code restarts and workspaces. Workspace-scope connections only appear when that workspace is open, so a connection can look missing after switching folders or opening VS Code without the same workspace.

If you create a connection through SQLTools while a workspace is open, check whether it was saved to the workspace settings. To make a kdb connection global, put it in User settings JSON:

```json
{
  "sqltools.connections": [
    {
      "name": "local kdb",
      "driver": "KDB",
      "server": "localhost",
      "port": 5000,
      "username": "",
      "password": "",
      "database": ".",
      "connectionTimeout": 30
    }
  ]
}
```

The `kdb+: Copy Example Global Connection Settings` command copies this User-settings fragment and can open settings for you. If you already have SQLTools connections, merge the example object into the existing `sqltools.connections` array instead of replacing the array.

## Features

- TCP q IPC authentication handshake with optional username/password.
- Synchronous text query execution.
- Result grids for q tables, keyed tables, dictionaries, vectors, lists, and scalars. Nested q values inside cells are displayed as compact strings, and unsafe-width q longs are displayed as exact decimal strings.
- Object explorer groups for tables, root q views, functions, and table columns. Column metadata preserves q `meta` type, foreign-key, and attribute fields for SQLTools describe/explorer views.
- Table preview and count support through SQLTools, using q `sublist` for limit/offset previews.
- Definition query generation for tables, views, and functions.
- Insert snippet generation using q `insert` syntax compatible with SQLTools' insert formatter.
- Minimal q keyword completions only; q language extensions should handle language-level autocomplete.
- SSH tunneling through SQLTools common connection settings.

## kdb Results Panel

The kdb results panel is the default target for `kdb+: Run q Script` and `kdb+: Run Selection`. It runs through this extension's direct driver path and avoids SQLTools `*.session.sql` editor documents. `Run Selection` sends the selected text exactly; with no selection, it sends only the current physical line. A blank current line uses the normal no-code warning.

To use SQLTools' own results target instead, set:

```json
"kdb-sqltools.results.target": "sqltools"
```

SQLTools target commands remain available: `kdb+: Run q Script in SQLTools Results` and `kdb+: Run Selection in SQLTools Results`. SQLTools may open `.session.sql` editors there; that is SQLTools core behavior, not this driver's panel path.

The kdb panel virtualizes rows and columns and transfers only the visible cell window from the extension to the webview. The q IPC result is still fully materialized in extension memory before display, so use q-side limits for truly massive query results.

Selection supports individual ranges, whole rows, whole columns, and all cells. With no selection, copy/export actions use all cells.

Columns can be hidden from the panel settings menu for the current panel session. Hidden columns stay hidden for later results in that panel when names match, and reset restores all columns. Hidden-column choices are not saved globally.

Header clicks default to column selection. Change the toolbar mode from Select to Sort to sort visible columns in the extension; repeated clicks cycle ascending, descending, and original order. Sorting uses the panel's visible cell text, so typed q columns sort sensibly when their displayed text preserves order, such as numbers and fixed-width q date/timestamp text.

Toolbar search runs in the extension against visible columns only. It returns capped row-match metadata to the webview instead of transferring all result cells.

Copy formats: CSV, TSV, JSON, NDJSON, HTML. Export formats: CSV, XLSX, TSV, JSON, NDJSON, HTML. XLSX export writes a real `.xlsx` workbook. The row-number/header copy and export options are enabled by default and persist globally from the panel settings menu.

kdb panel settings:

```json
{
  "kdb-sqltools.results.cellWidth": 160,
  "kdb-sqltools.results.rowHeight": 28,
  "kdb-sqltools.results.fontSize": 0,
  "kdb-sqltools.results.density": "standard",
  "kdb-sqltools.results.showRowIndex": true,
  "kdb-sqltools.results.includeHeaders": true,
  "kdb-sqltools.results.includeRowIndex": true
}
```

`fontSize: 0` uses the VS Code default. Density can be `compact`, `standard`, or `comfortable`. `showRowIndex` controls the visible left row-number column; `includeHeaders` and `includeRowIndex` control default copy/export output.

## Performance Trace

Opt-in performance tracing logs query timing and memory snapshots to the VS Code extension host console with the `[kdb-sqltools:perf]` prefix.

Enable it with either:

```json
"kdb-sqltools.performance.trace": true
```

or by launching VS Code with `KDB_SQLTOOLS_PERF=1`.

## Limitations

- TLS is not implemented by this driver, so no TLS option is exposed in the connection UI.
- The driver does not translate SQL to q. Write q/qSQL directly.
- Arbitrary editor queries are sent exactly as written. The driver does not add hidden limits; the kdb panel reduces webview transfer and DOM work, but it does not stream q execution. The SQLTools target renders however many rows SQLTools receives.
- SQLTools' "execute current query" command uses SQL-style semicolon/`GO` statement parsing before the driver is called. For q expressions that contain semicolons inside lambdas, projections, or multi-statement expressions, select the intended q text and run `kdb+: Run Selection` so it is sent as one q expression.
- kdb has namespaces rather than SQL catalogs and schemas; SQLTools `database`/`schema` fields are mapped to the selected q namespace.
- Root q views are listed with protected `views[]`; non-root view listing depends on what the target process returns for protected `system "b <namespace>"`.
- The default automated E2E suite uses a mock q IPC server so it can run without licensed kdb+/q tooling. Use `npm run test:live-kdb` for an opt-in live q process smoke test.

## Development

Install dependencies:

```sh
npm install
```

Compile:

```sh
npm run compile
```

Run unit tests:

```sh
npm run test:unit
```

Run the VS Code E2E suite:

```sh
npm run test:e2e
```

Run compile, unit tests, and E2E tests:

```sh
npm test
```

Run the opt-in live kdb+/q integration test when a local `q` binary is available:

```sh
KDB_Q_BIN=/path/to/q npm run test:live-kdb
```

The live test starts a real local `q -p <free-port>` process with `test/live/fixture.q`, then exercises the driver over real q IPC for handshake, query execution, table/view/function listing, column metadata, scalar results, definitions, and preview queries. It skips cleanly if no `q` binary is found unless `KDB_SQLTOOLS_LIVE_REQUIRED=1` is set.

Run everything, including live q, and fail if q is unavailable:

```sh
KDB_SQLTOOLS_LIVE_REQUIRED=1 npm run test:all
```

Start the compiler in watch mode while launching the extension host from VS Code:

```sh
npm run watch
```

This repository is not published to the VS Code Marketplace by the build scripts.

### E2E Test Pipeline

`npm run test:e2e` uses `@vscode/test-electron` to download a local VS Code build under `.vscode-test`, installs the real `mtxr.sqltools` Marketplace extension into an isolated test extensions directory, and launches a VS Code extension host for this extension.

Inside that extension host the test suite:

- activates this extension and verifies the SQLTools registration path with the real SQLTools extension;
- starts a mock q IPC server in the test process;
- opens the compiled `KdbDriver` against that TCP server;
- verifies `testConnection()` sends `1+1`;
- verifies query result conversion for a small table;
- verifies table listing and column metadata through the driver's object explorer methods.

On Linux without a display, the runner uses `xvfb-run` when available with `xauth`; otherwise it starts `Xvfb` directly. `npm run test:e2e` also runs `npm run prepare:e2e-linux-libs`, which uses `apt-get download` plus `dpkg-deb -x` without sudo to unpack the small set of VS Code desktop libraries this container is missing into `.vscode-test/apt-libs/root`. CI images should still install normal Electron/GTK runtime packages when possible; the bootstrap is a no-root fallback for minimal containers.

Useful E2E environment variables:

- `KDB_SQLTOOLS_E2E_VSCODE_VERSION=1.124.2` pins the downloaded VS Code version instead of `stable`.
- `KDB_SQLTOOLS_E2E_FORCE_SQLTOOLS_INSTALL=1` reinstalls `mtxr.sqltools`.
- `KDB_SQLTOOLS_E2E_SKIP_SQLTOOLS_INSTALL=1` skips the install step and uses whatever is already in `.vscode-test/e2e/extensions`.
- `KDB_SQLTOOLS_E2E_ALLOW_SQLTOOLS_INSTALL_FAILURE=1` allows a driver-only VS Code host fallback when Marketplace access is unavailable; the SQLTools activation test is skipped in that mode.
- `KDB_SQLTOOLS_E2E_RUNTIME_LIB_DIR=/path/to/libs` prepends a custom Linux runtime library directory for minimal containers.
- `KDB_SQLTOOLS_E2E_SKIP_LINUX_LIBS=1` skips the no-root `apt-get download`/`dpkg-deb` runtime-library bootstrap.
