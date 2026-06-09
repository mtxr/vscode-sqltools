import { parseBeforeSaveConnection, parseBeforeEditConnection } from './connection-parser';

const serverPortBase = () => ({
  connectionMethod: 'Server and Port',
  server: 'db.example.com',
  port: 5432,
  database: 'app',
  username: 'dbuser',
});

describe('pg connection-parser', () => {
  describe('parseBeforeSaveConnection', () => {
    it('Ask on connect: sets askForPassword and strips password/awsIamOptions', () => {
      const result = parseBeforeSaveConnection({
        connInfo: {
          ...serverPortBase(),
          usePassword: 'Ask on connect',
          password: 'should-be-removed',
          awsIamOptions: { region: 'us-east-1' },
        },
      });

      expect(result.askForPassword).toBe(true);
      expect(result.password).toBeUndefined();
      expect(result.awsIamOptions).toBeUndefined();
      expect(result.useAwsIamAuth).toBeUndefined();
      expect(result.connectionMethod).toBeUndefined();
      expect(result.usePassword).toBeUndefined();
    });

    it('Use empty password: sets password to empty string and strips askForPassword/awsIamOptions', () => {
      const result = parseBeforeSaveConnection({
        connInfo: {
          ...serverPortBase(),
          usePassword: 'Use empty password',
          askForPassword: true,
          awsIamOptions: { region: 'us-east-1' },
        },
      });

      expect(result.password).toBe('');
      expect(result.askForPassword).toBeUndefined();
      expect(result.awsIamOptions).toBeUndefined();
      expect(result.useAwsIamAuth).toBeUndefined();
    });

    it('Save as plaintext in settings: keeps the password value', () => {
      const result = parseBeforeSaveConnection({
        connInfo: {
          ...serverPortBase(),
          usePassword: 'Save as plaintext in settings',
          password: 'keep-me',
          askForPassword: true,
          awsIamOptions: { region: 'us-east-1' },
        },
      });

      expect(result.password).toBe('keep-me');
      expect(result.askForPassword).toBeUndefined();
      expect(result.awsIamOptions).toBeUndefined();
      expect(result.useAwsIamAuth).toBeUndefined();
    });

    it('IAM database authentication: sets useAwsIamAuth and keeps awsIamOptions', () => {
      const result = parseBeforeSaveConnection({
        connInfo: {
          ...serverPortBase(),
          usePassword: 'IAM database authentication',
          password: 'should-be-removed',
          askForPassword: true,
          awsIamOptions: { region: 'us-east-1', profile: 'dev' },
        },
      });

      expect(result.useAwsIamAuth).toBe(true);
      expect(result.password).toBeUndefined();
      expect(result.askForPassword).toBeUndefined();
      expect(result.awsIamOptions).toEqual({ region: 'us-east-1', profile: 'dev' });
    });

    it('SQLTools Driver Credentials: removes all auth-related owned props', () => {
      const result = parseBeforeSaveConnection({
        connInfo: {
          ...serverPortBase(),
          usePassword: 'SQLTools Driver Credentials',
          password: 'leftover',
          askForPassword: true,
          useAwsIamAuth: true,
          awsIamOptions: { region: 'us-east-1' },
        },
      });

      expect(result.password).toBeUndefined();
      expect(result.askForPassword).toBeUndefined();
      expect(result.useAwsIamAuth).toBeUndefined();
      expect(result.awsIamOptions).toBeUndefined();
    });

    it('Connection String: strips port, askForPassword, and all auth-owned props', () => {
      const result = parseBeforeSaveConnection({
        connInfo: {
          connectionMethod: 'Connection String',
          connectString: 'postgres://user@host/db',
          port: 5432,
          usePassword: 'IAM database authentication',
          awsIamOptions: { region: 'us-east-1' },
          password: 'x',
          askForPassword: true,
        },
      });

      expect(result.connectString).toBe('postgres://user@host/db');
      expect(result.port).toBeUndefined();
      expect(result.askForPassword).toBeUndefined();
      expect(result.awsIamOptions).toBeUndefined();
      expect(result.useAwsIamAuth).toBeUndefined();
    });

    describe('pgOptions SSL handling', () => {
      it('normalizes enableSsl=Enabled with empty ssl object to ssl=true', () => {
        const result = parseBeforeSaveConnection({
          connInfo: {
            ...serverPortBase(),
            usePassword: 'Save as plaintext in settings',
            password: 'p',
            pgOptions: { enableSsl: 'Enabled', ssl: {} },
          },
        });
        expect(result.pgOptions).toEqual({ ssl: true });
      });

      it('normalizes enableSsl=Disabled by dropping ssl', () => {
        const result = parseBeforeSaveConnection({
          connInfo: {
            ...serverPortBase(),
            usePassword: 'Save as plaintext in settings',
            password: 'p',
            pgOptions: { enableSsl: 'Disabled', ssl: { rejectUnauthorized: false } },
          },
        });
        expect(result.pgOptions).toBeUndefined(); // no keys left → removed
      });

      it('keeps a populated ssl object when enableSsl=Enabled', () => {
        const result = parseBeforeSaveConnection({
          connInfo: {
            ...serverPortBase(),
            usePassword: 'Save as plaintext in settings',
            password: 'p',
            pgOptions: { enableSsl: 'Enabled', ssl: { rejectUnauthorized: false } },
          },
        });
        expect(result.pgOptions).toEqual({ ssl: { rejectUnauthorized: false } });
      });
    });
  });

  describe('parseBeforeEditConnection', () => {
    it('askForPassword=true is exposed as Ask on connect', () => {
      const result = parseBeforeEditConnection({
        connInfo: { ...serverPortBase(), askForPassword: true },
      });
      expect(result.usePassword).toBe('Ask on connect');
      expect(result.password).toBeUndefined();
    });

    it('empty password is exposed as Use empty password', () => {
      const result = parseBeforeEditConnection({
        connInfo: { ...serverPortBase(), password: '' },
      });
      expect(result.usePassword).toBe('Use empty password');
      expect(result.askForPassword).toBeUndefined();
    });

    it('non-empty password is exposed as Save as plaintext in settings', () => {
      const result = parseBeforeEditConnection({
        connInfo: { ...serverPortBase(), password: 'secret' },
      });
      expect(result.usePassword).toBe('Save as plaintext in settings');
      expect(result.password).toBe('secret');
      expect(result.askForPassword).toBeUndefined();
    });

    it('useAwsIamAuth=true is exposed as IAM database authentication', () => {
      const result = parseBeforeEditConnection({
        connInfo: {
          ...serverPortBase(),
          useAwsIamAuth: true,
          awsIamOptions: { region: 'us-east-1' },
        },
      });
      expect(result.usePassword).toBe('IAM database authentication');
      expect(result.awsIamOptions).toEqual({ region: 'us-east-1' });
      expect(result.password).toBeUndefined();
      expect(result.askForPassword).toBeUndefined();
    });

    it('no auth fields defaults to SQLTools Driver Credentials', () => {
      const result = parseBeforeEditConnection({
        connInfo: { ...serverPortBase() },
      });
      expect(result.usePassword).toBe('SQLTools Driver Credentials');
    });

    it('detects Connection String method', () => {
      const result = parseBeforeEditConnection({
        connInfo: { connectString: 'postgres://user@host/db' },
      });
      expect(result.connectionMethod).toBe('Connection String');
    });

    it('detects Socket File method', () => {
      const result = parseBeforeEditConnection({
        connInfo: { socketPath: '/tmp/.s.PGSQL.5432', database: 'app', username: 'u' },
      });
      expect(result.connectionMethod).toBe('Socket File');
    });

    it('populates enableSsl=Enabled for boolean ssl=true', () => {
      const result = parseBeforeEditConnection({
        connInfo: { ...serverPortBase(), pgOptions: { ssl: true } },
      });
      expect(result.pgOptions.enableSsl).toBe('Enabled');
      expect(result.pgOptions.ssl).toEqual({});
    });

    it('populates enableSsl=Disabled when ssl is absent', () => {
      const result = parseBeforeEditConnection({
        connInfo: { ...serverPortBase() },
      });
      expect(result.pgOptions.enableSsl).toBe('Disabled');
    });

    it('round-trips save → edit → save for an IAM connection', () => {
      const original = {
        ...serverPortBase(),
        usePassword: 'IAM database authentication',
        awsIamOptions: { region: 'us-east-1', profile: 'dev' },
      };

      const saved = parseBeforeSaveConnection({ connInfo: { ...original } });
      const editForm = parseBeforeEditConnection({ connInfo: { ...saved } });
      const resaved = parseBeforeSaveConnection({ connInfo: { ...editForm } });

      expect(resaved).toEqual(saved);
      expect(resaved.useAwsIamAuth).toBe(true);
      expect(resaved.awsIamOptions).toEqual({ region: 'us-east-1', profile: 'dev' });
    });

    it('round-trips save → edit → save for a plaintext password connection', () => {
      const original = {
        ...serverPortBase(),
        usePassword: 'Save as plaintext in settings',
        password: 'secret',
      };

      const saved = parseBeforeSaveConnection({ connInfo: { ...original } });
      const editForm = parseBeforeEditConnection({ connInfo: { ...saved } });
      const resaved = parseBeforeSaveConnection({ connInfo: { ...editForm } });

      expect(resaved).toEqual(saved);
      expect(resaved.password).toBe('secret');
    });
  });
});
