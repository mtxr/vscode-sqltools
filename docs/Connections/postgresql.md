
# PostgreSQL Start Guide

## 1. Connections

Connection example:
```json
{
  "name": "PGSQL",
  "server": "localhost",
  "dialect": "PostgreSQL",
  "port": 5433,
  "database": "test_db",
  "username": "root",
  "askForPassword": false,
  "password": "root",
  "connectionTimeout": 15
}
```

### 1.1 Specific Options

PostgreSQL driver specific options can be passed using `pgOptions` settings.

```json
{
  "name": "PGSQL",
  "server": "localhost",
  "dialect": "PostgreSQL",
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

| Option key  | Default Value | Allowed Values |
| ------------- | ------------- | ------------- |
| ssl  | `null`  | See https://node-postgres.com/features/ssl |


### 1.2 Alternative Connection Strings

ConnectionStrings or connectionURIs are supported as defined in `node-postgres` library. See [Connection URI](https://node-postgres.com/features/connecting#connection-uri) for more information.

Using connectionURI for previous example:

```json
{
  "name": "PGSQL",
  "server": "localhost",
  "dialect": "PostgreSQL",
  "connectString": "postgresql://root:root@localhost:5433/test_db",
  "askForPassword": false,
  "connectionTimeout": 15,
}
```
