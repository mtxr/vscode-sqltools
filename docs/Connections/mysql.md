
# MySQL Start Guide

## 1. Connections

Connection example:
```json
{
  "name": "MySQL",
  "server": "localhost",
  "dialect": "MySQL",
  "port": 3306,
  "database": "test_db",
  "username": "root",
  "askForPassword": false,
  "password": "root",
  "connectionTimeout": 15
}
```

Using a socket file example:
```json
{
  "name": "MySQL",
  "dialect": "MySQL",
  "database": "test_db",
  "username": "root",
  "askForPassword": false,
  "password": "root",
  "connectionTimeout": 15,
  "socketPath": "/path/to/mysqld.sock",
}
```


### 1.1 Specific Options

MySQL driver specific options can be passed using `mysqlOptions` settings.

```json
{
  "name": "MySQL",
  "server": "localhost",
  "dialect": "MySQL",
  "port": 5433,
  "database": "test_db",
  "username": "root",
  "askForPassword": false,
  "password": "root",
  "connectionTimeout": 15,
  "mysqlOptions": {
    ... // options See section 2. mysqlOptions
  }
}
```


### 2. mysqlOptions

We have 2 options of connectors for MySQL. You can chose which one to use by change the setting `mysqlOptions.authProtocol`. The allowed values are `default` and `xprotocol`, we use `default` by default since is the most often used.

Extra options can be used as defined in the connectors documentation.

* For MySQL default protocol
  * See https://github.com/mysqljs/mysql#connection-options and https://github.com/mysqljs/mysql#pool-options
* For MySQL xprotocol
  * See https://dev.mysql.com/doc/dev/connector-nodejs/8.0/global.html#URI

They will be passed to the pool constructor directly. See https://github.com/mtxr/vscode-sqltools/blob/master/packages/core/dialect/mysql/index.ts .

## Know Errors and How to Fix

### MySQL 8 and ER_NOT_SUPPORTED_AUTH_MODE

MySQL 8 is available using xprotocol.

See issue [#195](https://github.com/mtxr/vscode-sqltools/issues/195).

This error can be probably fixed using `mysqlOptions`. See:

```json
[
  {
    ...
    "dialect": "MySQL",
    "port": 33060, // Take a look at MySQL ports section in https://mysqlserverteam.com/mysql-guide-to-ports/
    "mysqlOptions": {
      "authProtocol": "xprotocol",
      "ssl": true
    }
  }
]
...
```
