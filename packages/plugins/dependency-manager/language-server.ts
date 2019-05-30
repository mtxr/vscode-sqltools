import Dialects from '@sqltools/core/dialect';
import GenericDialect from '@sqltools/core/dialect/generic';
import SQLTools from '@sqltools/core/plugin-api';
import { commandExists } from '@sqltools/core/utils';
import { spawn, SpawnOptions } from 'child_process';
import fs from 'fs';
import path from 'path';
import { InstallDepRequest } from './contracts';

function run(
  command: string,
  args?: ReadonlyArray<string>,
  options: SpawnOptions = {}
): Promise<{ stdout?: string; stderr?: string; code: number }> {
  return new Promise<{ stdout?: string; stderr?: string; code: number }>(
    (resolve, reject) => {
      options.env = {
        ...process.env,
        NODE_VERSION: process.versions.node,
        ...options.env,
      };
      const child = spawn(command, args, { cwd: __dirname, ...options });
      let stderr = '';
      let stdout = '';

      if (!options.stdio) {
        child.stdout.on('data', chunk => {
          stdout += chunk.toString();
        });
        child.stderr.on('data', chunk => {
          stderr += chunk.toString();
        });
      }

      child.on('exit', code => {
        if (code !== 0) {
          return reject({
            code,
            stderr
          });
        }
        return resolve({
          code,
          stdout,
          stderr
        });
      });
    }
  );
}

export default class DependencyManager implements SQLTools.LanguageServerPlugin {
  private root: string;
  private server: SQLTools.LanguageServerInterface;

  public static runningJobs: string[] = [];

  private onRequestToInstall = async ({ dialect } = { dialect: undefined }) => {
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
    try {
      for (let dep of deps) {
        switch(dep.type) {
          case 'npmscript':
            console.log(`Will run ${dep.name} script`);
            await this.runNpmScript(dep.name, { env: dep.env });
            console.log(`Finished ${dep.name} script`);
            break;
          case 'package':
            console.log(`Will install ${dep.name} package`, dep.args || '');
            const args = [`${dep.name}${dep.version ? `@${dep.version}` : ''}`].concat(dep.args || [])
            await this.install(args, { env: dep.env });
            console.log(`Finished ${dep.name} script`);
            break;
        }
      }
      console.log('Finished installing deps');
      DependencyManager.runningJobs = DependencyManager.runningJobs.filter(v => v !== dialect);
    } catch(e) {
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

  private npm(args: ReadonlyArray<string>, options: SpawnOptions = {}) {
    if (!commandExists('npm')) {
      throw new Error('You need to install node@6 or newer and npm first to install dependencies. Install it and restart to continue.');
    }
    return run('npm', args, { cwd: this.root, shell: true, stdio: [ process.stdin, process.stdout, process.stderr ], ...options });
  }

  get npmVersion() {
    return this.npm(['--version']).then(({ stdout }) =>
      stdout.replace('\n', '')
    );
  }

  public async install(args: string | string[], options: SpawnOptions = {}) {
    return this.npm(['install', ...(Array.isArray(args) ? args : [args]) ], options);
  }

  public async runNpmScript(scriptName: string, options: SpawnOptions = {}) {
    return this.npm(['run', scriptName ], options);
  }
}
