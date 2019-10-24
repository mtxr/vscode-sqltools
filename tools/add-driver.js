const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

let { name } = require('minimist')(process.argv.slice(2));
if (name && (typeof name !== 'string' || /^\d/.test(`${name}`))) {
  console.error(`Invalid name! Must be a string and can't start with a number`);
  process.exit(1);
}

const applyPatch = async contents => {
  return new Promise((resolve, reject) => {
    const sp = spawn('git', ['apply']);
    const output = {
      stdout: '',
      stderr: '',
      full: '',
    };
    sp.stdout.on('data', data => {
      output.stdout += data.toString();
      output.full += data.toString();
    });
    sp.stderr.on('data', data => {
      output.stderr += data.toString();
      output.full += data.toString();
    });
    sp.stdin.write(contents);
    sp.stdin.end();
    sp.on('exit', code => {
      code === 0 ? resolve({ code, output }) : reject({ code, output });
    });
  });
};

const getDiffContents = async () => {
  // git diff origin/master..origin/add-driver-example
  return new Promise((resolve, reject) => {
    const sp = spawn('git', ['diff', 'origin/master..origin/add-driver-example']);
    const output = {
      stdout: '',
      stderr: '',
      full: '',
    };
    sp.stdout.on('data', data => {
      output.stdout += data.toString();
      output.full += data.toString();
    });
    sp.stderr.on('data', data => {
      output.stderr += data.toString();
      output.full += data.toString();
    });
    sp.stdin.end();
    sp.on('exit', code => {
      code === 0 ? resolve(output.stdout) : reject({ code, output });
    });
  });
}

const camelCase = str => str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index == 0 ? word.toLowerCase() : word.toUpperCase())
    .replace(/\s+/g, '')

const separatorCase = (str, sep) => str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, word => '-' + word.toLowerCase())
    .replace(/\s+/g, '')
    .replace(/^-/, '')

const titleCase = str => str.charAt(0).toUpperCase() + camelCase(str).substring(1)

const replaceName = (name, contents) => {
  const camelCaseName = camelCase(name);
  const titleCaseName = titleCase(name);
  const hyphenCaseName = separatorCase(name, '-');
  const snakeCaseName = separatorCase(name, '_');
  return contents
    .replace(/example-dialect/g, hyphenCaseName)
    .replace(/example_dialect/g, snakeCaseName)
    .replace(/exampleDialect/g, camelCaseName)
    .replace(/ExampleDialect/g, titleCaseName)
    .replace(/example dialect/gi, name);
};

getDiffContents()
  .then(contents => name ? replaceName(name, contents) : contents)
  .then(applyPatch)
  .then(() => {
    console.log('OK!')
  })
  .catch(error => {
    if (error && typeof error.code === 'number' && error.output && error.output.full) {
      console.error(error.output.full)
      return process.exit(error.code)
    }
    console.error(error)
    process.exit(1)
  })
