import Dialects from '@sqltools/core/dialect';
import GenericDialect from '@sqltools/core/dialect/generic';
import SQLTools from '@sqltools/core/plugin-api';
import fs from 'fs';
import path from 'path';
import { InstallDepRequest } from './contracts';
import packageManager from './lib/cli';
import ConfigManager from '@sqltools/core/config-manager';
import { Settings } from '@sqltools/core/interface';

export default class DependencyManager implements SQLTools.LanguageServerPlugin {
  private root: string;
  private server: SQLTools.LanguageServerInterface;

  public static runningJobs: string[] = [];

  private onRequestToInstall = async ({ dialect } = { dialect: undefined }) => {
    const depManagerSettings: Settings['dependencyManager'] = ConfigManager.dependencyManager || {
      packageManager: 'npm',
      installArgs: ['install'],
      runScriptArgs: ['run']
    };
    console.log(`Dependency manage settings:\n${JSON.stringify(depManagerSettings, null, 2)}`);
    
    const DialectClass = Dialects[dialect];
    if (
      !DialectClass ||
      !DialectClass.deps ||
      DialectClass.deps.length === 0
    ) {
      throw new Error('Nothing to install. Request is invalid.');
    }

    const deps: typeof GenericDialect['deps'] = DialectClass.deps;

    if (DependencyManager.runningJobs.includes(dialect)) {
      return console.log(`You are already installing deps for ${dialect}`)
    }
    DependencyManager.runningJobs.push(dialect);

    console.log('Received request to install deps:', JSON.stringify(deps));
    const command: string = depManagerSettings.packageManager;
    const options = { cwd: this.root };

    try {
      for (let dep of deps) {
        switch(dep.type) {
          case 'npmscript':
            console.log(`Will run ${dep.name} script`);
            await packageManager(command, depManagerSettings.runScriptArgs.concat([dep.name]), options);
            console.log(`Finished ${dep.name} script`);
            break;
          case 'package':
            console.log(`Will install ${dep.name} package`, dep.args || '');
            const args = [`${dep.name}${dep.version ? `@${dep.version}` : ''}`].concat(dep.args || [])
            await packageManager(command, depManagerSettings.installArgs.concat(args), options);
            console.log(`Finished ${dep.name} script`);
            break;
        }
      }
      console.log('Finished installing deps');
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== dialect);
    } catch (e) {
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== dialect);
      throw e;
    }
  }

  public register(server: SQLTools.LanguageServerInterface) {
    this.server = this.server || server;

    this.server.addOnInitializeHook(({ initializationOptions }) => {
      this.root = initializationOptions.extensionPath || __dirname;
      return { capabilities: {} };
    });

    try {
      fs.mkdirSync(path.join(this.root, 'node_modules'))
    } catch (error) {};

    this.server.onRequest(InstallDepRequest, this.onRequestToInstall);
  }
}
