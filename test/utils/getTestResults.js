const chalk = require('chalk');
const { specialChars } = require('jest-util');
const { ICONS } = specialChars;

const getTestResults = testResults => {
  const testSuites = groupTestsBySuites(testResults);

  return getLogSuite(testSuites, 0);
};

const groupTestsBySuites = testResults => {
  const output = { suites: [], tests: [], title: '' };
  testResults.forEach(testResult => {
    let targetSuite = output;

    // Find the target suite for this test,
    // creating nested suites as necessary.
    for (const title of testResult.ancestorTitles) {
      let matchingSuite = targetSuite.suites.find(s => s.title === title);
      if (!matchingSuite) {
        matchingSuite = { suites: [], tests: [], title };
        targetSuite.suites.push(matchingSuite);
      }
      targetSuite = matchingSuite;
    }

    targetSuite.tests.push(testResult);
  });

  return output;
};

const getLogSuite = (suite, indentLevel) => {
  let output = '';

  if (suite.title) {
    output += getLine(suite.title, indentLevel);
  }

  output += logTests(suite.tests, indentLevel + 1);

  suite.suites.forEach(suite => (output += getLogSuite(suite, indentLevel + 1)));

  return output;
};

const getLine = (str, indentLevel) => {
  const indentation = '  '.repeat(indentLevel || 0);

  return `${indentation}${str || ''}\n`;
};

const logTests = (tests, indentLevel) => {
  let output = '';
  tests.forEach(test => (output += logTest(test, indentLevel)));

  return output;
};

const logTest = (test, indentLevel) => {
  const status = getIcon(test.status);
  const time = test.duration ? ` (${test.duration.toFixed(0)}ms)` : '';
  const testStatus = `${status} ${chalk.dim(test.title + time)}`;

  return getLine(testStatus, indentLevel);
};

const getIcon = status => {
  switch (status) {
    case 'failed':
      return chalk.red(ICONS.failed);
    case 'pending':
      return chalk.yellow(ICONS.pending);
    case 'todo':
      return chalk.magenta(ICONS.todo);
    default:
      return chalk.green(ICONS.success);
  }
};

module.exports = getTestResults;
