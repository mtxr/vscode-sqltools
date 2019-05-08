import DB2 from './db2';
import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracle';
import PostgreSQL from './pgsql';
import SQLite from './sqlite';
import SAPHana from './saphana';
import CQL from './cql';
import ExampleDialect from './example-dialect';

const Drivers = {
  DB2,
  MSSQL,
  MySQL,
  MariaDB: MySQL, // alias
  PostgreSQL,
  'AWS Redshift': PostgreSQL, // alias
  OracleDB,
  SQLite,
  SAPHana,
  'Cassandra': CQL,
  ExampleDialect, // add your dialect here to make it availeble for usage
};

export default Drivers;
