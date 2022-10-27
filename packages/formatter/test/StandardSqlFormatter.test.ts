import sqlFormatter from "../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";
import dedent from 'dedent-js';
import { Config } from '../src/core/types';
describe('StandardSqlFormatter', () => {
  behavesLikeSqlFormatter();

  const format = (query, cfg: Config = {}) => sqlFormatter.format(query, { ...cfg, language: 'sql' });

  it('formats short CREATE TABLE', () => {
    expect(format(
      "CREATE TABLE items (a INT PRIMARY KEY, b TEXT);"
    )).toBe(
      "CREATE TABLE items (a INT PRIMARY KEY, b TEXT);"
    );
  });

  it('formats long CREATE TABLE', () => {
    expect(format(
      "CREATE TABLE items (a INT PRIMARY KEY, b TEXT, c INT NOT NULL, d INT NOT NULL);"
    )).toBe(
      "CREATE TABLE items (\n" +
      "  a INT PRIMARY KEY,\n" +
      "  b TEXT,\n" +
      "  c INT NOT NULL,\n" +
      "  d INT NOT NULL\n" +
      ");"
    );
  });

  it('formats INSERT without INTO', () => {
    const result = format(
      "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
    );
    expect(result).toBe(
      "INSERT Customers (ID, MoneyBalance, Address, City)\n" +
      "VALUES (12, -123.4, 'Skagen 2111', 'Stv');"
    );
  });

  it('formats ALTER TABLE ... MODIFY query', () => {
    const result = format(
      "ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;"
    );
    expect(result).toBe(
      "ALTER TABLE supplier\n" +
      "MODIFY supplier_name char(100) NOT NULL;"
    );
  });

  it('formats ALTER TABLE ... ALTER COLUMN query', () => {
    const result = format(
      "ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;"
    );
    expect(result).toBe(
      "ALTER TABLE supplier\n" +
      "ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;"
    );
  });

  it('recognizes [] strings', () => {
    expect(format("[foo JOIN bar]")).toBe("[foo JOIN bar]");
    expect(format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]");
  });

  it('recognizes @variables', () => {
    const result = format(
      "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name];"
    );
    expect(result).toBe(
      "SELECT @variable,\n" +
      "  @a1_2.3$,\n" +
      "  @'var name',\n" +
      "  @\"var name\",\n" +
      "  @`var name`,\n" +
      "  @[var name];"
    );
  });

  it('recognizes mssql server @variables', () => {
    const result = format(
      "SELECT @@SERVERNAME AS servername, @@SERVER_NAME AS server_name"
    );
    expect(result).toBe(
      "SELECT @@SERVERNAME AS servername,\n" +
      "  @@SERVER_NAME AS server_name"
    );
  });

  it('replaces @variables with param values', () => {
    const result = format(
      "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name], @'var\\name';",
      {
        params: {
          "variable": "\"variable value\"",
          "a1_2.3$": "'weird value'",
          "var name": "'var value'",
          "var\\name": "'var\\ value'"
        }
      }
    );
    expect(result).toBe(
      "SELECT \"variable value\",\n" +
      "  'weird value',\n" +
      "  'var value',\n" +
      "  'var value',\n" +
      "  'var value',\n" +
      "  'var value',\n" +
      "  'var\\ value';"
    );
  });

  it('recognizes :variables', () => {
    const result = format(
      "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`, :[var name];"
    );
    expect(result).toBe(
      "SELECT :variable,\n" +
      "  :a1_2.3$,\n" +
      "  :'var name',\n" +
      "  :\"var name\",\n" +
      "  :`var name`,\n" +
      "  :[var name];"
    );
  });

  it('replaces :variables with param values', () => {
    const result = format(
      "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`," +
      " :[var name], :'escaped \\'var\\'', :\"^*& weird \\\" var   \";",
      {
        params: {
          "variable": "\"variable value\"",
          "a1_2.3$": "'weird value'",
          "var name": "'var value'",
          "escaped 'var'": "'weirder value'",
          "^*& weird \" var   ": "'super weird value'"
        }
      }
    );
    expect(result).toBe(
      "SELECT \"variable value\",\n" +
      "  'weird value',\n" +
      "  'var value',\n" +
      "  'var value',\n" +
      "  'var value',\n" +
      "  'var value',\n" +
      "  'weirder value',\n" +
      "  'super weird value';"
    );
  });

  it('recognizes ?[0-9]* placeholders', () => {
    const result = format("SELECT ?1, ?25, ?;");
    expect(result).toBe(
      "SELECT ?1,\n" +
      "  ?25,\n" +
      "  ?;"
    );
  });

  it('replaces ? numbered placeholders with param values', () => {
    const result = format("SELECT ?1, ?2, ?0;", {
      params: {
        0: "first",
        1: "second",
        2: "third"
      }
    });
    expect(result).toBe(
      "SELECT second,\n" +
      "  third,\n" +
      "  first;"
    );
  });

  it('replaces ? indexed placeholders with param values', () => {
    const result = format("SELECT ?, ?, ?;", {
      params: ["first", "second", "third"]
    });
    expect(result).toBe(
      "SELECT first,\n" +
      "  second,\n" +
      "  third;"
    );
  });

  it('recognizes %s placeholders', () => {
    const result = format(
      "SELECT %s, %s, %s, %s, %d, %f FROM table WHERE id = %d;"
    );
    expect(result).toBe(
      "SELECT %s,\n" +
      "  %s,\n" +
      "  %s,\n" +
      "  %s,\n" +
      "  %d,\n" +
      "  %f\n" +
      "FROM table\n" +
      "WHERE id = %d;"
    );
  });


  it('formats query with GO batch separator', () => {
    const result = format("SELECT 1 GO SELECT 2", {
      params: ["first", "second", "third"]
    });
    expect(result).toBe(
      "SELECT 1\n" +
      "GO\n" +
      "SELECT 2"
    );
  });

  it('formats SELECT query with CROSS JOIN', () => {
    const result = format("SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t");
    expect(result).toBe(
      "SELECT a,\n" +
      "  b\n" +
      "FROM t\n" +
      "  CROSS JOIN t2 on t.id = t2.id_t"
    );
  });

  it('formats SELECT query with CROSS APPLY', () => {
    const result = format("SELECT a, b FROM t CROSS APPLY fn(t.id)");
    expect(result).toBe(
      "SELECT a,\n" +
      "  b\n" +
      "FROM t\n" +
      "  CROSS APPLY fn(t.id)"
    );
  });

  it('formats simple SELECT', () => {
    const result = format("SELECT N, M FROM t");
    expect(result).toBe(
      "SELECT N,\n" +
      "  M\n" +
      "FROM t"
    );
  });

  it('formats simple SELECT with national characters (MSSQL)', () => {
    const result = format("SELECT N'value'");
    expect(result).toBe(
      "SELECT N'value'"
    );
  });

  it('formats SELECT query with OUTER APPLY', () => {
    const result = format("SELECT a, b FROM t OUTER APPLY fn(t.id)");
    expect(result).toBe(
      "SELECT a,\n" +
      "  b\n" +
      "FROM t\n" +
      "  OUTER APPLY fn(t.id)"
    );
  });

  it('formats FETCH FIRST like LIMIT', () => {
    const result = format(
      "SELECT * FETCH FIRST 2 ROWS ONLY;"
    );
    expect(result).toBe(
      "SELECT *\n" +
      "FETCH FIRST 2 ROWS ONLY;"
    );
  });

  it('formats CASE ... WHEN with a blank expression', () => {
    const result = format(
      "CASE WHEN option = 'foo' THEN 1 WHEN option = 'bar' THEN 2 WHEN option = 'baz' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(
      "CASE\n" +
      "  WHEN option = 'foo' THEN 1\n" +
      "  WHEN option = 'bar' THEN 2\n" +
      "  WHEN option = 'baz' THEN 3\n" +
      "  ELSE 4\n" +
      "END;"
    );
  });

  it('formats CASE ... WHEN inside SELECT', () => {
    const result = format(
      "SELECT foo, bar, CASE baz WHEN 'one' THEN 1 WHEN 'two' THEN 2 ELSE 3 END FROM table"
    );

    expect(result).toBe(
      "SELECT foo,\n" +
      "  bar,\n" +
      "  CASE\n" +
      "    baz\n" +
      "    WHEN 'one' THEN 1\n" +
      "    WHEN 'two' THEN 2\n" +
      "    ELSE 3\n" +
      "  END\n" +
      "FROM table"
    );
  });

  it('formats CASE ... WHEN with an expression', () => {
    const result = format(
      "CASE toString(getNumber()) WHEN 'one' THEN 1 WHEN 'two' THEN 2 WHEN 'three' THEN 3 ELSE 4 END;"
    );

    expect(result).toBe(
      "CASE\n" +
      "  toString(getNumber())\n" +
      "  WHEN 'one' THEN 1\n" +
      "  WHEN 'two' THEN 2\n" +
      "  WHEN 'three' THEN 3\n" +
      "  ELSE 4\n" +
      "END;"
    );
  });

  it('recognizes lowercase CASE ... END', () => {
    const result = format(
      "case when option = 'foo' then 1 else 2 end;"
    );

    expect(result).toBe(
      "case\n" +
      "  when option = 'foo' then 1\n" +
      "  else 2\n" +
      "end;"
    );
  });

  // Regression test for issue #43
  it('ignores words CASE and END inside other strings', () => {
    const result = format('SELECT CASEDATE, ENDDATE FROM table1;');

    expect(result).toBe(
      "SELECT CASEDATE,\n" +
      "  ENDDATE\n" +
      "FROM table1;"
    );
  });

  it('formats tricky line comments', () => {
    expect(format("SELECT a#comment, here\nFROM b--comment")).toBe(
      "SELECT a #comment, here\n" +
      "FROM b --comment"
    );
  });

  it('formats line comments followed by semicolon', () => {
    expect(format("SELECT a FROM b\n--comment\n;")).toBe(
      "SELECT a\n" +
      "FROM b --comment\n" +
      ";"
    );
  });

  it('formats line comments followed by comma', () => {
    expect(format("SELECT a --comment\n, b")).toBe(
      "SELECT a --comment\n" +
      ",\n" +
      "  b"
    );
  });

  it('formats line comments followed by close-paren', () => {
    expect(format("SELECT ( a --comment\n )")).toBe(
      `SELECT (
    a --comment
  )`
    );
  });

  it('formats line comments followed by open-paren', () => {
    expect(format("SELECT a --comment\n()")).toBe(
      "SELECT a --comment\n" +
      "  ()"
    );
  });

  it('formats lonely semicolon', () => {
    expect(format(";")).toBe(";");
  });

  it('Format query with cyrilic chars', () => {
    expect(format(`select t.column1 Кириллица_cyrilic_alias
      , t.column2 Latin_alias
    from db_table t
    where a >= some_date1  -- from
    and a <  some_date2  -- to
    and b >= some_date3  -- and
    and b <  some_date4  -- where, select etc.
    and 1 = 1`)).toEqual(
      `select t.column1 Кириллица_cyrilic_alias,
  t.column2 Latin_alias
from db_table t
where a >= some_date1 -- from
  and a < some_date2 -- to
  and b >= some_date3 -- and
  and b < some_date4 -- where, select etc.
  and 1 = 1`);
  });

  it('Format query with japanese chars', () => {
    expect(format(`select * from 注文 inner join 注文明細 on 注文.注文id = 注文明細.注文id;`)).toEqual(
      `select *
from 注文
  inner join 注文明細 on 注文.注文id = 注文明細.注文id;`);
  });

  it('Format query with dollar quoting', () => {
    expect(format(`create function foo() returns void AS $$
      begin
      select true;
      end;
      $$ language PLPGSQL;`)).toEqual(
      `create function foo() returns void AS $$ begin
select true;
end;
$$ language PLPGSQL;`);
  });

  it('Format query with dollar parameters', () => {
    expect(format(`select * from a where id = $1`)).toEqual(
      `select *
from a
where id = $1`);
  });

  it('Format query with returning as top level', () => {
    expect(
      format(`UPDATE "log" SET "time" = '2020-02-01 09:00:00' WHERE "id" = 1 RETURNING "time";`)
    ).toEqual(dedent(`
        UPDATE "log"
        SET "time" = '2020-02-01 09:00:00'
        WHERE "id" = 1
        RETURNING "time";
      `));
  });

  it('Format query with BETWEEN as top level', () => {
    expect(
      format(`SELECT NAME, DATE FROM TABLENAME WHERE NAME IS NOT NULL AND DATE BETWEEN '2019-09-01' AND '2019-09-03'`)
    ).toEqual(dedent(`
      SELECT NAME,
        DATE
      FROM TABLENAME
      WHERE NAME IS NOT NULL
        AND DATE BETWEEN '2019-09-01' AND '2019-09-03'
      `));
  });

  it('UNION ALL same line issue', () => {
    expect(
      format(`SELECT supplier_id FROM suppliers UNION ALL SELECT supplier_id FROM orders ORDER BY supplier_id;`)
    ).toEqual(dedent(`
      SELECT supplier_id
      FROM suppliers
      UNION ALL
      SELECT supplier_id
      FROM orders
      ORDER BY supplier_id;
      `
    ));
  });

  it('convert case reserved word to UPPER', () => {
    expect(
      format(`select case when external_sub_ref_id is null then 'a' else 'b' end as ref_1, case when subscription_ref_id is null then 'c' else 'd' end as ref_2, count(1) c from table1 group by 1, 2;`, { reservedWordCase: 'upper' })
    ).toEqual(dedent(`
        SELECT CASE
            WHEN external_sub_ref_id IS NULL THEN 'a'
            ELSE 'b'
          END AS ref_1,
          CASE
            WHEN subscription_ref_id IS NULL THEN 'c'
            ELSE 'd'
          END AS ref_2,
          COUNT(1) c
        FROM table1
        GROUP BY 1,
          2;
        `
      ));
  });

  it('preserve line breaks', () => {
    let input = dedent`
      CREATE TABLE foo (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );

      CREATE TABLE bar (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );
    `;
    expect(format(input, { linesBetweenQueries: 'preserve' })).toEqual(input);
    input = dedent`
      CREATE TABLE foo (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );

      CREATE TABLE bar (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );

      CREATE TABLE baz (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );
    `;
    expect(format(input, { linesBetweenQueries: 'preserve' })).toEqual(input);
    input = dedent`
      CREATE TABLE foo (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );
      CREATE TABLE bar (
        id INTEGER PRIMARY KEY,
        name VARCHAR(200) UNIQUE,
      );
    `;
    expect(format(input, { linesBetweenQueries: 'preserve' })).toEqual(input);
    expect(format(dedent`
    CREATE TABLE foo (


      id INTEGER PRIMARY KEY,
      name VARCHAR(200) UNIQUE,
    );


    CREATE TABLE bar (
      id INTEGER PRIMARY KEY,

      name VARCHAR(200) UNIQUE,
    );
    `, { linesBetweenQueries: 'preserve' })).toEqual(dedent`
    CREATE TABLE foo (
      id INTEGER PRIMARY KEY,
      name VARCHAR(200) UNIQUE,
    );


    CREATE TABLE bar (
      id INTEGER PRIMARY KEY,
      name VARCHAR(200) UNIQUE,
    );
    `);

    expect(format(dedent`
    CREATE TABLE foo (


      id INTEGER PRIMARY KEY,
      name VARCHAR(200) UNIQUE,
    );





    CREATE TABLE bar (
      id INTEGER PRIMARY KEY,

      name VARCHAR(200) UNIQUE,
    );
    `, { linesBetweenQueries: 3 })).toEqual(dedent`
    CREATE TABLE foo (
      id INTEGER PRIMARY KEY,
      name VARCHAR(200) UNIQUE,
    );


    CREATE TABLE bar (
      id INTEGER PRIMARY KEY,
      name VARCHAR(200) UNIQUE,
    );
    `);
  });

  it('time uuid cassandra formating', () => {
    expect(format(`
    SELECT * FROM alphastore.alphaValueT0
    where
      exprid = 08eb9be4-77d2-11ea-a88d-28672d5f4dc4
      and symbol = 'sh600008';
    `)).toEqual(dedent(`
    SELECT *
    FROM alphastore.alphaValueT0
    where exprid = 08eb9be4-77d2-11ea-a88d-28672d5f4dc4
      and symbol = 'sh600008';
    `))
  })

  it('format json operators correctly', () => {
    const input = dedent(`
    SELECT json_col FROM (SELECT '[{"a":"foo"},{"b":"bar"},{"c":"baz"}]' :: jsonb json_col) AS tbl
    WHERE json_col @> '[{"c":"baz"}]';`);

    expect(format(input)).toEqual(dedent(`
    SELECT json_col
    FROM (
        SELECT '[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::jsonb json_col
      ) AS tbl
    WHERE json_col @> '[{"c":"baz"}]';`));

    let inputs = [
      `'{"a":1, "b":2}'::jsonb @> '{"b":2}'::jsonb`,
      `'{"b":2}'::jsonb <@ '{"a":1, "b":2}'::jsonb`,
      `'{"a":1, "b":2}'::jsonb ? 'b'`,
      `'{"a":1, "b":2, "c":3}'::jsonb ?| array ['b', 'c']`,
      `'["a", "b"]'::jsonb ?& array ['a', 'b']`,
      `'["a", "b"]'::jsonb || '["c", "d"]'::jsonb`,
      `'{"a": "b"}'::jsonb - 'a''{"a": "b"}'::jsonb - 'a''{"a": "b"}'::jsonb - 'a'`,
      `'["a", "b"]'::jsonb - 1`,
      `'["a", {"b":1}]'::jsonb #- '{1,b}'`,
      `'[{"a":"foo"},{"b":"bar"},{"c":"baz"}]'::json->2`,
      `'{"a": {"b":"foo"}}'::json->'a'`,
      `'[1,2,3]'::json->>2`,
      `'{"a":1,"b":2}'::json->>'b'`,
      `'{"a": {"b":{"c": "foo"}}}'::json#>'{a,b}'`,
      `'{"a":[1,2,3],"b":[4,5,6]}'::json#>>'{a,2}'`,
    ];
    for (let i of inputs) {
      expect(format(i))
        .toEqual(i);
    }
  });

  it(`format grant stataments with keyword identation`, () => {
    let input = `GRANT ALTER, CREATE, DELETE, EXECUTE, INSERT, SELECT, REFERENCES, TRIGGER, UPDATE ON *.* TO 'user' @'%';`;

    expect(format(input)).toEqual(dedent(`
    GRANT ALTER,
      CREATE,
      DELETE,
      EXECUTE,
      INSERT,
      SELECT,
      REFERENCES,
      TRIGGER,
      UPDATE ON *.* TO 'user' @'%';
    `))

    input = `GRANT INSERT, SELECT, REFERENCES, TRIGGER,   UPDATE ON *    TO    'user' @'%';`;

    expect(format(input)).toEqual(dedent(`
    GRANT INSERT,
      SELECT,
      REFERENCES,
      TRIGGER,
      UPDATE ON * TO 'user' @'%';
    `))
  });

  it("formats postgres specific c-style escape sequences", function() {
    expect(format("E'\\n'")).toBe("E'\\n'");
    expect(format("E'\\d+'")).toBe("E'\\d+'");
    expect(format("E'\n'")).toBe("E'\n'");
    expect(format("E'foo\\'bar'")).toBe("E'foo\\'bar'");

    // also support lower-case e
    expect(format("e'\n'")).toBe("e'\n'");
    // multiline escape sequence
    expect(format(`E'\n
    \\d+
    '`)).toBe(`E'\n
    \\d+
    '`);

    expect(format("e'\n' ='abc'")).toBe("e'\n' = 'abc'");

    // only E or e should be treated as special escape sequence
    expect(format("D'\n'")).toBe("D '\n'");
  });
});
