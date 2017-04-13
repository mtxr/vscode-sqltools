/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

'use strict';

import * as paths from 'path';
import * as glob from 'glob';

// Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
// Since we are not running in a tty environment, we just implementt he method statically
var tty = require('tty');
if (!tty.getWindowSize) {
    tty.getWindowSize = function () { return [80, 75]; };
}

import Mocha = require('mocha');

let mocha = new Mocha(<any>{
    ui: 'bdd',
    useColors: true,
    reporter: 'progress'
});

export function configure(opts: MochaSetupOptions): void {
}

export function run(testsRoot: string, clb: (error, failures?: number) => void): void {

    // Enable source map support
    require('source-map-support').install();

    // Glob test files
    glob('**/**.test.js', { cwd: testsRoot }, (error, files) => {
        if (error) {
            return clb(error);
        }

        try {

            // Fill into Mocha
            files.forEach(f => mocha.addFile(paths.join(testsRoot, f)));

            // Run the tests
            mocha.run((failures) => {
                clb(null, failures);
            });
        } catch (error) {
            return clb(error);
        }
    });
}

// // PLEASE DO NOT MODIFY / DELETE UNLESS YOU KNOW WHAT YOU ARE DOING
// //
// // This file is providing the test runner to use when running extension tests.
// // By default the test runner in use is Mocha based.
// //
// // You can provide your own test runner if you want to override it by exporting
// // a function run(testRoot: string, clb: (error:Error) => void) that the extension
// // host can call to run the tests. The test runner is expected to use console.log
// // to report the results back to the caller. When the tests are finished, return
// // a possible error to the callback or null if none.

// var testRunner = require('vscode/lib/testrunner');

// // You can directly control Mocha options by uncommenting the following lines
// // See https://github.com/mochajs/mocha/wiki/Using-mocha-programmatically#set-options for more info
// testRunner.configure({
//     ui: 'tdd', 		// the TDD UI is being used in extension.test.ts (suite, test, etc.)
//     useColors: true, // colored output from test results,
//     reporter: 'text'
// });

// module.exports = testRunner;
