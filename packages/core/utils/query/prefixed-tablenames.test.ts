import getNames from './prefixed-tablenames';
import { DatabaseDriver } from '@sqltools/types';

describe('Should generate table names based on drivers', () => {
  it('get db2 table names', () => {
    expect(getNames(DatabaseDriver.DB2, 'table')).toBe('table');
    expect(getNames(DatabaseDriver.DB2, { name: 'table', isView: false })).toBe('table');
    expect(getNames(DatabaseDriver.DB2, { name: 'table', tableSchema: 'schema', isView: false })).toBe('schema.table');
    expect(getNames(DatabaseDriver.DB2, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('schema.table');
  });
  
  it('get mysql table names', () => {
    expect(getNames(DatabaseDriver.MySQL, 'table')).toBe('`table`');
    expect(getNames(DatabaseDriver.MySQL, { name: 'table', isView: false })).toBe('`table`');
    expect(getNames(DatabaseDriver.MySQL, { name: 'table', tableSchema: 'schema', isView: false })).toBe('`schema`.`table`');
    expect(getNames(DatabaseDriver.MySQL, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('`schema`.`table`');
  });

  it('get oracledb table names', () => {
    expect(getNames(DatabaseDriver.OracleDB, 'table')).toBe('table');
    expect(getNames(DatabaseDriver.OracleDB, { name: 'table', isView: false })).toBe('table');
    expect(getNames(DatabaseDriver.OracleDB, { name: 'table', tableSchema: 'schema', isView: false })).toBe('schema.table');
    expect(getNames(DatabaseDriver.OracleDB, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('schema.table');
  });

  it('get postgresql table names', () => {
    expect(getNames(DatabaseDriver.PostgreSQL, 'table')).toBe('"table"');
    expect(getNames(DatabaseDriver.PostgreSQL, { name: 'table', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDriver.PostgreSQL, { name: 'table', tableSchema: 'schema', isView: false })).toBe('"schema"."table"');
    expect(getNames(DatabaseDriver.PostgreSQL, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('"database"."schema"."table"');
  });

  it('get redshift table names', () => {
    expect(getNames(DatabaseDriver['AWS Redshift'], 'table')).toBe('"table"');
    expect(getNames(DatabaseDriver['AWS Redshift'], { name: 'table', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDriver['AWS Redshift'], { name: 'table', tableSchema: 'schema', isView: false })).toBe('"schema"."table"');
    expect(getNames(DatabaseDriver['AWS Redshift'], { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('"database"."schema"."table"');
  });

  it('get mssql/azure table names', () => {
    expect(getNames(DatabaseDriver.MSSQL, 'table')).toBe('[table]');
    expect(getNames(DatabaseDriver.MSSQL, { name: 'table', isView: false })).toBe('[table]');
    expect(getNames(DatabaseDriver.MSSQL, { name: 'table', isView: false, tableSchema: 'sa' })).toBe('[sa].[table]');
    expect(getNames(DatabaseDriver.MSSQL, { name: 'table', isView: false, tableSchema: 'sa', tableDatabase: 'test' })).toBe('[sa].[table]');
    expect(getNames(DatabaseDriver.MSSQL, { name: 'table', isView: false, tableSchema: 'sa', tableCatalog: 'test' })).toBe('[test].[sa].[table]');
  });

  it('get cassandra table names', () => {
    expect(getNames(DatabaseDriver.Cassandra, 'table')).toBe('table');
    expect(getNames(DatabaseDriver.Cassandra, { name: 'table', isView: false })).toBe('table');
    expect(getNames(DatabaseDriver.Cassandra, { name: 'table', tableSchema: 'schema', isView: false })).toBe('schema.table');
    expect(getNames(DatabaseDriver.Cassandra, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'test' })).toBe('schema.table');
  });

  it('get other drivers table names', () => {
    expect(getNames(null, 'table')).toBe('table');
    expect(getNames(null, { name: 'table', isView: false })).toBe('table');
    expect(getNames(null, { name: 'table', tableSchema: 'schema', isView: false })).toBe('table');
    expect(getNames(null, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('table');

    expect(getNames(DatabaseDriver.SQLite, 'table')).toBe('"table"');
    expect(getNames(DatabaseDriver.SQLite, { name: 'table', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDriver.SQLite, { name: 'table', tableSchema: 'schema', isView: false })).toBe('"table"');
    expect(getNames(DatabaseDriver.SQLite, { name: 'table', isView: false, tableSchema: 'schema', tableDatabase: 'database' })).toBe('"table"');

  });
});