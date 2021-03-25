const jest = require('jest');

const { projectRootPath, testResultsFile, jestConfigFile } = require('./utils/constants');

async function run() {
  const config = require(jestConfigFile);

  const { results } = await jest.runCLI(config, [projectRootPath]);

  require('fs').writeFileSync(testResultsFile, JSON.stringify(results, null, 2));

  if (!results.success || results.numFailedTestSuites || results.numFailedTests) {
    throw new Error('There are some failed tests');
  }
  return results;
}

exports.run = run;
