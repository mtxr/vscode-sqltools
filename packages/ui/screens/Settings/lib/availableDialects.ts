import mariadbIcon from './../icons/mariadb.png';
import mssqlIcon from './../icons/mssql.png';
import mysqlIcon from './../icons/mysql.png';
import oracleIcon from './../icons/oracle.png';
import postgresqlIcon from './../icons/postgresql.png';
import redshiftIcon from './../icons/redshift.png';
import sapHanaIcon from './../icons/sap_hana.png';
import sqliteIcon from './../icons/sqlite.png';
import cassandraIcon from './../icons/cassandra.png';
import exampleDialectIcon from './../icons/mysql.png';

const requirements = [
  'Node 6 or newer. 7 or newer is prefered.',
];

interface Dialect {
  icon: string;
  port: number;
  text: string;
  value: string;
  experimental?: boolean;
  requirements?: typeof requirements;
  showHelperText?: boolean;
  requiredProps: Function;
}

const genericRequiredFields = setting => {
  const props = { name: true, dialect: true, socketPath: true, server: true, port: true, connectString: true, database: true, username: true };
  if (setting.socketPath) {
    delete props.server;
    delete props.port;
    delete props.connectString;
  }
  if (setting.connectString) {
    delete props.server;
    delete props.port;
    delete props.database;
    delete props.username;
    delete props.socketPath;
  }

  if (setting.server) {
    delete props.connectString;
    delete props.socketPath;
  }

  return props;
};

const availableDialects: { [name: string]: Dialect } = {
  MySQL: {
    port: 3306,
    value: 'MySQL',
    text: 'MySQL',
    icon: mysqlIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  MariaDB: {
    port: 3306,
    value: 'MariaDB',
    text: 'MariaDB',
    icon: mariadbIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  MSSQL: {
    port: 1433,
    value: 'MSSQL',
    text: 'MSSQL',
    icon: mssqlIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  PostgreSQL: {
    port: 5432,
    value: 'PostgreSQL',
    text: 'PostgreSQL',
    icon: postgresqlIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  'AWS Redshift': {
    port: 5432,
    value: 'AWS Redshift',
    text: 'AWS Redshift',
    icon: redshiftIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  OracleDB: {
    port: 1521,
    value: 'OracleDB',
    text: 'OracleDB (Node Native)',
    experimental: true,
    showHelperText: true,
    requirements,
    icon: oracleIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);

      return props;
    }
  },
  SQLite: {
    value: 'SQLite',
    text: 'SQLite (Node Native)',
    port: null,
    showHelperText: true,
    requirements,
    icon: sqliteIcon,
    requiredProps: () => {
      const props = { name: true, dialect: true, database: true };
      return props;
    }
  },
  SAPHana: {
    value: 'SAPHana',
    text: 'SAP Hana',
    port: 30000,
    showHelperText: true,
    icon: sapHanaIcon,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  Cassandra: {
    port: 9042,
    value: 'Cassandra',
    text: 'Cassandra',
    experimental: true,
    showHelperText: true,
    icon: cassandraIcon,
    requiredProps: () => {
      const props = { name: true, server: true, port: true, username: true };
      return props;
    }
  },
  ExampleDialect: {
    port: 9042,
    value: 'ExampleDialect',
    text: 'ExampleDialect',
    icon: exampleDialectIcon,
    requiredProps: () => {
      const props = { name: true, server: true, port: true, username: true };
      return props;
    }
  },
};

export const orderedDialeact = Object.keys(availableDialects).map(key => availableDialects[key]).sort((a, b) => a.text.localeCompare(b.text));

export default availableDialects;