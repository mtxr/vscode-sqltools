// tslint:disable:no-reference
// tslint:disable:no-console
// tslint:disable:no-var-requires

/// <reference path="../node_modules/@types/node/index.d.ts" />

'use strict';

import * as fs from 'fs';
import * as glob from 'glob';
import istanbul = require('istanbul');
import Mocha = require('mocha');
import * as paths from 'path';
import * as remapIstanbul from 'remap-istanbul';
// import * as SMSupport from 'source-map-support';

const tty = require('tty');

/* tty setup from vscode-mssql */
// Linux: prevent a weird NPE when mocha on Linux requires the window size from the TTY
// Since we are not running in a tty environment, we just implementt he method statically
if (!tty.getWindowSize) {
  tty.getWindowSize = (): number[] => [80, 75];
}

let mocha = new Mocha({ ui: 'bdd' });
let coverOptions;

function mkDir(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

export function configure(mochaOpts, testRunnerOpts): void {
  mocha = new Mocha(mochaOpts);
  coverOptions = testRunnerOpts;
}

export function run(testsRoot, callback): any {
  // SMSupport.install();
  const coverageVariable = '$$cov_' + new Date().getTime() + '$$';

  if (coverOptions) {
    // Set up Code Coverage, hooking require so that instrumented code is returned
    if (!coverOptions.sourcePath) {
      return callback('Error - sourcePath must be defined for code coverage to work');
    }

    const instrumenter = new istanbul.Instrumenter({ coverageVariable });
    const sourceRoot = paths.join(testsRoot, coverOptions.sourcePath);
    // Glob source files
    const srcFiles = glob.sync('**/**.js', {
      cwd: sourceRoot,
      ignore: coverOptions.ignorePatterns,
    });

    // Create a match function - taken from the run-with-cover.js in istanbul.
    // Note: I'm unclear if the matchFn.files assignment is needed a it mostly seems
    // to use the match function with takes file input and returns true if in the map
    const fileMap = {};
    srcFiles.forEach((file) => {
      const fullPath = paths.join(sourceRoot, file);
      fileMap[fullPath] = true;
    });

    const matchFn: any = (file): boolean => {
      return fileMap[file];
    };
    matchFn.files = Object.keys(fileMap);

    // Hook up to the Require function so that when this is called, if any of our source files
    // are required, the instrumented version is pulled in instead. These instrumented versions
    // write to a global coverage variable with hit counts whenever they are accessed
    const transformer = instrumenter.instrumentSync.bind(instrumenter);
    const hookOpts = {
      extensions: ['.js'],
      verbose: true,
    };

    istanbul.hook.hookRequire(matchFn, transformer, hookOpts);

    // initialize the global variable to stop mocha from complaining about leaks
    global[coverageVariable] = {};

  }

  glob('**/**.test.js', {
    cwd: testsRoot,
  }, (error, files): any => {
    if (error) {
      return callback(error);
    }
    try {
      // Fill into Mocha
      files.forEach((f): Mocha => {
        return mocha.addFile(paths.join(testsRoot, f));
      });
      // Run the tests
      let failures = 0;

      mocha.run()
        .on('fail', (test, err): void => {
          console.error(err);
          failures++;
        })
        .on('end', (): void => {
          if (coverOptions) {
            istanbul.hook.unhookRequire();
            let cov: any;
            if (typeof global[coverageVariable] === 'undefined' || Object.keys(global[coverageVariable]).length === 0) {
              console.error('No coverage information was collected, exit without writing coverage information');
              return;
            } else {
              cov = global[coverageVariable];
            }

            // TODO Allow config of reporting directory with
            const reportingDir = paths.join(testsRoot, coverOptions.coverageDir);
            const includePid = true;
            const pidExt = includePid ? ('-' + process.pid) : '';
            const coverageFile = paths.resolve(reportingDir, 'coverage' + pidExt + '.json');

            // yes, do this again since some test runners could clean the dir initially created
            mkDir(reportingDir);

            // if (config.reporting.print() !== 'none') {
            //     console.error('=============================================================================');
            //     console.error('Writing coverage object [' + file + ']');
            // }
            fs.writeFileSync(coverageFile, JSON.stringify(cov), 'utf8');

            // convenience method: do not use this when dealing with a large number of files
            // let collector = new istanbul.Collector();
            // collector.add(cov);

            // let reporter = new istanbul.Reporter(undefined, reportingDir);
            // reporter.addAll(['lcov', 'html', 'json', 'text-summary']);
            // reporter.write(collector, true, () => console.log('Code Coverage written'));

            const remappedHtmlDir = paths.resolve(reportingDir, 'remapped');
            mkDir(remappedHtmlDir);
            remapIstanbul(coverageFile, {
              html: remappedHtmlDir,
              json: paths.resolve(reportingDir, 'coverage.json'),
              lcovonly: paths.resolve(reportingDir, 'lcov.info'),
            }).then(() => {
              // tslint:disable-next-line:no-console
              console.log('remap complete');
            });

            // let remappedCollector: istanbul.Collector = remapIstanbul.remap(cov);
            /* collector now contains the remapped coverage */
            // remapIstanbul.writeReport(remappedCollector, {
            //     'lcovonly': paths.resolve(reportingDir, 'lcov.info'),
            //     'json': paths.resolve(reportingDir, 'coverage.json'),
            //     'html': remappedHtmlDir
            // }).then(function (): void {
            //     /* do something else now */
            //     console.log('Report written OK');
            // });

          }
          callback(undefined, failures);
        });
    } catch (error) {
      return callback(error);
    }
  });
}
