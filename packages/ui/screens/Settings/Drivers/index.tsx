import MySQL from './MySQL';
import MSSQL from './MSSQL';
import PostgreSQL from './PostgreSQL';
import OracleDB from './OracleDB';
import SQLite from './SQLite';
import SAPHana from './SAPHana';
import CQL from './CQL';

const DriversSettings = {
  MySQL,
  MariaDB: MySQL,
  MSSQL,
  PostgreSQL,
  'AWS Redshift': PostgreSQL,
  OracleDB,
  SQLite,
  SAPHana,
  'Cassandra': CQL
};

export default DriversSettings;