/// <reference path="./../../node_modules/@types/jest/index.d.ts" />

import Constants from '../constants';
const mustExportProps = [
  'version',
  'extNamespace',
  'outputChannelName',
  'bufferName',
];

describe('Constants Tests', () => {
  it(`Should have prop ${mustExportProps.join(', ')}`, () => {
    const oldHome = process.env.HOME;
    process.env.HOME = '/fakehome';
    mustExportProps.forEach((prop) => {
      expect(Constants).toHaveProperty(prop);
      expect(typeof Constants[prop]).toBe('string');
    });
    process.env.HOME = oldHome;
  });
  it('Should have a valid version', () => {
    expect(Constants.version).not.toBe(true);
    expect(Constants.version).toMatch(/v(\d+\.?){3}/);
  });
});
