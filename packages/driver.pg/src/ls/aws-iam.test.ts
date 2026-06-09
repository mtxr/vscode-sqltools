import { validateIamAuthOptions } from './aws-iam';

describe('pg aws-iam validateIamAuthOptions', () => {
  const pool = { ssl: true, hostname: 'h', port: 5432, username: 'u' };

  it('passes for a fully-formed config', () => {
    expect(() => validateIamAuthOptions({ region: 'us-east-1' }, pool)).not.toThrow();
  });

  it('rejects when region is missing', () => {
    expect(() => validateIamAuthOptions({}, pool)).toThrow(/requires a region/);
  });

  it('rejects when SSL is disabled', () => {
    expect(() => validateIamAuthOptions({ region: 'us-east-1' }, { ...pool, ssl: false }))
      .toThrow(/requires SSL. Enable SSL in the pgOptions/);
  });

  it('rejects when hostname is missing', () => {
    expect(() => validateIamAuthOptions({ region: 'us-east-1' }, { ...pool, hostname: undefined }))
      .toThrow(/host, port and username/);
  });

  it('rejects when port is missing', () => {
    expect(() => validateIamAuthOptions({ region: 'us-east-1' }, { ...pool, port: undefined }))
      .toThrow(/host, port and username/);
  });

  it('rejects when username is missing', () => {
    expect(() => validateIamAuthOptions({ region: 'us-east-1' }, { ...pool, username: undefined }))
      .toThrow(/host, port and username/);
  });
});
