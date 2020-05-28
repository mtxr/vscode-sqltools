#!/usr/bin/env node

const path = require('path');
const cp = require('child_process');
const fs = require('fs');

const downloadAndUnzipVSCode = require('vscode-test').downloadAndUnzipVSCode;

var testsFolder;
if (process.env.CODE_TESTS_PATH) {
  testsFolder = process.env.CODE_TESTS_PATH;
} else if (fs.existsSync(path.join(process.cwd(), 'out', 'test'))) {
  testsFolder = path.join(process.cwd(), 'out', 'test'); // TS extension
} else {
  testsFolder = path.join(process.cwd(), 'test'); // JS extension
}

var testsWorkspace = process.env.CODE_TESTS_WORKSPACE || testsFolder;
var extensionsFolder = process.env.CODE_EXTENSIONS_PATH || process.cwd();
if (!path.isAbsolute(extensionsFolder)) {
  extensionsFolder = path.resolve(process.cwd(), process.env.CODE_EXTENSIONS_PATH);
}
var locale = process.env.CODE_LOCALE || 'en';
var userDataDir = process.env.CODE_TESTS_DATA_DIR;

console.log('### VS Code Extension Test Run ###');
console.log('');
console.log('Current working directory: ' + process.cwd());

async function runTests(executablePath) {
  const args = [
    testsWorkspace,
    '--extensionDevelopmentPath=' + extensionsFolder,
    '--extensionTestsPath=' + testsFolder,
    '--locale=' + locale,
    `--log=${process.env.LOG_LEVEL || 'debug'}`,
  ];

  if (userDataDir) {
    args.push('--user-data-dir=' + userDataDir);
  }

  if (process.env.CODE_DISABLE_EXTENSIONS) {
    args.push('--disable-extensions');
  }

  console.log('Running extension tests: ' + [executablePath, args.join(' ')].join(' '));

  return new Promise(resolve => {
    const cmd = cp.spawn(executablePath, args);

    cmd.stdout.on('data', function(data) {
      console.log(data.toString().replace(/\n$/, ''));
    });

    cmd.stderr.on('data', function(data) {
      console.error(data.toString());
    });

    cmd.on('error', function(data) {
      console.log('Failed to execute tests: ' + data.toString());
    });

    cmd.on('close', function(code) {
      console.log('Tests exited with code: ' + code);
      return resolve(code);
    });
  });
}

function downloadExecutableAndRunTests() {
  return downloadAndUnzipVSCode(process.env.CODE_VERSION)
    .then(executablePath => runTests(executablePath))
    .then(code => process.exit(code))
    .catch(err => {
      console.error('Failed to run test with error:');
      console.log(err);
      process.exit(1);
    });
}

downloadExecutableAndRunTests();
