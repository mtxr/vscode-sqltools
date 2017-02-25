import * as vscode from 'vscode';
import { expect } from 'chai';
import * as semver from 'semver';
import * as Constants from '../src/constants';
const mustExportProps = ['bufferName', 'version', 'extensionNamespace']

describe("Constants Tests", () => {
  it(`Should export ${mustExportProps.join(', ')}`, () => {
    mustExportProps.forEach(prop => {
      expect(Constants).to.have.property(prop).and.to.be.a('string');
    });
  });
  it('Should export valid version', () => {
    expect(semver.valid(Constants.version)).to.be.not.null;
    expect(semver.valid(Constants.version)).to.be.a('string');
  });
})
