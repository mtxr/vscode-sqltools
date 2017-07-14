'use strict';

const window = {
  createOutputChannel: jest.fn(() => ({
    appendLine: jest.fn(),
    show: jest.fn(),
  })),
  createStatusBarItem: jest.fn(() => ({
    show: jest.fn(),
  })),
  showErrorMessage: jest.fn(),
};

const workspace = {
  getConfiguration: jest.fn(),
};
const ExtensionContext = {};
export {
  window,
  workspace,
  ExtensionContext,
};
