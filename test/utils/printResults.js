const getTestResults = require('./getTestResults');
const getResultHeader = require('./getResultHeader');
const { projectRootPath } = require('./constants');

function printResults(results) {
  results.testResults.forEach(testResult => {
    process.stdout.write(getResultHeader(testResult, projectRootPath));
    process.stdout.write('\n');
    process.stdout.write(getTestResults(testResult.testResults));
    process.stdout.write('\n');
    if (testResult.failureMessage) {
      process.stderr.write(testResult.failureMessage);
      process.stdout.write('\n');
    }
  });
}
module.exports = printResults