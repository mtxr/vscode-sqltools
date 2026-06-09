import Ajv from 'ajv';
import * as path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const schema = require(path.join(__dirname, '..', 'connection.schema.json'));

describe('pg connection schema', () => {
  const ajv = new Ajv({ allErrors: true });
  const validate = ajv.compile(schema);

  const check = (conn: Record<string, unknown>) => {
    const ok = validate(conn);
    return { ok, errors: validate.errors };
  };

  describe('connection method', () => {
    it('requires connectionMethod', () => {
      expect(check({}).ok).toBe(false);
    });

    it('Server and Port requires server, port, database, username', () => {
      expect(check({
        connectionMethod: 'Server and Port',
        server: 'db',
        port: 5432,
        database: 'app',
        username: 'u',
      }).ok).toBe(true);
    });

    it('Server and Port rejects missing port', () => {
      expect(check({
        connectionMethod: 'Server and Port',
        server: 'db',
        database: 'app',
        username: 'u',
      }).ok).toBe(false);
    });

    it('Socket File requires socketPath, database, username', () => {
      expect(check({
        connectionMethod: 'Socket File',
        socketPath: '/tmp/.s.PGSQL.5432',
        database: 'app',
        username: 'u',
      }).ok).toBe(true);
    });

    it('Socket File rejects missing socketPath', () => {
      expect(check({
        connectionMethod: 'Socket File',
        database: 'app',
        username: 'u',
      }).ok).toBe(false);
    });

    it('Connection String requires connectString', () => {
      expect(check({
        connectionMethod: 'Connection String',
        connectString: 'postgres://u@h/d',
      }).ok).toBe(true);
    });

    it('Connection String rejects missing connectString', () => {
      expect(check({
        connectionMethod: 'Connection String',
      }).ok).toBe(false);
    });
  });

  describe('usePassword', () => {
    const baseConn = {
      connectionMethod: 'Server and Port',
      server: 'db',
      port: 5432,
      database: 'app',
      username: 'u',
    };

    it('allows Ask on connect', () => {
      expect(check({ ...baseConn, usePassword: 'Ask on connect' }).ok).toBe(true);
    });

    it('allows Use empty password', () => {
      expect(check({ ...baseConn, usePassword: 'Use empty password' }).ok).toBe(true);
    });

    it('allows SQLTools Driver Credentials', () => {
      expect(check({ ...baseConn, usePassword: 'SQLTools Driver Credentials' }).ok).toBe(true);
    });

    it('Save as plaintext in settings requires password', () => {
      expect(check({
        ...baseConn,
        usePassword: 'Save as plaintext in settings',
        password: 'secret',
      }).ok).toBe(true);
      expect(check({
        ...baseConn,
        usePassword: 'Save as plaintext in settings',
      }).ok).toBe(false);
    });

    it('rejects unknown usePassword values', () => {
      expect(check({ ...baseConn, usePassword: 'Wat' }).ok).toBe(false);
    });

    describe('IAM database authentication', () => {
      it('accepts a valid IAM connection', () => {
        expect(check({
          ...baseConn,
          usePassword: 'IAM database authentication',
          awsIamOptions: { region: 'us-east-1' },
        }).ok).toBe(true);
      });

      it('accepts a valid IAM connection with profile', () => {
        expect(check({
          ...baseConn,
          usePassword: 'IAM database authentication',
          awsIamOptions: { region: 'us-east-1', profile: 'dev' },
        }).ok).toBe(true);
      });

      it('rejects IAM missing awsIamOptions.region', () => {
        expect(check({
          ...baseConn,
          usePassword: 'IAM database authentication',
          awsIamOptions: {},
        }).ok).toBe(false);
      });

      it('rejects IAM missing awsIamOptions entirely', () => {
        expect(check({
          ...baseConn,
          usePassword: 'IAM database authentication',
        }).ok).toBe(false);
      });
    });

    it('IAM database authentication is in the usePassword enum', () => {
      expect(schema.definitions.usePassword.enum).toContain('IAM database authentication');
    });
  });

  describe('ssh', () => {
    const baseConn = {
      connectionMethod: 'Server and Port',
      server: 'db',
      port: 5432,
      database: 'app',
      username: 'u',
    };

    it('ssh=Enabled requires sshOptions', () => {
      expect(check({ ...baseConn, ssh: 'Enabled' }).ok).toBe(false);
    });

    it('ssh=Enabled with sshOptions host+username is valid', () => {
      expect(check({
        ...baseConn,
        ssh: 'Enabled',
        sshOptions: { host: 'bastion.example.com', username: 'ec2-user' },
      }).ok).toBe(true);
    });

    it('ssh=Enabled with sshOptions missing host is rejected', () => {
      expect(check({
        ...baseConn,
        ssh: 'Enabled',
        sshOptions: { username: 'ec2-user' },
      }).ok).toBe(false);
    });

    it('ssh=Disabled is valid', () => {
      expect(check({ ...baseConn, ssh: 'Disabled' }).ok).toBe(true);
    });
  });
});
