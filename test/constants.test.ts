// tslint:disable:no-unused-expression

import { expect } from 'chai';
import * as semver from 'semver';
import * as vscode from 'vscode';
import Constants from '../src/constants';
const mustExportProps = [
  'version',
  'extNamespace',
  'outputChannelName',
  'bufferName',
];

describe('Constants Tests', () => {
  it(`Should have prop ${mustExportProps.join(', ')}`, () => {
    mustExportProps.forEach((prop) => {
      expect(Constants).to.have.property(prop).and.to.be.a('string');
    });
  });
  it('Should have a valid version', () => {
    expect(semver.valid(Constants.version)).to.be.not.null;
    expect(semver.valid(Constants.version)).to.be.a('string');
  });
});
