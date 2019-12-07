import Drivers from '@sqltools/drivers';
import { InstallDepRequest } from './contracts';
import packageManager from './lib/cli';
import ConfigManager from '@sqltools/core/config-manager';
import { ISettings, ILanguageServerPlugin, ILanguageServer } from '@sqltools/types';
import logger from '@sqltools/core/log';

const log = logger.extend('dep-man');

type AvailableDrivers = keyof typeof Drivers;


export default class DependencyManager implements ILanguageServerPlugin {
  private server: ILanguageServer;

  public static runningJobs: string[] = [];

  private onRequestToInstall = async ({ driver }: { driver?: AvailableDrivers } = { }) => {
    const depManagerSettings: ISettings['dependencyManager'] = ConfigManager.dependencyManager || {
      packageManager: 'npm',
      installArgs: ['install'],
      runScriptArgs: ['run'],
      autoAccept: false
    };
    log.extend('debug')(`Dependency manager settings:\n${JSON.stringify(depManagerSettings, null, 2)}`);

    const DriverClass = Drivers[driver];
    if (
      !DriverClass ||
      !DriverClass.deps ||
      DriverClass.deps.length === 0
    ) {
      log.extend('info')(`Nothing to install for ${driver}. Request is invalid.`);
      throw new Error(`Nothing to install for ${driver}. Request is invalid.`);
    }

    const deps = DriverClass.deps;

    if (DependencyManager.runningJobs.includes(driver)) {
      return log.extend('info')(`You are already installing deps for ${driver}`)
    }
    DependencyManager.runningJobs.push(driver);

    log.extend('debug')('Received request to install deps:', JSON.stringify(deps));
    const command: string = depManagerSettings.packageManager;

    try {
      for (let dep of deps) {
        switch(dep.type) {
          case 'npmscript':
            log.extend('info')(`Will run ${dep.name} script`);
            await packageManager(command, depManagerSettings.runScriptArgs.concat([dep.name]));
            log.extend('info')(`Finished ${dep.name} script`);
            break;
          case 'package':
            log.extend('info')(`Will install ${dep.name} package`, dep.args || '');
            const args = [`${dep.name}${dep.version ? `@${dep.version}` : ''}`].concat(dep.args || [])
            await packageManager(command, depManagerSettings.installArgs.concat(args));
            log.extend('info')(`Finished ${dep.name} script`);
            break;
        }
      }
      log.extend('info')('Finished installing deps');
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== driver);
    } catch (e) {
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== driver);
      throw e;
    }
  }

  public register(server: ILanguageServer) {
    this.server = this.server || server;

    this.server.addOnInitializeHook(() => {
      return { capabilities: {} };
    });

    this.server.onRequest(InstallDepRequest, this.onRequestToInstall);
  }
}
