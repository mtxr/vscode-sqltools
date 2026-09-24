import queryFactory from './factory';

describe(`query generator`, () => {
  it(`should be able to create queries`, () => {
    const describeTableSQL = queryFactory<{ table: string; catalog: string; schema: string }>`
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE
        TABLE_NAME = '${({ table }) => table}'
        AND TABLE_CATALOG = '${({ catalog }) => catalog}'
        AND TABLE_SCHEMA = '${({ schema }) => schema}'
        AND something = '${'smtg'}'
    `;
    const table = 'table';
    const schema = 'schema';
    const catalog = 'catalog';
    const result = describeTableSQL({ table, schema, catalog });

    const expected = `SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'table' AND TABLE_CATALOG = 'catalog' AND TABLE_SCHEMA = 'schema' AND something = 'smtg'`;
    expect(result).toBe(expected);
  });

  it(`should generate foreign key queries with schema and database params`, () => {
    const fetchForeignKeys = queryFactory<{ schema: string; database: string }>`
    SELECT
      tc.constraint_name AS "constraintName",
      tc.table_schema AS "sourceTableSchema",
      tc.table_name AS "sourceTableName",
      kcu.column_name AS "sourceColumnName",
      ccu.table_schema AS "targetTableSchema",
      ccu.table_name AS "targetTableName",
      ccu.column_name AS "targetColumnName"
    FROM information_schema.table_constraints AS tc
    WHERE
      tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = '${p => p.schema}'
      AND tc.table_catalog = '${p => p.database}'
    `;
    const result = fetchForeignKeys({ schema: 'public', database: 'mydb' });

    expect(result).toContain("tc.table_schema = 'public'");
    expect(result).toContain("tc.table_catalog = 'mydb'");
    expect(result).toContain("tc.constraint_type = 'FOREIGN KEY'");
    expect(result).toContain('"constraintName"');
    expect(result).toContain('"sourceTableName"');
    expect(result).toContain('"targetTableName"');
  });

  it(`should handle queries with no dynamic params`, () => {
    const staticQuery = queryFactory`SELECT 1 AS result`;
    expect(staticQuery({})).toBe('SELECT 1 AS result');
  });

  it(`should expose raw query template`, () => {
    const query = queryFactory<{ name: string }>`
    SELECT * FROM tables WHERE name = '${p => p.name}'
    `;
    expect(query.raw).toBeDefined();
    expect(query.raw).toContain('${');
  });
});