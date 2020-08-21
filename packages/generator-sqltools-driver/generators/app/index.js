'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the badass ${chalk.red('sqltools-driver')} generator!`)
    );

    const prompts = [
      {
        type: 'string',
        name: 'displayName',
        message: 'What\'s your driver display name?',
        default: 'My Cool Driver'
      },
      {
        type: 'string',
        name: 'name',
        message: 'What\'s your driver name identifier (allowed alphanum and hiphen)?',
        default: 'my-cool-driver'
      },
      {
        type: 'string',
        name: 'description',
        message: 'What\'s your driver description?',
        default: 'My Cool Driver for SQLTools'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(this.templatePath('driver-ts/vscode'), this.destinationPath(this.props.name + '/.vscode'));
    this.fs.copy(this.templatePath('driver-ts/icons'), this.destinationPath(this.props.name + '/icons'));
    this.fs.copy(this.templatePath('driver-ts/babelrc.js'), this.destinationPath(this.props.name + '/.babelrc.js'));
    this.fs.copy(this.templatePath('driver-ts/vscodeignore'), this.destinationPath(this.props.name + '/.vscodeignore'));
    this.fs.copy(this.templatePath('driver-ts/gitignore'), this.destinationPath(this.props.name + '/.gitignore'));
    this.fs.copy(this.templatePath('driver-ts/connection.schema.json'), this.destinationPath(this.props.name + '/connection.schema.json'));
    this.fs.copy(this.templatePath('driver-ts/ui.schema.json'), this.destinationPath(this.props.name + '/ui.schema.json'));
    this.fs.copy(this.templatePath('driver-ts/tsconfig.json'), this.destinationPath(this.props.name + '/tsconfig.json'));

    this.fs.copyTpl(this.templatePath('driver-ts/package.json.sample'), this.destinationPath(this.props.name + '/package.json'), this.props);
    this.fs.copyTpl(this.templatePath('driver-ts/README.md'), this.destinationPath(this.props.name + '/README.md'), this.props);

    this.fs.copyTpl(this.templatePath('driver-ts/src/extension.ts'), this.destinationPath(this.props.name + '/src/extension.ts'), this.props);
    this.fs.copyTpl(this.templatePath('driver-ts/src/constants.ts'), this.destinationPath(this.props.name + '/src/constants.ts'), this.props);
    this.fs.copyTpl(this.templatePath('driver-ts/src/ls/driver.ts'), this.destinationPath(this.props.name + '/src/ls/driver.ts'), this.props);
    this.fs.copyTpl(this.templatePath('driver-ts/src/ls/plugin.ts'), this.destinationPath(this.props.name + '/src/ls/plugin.ts'), this.props);
    this.fs.copyTpl(this.templatePath('driver-ts/src/ls/queries.ts'), this.destinationPath(this.props.name + '/src/ls/queries.ts'), this.props);
  }

  install() {
    process.chdir(this.props.name);
    this.npmInstall();
  }
};
