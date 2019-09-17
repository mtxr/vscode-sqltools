# SQLite Start Guide

## 1. Prerequisites

- Node.js 6 or newer
- Enable `sqltools.useNodeRuntime` setting, can be `true` or a path to the node runtime.

```json
// settings.json example
{
    "sqltools.useNodeRuntime": true
}
```

> Extension automatically asks to install the SQLite driver (sqlite@v4.0.6)

More information you can find in [node-sqlite3](https://github.com/mapbox/node-sqlite3) repo: https://github.com/mapbox/node-sqlite3.

## 2. Connections

### 2.1 SQLite's Easy Connect Syntax

SQLite's connections handle files so you can use the example below as reference to connect to your DB file:

```json
{
  "name": "SQLite",
  "dialect": "SQLite",
  "database": "./sqlite/test_db.db", // if you use relative paths, the base folder is the currently open folder (or workspace).
  "connectionTimeout": 15
}
```
