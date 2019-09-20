import { format } from './utils';

it('Format simple select query', () => {
  expect(format('SELECT * FROM user;')).toEqual(
`SELECT
  *
FROM user;`
  );
});

it('Format simple update query', () => {
  expect(format('UPDATE user SET password_requested_at = NULL, confirmation_token = NULL;')).toEqual(
`UPDATE user
SET
  password_requested_at = NULL,
  confirmation_token = NULL;`
  );
});

it('Format query with cyrilic chars. Issue #99', () => {
  expect(format(`select t.column1 Кириллица_cyrilic_alias
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
  and 1 = 1`
  );
});

it('Format query with dollar quoting. Issue #142', () => {
  expect(format(`create function foo() returns void AS $$
  begin
  select true;
  end;
  $$ language PLPGSQL;`)).toEqual(
`create function foo() returns void AS $$ begin
select
  true;
end;
$$ language PLPGSQL;`
  );
});

it('Format query with dollar parameters', () => {
  expect(format(`select * from a where id = $1`)).toEqual(
`select
  *
from a
where
  id = $1`
  );
});

it('Format vscode query snippet', () => {
  expect(format("INSERT INTO  access_token (created, id, scopes, ttl, userid) VALUES  ('${1:timestamp with time zone}', '${2:text}', '${3:text}', '${4:integer}', '${5:integer}');")).toEqual(
`INSERT INTO access_token (created, id, scopes, ttl, userid)
VALUES
  (
    '\${1:timestamp with time zone}',
    '\${2:text}',
    '\${3:text}',
    '\${4:integer}',
    '\${5:integer}'
  );`
  );
});