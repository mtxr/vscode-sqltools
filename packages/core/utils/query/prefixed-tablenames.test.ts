import getNames from './prefixed-tablenames';
import { DatabaseDialect } from '../../interface';

describe('Should generate table names base on dialects', () => {
  it('get db2 table names', () => {
    expect(getNames(DatabaseDialect.DB2, 'table')).toBe('table');
    expect(getNames(DatabaseDialect.DB2, { name: 'table', isView: false })).toBe('table');
    expect(getNames(DatabaseDialect.DB2, { name: 'table', tableSchema: 'schema', isView: false })).toBe('schema.table');
    expect(getNames(DatabaseDialect.DB2, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('schema.table');
  });
  
  it('get mysql table names', () => {
    expect(getNames(DatabaseDialect.MySQL, 'table')).toBe('`table`');
    expect(getNames(DatabaseDialect.MySQL, { name: 'table', isView: false })).toBe('`table`');
    expect(getNames(DatabaseDialect.MySQL, { name: 'table', tableSchema: 'schema', isView: false })).toBe('`schema`.`table`');
    expect(getNames(DatabaseDialect.MySQL, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('`schema`.`table`');
  });

  it('get oracledb table names', () => {
    expect(getNames(DatabaseDialect.OracleDB, 'table')).toBe('table');
    expect(getNames(DatabaseDialect.OracleDB, { name: 'table', isView: false })).toBe('table');
    expect(getNames(DatabaseDialect.OracleDB, { name: 'table', tableSchema: 'schema', isView: false })).toBe('schema.table');
    expect(getNames(DatabaseDialect.OracleDB, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('schema.table');
  });

  it('get postgresql table names', () => {
    expect(getNames(DatabaseDialect.PostgreSQL, 'table')).toBe('"table"');
    expect(getNames(DatabaseDialect.PostgreSQL, { name: 'table', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDialect.PostgreSQL, { name: 'table', tableSchema: 'schema', isView: false })).toBe('"schema"."table"');
    expect(getNames(DatabaseDialect.PostgreSQL, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('"database"."schema"."table"');
  });

  it('get redshift table names', () => {
    expect(getNames(DatabaseDialect['AWS Redshift'], 'table')).toBe('"table"');
    expect(getNames(DatabaseDialect['AWS Redshift'], { name: 'table', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDialect['AWS Redshift'], { name: 'table', tableSchema: 'schema', isView: false })).toBe('"schema"."table"');
    expect(getNames(DatabaseDialect['AWS Redshift'], { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('"database"."schema"."table"');
  });

  it('get mssql/azure table names', () => {
    expect(getNames(DatabaseDialect.MSSQL, 'table')).toBe('[table]');
    expect(getNames(DatabaseDialect.MSSQL, { name: 'table', isView: false })).toBe('[table]');
    expect(getNames(DatabaseDialect.MSSQL, { name: 'table', isView: false, tableSchema: 'sa' })).toBe('[sa].[table]');
    expect(getNames(DatabaseDialect.MSSQL, { name: 'table', isView: false, tableSchema: 'sa', tableDatabase: 'test' })).toBe('[sa].[table]');
    expect(getNames(DatabaseDialect.MSSQL, { name: 'table', isView: false, tableSchema: 'sa', tableCatalog: 'test' })).toBe('[test].[sa].[table]');
  });

  it('get cassandra table names', () => {
    expect(getNames(DatabaseDialect.Cassandra, 'table')).toBe('table');
    expect(getNames(DatabaseDialect.Cassandra, { name: 'table', isView: false })).toBe('table');
    expect(getNames(DatabaseDialect.Cassandra, { name: 'table', tableSchema: 'schema', isView: false })).toBe('schema.table');
    expect(getNames(DatabaseDialect.Cassandra, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('schema.table');
  });

  it('get other dialects table names', () => {
    expect(getNames(null, 'table')).toBe('table');
    expect(getNames(null, { name: 'table', isView: false })).toBe('table');
    expect(getNames(null, { name: 'table', tableSchema: 'schema', isView: false })).toBe('table');
    expect(getNames(null, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('table');

    expect(getNames(DatabaseDialect.SQLite, 'table')).toBe('"table"');
    expect(getNames(DatabaseDialect.SQLite, { name: 'table', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDialect.SQLite, { name: 'table', tableSchema: 'schema', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDialect.SQLite, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('"table"');

  });
});