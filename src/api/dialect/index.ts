import Mssql from './mssql';

const dialects = {
  Mssql,
  getClass: (dialect: string) => {
    return dialect.charAt(0).toUpperCase() + dialect.slice(1).toLowerCase();
  },
};

export default dialects;
