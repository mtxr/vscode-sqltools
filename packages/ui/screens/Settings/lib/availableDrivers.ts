import { DatabaseDriver } from '@sqltools/types';
import { getIconPathForDriver } from '@sqltools/core/utils/driver';

const requirements = [
  'Node 7 or newer is required.',
];

interface Driver {
  icon: string;
  port: number;
  text: string;
  value: DatabaseDriver;
  experimental?: boolean;
  requirements?: typeof requirements;
  showHelperText?: boolean;
  requiredProps: Function;
}

const genericRequiredFields = setting => {
  const props = { name: true, driver: true, socketPath: true, server: true, port: true, connectString: true, database: true, username: true };
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

const availableDrivers: { [name: string]: Driver } = {
  DB2: {
    port: 50000,
    value: DatabaseDriver['DB2'],
    icon: getIconPathForDriver(DatabaseDriver['DB2']),
    text: 'DB2 (Node Native)',
    experimental: true,
    showHelperText: true,
    requirements,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  MySQL: {
    port: 3306,
    value: DatabaseDriver['MySQL'],
    icon: getIconPathForDriver(DatabaseDriver['MySQL']),
    text: 'MySQL',
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  MariaDB: {
    port: 3306,
    value: DatabaseDriver['MariaDB'],
    icon: getIconPathForDriver(DatabaseDriver['MariaDB']),
    text: 'MariaDB',
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  MSSQL: {
    port: 1433,
    value: DatabaseDriver['MSSQL'],
    icon: getIconPathForDriver(DatabaseDriver['MSSQL']),
    text: 'MSSQL',
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  PostgreSQL: {
    port: 5432,
    value: DatabaseDriver['PostgreSQL'],
    icon: getIconPathForDriver(DatabaseDriver['PostgreSQL']),
    text: 'PostgreSQL',
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  'AWS Redshift': {
    port: 5432,
    value: DatabaseDriver['AWS Redshift'],
    icon: getIconPathForDriver(DatabaseDriver['AWS Redshift']),
    text: 'AWS Redshift',
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  OracleDB: {
    port: 1521,
    value: DatabaseDriver['OracleDB'],
    icon: getIconPathForDriver(DatabaseDriver['OracleDB']),
    text: 'OracleDB (Node Native)',
    experimental: true,
    showHelperText: true,
    requirements,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);

      return props;
    }
  },
  SQLite: {
    value: DatabaseDriver['SQLite'],
    icon: getIconPathForDriver(DatabaseDriver['SQLite']),
    text: 'SQLite (Node Native)',
    port: null,
    showHelperText: true,
    requirements,
    requiredProps: () => {
      const props = { name: true, driver: true, database: true };
      return props;
    }
  },
  SAPHana: {
    value: DatabaseDriver['SAPHana'],
    icon: getIconPathForDriver(DatabaseDriver['SAPHana']),
    text: 'SAP Hana',
    port: 30000,
    showHelperText: true,
    requiredProps: setting => {
      const props = genericRequiredFields(setting);
      return props;
    }
  },
  Cassandra: {
    port: 9042,
    value: DatabaseDriver['Cassandra'],
    icon: getIconPathForDriver(DatabaseDriver['Cassandra']),
    text: 'Cassandra',
    experimental: true,
    showHelperText: true,
    requiredProps: () => {
      const props = { name: true, server: true, port: true, username: true };
      return props;
    }
  },
  ExampleDriver: {
    port: 9042,
    value: DatabaseDriver['ExampleDriver'],
    text: 'ExampleDriver',
    icon: getIconPathForDriver(DatabaseDriver['ExampleDriver']),
    requiredProps: () => {
      const props = { name: true, server: true, port: true, username: true };
      return props;
    }
  },
};

export const orderedDrivers = Object.keys(availableDrivers).map(key => availableDrivers[key]).sort((a, b) => a.text.localeCompare(b.text));

export default availableDrivers;