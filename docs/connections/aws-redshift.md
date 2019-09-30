
# AWS Redshift Start Guide

> Remember: Redshift is a fork from postgresql. We use the same driver to connect for both Redshift and PostgreSQL.

## 1. Connections

Connection example:
```json
{
  "name": "Redshift",
  "server": "localhost",
  "dialect": "AWS Redshift",
  "port": 5433,
  "database": "test_db",
  "username": "root",
  "askForPassword": false,
  "password": "root",
  "connectionTimeout": 15
}
```

### 1.1 Specific Options

AWS Redshift driver specific options can be passed using `pgOptions` settings.

```json
{
  "name": "Redshift",
  "server": "localhost",
  "dialect": "AWS Redshift",
  "port": 5433,
  "database": "test_db",
  "username": "root",
  "askForPassword": false,
  "password": "root",
  "connectionTimeout": 15,
  "pgOptions": {
    ... // options
  }
}
```
You can use any options defined in https://node-postgres.com/features/connecting#programmatic in `pgOptions`.

They will be passed to the pool constructor directly. See https://github.com/mtxr/vscode-sqltools/blob/master/packages/core/dialect/Redshift/index.ts .


### 1.2 Alternative Connection Strings

ConnectionStrings or connectionURIs are supported as defined in `node-postgres` library. See [Connection URI](https://node-postgres.com/features/connecting#connection-uri) for more information.

Using connectionURI for previous example:

```json
{
  "name": "Redshift",
  "server": "localhost",
  "dialect": "AWS Redshift",
  "connectString": "AWS Redshift://root:root@localhost:5433/test_db",
  "askForPassword": false,
  "connectionTimeout": 15,
}
```
