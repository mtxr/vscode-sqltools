import { window as Win, workspace, ConfigurationTarget, window, ProgressLocation, commands } from 'vscode';
import { InstallDepRequest, MissingModuleNotification, ElectronNotSupportedNotification, DependeciesAreBeingInstalledNotification } from '@sqltools/plugins/dependency-manager/contracts';
import { openExternal } from '@sqltools/vscode/utils';
import { EXT_NAME, DOCS_ROOT_URL } from '@sqltools/core/constants';
import { getConnectionId } from '@sqltools/core/utils';
import ConfigManager from '@sqltools/core/config-manager';
import { IExtensionPlugin, ILanguageClient, IExtension, IConnection } from '@sqltools/types';
import { NodeDependency } from './interfaces';

export default class DependencyManager implements IExtensionPlugin {
  public client: ILanguageClient;
  private extension: IExtension;
  register(extension: IExtension) {
    this.extension = extension;
    this.client = extension.client;
    this.client.onNotification(MissingModuleNotification, this.requestToInstall);
    this.client.onNotification(DependeciesAreBeingInstalledNotification, this.jobRunning);
    this.client.onNotification(ElectronNotSupportedNotification, this.electronNotSupported);
  }

  private electronNotSupported = async () => {
    const r = await Win.showInformationMessage(
      'VSCode engine is not supported. You should enable \'sqltools.useNodeRuntime\' and have NodeJS installed to continue.',
      'Enable now',
    );
    if (!r) return;
    await workspace.getConfiguration(EXT_NAME.toLowerCase()).update('useNodeRuntime', true, ConfigurationTarget.Global);
    try { await workspace.getConfiguration(EXT_NAME.toLowerCase()).update('useNodeRuntime', true, ConfigurationTarget.Workspace) } catch(e) {}
    try { await workspace.getConfiguration(EXT_NAME.toLowerCase()).update('useNodeRuntime', true, ConfigurationTarget.WorkspaceFolder) } catch(e) {}
    const res = await Win.showInformationMessage(
      '\'sqltools.useNodeRuntime\' enabled. You must reload VSCode to take effect.', 'Reload now');
    if (!res) return;
    commands.executeCommand('workbench.action.reloadWindow');
  }

  private installingDrivers: string[] = [];
  private requestToInstall = async ({ conn, action = 'install', deps = [] }: { conn: IConnection; action: 'upgrade' | 'install'; deps: NodeDependency[]}) => {
    if (!conn) return;
    const installNow = action === 'upgrade' ? 'Upgrade now' : 'Install now';
    const readMore = 'Read more';
    const options = [readMore, installNow];
    const dependencyManagerSettings = ConfigManager.dependencyManager;
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
            title: 'SQLTools',
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
            await commands.executeCommand(`${EXT_NAME}.selectConnection`, getConnectionId(conn));
          }
          break;
        case readMore:
          openExternal(`${DOCS_ROOT_URL}/driver/${conn.driver ? conn.driver.toLowerCase() : ''}`);
          break;
      }
    } catch (error) {
      this.installingDrivers = this.installingDrivers.filter(v => v !== conn.driver);
      this.extension.errorHandler(`Failed to install dependencies for ${conn.driver}:`, error);
    }
  }

  private jobRunning = async ({ moduleName, moduleVersion, conn }) =>  {
    return Win.showInformationMessage(`We are installing "${moduleName}@${moduleVersion}" to connect to ${conn.name}. Please wait till it finishes.`);
  }
}