// tslint:disable:no-reference
// tslint:disable:no-console

/// <reference path="../node_modules/@types/node/index.d.ts" />

'use strict';

import * as TestRunner from './test-runner';

const testRunner = TestRunner;
const mochaConfig: any = { ui: 'bdd', useColors: true };
let coverageConfig: any;

if (process.argv.indexOf('--coverage') >= 0) {
  coverageConfig = {
    coverageDir: `${__dirname}/../coverage`,
    ignorePatterns: ['**/node_modules/**'],
    sourcePath: `${__dirname}/../src`,
  };
}

testRunner.configure(mochaConfig, coverageConfig);

module.exports = testRunner;
