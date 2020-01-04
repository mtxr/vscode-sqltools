/// reference types="./driver/database-driver";

/**
 * @type {DatabaseDriver}
 */
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

module.exports = {
  DatabaseDriver
}
