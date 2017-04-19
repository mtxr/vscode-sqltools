// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="./../node_modules/@types/mocha/index.d.ts" />
/// <reference path="./../node_modules/@types/chai/index.d.ts" />
/// <reference path="./../node_modules/@types/node/index.d.ts" />

import { expect } from 'chai';
import { calledOnce, spy, stub } from 'sinon';
import * as vscode from 'vscode';
import LogWriter from './../src/log-writer';

describe('Log writer', () => {
  it('should log messages using various methods', () => {
    const message = 'Message!';
    const expectedData = {success: true, message: 'teste'};
    const output = new LogWriter();
    const s = stub(output, 'writeLog', (msg: string, ...data: any[]) => {
      expect(msg).to.be.match(/[A-Z]+\: Message!/);
      if (data.length > 0) {
        expect(data).to.be.eqls([expectedData]);
      }
    });
    output.debug(message);
    output.error(message);
    output.info(message);
    output.warn(message);
    output.debug(message, expectedData);
    output.error(message, expectedData);
    output.info(message, expectedData);
    output.warn(message, expectedData);
    s.restore();
  });

  it('should be able to call show()', () => {
    const message = 'Message!';
    const expectedData = { success: true, message: 'teste' };
    const output = new LogWriter();
    const outputChannel = output.getOutputChannel();
    const s = spy(outputChannel, 'show');
    output.showOutput();
    expect(s.calledOnce).to.be.true;
    s.restore();
  });

  it('should call appendLine()', () => {
    const message = 'Message!';
    const expectedData = { success: true, message: 'teste' };
    const output = new LogWriter();
    const outputChannel = output.getOutputChannel();
    const s = spy(outputChannel, 'appendLine');
    output.debug(message, {});
    expect(s.calledTwice).to.be.true;
    s.restore();
  });
});
