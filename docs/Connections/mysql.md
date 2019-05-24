
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
    ... // options
  }
}
```

| Option key  | Default Value | Allowed Values |
| ------------- | ------------- | ------------- |
| ssl  | `null`  | See section [SSL](#2-ssl) |
| authProtocol  | `default`  | `xprotocol`,`default` |

### 2. SSL

If you are using default protocol, see:

https://www.npmjs.com/package/mysql#ssl-options


If you are connecting using XProtocol, see:

https://dev.mysql.com/doc/dev/connector-nodejs/8.0/tutorial-Secure_Sessions.html



## Know Errors and How to Fix

### ER_NOT_SUPPORTED_AUTH_MODE

See issue [#195](https://github.com/mtxr/vscode-sqltools/issues/195).

This error can be probably fixed using `mysqlOptions`. See:

```json
[
  {
    ...
    "dialect": "MySQL",
    "port": 33060, // Yes, changin port might help. Take a look at MySQL ports section in https://mysqlserverteam.com/mysql-guide-to-ports/
    "mysqlOptions": {
      "authProtocol": "xprotocol",
      "ssl": true
    }
  }
]
...
```
