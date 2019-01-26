import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracledb';
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
