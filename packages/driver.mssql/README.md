# SQLTools MSSQL/Azure Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=mssql) extension.

## Changelog

### 0.4.8

- Support password connections over SSH.

### 0.4.7

- Support connections over SSH. [#1470](https://github.com/mtxr/vscode-sqltools/pull/1470) - thanks [@d-mato](https://github.com/d-mato)
- Change icon to resolve copyright issues.

### 0.4.4

- Improvements and fixes by [@fzhem](https://github.com/fzhem) - [#1396](https://github.com/mtxr/vscode-sqltools/pull/1396) and  [#1399](https://github.com/mtxr/vscode-sqltools/pull/1399)
    - Use Microsoft recommended system table to get a list of databases.
    - Better error handling: Throw database configuration errors rather than retrying.
    - Set default connection timeout to 15 - same as the tedious driver.
    - Add tedious specific option - trustServerCertificate.
    - Database is now optional in connection UI.
    - Use database specific information_schema in queries, fixing empty schemas, tables/views when clicking on a database that is not "master".
    - Return empty list when schema is inaccessible, fixing "sqltools.getChildrenForTreeItem" when clicking on inaccessible schema in sidebar.
- Use NodeJS 20.

### 0.4.3

- Use NodeJS 16.

### 0.4.2

- Support password storage using SQLTools Driver Credentials service. [#1175](https://github.com/mtxr/vscode-sqltools/pull/1175) - thanks [@raulcesar](https://github.com/raulcesar)
- List schemas in alphabetical order. [#1176](https://github.com/mtxr/vscode-sqltools/issues/1176) - thanks [@bombillazo](https://github.com/bombillazo)

### 0.4.1

- Avoid storing redundant properties on connections that use `connectString`. [#1087](https://github.com/mtxr/vscode-sqltools/issues/1087)

### 0.4.0

- Sync with 0.27 release of main extension.

### 0.3.0

- Sync with 0.24 release of main extension.

### 0.2.0

- Update `base-driver` package.

### 0.1.0

- Sync official driver versions and technology

### 0.0.6

- Connection assistant not showing options. [#619](https://github.com/mtxr/vscode-sqltools/issues/619)
- Removed preview flag

### 0.0.4

- Fixes drivers not showing data type on explorer. [#595](https://github.com/mtxr/vscode-sqltools/issues/595)

### 0.0.3

- First working version
