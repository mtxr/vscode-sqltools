import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracledb.module';
import PostgreSQL from './pgsql';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  ...OracleDB,
};

export default dialects;
