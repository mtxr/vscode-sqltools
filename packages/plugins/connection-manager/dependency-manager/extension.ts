import { window as Win, window, ProgressLocation, commands } from 'vscode';
import { InstallDepRequest, DependeciesAreBeingInstalledNotification } from './contracts';
import { openExternal } from '@sqltools/vscode/utils';
import { EXT_NAMESPACE, DOCS_ROOT_URL, DISPLAY_NAME } from '@sqltools/util/constants';
import { getConnectionId } from '@sqltools/util/connection';
import Config from '@sqltools/util/config-manager';
import { IExtensionPlugin, ILanguageClient, IExtension, IConnection, NodeDependency, DatabaseDriver } from '@sqltools/types';
import { MissingModuleNotification } from '@sqltools/base-driver/dist/lib/notification';
import { DriverNotInstalledNotification } from '@sqltools/language-server/notifications';

export default class DependencyManager implements IExtensionPlugin {
  public readonly name = 'Dependency Manager Plugin';
  public client: ILanguageClient;
  private extension: IExtension;
  register(extension: IExtension) {
    this.extension = extension;
    this.client = extension.client;
    this.client.onNotification(DriverNotInstalledNotification, this.driverNotInstalled);
    this.client.onNotification(MissingModuleNotification, this.requestToInstall);
    this.client.onNotification(DependeciesAreBeingInstalledNotification, this.jobRunning);
  }

  private installingDrivers: string[] = [];
  private requestToInstall = async ({ conn, action = 'install', deps = [] }: { conn: IConnection; action: 'upgrade' | 'install'; deps: NodeDependency[]}) => {
    if (!conn) return;
    const installNow = action === 'upgrade' ? 'Upgrade now' : 'Install now';
    const readMore = 'Read more';
    const options = [readMore, installNow];
    const dependencyManagerSettings = Config.dependencyManager;
    const autoUpdateOrInstall = dependencyManagerSettings && dependencyManagerSettings.autoAccept;
    const dependenciesName = deps.map((d, i) => `${d.name}@${d.version || 'latest'}${i === deps.length - 2 ? ' and ' : (i === deps.length - 1 ? '' : ', ')}`).join('');
    try {
      const r = autoUpdateOrInstall ? installNow : await Win.showInformationMessage(
        `You need to ${action} "${dependenciesName}" to connect to ${conn.name}.`,
        ...options,
      );
      switch (r) {
        case installNow:
          this.installingDrivers.push(conn.driver);
          await window.withProgress({
            location: ProgressLocation.Notification,
            title: DISPLAY_NAME,
            cancellable: false,
          }, async (progress) => {
            progress.report({ message: `${action === 'upgrade' ? 'upgrading' : 'installing'} ${this.installingDrivers.join(', ')} dependencies` });
            const result = await this.client.sendRequest(InstallDepRequest, { deps });
            return result;
          });
          this.installingDrivers = this.installingDrivers.filter(v => v !== conn.driver);
          const opt = conn.name ? [`Connect to ${conn.name}`] : [];
          const rr = conn.name && autoUpdateOrInstall ? opt[0] : await Win.showInformationMessage(
            `"${dependenciesName}" installed!\n
Go ahead and connect!`,
            ...opt
          );
          if (rr === opt[0]) {
            await commands.executeCommand(`${EXT_NAMESPACE}.selectConnection`, getConnectionId(conn));
          }
          break;
        case readMore:
          openExternal(`${DOCS_ROOT_URL}/driver/${conn.driver ? conn.driver.toLowerCase() : ''}?umd_source=vscode&utm_medium=driver&utm_campaign=dependencies`);
          break;
      }
    } catch (error) {
      this.installingDrivers = this.installingDrivers.filter(v => v !== conn.driver);
      this.extension.errorHandler(`Failed to install dependencies for ${conn.driver}:`, error);
    }
  }

  private driverNotInstalled = async ({ driverName }: { driverName: DatabaseDriver }) => {
    if (!driverName) return;
    const options = ['Search VSCode Marketplace'];
    try {
      const r = await Win.showInformationMessage(
        `Driver ${driverName} is not installed.`,
        ...options,
      );
      if (r === options[0]) {
        await commands.executeCommand('workbench.extensions.search', `@tag:"sqltools-driver" ${driverName}`);
      }
    } catch (error) { }
  }

  private jobRunning = async ({ moduleName, moduleVersion, conn }) =>  {
    return Win.showInformationMessage(`We are installing "${moduleName}@${moduleVersion}" to connect to ${conn.name}. Please wait till it finishes.`);
  }
}