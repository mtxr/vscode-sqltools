---
name: Codelens
menu: Features
route: /features/codelens
---

# Codelens

Since v0.17.15 you can run queries using VSCode Codelens.

To use codelens, first you need to define query blocks, using the `@block` comment. See the example below:
```sql
-- @block create company table
-- @conn PGSQL
CREATE TABLE IF NOT EXISTS COMPANY(
    ID INT PRIMARY KEY NOT NULL,
    NAME TEXT NOT NULL,
    AGE INT NOT NULL,
    ADDRESS CHAR(50),
    SALARY REAL
);

INSERT INTO COMPANY VALUES (1, 'Name', 12, 'address', 0.2);

-- @block create department table
CREATE TABLE IF NOT EXISTS DEPARTMENT(
    ID INT PRIMARY KEY NOT NULL,
    DEPT CHAR(50) NOT NULL,
    EMP_ID INT NOT NULL
);
```

This wil be transformed into:

![static/codelens/codelens-example.png](https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/static/codelens/codelens-example.png)

Everything inside a block will run together.

If you add `@conn ConnectionName` to your query block, your queries will be executed on the defined connection.

You can even have multiple blocks of different connections on same file.