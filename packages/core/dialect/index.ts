import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracle';
import PostgreSQL from './pgsql';
import Firebird from './firebird';
import SQLite from './sqlite';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  Firebird,
  OracleDB,
  SQLite,
};

export default dialects;
