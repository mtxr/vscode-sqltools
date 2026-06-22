const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');

function run() {
  const mocha = new Mocha({
    color: true,
    timeout: 60000,
    ui: 'tdd',
  });

  const testsRoot = __dirname;
  fs.readdirSync(testsRoot)
    .filter(file => file.endsWith('.test.js'))
    .forEach(file => mocha.addFile(path.join(testsRoot, file)));

  return new Promise((resolve, reject) => {
    mocha.run(failures => {
      if (failures > 0) {
        reject(new Error(`${failures} E2E test failure${failures === 1 ? '' : 's'}`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = {
  run,
};
