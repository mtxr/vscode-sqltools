import sqlFormatter from "../src/sqlFormatter";
import behavesLikeSqlFormatter from "./behavesLikeSqlFormatter";

describe("StandardSqlFormatter", function() {
    behavesLikeSqlFormatter();

    it("formats short CREATE TABLE", function() {
        expect(sqlFormatter.format(
            "CREATE TABLE items (a INT PRIMARY KEY, b TEXT);"
        )).toBe(
            "CREATE TABLE items (a INT PRIMARY KEY, b TEXT);"
        );
    });

    it("formats long CREATE TABLE", function() {
        expect(sqlFormatter.format(
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

    it("formats INSERT without INTO", function() {
        const result = sqlFormatter.format(
            "INSERT Customers (ID, MoneyBalance, Address, City) VALUES (12,-123.4, 'Skagen 2111','Stv');"
        );
        expect(result).toBe(
            "INSERT Customers (ID, MoneyBalance, Address, City)\n" +
            "VALUES\n" +
            "  (12, -123.4, 'Skagen 2111', 'Stv');"
        );
    });

    it("formats ALTER TABLE ... MODIFY query", function() {
        const result = sqlFormatter.format(
            "ALTER TABLE supplier MODIFY supplier_name char(100) NOT NULL;"
        );
        expect(result).toBe(
            "ALTER TABLE supplier\n" +
            "MODIFY\n" +
            "  supplier_name char(100) NOT NULL;"
        );
    });

    it("formats ALTER TABLE ... ALTER COLUMN query", function() {
        const result = sqlFormatter.format(
            "ALTER TABLE supplier ALTER COLUMN supplier_name VARCHAR(100) NOT NULL;"
        );
        expect(result).toBe(
            "ALTER TABLE supplier\n" +
            "ALTER COLUMN\n" +
            "  supplier_name VARCHAR(100) NOT NULL;"
        );
    });

    it("recognizes [] strings", function() {
        expect(sqlFormatter.format("[foo JOIN bar]")).toBe("[foo JOIN bar]");
        expect(sqlFormatter.format("[foo ]] JOIN bar]")).toBe("[foo ]] JOIN bar]");
    });

    it("recognizes @variables", function() {
        const result = sqlFormatter.format(
            "SELECT @variable, @a1_2.3$, @'var name', @\"var name\", @`var name`, @[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  @variable,\n" +
            "  @a1_2.3$,\n" +
            "  @'var name',\n" +
            "  @\"var name\",\n" +
            "  @`var name`,\n" +
            "  @[var name];"
        );
    });

    it("recognizes mssql server @variables", function() {
      const result = sqlFormatter.format(
          "SELECT @@SERVERNAME AS servername, @@SERVER_NAME AS server_name"
      );
      expect(result).toBe(
          "SELECT\n" +
          "  @@SERVERNAME AS servername,\n" +
          "  @@SERVER_NAME AS server_name"
      );
  });

    it("replaces @variables with param values", function() {
        const result = sqlFormatter.format(
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
            "SELECT\n" +
            "  \"variable value\",\n" +
            "  'weird value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var\\ value';"
        );
    });

    it("recognizes :variables", function() {
        const result = sqlFormatter.format(
            "SELECT :variable, :a1_2.3$, :'var name', :\"var name\", :`var name`, :[var name];"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  :variable,\n" +
            "  :a1_2.3$,\n" +
            "  :'var name',\n" +
            "  :\"var name\",\n" +
            "  :`var name`,\n" +
            "  :[var name];"
        );
    });

    it("replaces :variables with param values", function() {
        const result = sqlFormatter.format(
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
            "SELECT\n" +
            "  \"variable value\",\n" +
            "  'weird value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'var value',\n" +
            "  'weirder value',\n" +
            "  'super weird value';"
        );
    });

    it("recognizes ?[0-9]* placeholders", function() {
        const result = sqlFormatter.format("SELECT ?1, ?25, ?;");
        expect(result).toBe(
            "SELECT\n" +
            "  ?1,\n" +
            "  ?25,\n" +
            "  ?;"
        );
    });

    it("replaces ? numbered placeholders with param values", function() {
        const result = sqlFormatter.format("SELECT ?1, ?2, ?0;", {
            params: {
                0: "first",
                1: "second",
                2: "third"
            }
        });
        expect(result).toBe(
            "SELECT\n" +
            "  second,\n" +
            "  third,\n" +
            "  first;"
        );
    });

    it("replaces ? indexed placeholders with param values", function() {
        const result = sqlFormatter.format("SELECT ?, ?, ?;", {
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  first,\n" +
            "  second,\n" +
            "  third;"
        );
    });

    it("recognizes %s placeholders", function() {
      const result = sqlFormatter.format(
          "SELECT %s, %s, %s, %s, %d, %f FROM table WHERE id = %d;"
      );
      expect(result).toBe(
          "SELECT\n" +
          "  %s,\n" +
          "  %s,\n" +
          "  %s,\n" +
          "  %s,\n" +
          "  %d,\n" +
          "  %f\n" +
          "FROM table\n" +
          "WHERE\n" +
          "  id = %d;"
      );
  });


    it("formats query with GO batch separator", function() {
        const result = sqlFormatter.format("SELECT 1 GO SELECT 2", {
            params: ["first", "second", "third"]
        });
        expect(result).toBe(
            "SELECT\n" +
            "  1\n" +
            "GO\n" +
            "SELECT\n" +
            "  2"
        );
    });

    it("formats SELECT query with CROSS JOIN", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS JOIN t2 on t.id = t2.id_t");
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM t\n" +
            "CROSS JOIN t2 on t.id = t2.id_t"
        );
    });

    it("formats SELECT query with CROSS APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t CROSS APPLY fn(t.id)");
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM t\n" +
            "  CROSS APPLY fn(t.id)"
        );
    });

    it("formats simple SELECT", function() {
        const result = sqlFormatter.format("SELECT N, M FROM t");
        expect(result).toBe(
            "SELECT\n" +
            "  N,\n" +
            "  M\n" +
            "FROM t"
        );
    });

    it("formats simple SELECT with national characters (MSSQL)", function() {
        const result = sqlFormatter.format("SELECT N'value'");
        expect(result).toBe(
            "SELECT\n" +
            "  N'value'"
        );
    });

    it("formats SELECT query with OUTER APPLY", function() {
        const result = sqlFormatter.format("SELECT a, b FROM t OUTER APPLY fn(t.id)");
        expect(result).toBe(
            "SELECT\n" +
            "  a,\n" +
            "  b\n" +
            "FROM t\n" +
            "  OUTER APPLY fn(t.id)"
        );
    });

    it("formats FETCH FIRST like LIMIT", function() {
        const result = sqlFormatter.format(
            "SELECT * FETCH FIRST 2 ROWS ONLY;"
        );
        expect(result).toBe(
            "SELECT\n" +
            "  *\n" +
            "FETCH FIRST\n" +
            "  2 ROWS ONLY;"
        );
    });

    it("formats CASE ... WHEN with a blank expression", function() {
        const result = sqlFormatter.format(
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

    it("formats CASE ... WHEN inside SELECT", function() {
        const result = sqlFormatter.format(
            "SELECT foo, bar, CASE baz WHEN 'one' THEN 1 WHEN 'two' THEN 2 ELSE 3 END FROM table"
        );

        expect(result).toBe(
            "SELECT\n" +
            "  foo,\n" +
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

    it("formats CASE ... WHEN with an expression", function() {
        const result = sqlFormatter.format(
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

    it("recognizes lowercase CASE ... END", function() {
        const result = sqlFormatter.format(
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
    it("ignores words CASE and END inside other strings", function() {
        const result = sqlFormatter.format(
            "SELECT CASEDATE, ENDDATE FROM table1;"
        );

        expect(result).toBe(
            "SELECT\n" +
            "  CASEDATE,\n" +
            "  ENDDATE\n" +
            "FROM table1;"
        );
    });

    it("formats tricky line comments", function() {
        expect(sqlFormatter.format("SELECT a#comment, here\nFROM b--comment")).toBe(
            "SELECT\n" +
            "  a #comment, here\n" +
            "FROM b --comment"
        );
    });

    it("formats line comments followed by semicolon", function() {
        expect(sqlFormatter.format("SELECT a FROM b\n--comment\n;")).toBe(
            "SELECT\n" +
            "  a\n" +
            "FROM b --comment\n" +
            ";"
        );
    });

    it("formats line comments followed by comma", function() {
        expect(sqlFormatter.format("SELECT a --comment\n, b")).toBe(
            "SELECT\n" +
            "  a --comment\n" +
            ",\n" +
            "  b"
        );
    });

    it("formats line comments followed by close-paren", function() {
        expect(sqlFormatter.format("SELECT ( a --comment\n )")).toBe(
`SELECT
  (
    a --comment
  )`
        );
    });

    it("formats line comments followed by open-paren", function() {
        expect(sqlFormatter.format("SELECT a --comment\n()")).toBe(
            "SELECT\n" +
            "  a --comment\n" +
            "  ()"
        );
    });

    it("formats lonely semicolon", function() {
        expect(sqlFormatter.format(";")).toBe(";");
    });

    it('Format query with cyrilic chars', () => {
      expect(sqlFormatter.format(`select t.column1 Кириллица_cyrilic_alias
      , t.column2 Latin_alias
    from db_table t
    where a >= some_date1  -- from
    and a <  some_date2  -- to
    and b >= some_date3  -- and
    and b <  some_date4  -- where, select etc.
    and 1 = 1`)).toEqual(
    `select
  t.column1 Кириллица_cyrilic_alias,
  t.column2 Latin_alias
from db_table t
where
  a >= some_date1 -- from
  and a < some_date2 -- to
  and b >= some_date3 -- and
  and b < some_date4 -- where, select etc.
  and 1 = 1`);
    });

    it('Format query with japanese chars', () => {
      expect(sqlFormatter.format(`select * from 注文 inner join 注文明細 on 注文.注文id = 注文明細.注文id;`)).toEqual(
`select
  *
from 注文
inner join 注文明細 on 注文.注文id = 注文明細.注文id;`);
    });

    it('Format query with dollar quoting', () => {
      expect(sqlFormatter.format(`create function foo() returns void AS $$
      begin
      select true;
      end;
      $$ language PLPGSQL;`)).toEqual(
`create function foo() returns void AS $$ begin
select
  true;
end;
$$ language PLPGSQL;`);
    });

    it('Format query with dollar parameters', () => {
      expect(sqlFormatter.format(`select * from a where id = $1`)).toEqual(
`select
  *
from a
where
  id = $1`);
    });
});

// @TODO improve this tests
describe('StandardSqlFormatter tokenizer', function() {
  it('tokenizes tricky line comments', function() {
    expect(sqlFormatter.tokenize('SELECT a#comment, here\nFROM h.b--comment', {})).toEqual([
      { type: 'reserved-toplevel', value: 'SELECT' },
      { type: 'whitespace', value: ' ' },
      { type: 'word', value: 'a' },
      { type: 'line-comment', value: '#comment, here\n' },
      { type: 'tablename-prefix', value: 'FROM' },
      { type: 'whitespace', value: ' ' },
      { type: 'tablename', value: 'h.b' },
      { type: 'line-comment', value: '--comment' },
    ]);
  });

  it('tokenizes tricky line comments using sql as language', function() {
    expect(sqlFormatter.tokenize('SELECT a#comment, here\nFROM h.b--comment')).toEqual([
      { type: 'reserved-toplevel', value: 'SELECT' },
      { type: 'whitespace', value: ' ' },
      { type: 'word', value: 'a' },
      { type: 'line-comment', value: '#comment, here\n' },
      { type: 'tablename-prefix', value: 'FROM' },
      { type: 'whitespace', value: ' ' },
      { type: 'tablename', value: 'h.b' },
      { type: 'line-comment', value: '--comment' },
    ]);
  });

  it('tokenize SELECT query with OUTER APPLY', function() {
    const result = sqlFormatter.tokenize('SELECT a, b FROM t OUTER APPLY fn(t.id)');
    expect(result).toEqual([
      { type: 'reserved-toplevel', value: 'SELECT' },
      { type: 'whitespace', value: ' ' },
      { type: 'word', value: 'a' },
      { type: 'operator', value: ',' },
      { type: 'whitespace', value: ' ' },
      { type: 'word', value: 'b' },
      { type: 'whitespace', value: ' ' },
      { type: 'tablename-prefix', value: 'FROM' },
      { type: 'whitespace', value: ' ' },
      { type: 'tablename', value: 't' },
      { type: 'whitespace', value: ' ' },
      { type: 'reserved-newline', value: 'OUTER APPLY' },
      { type: 'whitespace', value: ' ' },
      { type: 'word', value: 'fn' },
      { type: 'open-paren', value: '(' },
      { type: 'word', value: 't' },
      { type: 'operator', value: '.' },
      { type: 'word', value: 'id' },
      { type: 'close-paren', value: ')' },
    ]);
  });
});
