// tslint:disable:no-console
// tslint:disable:no-reference
/// <reference path="./../node_modules/@types/node/index.d.ts" />

'use strict';

import * as fs from 'fs';
import * as TestRunner from './test-runner';

const testRunner = TestRunner;
const mochaConfig: any = { ui: 'bdd', useColors: true, reporter: 'spec', compilers: 'ts:ts-node/register' };
let coverageConfig: any;

if (fs.existsSync(`${__dirname}/../../coverage.enabled`)) {
  fs.unlinkSync(`${__dirname}/../../coverage.enabled`);
  coverageConfig = {
    coverageDir: `../../coverage`,
    ignorePatterns: ['**/node_modules/**'],
    sourcePath: `../src`,
  };
}

testRunner.configure(mochaConfig, coverageConfig);

module.exports = testRunner;
