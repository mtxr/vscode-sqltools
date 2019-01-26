import MSSQL from './mssql';
import MySQL from './mysql';
import PostgreSQL from './pgsql';
import SQLite from './sqlite';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  SQLite,
};

export default dialects;
