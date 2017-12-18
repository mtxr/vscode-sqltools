
import { EnvironmentException } from './../../../api/exception';

describe('Exceptions: EnvironmentException Tests', () => {
  it(`Should have prop  message like 'Could not retrived env vars'`, () => {
    const exp = new EnvironmentException();
    expect(exp).toHaveProperty('message');
    expect(typeof exp.message).toBe('string');
    expect(exp).toBeInstanceOf(EnvironmentException);
    expect(exp.message).toBe('Could not retrived env vars');
  });

  const expectedMessage = 'Exp message';
  it(`Should have prop  message like '${expectedMessage}'`, () => {
    const exp = new EnvironmentException(expectedMessage);
    expect(exp).toHaveProperty('message');
    expect(typeof exp.message).toBe('string');
    expect(exp).toBeInstanceOf(EnvironmentException);
    expect(exp.message).toBe(expectedMessage);
  });
});
