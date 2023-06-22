'use strict';

const fs: any = jest.genMockFromModule('fs');

let mockFiles: any = {};
function readFileSync(directoryPath) {
  if (!mockFiles.hasOwnProperty(directoryPath)) {
    throw new Error('File not found!');
  }
  return mockFiles[directoryPath];
}

function unlinkSync(directoryPath) {
  if (!mockFiles.hasOwnProperty(directoryPath)) {
    throw new Error('File not found!');
  }
  delete mockFiles[directoryPath];
  mockFiles[directoryPath] = undefined;
}

function existsSync(directoryPath) {
  return !!mockFiles[directoryPath];
}

function writeFileSync(directoryPath, content) {
  mockFiles[directoryPath] = Buffer.from(content);
}

fs.readFileSync = readFileSync;
fs.writeFileSync = writeFileSync;
fs.unlinkSync = unlinkSync;

module.exports = fs;
