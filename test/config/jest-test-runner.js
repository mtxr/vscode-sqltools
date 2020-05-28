const { runCLI } = require('jest');
const path = require('path');
const sourceMapSupport = require('source-map-support');

const jestConfig = {
  color: true,
  colors: true,
  config: undefined,
  runInBand: true, // Required due to the way the "vscode" module is injected.
  watch: Boolean(process.env.WATCH || false),
  testEnvironment: require.resolve('./jest-vscode-environment.js'),
  // setupTestFrameworkScriptFile: require.resolve('./jest-vscode-framework-setup.js'),
};

async function run(_testRoot, callback) {
  console.log('Wating vscode to load completelly');
  await new Promise(resolve => setTimeout(resolve, 10000));
  console.log("Let's run this tests!");
  const rootDir = path.resolve(_testRoot, '..');
  (jestConfig.rootDir = rootDir),
    (jestConfig.roots = ['<rootDir>']),
    (jestConfig.config = path.join(rootDir, 'jest.config.js')),
    // Enable source map support. This is done in the original Mocha test runner,
    // so do it here. It is not clear if this is having any effect.
    sourceMapSupport.install();

  if (process.env.TESTS_PATH_FILTER) jestConfig.testPathPattern = process.env.TESTS_PATH_FILTER.split(/ *,/);

  // Forward logging from Jest to the Debug Console.
  forwardStdoutStderrStreams();

  try {
    const { results, ...rest } = await runCLI(jestConfig, [rootDir]);
    const failures = collectTestFailureMessages(results);
    const { success } = results;
    if (failures.length > 0) {
      throw new Error('There are some failed tests');
      return;
    }

    if (!success) {
      throw new Error('Test did not succeed.');
    }

    callback(null);
  } catch (e) {
    callback(e);
  }
}

/**
 * Collect failure messages from Jest test results.
 *
 * @param results Jest test results.
 */
function collectTestFailureMessages(results) {
  const failures = results.testResults.reduce((acc, testResult) => {
    if (testResult.failureMessage) acc.push(testResult.failureMessage);
    return acc;
  }, []);

  return failures;
}

/**
 * Forward writes to process.stdout and process.stderr to console.log.
 *
 * For some reason this seems to be required for the Jest output to be streamed
 * to the Debug Console.
 */
function forwardStdoutStderrStreams() {
  const logger = line => {
    console.log(line.replace(/\n$/g, '')); // tslint:disable-line:no-console
    return true;
  };

  process.stdout.write = logger;
  process.stderr.write = logger;
}

module.exports = {
  run,
};
