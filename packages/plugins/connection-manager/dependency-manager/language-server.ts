import { InstallDepRequest } from './contracts';
import packageManager from './lib/cli';
import ConfigRO from '@sqltools/util/config-manager';
import { ISettings, ILanguageServerPlugin, ILanguageServer, RequestHandler } from '@sqltools/types';
import { createLogger } from '@sqltools/log/src';

const log = createLogger('dep-man');

export default class DependencyManager<T extends ILanguageServer = ILanguageServer> implements ILanguageServerPlugin<T> {
  private server: T;

  public static runningJobs: string[] = [];

  private onRequestToInstall: RequestHandler<typeof InstallDepRequest> = async ({ deps = [] }) => {
    const depManagerSettings: ISettings['dependencyManager'] = ConfigRO.dependencyManager || {
      packageManager: 'npm',
      installArgs: ['install'],
      runScriptArgs: ['run'],
      autoAccept: false
    };
    log.debug(`Dependency manager settings:\n${JSON.stringify(depManagerSettings, null, 2)}`);

    if (deps.length === 0) {
      log.info(`Nothing to install. Request is invalid.`);
      throw new Error(`Nothing to install. Request is invalid.`);
    }

    const depsId = deps.sort((a, b) => (a.name).localeCompare((b.name))).map(d => (d.name)).join();
    if (DependencyManager.runningJobs.includes(depsId)) {
      return log.info(`You are already installing deps`);
    }
    DependencyManager.runningJobs.push(depsId);

    log.debug('Received request to install deps:', JSON.stringify(deps));
    const command: string = depManagerSettings.packageManager;

    try {
      for (let dep of deps) {
        switch(dep.type) {
          case 'npmscript':
            log.info(`Will run ${dep.name} script`);
            await packageManager(command, depManagerSettings.runScriptArgs.concat([dep.name]));
            log.info(`Finished ${dep.name} script`);
            break;
          case 'package':
            log.info(`Will install ${dep.name} package`, dep.args || '');
            const args = [`${dep.name}${dep.version ? `@${dep.version}` : ''}`].concat(dep.args || [])
            await packageManager(command, depManagerSettings.installArgs.concat(args));
            log.info(`Finished ${dep.name} script`);
            break;
        }
      }
      log.info('Finished installing deps');
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
