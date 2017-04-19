// tslint:disable:no-unused-expression
// tslint:disable:no-reference
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="./../../node_modules/@types/node/index.d.ts" />

import { expect } from 'chai';
import * as vscode from 'vscode';
import { Logger } from '../../src/api';

describe('Logger', () => {
  it('should throws error if no writer provided', () => {
    Logger.loggerInstance = null;
    expect(() => Logger.instance()).to.throws(Error);
  });
});
