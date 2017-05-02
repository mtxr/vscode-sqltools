import Util = require('util');
import mssql = require('mssql');
import { ConnectionCredentials } from './../interface/connection-credentials';
import { ConnectionDialect } from './../interface/connection-dialect';
import { DialectQueries } from './../interface/dialect-queries';
export default class Mssql implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    describeTable: 'SP_COLUMNS %s',
    fetchTables: `SELECT TABLE_NAME
      FROM INFORMATION_SCHEMA.TABLES
      WHERE TABLE_TYPE = 'BASE TABLE' AND TABLE_CATALOG='%s'`,
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {

  }

  public open() {
    if (this.connection) {
      return this.connection;
    }
    const options = {
      database: this.credentials.database,
      password: this.credentials.password,
      server: this.credentials.server,
      user: this.credentials.username,
    };
    this.connection = mssql.connect(options);
    return this.connection;
  }

  public close() {
    return this.connection.then((pool) => pool.close());
  }

  public query(query: string): Promise<any> {
    return this.open().then((pool) => pool.request().query(query)).then((results) => {
      if (results.recordsets.lenght === 0) {
        return [];
      }
      return results.recordsets;
    });
  }

  public getTables() {
    return this.query(Util.format(this.queries.fetchTables, this.credentials.database))
    .then((results) => {
      return results
        .reduce((prev, curr) => prev.concat(curr), [])
        .map((obj) => obj.TABLE_NAME)
        .sort();
    });
  }

  public describeTable(tableName: string) {
    return this.query(Util.format(this.queries.describeTable, tableName));
  }
}
