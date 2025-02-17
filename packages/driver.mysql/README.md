# SQLTools MySQL/MariaDB/TiDB Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=mysql) extension.

## Changelog

### 0.6.4

- Use NodeJS 20.

### 0.6.3

- Update mysql2 library package.

### 0.6.2

- Use NodeJS 16.
- Update mysql2 library package.

### 0.6.1

- Delete SSL config if SSL is disabled on MySQL driver. [#1271](https://github.com/mtxr/vscode-sqltools/pull/1271) - thanks [@Fludem](https://github.com/Fludem).

### 0.6.0

- Support TiDB. Support SSL / TLS options in the `Connection Assistant` panel. Switch from `mysql` library to `mysql2`. [#1113](https://github.com/mtxr/vscode-sqltools/pull/1113) - thanks [@Icemap](https://github.com/Icemap).

### 0.5.2

- Handle multi-statement queries correctly. [#1140](https://github.com/mtxr/vscode-sqltools/pull/1140)

### 0.5.1

- Fix unnecessary password prompt on connections that use `connectString`. [#1086](https://github.com/mtxr/vscode-sqltools/pull/1086)
- Avoid storing redundant properties on connections that use `connectString`. [#1087](https://github.com/mtxr/vscode-sqltools/issues/1087)

### 0.5.0

- Add "SQLTools Driver Credentials" password mode, using new authentication provider feature of 0.27 main extension release to store connection password securely. [#1066](https://github.com/mtxr/vscode-sqltools/pull/1066)

### 0.4.1

- Fix table and column searching. [#1015](https://github.com/mtxr/vscode-sqltools/pull/1015)

### 0.4.0

- Add version 8 keywords. [#841](https://github.com/mtxr/vscode-sqltools/pull/841) - thanks [@mojoaxel](https://github.com/mojoaxel).
- Give access to MySQL meta databases such as information_schema, and list target database first. [#938](https://github.com/mtxr/vscode-sqltools/pull/938)
- Fix destructure property 'name' of 'undefined' error. [#950](https://github.com/mtxr/vscode-sqltools/pull/950)
- Report connection test failure. [#951](https://github.com/mtxr/vscode-sqltools/pull/951)

### 0.3.0

- Sort databases alphabetically. [#706](https://github.com/mtxr/vscode-sqltools/pull/706) - thanks [@mattschlosser](https://github.com/mattschlosser).
- Sync with 0.24 release of main extension.

### 0.2.0

- Update `base-driver` package.

### 0.1.1

- Display HEX as string. [#669](https://github.com/mtxr/vscode-sqltools/issues/669)

### 0.1.0

- Sync official driver versions and technology

### 0.0.7

- Assitant naming convetions
- Removed preview flag from extension
- Fixes completions and adapt to work with MySQL <= 5.6 or older. [#622](https://github.com/mtxr/vscode-sqltools/issues/622)

### 0.0.4

- Fixes drivers not showing data type on explorer. [#595](https://github.com/mtxr/vscode-sqltools/issues/595)

### 0.0.3
- First working version

