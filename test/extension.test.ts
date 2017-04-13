// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../node_modules/@types/chai/index.d.ts" />

import { expect } from 'chai';
import { commands as VSCode, ExtensionContext } from 'vscode';
import Constants from './../src/constants';
import { ST } from './../src/sqltools-commands';

describe('Check exported commands', () => {
  it('Check all commands was exported', (done) => {
    VSCode.getCommands(true)
      .then((commands) => {
        commands = commands.filter(cmd => cmd.indexOf(Constants.extNamespace) === 0);
        Object.keys(ST.textEditor).forEach(cmd => {
          const index = commands.indexOf(`${Constants.extNamespace}.${cmd}`);
          expect(index >= 0).to.be.true;
          commands.splice(index, 1);
        });
        Object.keys(ST.workspace).forEach(cmd => {
          const index = commands.indexOf(`${Constants.extNamespace}.${cmd}`);
          expect(index >= 0).to.be.true;
          commands.splice(index, 1);
        })
        expect(commands.length).to.be.eql(0);
        done();
      })
  });
});
