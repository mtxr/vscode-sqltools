jest.mock('pgpass', () => (_connectionParameters: unknown, callback: (password: string) => void) => {
  callback('from-pgpass');
});

import { Client } from 'pg';

describe('PostgreSQL pgpass authentication', () => {
  it('continues authentication with the password returned by pgpass', () => {
    const client = new Client({
      host: 'db.example.com',
      port: 5432,
      database: 'app',
      user: 'dbuser',
    });
    const continueAuthentication = jest.fn();
    const internalClient = client as any;

    const getPassword = internalClient._getPassword ?? internalClient._checkPgPass;
    getPassword.call(internalClient, continueAuthentication);

    expect(internalClient.password).toBe('from-pgpass');
    expect(internalClient.connectionParameters.password).toBe('from-pgpass');
    expect(continueAuthentication).toHaveBeenCalledTimes(1);
  });
});
