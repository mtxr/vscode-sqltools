/// <reference path="./../node_modules/@types/node/index.d.ts" />
/// <reference path="./../node_modules/@types/jest/index.d.ts" />

'use strict';
import * as fs from 'fs';
import * as jest from 'jest-cli';

// const testRunner = jest.TestRunner;
// const mochaConfig: any = { ui: 'bdd', useColors: true, reporter: 'spec', compilers: 'ts:ts-node/register' };
// let coverageConfig: any;

// if (fs.existsSync(`${__dirname}/../../coverage.enabled`)) {
//   fs.unlinkSync(`${__dirname}/../../coverage.enabled`);
//   coverageConfig = {
//     coverageDir: `../../coverage`,
//     ignorePatterns: ['**/node_modules/**'],
//     sourcePath: `../src`,
//   };
// }

// testRunner.configure(mochaConfig, coverageConfig);

module.exports = {
  configure: () => {
    //
  },
  run: (testsRoot, clb) => {
    jest.runCLI({}, __dirname, clb);
  },
};
