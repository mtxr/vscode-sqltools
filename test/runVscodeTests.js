const { runTests } = require('vscode-test');
const { extensionDevelopmentPath, testResultsFile, extensionTestsPath } = require("./utils/constants");
const printResults = require("./utils/printResults");

async function main() {
  // Testing is currently pinned to using 1.77.3 (see https://github.com/microsoft/vscode/issues/152938#issuecomment-1534782052)
  const VSCODE_VERSION = "1.77.3";
  try {
    // Download VS Code, unzip it and run the integration test
    console.log("Start running tests. Will wait til get the results");
    const interval = setInterval(() => process.stderr.write("."), 1000);
    const code = await runTests({ version: VSCODE_VERSION, extensionDevelopmentPath, extensionTestsPath, launchArgs: ['--disable-extensions'] });
    clearInterval(interval);
    const results = require(testResultsFile);

    printResults(results);

    process.exit(code);
  } catch (error) {
    console.error('Failed to run tests', { error });
    process.exit(1);
  }
}

main();
