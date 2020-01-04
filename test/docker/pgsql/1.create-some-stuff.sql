-- @conn PGSQL
-- Extracted from w3schools

-- @block create company table
-- @conn PGSQL
CREATE TABLE IF NOT EXISTS COMPANY(
    ID INT PRIMARY KEY NOT NULL,
    NAME TEXT NOT NULL,
    AGE INT NOT NULL,
    ADDRESS CHAR(50),
    SALARY REAL
);

-- @block create department table
CREATE TABLE IF NOT EXISTS DEPARTMENT(
    ID INT PRIMARY KEY NOT NULL,
    DEPT CHAR(50) NOT NULL,
    EMP_ID INT NOT NULL
);
