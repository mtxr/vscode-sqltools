import DB2 from '@driver/db2';
import MSSQL from '@driver/mssql';
import MySQL from '@driver/mysql';
import OracleDB from '@driver/oracle';
import PostgreSQL from '@driver/pgsql';
import SQLite from '@driver/sqlite';
import SAPHana from '@driver/saphana';
import CQL from '@driver/cql';

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
};

export default Drivers;
