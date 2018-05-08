import MSSQL from './mssql';
import MySQL from './mysql';
import PostgreSQL from './pgsql';
import oracledb = from './oracledb';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  oracledb
};

export default dialects;
