const NodeEnvironment = require('jest-environment-node');

class VsCodeEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    this.testPath = context.testPath;
  }

  async setup() {
    await super.setup();
    this.global.vscode = require('vscode');
  }

  teardown() {
    this.global.vscode = {};
    return super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = VsCodeEnvironment;
