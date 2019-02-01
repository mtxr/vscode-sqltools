import MSSQL from './mssql';
import MySQL from './mysql';
import PostgreSQL from './pgsql';
import Firebird from './firebird';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  Firebird,
};

export default dialects;
