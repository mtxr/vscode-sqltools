const path = require('path');

const projectRootPath = path.resolve(__dirname, '..', '..');
const testResultsFile = path.resolve(projectRootPath, '.test-results', 'jest.results.json');
const jestConfigFile = path.resolve(projectRootPath, 'jest.config.js');
const extensionDevelopmentPath = path.resolve(projectRootPath, 'packages/extension');
const extensionTestsPath = path.resolve(__dirname, '..', 'vscodeTestRunner');

try {
  require('fs').mkdirSync(path.resolve(projectRootPath, '.test-results'));
} catch (error) {
  /** */
}

module.exports = {
  projectRootPath,
  testResultsFile,
  jestConfigFile,
  extensionDevelopmentPath,
  extensionTestsPath,
};
