-- Extracted from w3schools

-- @name create company table
CREATE TABLE COMPANY(
    ID INT PRIMARY KEY NOT NULL,
    NAME TEXT NOT NULL,
    AGE INT NOT NULL,
    ADDRESS CHAR(50),
    SALARY REAL
);

-- @name create department table
CREATE TABLE DEPARTMENT(
    ID INT PRIMARY KEY NOT NULL,
    DEPT CHAR(50) NOT NULL,
    EMP_ID INT NOT NULL
);
