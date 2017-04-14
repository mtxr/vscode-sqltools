// tslint:disable:no-console
// tslint:disable:no-var-requires

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

let mocha: any = new Mocha({
  reporter: 'spec',
  ui: 'bdd',
});
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

export function run(testsRoot, clb): any {
  // Enable source map support
  require('source-map-support').install();

  // Read configuration for the coverage file
  if (coverOptions) {
    // Setup coverage pre-test, including post-test hook to report
    const coverageRunner = new CoverageRunner(coverOptions, testsRoot, clb);
    coverageRunner.setupCoverage();
  }

  // Glob test files
  glob('**/**.test.js', { cwd: testsRoot }, (error, files): any => {
    if (error) {
      return clb(error);
    }
    try {
      // Fill into Mocha
      files.forEach((f): Mocha => {
        return mocha.addFile(paths.join(testsRoot, f));
      });
      // Run the tests
      let failureCount = 0;

      mocha.run()
        .on('fail', (test, err): void => {
          failureCount++;
        })
        .on('end', (): void => {
          clb(undefined, failureCount);
        });
    } catch (error) {
      return clb(error);
    }
  });
}
exports.run = run;

interface ITestRunnerOptions {
  enabled?: boolean;
  coverageDir: string;
  sourcePath: string;
  ignorePatterns: string[];
  verbose?: boolean;
}

class CoverageRunner {

  private coverageVar: string = '$$cov_' + new Date().getTime() + '$$';
  private transformer: any = undefined;
  private matchFn: any = undefined;
  private instrumenter: any = undefined;

  constructor(private options: ITestRunnerOptions, private testsRoot: string, private endRunCallback: any) {
    if (!options.sourcePath) {
      return endRunCallback('Error - sourcePath must be defined for code coverage to work');
    }

  }

  public setupCoverage(): void {
    // Set up Code Coverage, hooking require so that instrumented code is returned
    const self = this;
    self.instrumenter = new istanbul.Instrumenter({ coverageVariable: self.coverageVar });
    const sourceRoot = paths.join(self.testsRoot, self.options.sourcePath);

    // Glob source files
    const srcFiles = glob.sync('**/**.js', {
      cwd: sourceRoot,
      ignore: self.options.ignorePatterns,
    });

    // Create a match function - taken from the run-with-cover.js in istanbul.
    const decache = require('decache');
    const fileMap = {};
    srcFiles.forEach((file) => {
      const fullPath = paths.join(sourceRoot, file);
      fileMap[fullPath] = true;

      // On Windows, extension is loaded pre-test hooks and this mean we lose
      // our chance to hook the Require call. In order to instrument the code
      // we have to decache the JS file so on next load it gets instrumented.
      // This doesn't impact tests, but is a concern if we had some integration
      // tests that relied on VSCode accessing our module since there could be
      // some shared global state that we lose.
      decache(fullPath);
    });

    self.matchFn = (file): boolean => fileMap[file];
    self.matchFn.files = Object.keys(fileMap);

    // Hook up to the Require function so that when this is called, if any of our source files
    // are required, the instrumented version is pulled in instead. These instrumented versions
    // write to a global coverage variable with hit counts whenever they are accessed
    self.transformer = self.instrumenter.instrumentSync.bind(self.instrumenter);
    const hookOpts = { verbose: false, extensions: ['.js'] };
    istanbul.hook.hookRequire(self.matchFn, self.transformer, hookOpts);

    // initialize the global variable to stop mocha from complaining about leaks
    global[self.coverageVar] = {};

    // Hook the process exit event to handle reporting
    // Only report coverage if the process is exiting successfully
    process.on('exit', (code) => {
      self.reportCoverage();
    });
  }

  /**
   * Writes a coverage report. Note that as this is called in the process exit callback, all calls must be synchronous.
   *
   * @returns {void}
   *
   * @memberOf CoverageRunner
   */
  public reportCoverage(): void {
    istanbul.hook.unhookRequire();
    let cov: any;
    if (typeof global[this.coverageVar] === 'undefined' || Object.keys(global[this.coverageVar]).length === 0) {
      console.error('No coverage information was collected, exit without writing coverage information');
      return;
    } else {
      cov = global[this.coverageVar];
    }

    // TODO consider putting this under a conditional flag
    // Files that are not touched by code ran by the test runner is manually instrumented, to
    // illustrate the missing coverage.
    this.matchFn.files.forEach((file) => {
      if (!cov[file]) {
        this.transformer(fs.readFileSync(file, 'utf-8'), file);

        // When instrumenting the code, istanbul will give each FunctionDeclaration a value of 1 in coverState.s,
        // presumably to compensate for function hoisting. We need to reset this, as the function was not hoisted,
        // as it was never loaded.
        Object.keys(this.instrumenter.coverState.s).forEach((key) => {
          this.instrumenter.coverState.s[key] = 0;
        });

        cov[file] = this.instrumenter.coverState;
      }
    });

    // TODO Allow config of reporting directory with
    const reportingDir = paths.join(this.testsRoot, this.options.coverageDir);
    const includePid = true;
    const pidExt = includePid ? ('-' + process.pid) : '';
    const coverageFile = paths.resolve(reportingDir, 'coverage' + pidExt + '.json');

    mkDir(reportingDir); // yes, do this again since some test runners could clean the dir initially created

    fs.writeFileSync(coverageFile, JSON.stringify(cov), 'utf8');

    const remappedCollector = remapIstanbul.remap(cov, {
      warn: (warning) => {
        // We expect some warnings as any JS file without a typescript mapping will cause this.
        // By default, we'll skip printing these to the console as it clutters it up
        if (this.options.verbose) {
          console.warn(warning);
        }
      },
    });

    const reporter = new istanbul.Reporter(undefined, reportingDir);
    reporter.addAll(['lcov', 'html']);
    reporter.write(remappedCollector, true, () => {
      console.log(`Reports written to ${reportingDir}`);
      console.log(`Report index: ${reportingDir}/index.html`);
    });
  }
}
