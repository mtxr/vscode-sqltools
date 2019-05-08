import MSSQL from './mssql';
import MySQL from './mysql';
import OracleDB from './oracle';
import PostgreSQL from './pgsql';
import SQLite from './sqlite';
import ExampleDialect from './example-dialect';

const dialects = {
  MSSQL,
  MySQL,
  PostgreSQL,
  OracleDB,
  SQLite,
  ExampleDialect, // add your dialect here to make it availeble for usage
};

export default dialects;
