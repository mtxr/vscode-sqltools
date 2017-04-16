import { expect } from 'chai';
import { EnvironmentException } from './../../../src/api/exception';

describe('Exceptions: EnvironmentException Tests', () => {
  it(`Should have prop  message like 'Could not retrived env vars'`, () => {
    const exp = new EnvironmentException();
    expect(exp).to.have.property('message').and.to.be.a('string');
    expect(exp).to.be.instanceof(EnvironmentException);
    expect(exp.message).to.be.eql('Could not retrived env vars');
  });

  const expectedMessage = 'Exp message';
  it(`Should have prop  message like '${expectedMessage}'`, () => {
    const exp = new EnvironmentException(expectedMessage);
    expect(exp).to.have.property('message').and.to.be.a('string');
    expect(exp).to.be.instanceof(EnvironmentException);
    expect(exp.message).to.be.eql(expectedMessage);
  });
});
