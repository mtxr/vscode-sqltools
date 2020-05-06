import getNames from './prefixed-tablenames';
import { DatabaseDriver } from '@sqltools/types';

describe('Should generate table names based on drivers', () => {
  it('get db2 table names', () => {
    expect(getNames('table', { driver: DatabaseDriver.DB2 })).toBe('table');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.DB2 })).toBe('table');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: DatabaseDriver.DB2 })).toBe('schema.table');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'test' }, { driver: DatabaseDriver.DB2 })).toBe('schema.table');
  });

  it('get mysql table names', () => {
    expect(getNames('table', { driver: DatabaseDriver.MySQL })).toBe('`table`');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.MySQL })).toBe('`table`');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: DatabaseDriver.MySQL })).toBe('`schema`.`table`');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'test' }, { driver: DatabaseDriver.MySQL })).toBe('`schema`.`table`');
  });

  it('get oracledb table names', () => {
    expect(getNames('table', { driver: DatabaseDriver.OracleDB })).toBe('table');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.OracleDB })).toBe('table');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: DatabaseDriver.OracleDB })).toBe('schema.table');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'test' }, { driver: DatabaseDriver.OracleDB })).toBe('schema.table');
  });

  it('get postgresql table names', () => {
    expect(getNames('table', { driver: DatabaseDriver.PostgreSQL })).toBe('table');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.PostgreSQL })).toBe('table');
    expect(getNames({ label: 'table', schema: 'Schema', isView: false }, { driver: DatabaseDriver.PostgreSQL })).toBe('"Schema".table');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'database' }, { driver: DatabaseDriver.PostgreSQL })).toBe('database.schema.table');
  });

  it('get redshift table names', () => {
    expect(getNames('table', { driver: DatabaseDriver['AWS Redshift'] })).toBe('"table"');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver['AWS Redshift'] })).toBe('"table"');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: DatabaseDriver['AWS Redshift'] })).toBe('"schema"."table"');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'database' }, { driver: DatabaseDriver['AWS Redshift'] })).toBe('"database"."schema"."table"');
  });

  it('get mssql/azure table names', () => {
    expect(getNames('table', { driver: DatabaseDriver.MSSQL })).toBe('[table]');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.MSSQL })).toBe('[table]');
    expect(getNames({ label: 'table', isView: false, schema: 'sa' }, { driver: DatabaseDriver.MSSQL })).toBe('[sa].[table]');
    expect(getNames({ label: 'table', isView: false, schema: 'sa', database: 'test' }, { driver: DatabaseDriver.MSSQL })).toBe('[sa].[table]');
  });

  it('get cassandra table names', () => {
    expect(getNames('table', { driver: DatabaseDriver.Cassandra })).toBe('table');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.Cassandra })).toBe('table');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: DatabaseDriver.Cassandra })).toBe('schema.table');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'test' }, { driver: DatabaseDriver.Cassandra })).toBe('schema.table');
  });

  it('get other drivers table names', () => {
    expect(getNames('table', { driver: null })).toBe('table');
    expect(getNames({ label: 'table', isView: false }, { driver: null })).toBe('table');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: null })).toBe('table');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'database' }, { driver: null })).toBe('table');

    expect(getNames('table', { driver: DatabaseDriver.SQLite })).toBe('"table"');
    expect(getNames({ label: 'table', isView: false }, { driver: DatabaseDriver.SQLite })).toBe('"table"');
    expect(getNames({ label: 'table', schema: 'schema', isView: false }, { driver: DatabaseDriver.SQLite })).toBe('"table"');
    expect(getNames({ label: 'table', isView: false, schema: 'schema', database: 'database' }, { driver: DatabaseDriver.SQLite })).toBe('"table"');

  });
});