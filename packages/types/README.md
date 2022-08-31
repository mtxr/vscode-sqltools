# SQLTools Interfaces & Types

[![GitHub](https://img.shields.io/github/license/mtxr/vscode-sqltools)](https://github.com/mtxr/vscode-sqltools/blob/dev/LICENSE)

Package with types and interfaces to develop SQLTools Plugins.

Please refer to @TBD

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev?umd_source=repository&utm_medium=readme&utm_campaign=types) extension.

# Changelog

### v0.1.6

- IBaseQueries.fetchDatabases() can optionally pass an MConnectionExplorer.IChildItem in versions after 0.23.0.

### v0.1.5

- Allow IConnection to have any properties.

### v0.1.4

- Add boolean option `highlightQuery` to extension configuration so query highlight can be disabled/enabled.

### v0.1.3

- fixed `checkDependencies` being required. It's optional

### v0.1.2

- updated IConnectionDriver to export checkDependencies internal method

### v0.1.1

- vscode-languageserver and vscode-languageclient as devDependencies instead of peerDependecies

### v0.1.0

- First release
