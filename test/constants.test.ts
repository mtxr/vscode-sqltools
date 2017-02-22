
import * as vscode from 'vscode';
import { expect } from 'chai';
import * as Constants from '../src/constants';

const mustExportProps = ['bufferName', 'version', 'extensionNamespace']

describe("Constants Tests", () => {
  it(`Should export ${mustExportProps.join(', ')}`, () => {
    mustExportProps.forEach(prop => {
      expect(Constants).to.have.property(prop)
    })
  })
})
