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
  })
});