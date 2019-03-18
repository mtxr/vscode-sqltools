
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

MSSQL driver specific options can be passed using `pgOptions` settings.

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
  "dialectOptions": {
    ... // options
  }
```

| Option key  | Default Value | Allowed Values |
| ------------- | ------------- | ------------- |
| encrypt  | `true`  | See https://github.com/tediousjs/node-mssql/tree/v4.3.1#tedious |

