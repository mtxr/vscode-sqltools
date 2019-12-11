import { InstallDepRequest } from './contracts';
import packageManager from './lib/cli';
import ConfigManager from '@sqltools/core/config-manager';
import { ISettings, ILanguageServerPlugin, ILanguageServer, RequestHandler } from '@sqltools/types';
import logger from '@sqltools/core/log';

const log = logger.extend('dep-man');

export default class DependencyManager<T extends ILanguageServer<any> = ILanguageServer<any>> implements ILanguageServerPlugin<T> {
  private server: T;

  public static runningJobs: string[] = [];

  private onRequestToInstall: RequestHandler<typeof InstallDepRequest> = async ({ deps = [] }) => {
    const depManagerSettings: ISettings['dependencyManager'] = ConfigManager.dependencyManager || {
      packageManager: 'npm',
      installArgs: ['install'],
      runScriptArgs: ['run'],
      autoAccept: false
    };
    log.extend('debug')(`Dependency manager settings:\n${JSON.stringify(depManagerSettings, null, 2)}`);

    if (deps.length === 0) {
      log.extend('info')(`Nothing to install. Request is invalid.`);
      throw new Error(`Nothing to install. Request is invalid.`);
    }

    const depsId = deps.sort((a, b) => (a.name).localeCompare((b.name))).map(d => (d.name)).join();
    if (DependencyManager.runningJobs.includes(depsId)) {
      return log.extend('info')(`You are already installing deps`);
    }
    DependencyManager.runningJobs.push(depsId);

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
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== depsId);
    } catch (e) {
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== depsId);
      throw e;
    }
  }

  public register(server: T) {
    this.server = this.server || server;

    this.server.addOnInitializeHook(() => {
      return { capabilities: {} };
    });

    this.server.onRequest(InstallDepRequest, this.onRequestToInstall);
  }
}
