import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracledb';
import PostgreSQL from './pgsql';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  OracleDB,
};

export default dialects;
