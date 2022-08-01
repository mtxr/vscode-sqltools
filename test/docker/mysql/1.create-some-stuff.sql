-- Extracted from w3schools
-- TODO change to data model that makes better sense

--@block Create tables
DROP TABLE IF EXISTS DEPARTMENT;
DROP TABLE IF EXISTS COMPANY;

CREATE TABLE COMPANY(
    ID INT PRIMARY KEY NOT NULL,
    NAME TEXT NOT NULL,
    AGE INT NOT NULL,
    ADDRESS CHAR(50),
    SALARY REAL
);

CREATE TABLE DEPARTMENT(
    ID INT PRIMARY KEY NOT NULL,
    DEPT CHAR(50) NOT NULL,
    EMP_ID INT NOT NULL,
    COMPANY_ID INT NOT NULL,
    FOREIGN KEY (COMPANY_ID) REFERENCES COMPANY(ID)
);

--@block Insert records
INSERT INTO COMPANY (ID, NAME, AGE, ADDRESS, SALARY) VALUES
    (1, 'Dan', 20, 'Code Close', 40000),
    (2, 'Tim', 27, 'Test Town', 37000),
    (3, 'Roz', 27, 'Release Road', 55000)
    ;
