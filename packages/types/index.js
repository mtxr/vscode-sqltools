// ATTENTION! Remember to update type declarations too!!!

/// <reference path="./driver/database-driver.d.ts" />
const DatabaseDriver = {
  'AWS Redshift': 'AWS Redshift',
  Cassandra: 'Cassandra',
  DB2: 'DB2',
  MariaDB: 'MariaDB',
  MSSQL: 'MSSQL',
  MySQL: 'MySQL',
  OracleDB: 'OracleDB',
  PostgreSQL: 'PostgreSQL',
  SAPHana: 'SAPHana',
  SQLite: 'SQLite'
}

/// <reference path="./generic/connection.d.ts" />
const ContextValue = {
  CONNECTION: 'connection',
  CONNECTED_CONNECTION: 'connectedConnection',
  TABLEORVIEW: 'connection.tableOrView',
  COLUMN: 'connection.column',
  FUNCTION: 'connection.function',
  RESOURCE_GROUP: 'connection.resource_group',
  DATABASE: 'connection.database',
}

module.exports = {
  ContextValue,
  DatabaseDriver
};
