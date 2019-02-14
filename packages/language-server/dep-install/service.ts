import { SpawnOptions, spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { IConnection } from 'vscode-languageserver';
import { InstallDep } from '@sqltools/core/contracts/connection-requests';
import Dialects from '@sqltools/core/dialect';
import GenericDialect from '@sqltools/core/dialect/generic';

function run(
  command: string,
  args?: ReadonlyArray<string>,
  options: SpawnOptions = {}
): Promise<{ stdout?: string; stderr?: string; code: number }> {
  return new Promise<{ stdout?: string; stderr?: string; code: number }>(
    (resolve, reject) => {
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

const depInstallerModule = './../vscode-sqltools/packages/dep-installer';
const depInstallerVersion = '1.0.0';

interface Options {
  root?: string;
  server?: IConnection;
  vscodeVersion?: string;
}

export class DepInstaller {
  private static instance: DepInstaller;
  private root: string;
  private vscodeVersion: string;
  private mustUpdate = {
    modules: false
  };

  private server: IConnection;

  private get infoFilePath() {
    return path.join(this.root, 'vscodeVersionData.json');
  }
  private getInfo() {
    let currentProps: any = {};
    try {
      currentProps = JSON.parse(fs.readFileSync(this.infoFilePath).toString());
      this.mustUpdate.modules =
        !currentProps.electron ||
        !currentProps.electron.target ||
        currentProps.vscodeVersion !== this.vscodeVersion;
    } catch (error) {
      this.mustUpdate.modules = true;
    }
    return currentProps;
  }
  private updateInfo(props: { [id: string]: number | string | object } = {}) {
    let currentProps = this.getInfo();
    try {
      if (Object.keys(props).length > 0) {
        currentProps = { ...currentProps, ...props };
        fs.writeFileSync(this.infoFilePath, JSON.stringify(currentProps));
      }
    } catch (error) {}
    console.log('Update extension versions info:', JSON.stringify(currentProps));
    return currentProps;
  }

  private onRequestToInstall = async (params) => {
    console.log('Received request to install deps:', JSON.stringify(params));
    const DialectClass = Dialects[params.dialect];
    if (
      !DialectClass ||
      !DialectClass.deps ||
      DialectClass.deps.length === 0
    ) {
      throw new Error('Nothing to install. Request is invalid.');
    }

    await this.checkElectronVersion();
    const modulesToInstall: typeof GenericDialect['deps'] = [];
    DialectClass.deps.forEach((dep) => {
      modulesToInstall.push(dep);
    });
    for (let dep of modulesToInstall) {
      console.log('Will install ', dep.moduleName);
      await this.install(dep.installArgs);

    }
    console.log('Modules to installed:', JSON.stringify(modulesToInstall.map(({ moduleName }) => moduleName)));
  }

  public boot({ server, vscodeVersion, ...options }: Options = {}): DepInstaller {
    Object.keys(options).forEach(k => (this[k] = options[k] ));

    if (vscodeVersion) {
      this.vscodeVersion = vscodeVersion;
      this.updateInfo({ vscodeVersion });
    }

    if (!this.server && server) {
      this.server = this.server || server;
      this.server.onRequest(InstallDep, this.onRequestToInstall);
    }
    return this;
  }

  private async getElectronVersion(useMaster: boolean = false) {
    return new Promise<{
      disturl: string;
      target: string;
      runtime: string;
    }>((resolve, reject) => {
      const vsCodeTag = (useMaster
        ? 'master'
        : this.vscodeVersion || 'master'
      ).replace(/(\d+\.\d+\.\d+).*/, '$1');

      https
        .get(
          `https://raw.githubusercontent.com/Microsoft/vscode/${vsCodeTag}/.yarnrc`,
          res => {
            let data = '';

            res.on('data', chunk => {
              data += chunk.toString();
            });

            res.on('end', () => {
              const result = {
                disturl: undefined,
                target: undefined,
                runtime: undefined
              };
              data.split('\n').forEach((line = '') => {
                const [key = '', value = ''] = line.split(' ');
                result[key] = value.replace(/^"(.+)" *$/, '$1');
              });
              if (!result.target) return reject(new Error('Electron install error: ' + data));
              resolve(result);
            });
          }
        )
        .on('error', reject);
    });
  }

  private async checkElectronVersion() {
    console.log('Checking electron version. Needs to update?', JSON.stringify(this.mustUpdate));
    const { electron = { } } = this.getInfo();
    if (!this.mustUpdate.modules && electron.target) return;

    const { target, disturl, runtime } = await this.getElectronVersion().catch(
      () => this.getElectronVersion(true)
    );

    if (electron.target === target) {
      console.log('Electron version is correct. Keep going. Version:' + target);
      return;
    }

    console.log('New electron version received: ', JSON.stringify({ target, disturl, runtime }));
    this.updateInfo({ electron: { target, disturl, runtime } });
  }

  private async checkSQLToolsDepInstaller() {
    try {
      const { version } = __non_webpack_require__(
        '@sqltools/dep-installer/package.json'
      );
      console.log(`SQLTools Dep Installer version: ${version}`);
      if (version !== depInstallerVersion) throw 'update!';
    } catch (e) {
      await this.installSQLToolsDepInstaller();
    }
    return Promise.resolve();
  }

  private npm(args: ReadonlyArray<string>, options: SpawnOptions = {}) {
    return run('npm', args, { cwd: this.root, shell: true, ...options });
  }

  private async installSQLToolsDepInstaller() {
    await this.npm(['install', depInstallerModule], { stdio: [ process.stdin, process.stdout, process.stderr ] });
    console.log(`SQLTools Dep Installer installed version: ${depInstallerVersion}`);
  }

  get npmVersion() {
    return this.npm(['--version']).then(({ stdout }) =>
      stdout.replace('\n', '')
    );
  }
  constructor(options: Options) {
    if (DepInstaller.instance) {
      DepInstaller.instance.boot(options);
      return this;
    }
    DepInstaller.instance = this.boot(options);
  }

  public async install(args: string | string[]) {
    await this.checkSQLToolsDepInstaller();
    return run('npm', ['install', ...(Array.isArray(args) ? args : [args]) ], { stdio: [ process.stdin, process.stdout, process.stderr ] });
  }
}
