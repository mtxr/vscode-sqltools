const INCLUDE_ORACLEDB = require('./../../../package.json').module.oracledb;

let OracleDB;
if (INCLUDE_ORACLEDB) {
  OracleDB = require('./oracledb').default;
}

export default {OracleDB};
