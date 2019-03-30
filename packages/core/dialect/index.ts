import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracle';
import PostgreSQL from './pgsql';
import SQLite from './sqlite';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  OracleDB,
  SQLite,
};

export default dialects;
