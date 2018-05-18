// Set to true to include OracleDB dialect
const INCLUDE_ORACLEDB = false;

let OracleDB;
if (INCLUDE_ORACLEDB) {
  OracleDB = require('./oracledb').default;
}

export default {OracleDB};
