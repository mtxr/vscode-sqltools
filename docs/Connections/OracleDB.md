
# Oracle Start Guide

## 1. Prerequisites

- Node.js 6, 8, 10 or 11
- Enable `sqltools.useNodeRuntime` setting, can be `true` or a path to the node runtime.

> Extension automatically installs Oracle driver (node-oracledb@v3.1.1) that contains pre-built binaries for Node 6, 8, 10 and 11 on:
> - Windows 64-bit (x64) (built with VS 2015)
> - macOS 64-bit (Intel x64)
> - Linux 64-bit (x86-64) (built on Oracle Linux 6)

More information you can find in [node-oracledb](https://github.com/oracle/node-oracledb) repository: https://github.com/oracle/node-oracledb.

## 2. Connections

### 2.1 Oracle's Easy Connect Syntax

Oracle's connectionString is constructed from connection properties as following (If all three properties are provided):

```
"connectionString" = server:port/database
```

Connection example:
```json
{
  "dialect": "OracleDB",
  "name": "oracledb1",
  "username": "hr",
  "password": "welcome",
  "askForPassword": false,
  "connectionTimeout": 15,
  "server": "localhost",
  "port": 1521,
  "database": "XEPDB1"
}
```

### 2.2 Alternative Connection Strings

ConnectionString maps from `connectString` property:

```
"connectionString" = connectString
```

For example if you have `tnsnames.ora` file with service name defined or any other alternative connection strings:

```json
{
  "dialect": "OracleDB",
  "name": "oracledb2",
  "username": "hr",
  "password": "welcome",
  "askForPassword": false,
  "connectionTimeout": 15,
  "connectString": "oracledb"
}
```

If you omit `server` and `port` properties, `database` can be used as an alias for `connectString`.

### 2.3 Specific Options

Oracle Connection Pool specific configurations can be passed using `oracleOptions` settings:

```json
{
  "dialect": "OracleDB",
  "name": "oracledb2",
  "username": "hr",
  "password": "welcome",
  "connectString": "hostname:port/service_name",
  "oracleOptions": {
    "poolMax": 1,
    "poolMin": 1,
    "poolIncrement": 0
  }
}
```

See https://github.com/oracle/node-oracledb/blob/master/doc/api.md#createpoolpoolattrs for additional information.

## 3. Autocompletion

To enable autocompletion in PL/SQL files add:
```json
"sqltools.completionLanguages": [
  "plsql"
]
```
to `settings.json`.

NOTE: You must have installed support for `plsql` language files.