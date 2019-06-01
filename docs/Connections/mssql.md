
# SQL Server/Azure Start Guide

## 1. Connections

Connection example:
```json
{
  "name": "MSSQL",
  "server": "localhost",
  "dialect": "MSSQL",
  "port": 1433,
  "database": "test_db",
  "username": "sa",
  "askForPassword": false,
  "password": "root(!)Password",
  "connectionTimeout": 15,
}
```

### 1.1 Specific Options

MSSQL driver specific options can be passed using `mssqlOptions` settings.

```json
{
  "name": "MSSQL",
  "server": "localhost", // You can use 'localhost\\instance' to connect to named instance
  "dialect": "MSSQL",
  "port": 1433,
  "database": "test_db",
  "username": "sa",
  "askForPassword": false,
  "password": "root(!)Password",
  "connectionTimeout": 15,
  "mssqlOptions": {
    ... // options
  }
```

| Option key  | Default Value | Allowed Values |
| ------------- | ------------- | ------------- |
| encrypt  | `true`  | See https://github.com/tediousjs/node-mssql/tree/v4.3.1#tedious |

You can use any setting defined in https://www.npmjs.com/package/mssql#configuration-1 also extra options defined in Tedious specific options https://www.npmjs.com/package/mssql#tedious

## Breaking changes

### v0.19.x

* Remove deprecated (v0.17.6) `sqltools.connections[].dialectOptions` in favor of `sqltools.connections[].mssqlOptions`.