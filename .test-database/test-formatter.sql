
-- New lines with comments. Issue #97

SELECT * FROM user;

-- RESET ALL PASSWORD REQUESTS

UPDATE user SET password_requested_at = NULL, confirmation_token = NULL;


-- Cyrilic chars. Issue #99
select t.column1 Кириллица_cyrilic_alias
    , t.column2 Latin_alias
from db_table t
where a >= some_date1  -- from
  and a <  some_date2  -- to
  and b >= some_date3  -- and
  and b <  some_date4  -- where, select etc.
  and 1 = 1