# Changelog

## v0.19

### v0.19.7 - (July 24, 2019)

* **NEW** 🎉
  * Add run, bookmark and format selected query to context menu
* **Fix** 🎉
  * Reopen existing session file when reconnecting. Issue [#283](https://github.com/mtxr/vscode-sqltools/issues/283)
  * Small changes on high contrast themes. Issue [#286](https://github.com/mtxr/vscode-sqltools/issues/286)

### v0.19.6 - (June 26, 2019)

* **Fix** 🎉
  * Codelens connection switch. Issue [#270](https://github.com/mtxr/vscode-sqltools/issues/270)
  * Bookmarked query changed on edit. Issue [#278](https://github.com/mtxr/vscode-sqltools/issues/278)
  * SQLTools blocking output of test cases for other extensions. Issue [#273](https://github.com/mtxr/vscode-sqltools/issues/273)

### v0.19.5 - (June 7, 2019)

* **NEW** 🎉
  * Add support for AWS Redshift. Issue [#264](https://github.com/mtxr/vscode-sqltools/issues/264)

### v0.19.4 - (June 1, 2019)

* **NEW** 🎉
  * Dialect configs extended to match connector options. Issue [#235](https://github.com/mtxr/vscode-sqltools/issues/235)
  * Oracle data types in stored procedures. Thanks to [@mickeypearce](https://github.com/mickeypearce). PR [#260](https://github.com/mtxr/vscode-sqltools/pull/260)

### v0.19.3 - (May 30, 2019)

* **NEW** 🎉
  * Upgrade SQLite lib to 4.0.8 to support NodeJS v12. Issue [#256](https://github.com/mtxr/vscode-sqltools/issues/256)
  * Add/edit SQLite connections will be relative to workspace. Thanks to [@mitchellsimoens](https://github.com/mitchellsimoens). PR [#255](https://github.com/mtxr/vscode-sqltools/pull/255)

* **Fix** 🎉
  * Fixed edit connection not using existing port. Issue [#224](https://github.com/mtxr/vscode-sqltools/issues/224)
  * Fixed column filtering breaking results screen. Issue [#251](https://github.com/mtxr/vscode-sqltools/issues/251)
  * Fixed results screen taking focus after running query. Issue [#254](https://github.com/mtxr/vscode-sqltools/issues/254)
  * Fixed saving results using editor button. Issue [#257](https://github.com/mtxr/vscode-sqltools/issues/257)

### v0.19.2 - (May 24, 2019)

* **Fix** 🎉
  * Fixed explorer tree when tree items have dots. Issue [#242](https://github.com/mtxr/vscode-sqltools/issues/242)
  * Hiding sqlite_sequence from explorer. Issue [#152](https://github.com/mtxr/vscode-sqltools/issues/152)

* **Enhancements**
  * Enhanced speed removing cycle references. Thanks to [@ariel-bentu](https://github.com/ariel-bentu). PR [#233](https://github.com/mtxr/vscode-sqltools/pull/233)

### v0.19.1 - (May 20, 2019)

* **NEW** 🎉
  * Add attach and detach commands to the command palette. Issue [#237](https://github.com/mtxr/vscode-sqltools/issues/237)

* **Fix** 🎉
  * Fixed session files when no folder is open. Issue [#236](https://github.com/mtxr/vscode-sqltools/issues/236)


### v0.19.0 - (May 20, 2019)

* **NEW** 🎉
  * Multiple connections with session files. PR [#188](https://github.com/mtxr/vscode-sqltools/pull/188)
    * Read the docs: [Sessions and Multiple Connections](https://vscode-sqltools.mteixeira.dev/session-multiple-connections)
  * Added support for SAP Hana, thanks to [@ariel-bentu](https://github.com/ariel-bentu). PR [#215](https://github.com/mtxr/vscode-sqltools/pull/215)
  * Multiple results screens, one per connection. PR [#234](https://github.com/mtxr/vscode-sqltools/pull/234)

* **Fix** 🎉
  * Fixed timestamps to be raw from server. Issue [#231](https://github.com/mtxr/vscode-sqltools/issues/231)
  * Fixed besides results locations leaving empty space. Issue [#211](https://github.com/mtxr/vscode-sqltools/issues/211)
  * Fixed GO delimiter breaking queries on results screen. Issue [#226](https://github.com/mtxr/vscode-sqltools/issues/226)

* **DOCS Updates**
  * Add SSL example to PostgreSQL docs. Thanks to [@lawrencegripper](https://github.com/lawrencegripper). PR [#223](https://github.com/mtxr/vscode-sqltools/pull/223)

* **Breaking Changes**
  * Remove deprecated (v0.17.7) `sqltools.previewLimit` in favor of `sqltools.results.limit`.
  * Remove deprecated (v0.17.6) `sqltools.connections[].dialectOptions` in favor of `sqltools.connections[].mssqlOptions`, `sqltools.connections[].pgOptions`, `sqltools.connections[].mysqlOptions` and `sqltools.connections[].oracleOptions`.

## v0.18

### v0.18.2 - (May 9, 2019)

* **Fix** 🎉
  * Add stored procedure listing on explorer for Oracle. Issue [#208](https://github.com/mtxr/vscode-sqltools/issues/208)

### v0.18.1 - (May 8, 2019)

* **Fix** 🎉
  * Add escape chars for table names, schemas and catalogs. Issue [#216](https://github.com/mtxr/vscode-sqltools/issues/216)

### v0.18.0 - (May 7, 2019)

* **NEW** 🎉
  * Add options to edit connections from explorer and command palette. Issue [#185](https://github.com/mtxr/vscode-sqltools/issues/185) and PR [#209](https://github.com/mtxr/vscode-sqltools/pull/209)
  * Add stored procedure listing on explorer for MSSQL. Oracle is coming soon. [#203](https://github.com/mtxr/sqltools-formatter/issues/203)
  * Add pool options for Oracle. Issue [#186](https://github.com/mtxr/vscode-sqltools/issues/186) and PR [#204](https://github.com/mtxr/vscode-sqltools/pull/204)

* **Enhancements**
  * Adopted support for more `--vscode-editor-*` prefixes to webviews.
  * Enhanced results them for JSONB in white themes. Issue [#207](https://github.com/mtxr/vscode-sqltools/issues/207)

* **Fix** 🎉
  * Fix results header not in sync with columns. Issue [#201](https://github.com/mtxr/vscode-sqltools/issues/201)

## v0.17

### v0.17.18 - (May 2, 2019)

* **Enhancements**
  * Error messages now has an option for quick opening docs.
  * Font fallbacks. Issue [#200](https://github.com/mtxr/vscode-sqltools/issues/200)
  * Changed tree separators for explorer.

### v0.17.17 - (april 29, 2019)

* **NEW** 🎉
  * Add support for connections string for PostgreSQL and Oracle. PR [#192](https://github.com/mtxr/vscode-sqltools/pull/192)
    * Thanks to [@zetxx](https://github.com/zetxx)

* **Fix** 🎉
  * Fix command palette not using schemas for tables. Issue [#197](https://github.com/mtxr/vscode-sqltools/issues/197)
  * Fix MySQL escaping for database names. Issue [#196](https://github.com/mtxr/vscode-sqltools/issues/196)
  * Fix completions too fuzzy. Issue [#193](https://github.com/mtxr/vscode-sqltools/issues/193)
  * Fix MySQL escaping for database names. Issue [#196](https://github.com/mtxr/vscode-sqltools/issues/196)

### v0.17.16

> this package contains a packing error. Please update to most recent version.

### v0.17.15 - (April 14, 2019)

* **Fix** 🎉
  * Minor fix on codelens.
  * Allow to set connection on query block. See: [Codelens Doc](https://vscode-sqltools.mteixeira.dev/codelens)

### v0.17.14

* **NEW** 🎉
  * Add codelens to sql files. You can select file types to add code lens using `sqltools.codelensLanguages` setting. Default to `['sql']`
    * Split your query blocks using `@block` on comments. See:
    * ![static/codelens.png](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/codelens.png)

* **Enhancements**
  * Installing dependencies now uses VSCode progress indicator notification to better notify user about installation.
  * `NULL` values are now centered on results table.
  * `TRUE` and `FALSE` are better displayed on results table.

### v0.17.13

* **NEW** 🎉
  * Enhanced connection hierarchy to allow multiple schemas and databases for Oracle, thanks to [@mickeypearce](https://github.com/mickeypearce)

* **Enhancements**
  * Generate insert queries now includes database and schema prefixes accordingly with the dialect.

### v0.17.12

* **NEW** 🎉
  * Add some options to customize results screen. Issue [#174](https://github.com/mtxr/vscode-sqltools/issues/174). Eg:
    ```json
    ...
    "sqltools.results": {
      ...
      "customization": {
        "font-size": "12px",
        "font-family": "monospace",
        "table-cell-padding": "2px 4px"
      }
    },
    ...
    ```
  * Allow connecting to MySQL using Socket files. Issue [#163](https://github.com/mtxr/sqltools-formatter/issues/163).
    See [https://vscode-sqltools.mteixeira.dev/connections/mysql#1-connections](https://vscode-sqltools.mteixeira.dev/connections/mysql#1-connections)

* **Enhancements**
  * Updated fetch columns query to support MySQL new versions. Issue [#173](https://github.com/mtxr/sqltools-formatter/issues/173).

### v0.17.11

* **NEW** 🎉
  * Add command `SQLTools.focusOnExplorer` to focus on explorer.
  * Allow users to set connection icons.
  * Add stored procedure listing on explorer for PostgreSQL and MySQL. Oracle is coming soon. [#74](https://github.com/mtxr/sqltools-formatter/issues/74)
    * ![static/stored-procedures.png](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/stored-procedures.png)
  * Enhanced connection hierarchy to allow multiple schemas and databases for PostgreSQL, MySQL, SQLite and MSSQL. Oracle is coming soon. Issue [#71](https://github.com/mtxr/sqltools-formatter/i
  * Enhanced connection hierarchy to allow multiple schemas and databases for PostgreSQL, MySQL, SQLite and MSSQL. Oracle is coming soon. Issue [#71](https://github.com/mtxr/sqltools-formatter/ssues/71)
    * You can flatten groups with only one child using the setting `sqltools.flattenGroupsIfOne`. Default to `false`
    * ![static/sidebar-explorer.png](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/sidebar-explorer.png)

* **Enhancements**
  * Insert query generator includes column name and type on placeholders.
  * Improved query parser for better handling MSSQL queries.
  * Identifying table prefix words for suggestions.
  * Changed the icon on suggestions if it`s a view to make it visually different of a table.
  * Sorting column names by table name on suggestions.

* **Fixes**
  * Fixed formatting with CRLF. Formatter issue [#3](https://github.com/mtxr/sqltools-formatter/issues/3)
  - Fixed history cutting some query parts on history explorer.

### v0.17.10

* **Enhancements**
  * Improved query multiple statements parser
  * Add ssl support for MySQL. Thanks to [@MOZGIII](http://github.com/MOZGIII).
  * Ignoring comments on Query History tree view

### v0.17.9

* **Fixes**
  - Allow user to force add connection to global settings. Part of issue #137.
  - Fixed filtering excluding some values.

### v0.17.8

* **Fixes**
  - Fixes Icon Paths on windows. Issue #151
  - Allow empty password. Issue #150
  - Fixes cluttered database tree view. Issue #139

### v0.17.7

* **NEW** 🎉
  * Added Primary key ![Alt text](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/pk.png) and foreign key ![Alt text](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/fk.png) icons for PostgreSQL, MySQL, MSSQL and SQLite columns.
  * Added setting `format.reservedWordCase` allowing to change SQL reserved words case to `upper` or `lower`. Default is null meaning no changes.
  * Added setting `sortColumns` to change column sorting on explorer. Default sort is by `name`.
  * Added setting `results.location` to set results show up. Default sort is by `active` editor.
  * Added setting `results.limit` to set the limit when using Show Records function. This deprecates global `previewLimit`. Default changed to 50.

### v0.17.6

* **NEW** 🎉
  * Added option to open results rows/values in editor. Issue #140.
  * Added SSL support for PostgreSQL via `pgOptions` connection setting. Issue #141
  * Deprecating `dialectOptions` in favor of `[dialect]Options` settings.

* **Fixes**
  * Fixed dollar quoting on formatter. Issue #142

### v0.17.5

* **Fixes**
  - Fixed formatter when formatting query with $1 parameters
  - Fixed #136 scroll issue

### v0.17.4

* **NEW** 🎉
  * Highlight result row on click.
  * Using query labels for `Describe Table` and `Show Records`.
* **Fixes** 🔧
  * _**UI**_:
    * Fixed scroll issue on windows #132

### v0.17.3

* Fixes readme documentation link
* Fixes 'server' of undefined issue. Webpack/babel issue.

### v0.17.0

* **NEW** 🎉
  * Added support for SQLite. #51
  * Added support for Oracle Database, thanks to [@mickeypearce](https://github.com/mickeypearce). #13
  * Added History Explorer on sidebar
  * Added Bookmarks Explorer on sidebar
  * MySQL Xdevapi: Added support to MySQL XDEVAPI. It fixes `ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol` error. \(Experimental\).
  * Export query results as JSON and CSV. #95
    * ![static/export-results.gif](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/export-results.gif)
  * Added feature to copy cell value and the entire row. #63
* **Fixes** 🔧
  * _**UI**_:
    * Fixed results ui scroll and resize issues. #131 and #132
    * Improved more the look and feel to match VSCode Standards.
  * _**Connections**_:
    * MySQL Xdevapi: Added support to MySQL XDEVAPI. It fixes `ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol` error. \(Experimental\)
* **Breaking Changes** ❗
  * _**Commands**_:
    * `SQLTools.addNewConnection` command was renamed to `SQLTools.openAddConnectionScreen`
    * `SQLTools.appendToCursor` command was renamed to `SQLTools.insertText`
    * `SQLTools.refreshSidebar` command was renamed to `SQLTools.refreshAll`
    * `SQLTools.runFromInput` command was renamed to `SQLTools.executeFromInput`
    * `SQLTools.editFromHistory` command was renamed to `SQLTools.editHistory`
  * _**Settings**_:
    * `sqltools.logging` and `sqltools.logLevel` were removed.
    * **Fixes**
      * This settings were ported from Sublime Text version but were never used here.
        * `SQLTools.queryTimeout` not used in VSCode version.
        * `SQLTools.showResultOnTab` not used in VSCode version.
        * `SQLTools.clearOutput` not used in VSCode version.
        * `sqltools.completionTriggers` not used in VSCode version.

## v0.16

### v0.16.11

* **Enhancements**
  * _**Connections**_:
    * MSSQL: Fixed trying to access 'encrypt of undefined issue'.

### v0.16.10

* **Enhancements**
  * _**General**_:
    * Removed some dependencies
    * Reduced startup time
  * _**Connections**_:
    * Error logging minor fix

### v0.16.9

* **Enhancements**
  * _**General**_: Reduced extension size from 9.8MB to ~3MB
  * _**Settings**_:
    * Added options to disable release notifications. `disableReleaseNotifications` defaults to `false`.
  * _**Connections**_:
    * MySQL: Updated library to mysql instead of mysql2. Previous was very buggy.
    * PostgreSQL: Updated library and migrated to connection pooling to avoid errors.
    * MSSQL: Updated library and migrated to connection pooling to avoid errors. Issue #126

### v0.16.8

* **Fixes**
  * _**Connections**_:
    * MSSQL: Fixes `Requests can only be made in the LoggedIn state, not the LoggedInSendingInitialSql state`. Issue #126

### v0.16.7

* **Fixes**
  * _**UI**_:
    * Using Octicons as suggested by VSCode team.
    * Adopted the new QuickPick API.
    * Added disconnect icon to connection-explorer
  * _**Connections**_:
    * General: quick pick not showing options if no connection active. Issue #124
    * General: Allow auto connect to multiple connections.
    * MySQL: Fixes `Can't add new command when connection is in closed state`. Should happen less often at least.
  * _**History**_:
    * Add option to edit item from history.
    * Updated history to show most recently used at first position
  * _**Query Format**_:
    * Fixed formatting with comments. Issue #97
    * Fixed formatting with non latin chars. Issue #99

### v0.16.6

* **Fixes**
  * _**Connections**_: Error while connecting =&gt; `toString() of undefined`

### v0.16.5

* **Enhancements**
  * _**UI**_: Updated extension icon and README.
  * _**Settings**_: Added settings definition for `dialectOptions`.
  * _**Connection Explorer**_
    * Improved to show  `Generate insert Query` and `Add to cursor` only when an editor is open and editable.
    * Auto Expand connection on connect.
* **Fixes**
  * _**Connection Explorer**_: Fixes tables not showing columns.

### v0.16.4

* Fixes disconnect not working. #122.
* Auto connecting if have just one connection
* 'Add new Server' changed to 'Add new connection'
* Fixes show records when not connected

### v0.16.3

* Show records and describe tables when using multiple connections. #119
* Avoid asking password for already open connection

### v0.16.2

* Minor fix. Show records infinity loop.

### v0.16.0 and v0.16.1

See [v0.16.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.16.x.md)

## v0.15

See [v0.15.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.15.x.md)

## v0.14

Skipped.

## v0.13

See [v0.13.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.13.x.md)

## v0.12

See [v0.12.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.12.x.md)

## v0.11

See [v0.11.x](https://github.com/mtxr/vscode-sqltools/blob/master/static/release-notes/v0.11.x.md)
