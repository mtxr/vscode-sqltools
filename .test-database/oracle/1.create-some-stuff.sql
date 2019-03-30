-- Extracted from w3schools
CREATE TABLE admin_emp (
  empno NUMBER(5) PRIMARY KEY,
  ename VARCHAR2(15) NOT NULL,
  ssn NUMBER(9) ENCRYPT,
  job VARCHAR2(10),
  mgr NUMBER(5),
  hiredate DATE DEFAULT (sysdate),
  photo BLOB,
  sal NUMBER(7, 2),
  hrly_rate NUMBER(7, 2) GENERATED ALWAYS AS (sal / 2080),
  comm NUMBER(7, 2),
  deptno NUMBER(3) NOT NULL
) TABLESPACE admin_tbs STORAGE (INITIAL 50K);