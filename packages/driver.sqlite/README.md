# SQLTools SQLite Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=sqlite) extension.

See [SQLite Start Guide](https://vscode-sqltools.mteixeira.dev/en/drivers/sq-lite/) for instructions, including prerequisites.

## Changelog

### 0.5.0

- Sync with 0.27 release of main extension.

### 0.4.1

  - Link from README to Start Guide (see above).

### 0.4.0

  - Install dependencies and report errors during connection test. [#963](https://github.com/mtxr/vscode-sqltools/pull/963)
  - Handle driver's ${workspaceFolder:rootFolderName}/... database path format correctly on Windows. [#961](https://github.com/mtxr/vscode-sqltools/pull/961)
  - Upgrade node-sqlite3 package from 4.2.0 to 5.0.11 (bundled SQLite is now v3.39.2). [#953](https://github.com/mtxr/vscode-sqltools/pull/953)

### 0.3.0

- Fix dependency installation problem. [#757](https://github.com/mtxr/vscode-sqltools/issues/757)
- Sync with 0.24 release of main extension.

### 0.2.0

- Update `base-driver` package.

### 0.1.0

- Sync official driver versions and technology

### 0.0.6

- Fixes silent errors on connecting.

### 0.0.3

- First working version
