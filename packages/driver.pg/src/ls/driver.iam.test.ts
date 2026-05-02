/**
 * Integration-style tests for the IAM auth code path in the pg driver's open().
 * We mock the `pg` library and the local `./aws-iam` helper so the test
 * exercises the driver logic without opening a real connection or shipping
 * a real token.
 */

const poolConstructorCalls: Array<Record<string, unknown>> = [];
const poolConnectMock = jest.fn();
jest.mock('pg', () => {
  class FakePool {
    public readonly config: Record<string, unknown>;
    constructor(config: Record<string, unknown>) {
      this.config = config;
      poolConstructorCalls.push(config);
    }
    public connect = poolConnectMock;
    public end = jest.fn();
  }
  return {
    Pool: FakePool,
    types: {
      setTypeParser: jest.fn(),
      builtins: { TIMESTAMP: 1114, TIMESTAMPTZ: 1184, DATE: 1082 },
    },
    Client: class {},
  };
});

const signAwsIamTokenMock = jest.fn();
const validateIamAuthOptionsMock = jest.fn();
jest.mock('./aws-iam', () => ({
  signAwsIamToken: signAwsIamTokenMock,
  validateIamAuthOptions: validateIamAuthOptionsMock,
}));

import PostgreSQL from './driver';

function makeDriver(credentials: Record<string, unknown>): PostgreSQL {
  const getWorkspaceFolders = jest.fn().mockResolvedValue([]);
  return new (PostgreSQL as any)(credentials, getWorkspaceFolders);
}

describe('pg driver IAM auth', () => {
  beforeEach(() => {
    poolConstructorCalls.length = 0;
    poolConnectMock.mockReset();
    signAwsIamTokenMock.mockReset();
    validateIamAuthOptionsMock.mockReset();
    poolConnectMock.mockResolvedValue({
      on: jest.fn(),
      query: jest.fn(),
      release: jest.fn(),
    });
  });

  it('installs an async password callback that delegates to signAwsIamToken', async () => {
    signAwsIamTokenMock.mockResolvedValue('fresh-token');

    const driver = makeDriver({
      driver: 'PostgreSQL',
      server: 'db.example.com',
      port: 5432,
      database: 'app',
      username: 'dbuser',
      useAwsIamAuth: true,
      awsIamOptions: { region: 'us-east-1', profile: 'dev' },
      pgOptions: { ssl: { rejectUnauthorized: false } },
    });

    await driver.open();

    expect(validateIamAuthOptionsMock).toHaveBeenCalledTimes(1);
    expect(validateIamAuthOptionsMock).toHaveBeenCalledWith(
      { region: 'us-east-1', profile: 'dev' },
      { ssl: true, hostname: 'db.example.com', port: 5432, username: 'dbuser' },
    );

    expect(poolConstructorCalls).toHaveLength(1);
    const config = poolConstructorCalls[0];
    expect(typeof config.password).toBe('function');

    const token = await (config.password as () => Promise<string>)();
    expect(token).toBe('fresh-token');
    expect(signAwsIamTokenMock).toHaveBeenCalledWith({
      hostname: 'db.example.com',
      port: 5432,
      username: 'dbuser',
      region: 'us-east-1',
      profile: 'dev',
    });
  });

  it('propagates validation errors from validateIamAuthOptions', async () => {
    validateIamAuthOptionsMock.mockImplementationOnce(() => {
      throw new Error('IAM database authentication requires a region in awsIamOptions.');
    });

    const driver = makeDriver({
      driver: 'PostgreSQL',
      server: 'db.example.com',
      port: 5432,
      database: 'app',
      username: 'dbuser',
      useAwsIamAuth: true,
      awsIamOptions: {},
      pgOptions: { ssl: true },
    });

    await expect(driver.open()).rejects.toThrow(/requires a region/);
    expect(poolConstructorCalls).toHaveLength(0);
    expect(signAwsIamTokenMock).not.toHaveBeenCalled();
  });

  it('does not install the IAM callback when useAwsIamAuth is false', async () => {
    const driver = makeDriver({
      driver: 'PostgreSQL',
      server: 'db.example.com',
      port: 5432,
      database: 'app',
      username: 'dbuser',
      password: 'plain-password',
      pgOptions: { ssl: true },
    });

    await driver.open();

    expect(poolConstructorCalls).toHaveLength(1);
    expect(poolConstructorCalls[0].password).toBe('plain-password');
    expect(validateIamAuthOptionsMock).not.toHaveBeenCalled();
    expect(signAwsIamTokenMock).not.toHaveBeenCalled();
  });
});
