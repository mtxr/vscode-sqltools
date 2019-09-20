import DB2 from './db2';
import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracle';
import PostgreSQL from './pgsql';
import SQLite from './sqlite';
import SAPHana from './saphana';
import CQL from './cql';

const dialects = {
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

export default dialects;
