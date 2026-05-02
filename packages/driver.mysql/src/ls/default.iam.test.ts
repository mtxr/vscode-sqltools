/**
 * Integration-style tests for the IAM auth code path in the default mysql
 * driver's open(). We mock `mysql2` and the local `./aws-iam` helper so the
 * test exercises the driver logic without opening a real connection.
 */

const poolConfigs: Array<Record<string, unknown>> = [];

jest.mock('mysql2', () => {
  const pool = {
    getConnection: jest.fn((cb: any) => cb(null, { release: jest.fn() })),
    end: jest.fn((cb?: any) => cb && cb(null)),
  };
  return {
    createPool: jest.fn((config: any) => {
      poolConfigs.push(typeof config === 'string' ? { connectString: config } : config);
      return pool;
    }),
  };
});

const signAwsIamTokenMock = jest.fn();
const validateIamAuthOptionsMock = jest.fn();
jest.mock('./aws-iam', () => ({
  signAwsIamToken: signAwsIamTokenMock,
  validateIamAuthOptions: validateIamAuthOptionsMock,
}));

import MySQLDefault from './default';

function makeDriver(credentials: Record<string, unknown>): MySQLDefault {
  const getWorkspaceFolders = jest.fn().mockResolvedValue([]);
  return new (MySQLDefault as any)(credentials, getWorkspaceFolders);
}

describe('mysql driver IAM auth', () => {
  beforeEach(() => {
    poolConfigs.length = 0;
    signAwsIamTokenMock.mockReset();
    validateIamAuthOptionsMock.mockReset();
  });

  it('signs a token and uses it as the pool password', async () => {
    signAwsIamTokenMock.mockResolvedValue('fresh-token');

    const driver = makeDriver({
      driver: 'MySQL',
      server: 'db.example.com',
      port: 3306,
      database: 'app',
      username: 'dbuser',
      connectionTimeout: 15,
      useAwsIamAuth: true,
      awsIamOptions: { region: 'eu-west-1', profile: 'prod' },
      mysqlOptions: { ssl: { rejectUnauthorized: false } },
    });

    await driver.open();

    expect(validateIamAuthOptionsMock).toHaveBeenCalledTimes(1);
    expect(validateIamAuthOptionsMock).toHaveBeenCalledWith(
      { region: 'eu-west-1', profile: 'prod' },
      { ssl: true, hostname: 'db.example.com', port: 3306, username: 'dbuser' },
    );
    expect(signAwsIamTokenMock).toHaveBeenCalledWith({
      hostname: 'db.example.com',
      port: 3306,
      username: 'dbuser',
      region: 'eu-west-1',
      profile: 'prod',
    });

    expect(poolConfigs).toHaveLength(1);
    expect(poolConfigs[0].password).toBe('fresh-token');
    expect(poolConfigs[0]).not.toHaveProperty('useAwsIamAuth');
    expect(poolConfigs[0]).not.toHaveProperty('awsIamOptions');
  });

  it('propagates validation errors from validateIamAuthOptions', async () => {
    validateIamAuthOptionsMock.mockImplementationOnce(() => {
      throw new Error('IAM database authentication requires SSL.');
    });

    const driver = makeDriver({
      driver: 'MySQL',
      server: 'db.example.com',
      port: 3306,
      database: 'app',
      username: 'dbuser',
      connectionTimeout: 15,
      useAwsIamAuth: true,
      awsIamOptions: { region: 'us-east-1' },
      mysqlOptions: {},
    });

    await expect(driver.open()).rejects.toThrow(/requires SSL/);
    expect(signAwsIamTokenMock).not.toHaveBeenCalled();
    expect(poolConfigs).toHaveLength(0);
  });

  it('uses the static password when useAwsIamAuth is false', async () => {
    const driver = makeDriver({
      driver: 'MySQL',
      server: 'db.example.com',
      port: 3306,
      database: 'app',
      username: 'dbuser',
      connectionTimeout: 15,
      password: 'plain-password',
      mysqlOptions: { ssl: true },
    });

    await driver.open();

    expect(poolConfigs).toHaveLength(1);
    expect(poolConfigs[0].password).toBe('plain-password');
    expect(validateIamAuthOptionsMock).not.toHaveBeenCalled();
    expect(signAwsIamTokenMock).not.toHaveBeenCalled();
  });
});
