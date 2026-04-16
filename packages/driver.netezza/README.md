# SQLTools IBM Netezza Driver

This package is part of [vscode-sqltools](https://vscode-sqltools.mteixeira.dev/?umd_source=repository&utm_medium=readme&utm_campaign=netezza) extension.

## About

This driver enables SQLTools to connect to IBM Netezza databases using the `ibm-netezza` Node.js driver.

## Features

- Connect to IBM Netezza databases
- Browse database schemas, tables, views, and functions
- Execute SQL queries
- View query results
- Auto-completion for SQL keywords
- Support for SSH tunneling

## Configuration

### Basic Connection

```json
{
  "name": "Netezza Connection",
  "driver": "Netezza",
  "server": "localhost",
  "port": 5480,
  "database": "your_database",
  "username": "your_username",
  "password": "your_password"
}
```

### Connection String

```json
{
  "name": "Netezza Connection",
  "driver": "Netezza",
  "connectString": "host=localhost port=5480 dbname=your_database user=your_username password=your_password"
}
```

### SSH Tunnel

```json
{
  "name": "Netezza Connection via SSH",
  "driver": "Netezza",
  "server": "remote-server",
  "port": 5480,
  "database": "your_database",
  "username": "your_username",
  "password": "your_password",
  "ssh": "Enabled",
  "sshOptions": {
    "host": "ssh-server",
    "port": 22,
    "username": "ssh_user",
    "password": "ssh_password"
  }
}
```

## Changelog

### 0.1.0

- Initial release of IBM Netezza driver
- Support for basic database operations
- Schema, table, view, and function browsing
- Query execution and result viewing
- SSH tunnel support
- Connection string support

## Requirements

- IBM Netezza database server
- Node.js >= 16.0.0

## Credits

This driver is built on top of the [ibm-netezza](https://github.com/IBM/nz-node) Node.js driver.
