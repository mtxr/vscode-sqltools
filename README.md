# SQLTools for VSCode

<!--[![Build Status](https://travis-ci.org/mtxr/vscode-sqltools.svg?branch=master)](https://travis-ci.org/mtxr/vscode-sqltools)-->

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg)](https://www.patreon.com/mteixeira)
[![Paypal Donate](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8)

Your swiss knife SQL for VSCode.

> (The project is currently under development.)

Project website: [https://github.com/mtxr/vscode-sqltools](https://github.com/mtxr/vscode-sqltools)

> If you are looking for Sublime Text version go to [http://mtxr.github.io/SQLTools/](http://mtxr.github.io/SQLTools/).


## Donate

SQLTools was developed with ♥ to save us time during our programming journey. But It also takes me time and efforts to develop SQLTools.

SQLTools will save you (for sure) a lot of time and help you to increase your productivity so, I hope you can donate and help SQLTools to become more awesome than ever.

[![Patreon](https://img.shields.io/badge/patreon-donate-blue.svg?style=for-the-badge&logo=patreon)](https://www.patreon.com/mteixeira)
[![Paypal Donate](https://img.shields.io/badge/paypal-donate-blue.svg?style=for-the-badge&logo=paypal)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8)

## Features

* SQL Format (Beautifier)
  * __Win/Linux__: <kbd>ctrl+e</kbd> <kbd>ctrl+b</kbd>
  * __OSX__: <kbd>cmd+e</kbd> <kbd>cmd+b</kbd>
  * or using the standard VSCode Format Document/selection
* Bookmark query
  * __Win/Linux__: <kbd>ctrl+e</kbd> <kbd>ctrl+q</kbd>
  * __OSX__: <kbd>cmd+e</kbd> <kbd>q</kbd>
* Delete Bookmarked query
  * __Win/Linux__: <kbd>ctrl+e</kbd> <kbd>ctrl+r</kbd>
  * __OSX__: <kbd>cmd+e</kbd> <kbd>cmd+r</kbd>
* Edit Bookmarked query
* Auto complete for Table names and columns

![static/autocomplete.png](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/autocomplete.png)

* Sidebar database explorer

![static/sidebar.png](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/sidebar.png)

## Docs

[Setup your first connection](https://github.com/mtxr/vscode-sqltools/wiki/connections) using this guide: [Connections](https://github.com/mtxr/vscode-sqltools/wiki/connections)

You can read the entire docs in the [SQLTools Wiki](https://github.com/mtxr/vscode-sqltools/wiki)

## To-do

- [ ] Allow switch databases
- [ ] Create connection profile tour
- [ ] Show explain plan for queries
- [ ] SQLite Support
- [x] Show query execution messages
- [x] Sidebar explorer with Table Description, query generator, table records
- [x] Auto complete for columns and tables
- [x] List and Run bookmarked queries
- [x] Run SQL Queries
- [x] Show table records
- [x] View Queries history
- [x] View table schemas
- [x] MySQL/MariaDB Support
- [x] MsSQL Support
- [x] PostgreSQL Support


## Migrating from v0.0*.* to v0.1*.* or newer

Some settings were changed to keep SQLTools naming standards.

* `sqltools.format.indent_size` was renamed to `sqltools.format.indentSize`
* `sqltools.format.show_statusbar` was renamed to `sqltools.format.showStatusbar`
* `sqltools.format.log_level` was renamed to `sqltools.format.logLevel`
* `sqltools.format.query_timeout` was renamed to `sqltools.format.queryTimeout`
* `sqltools.format.history_size` was renamed to `sqltools.format.historySize`
* `sqltools.format.show_result_on_tab` was renamed to `sqltools.format.showResultOnTab`
* `sqltools.format.clear_output` was renamed to `sqltools.format.clearOutput`

## Known Issues

None for now.
