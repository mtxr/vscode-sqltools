// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import { expect } from 'chai';
import { stub } from 'sinon';
import * as vscode from 'vscode';
import { Logger } from '../../src/api';
import LogWriter from './../../src/log-writer';

describe.only('Logger', () => {
  it('should throws error if no writer provided', () => {
    expect(() => new Logger()).to.throws(Error);
  });

  it('should create logger with success', () => {
    const output = new LogWriter();
    expect(new Logger(output)).to.be.instanceof(Logger);
  });

  it('should return if is logging', () => {
    const output = new LogWriter();
    const logger = new Logger(output);
    expect(logger.isLogging()).to.be.false;
    logger.setLogging(true);
    expect(logger.isLogging()).to.be.true;
    logger.setLogging(false);
    expect(logger.isLogging()).to.be.false;
  });

  it('should log messages using various methods', () => {
    const expected = 'Message!';
    const output = new LogWriter();
    const s = stub(output, 'writeLog', (message: string, ...data: any[]) => {
      expect(message).to.be.eqls(expected);
    });
    const logger = new Logger(output);
    logger.debug(expected);
    logger.error(expected);
    logger.info(expected);
    logger.warn(expected);
    s.restore();
  });
});
