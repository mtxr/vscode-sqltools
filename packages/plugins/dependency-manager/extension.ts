import { window as Win, workspace, ConfigurationTarget, window, ProgressLocation, commands } from 'vscode';
import { InstallDepRequest, MissingModuleNotification, ElectronNotSupportedNotification, DependeciesAreBeingInstalledNotification } from '@sqltools/plugins/dependency-manager/contracts';
import SQLTools from '@sqltools/core/plugin-api';
import { ConnectRequest } from '@sqltools/plugins/connection-manager/contracts';
import { openExternal } from '@sqltools/core/utils/vscode';
import { EXT_NAME, DOCS_ROOT_URL } from '@sqltools/core/constants';

export default class DependencyManager implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  private extension: SQLTools.ExtensionInterface;
  register(extension: SQLTools.ExtensionInterface) {
    this.extension = extension;
    this.client = extension.client;
    this.client.onNotification(MissingModuleNotification, param => this.requestToInstall(param));
    this.client.onNotification(DependeciesAreBeingInstalledNotification, param => this.jobRunning(param));
    this.client.onNotification(ElectronNotSupportedNotification, this.electronNotSupported);
  }

  private electronNotSupported = async () => {
    const r = await Win.showInformationMessage(
      'Electron is not supported. You should enable \'sqltools.useNodeRuntime\' and have NodeJS installed to continue.',
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
  private requestToInstall = async ({ moduleName, moduleVersion, conn, action = 'install' }) => {
    conn = conn || {};
    const installNow = 'Install now';
    const readMore = 'Read more';
    const options = [readMore, installNow];
    try {
      const r = action === 'upgrade' ? installNow : await Win.showInformationMessage(
        `You need to ${action} "${moduleName}@${moduleVersion}" to connect to ${conn.name}.`,
        ...options,
      );
      switch (r) {
        case installNow:
          this.installingDrivers.push(conn.driver);
          await window.withProgress({
            location: ProgressLocation.Notification,
            title: `SQLTools is ${action === 'upgrade' ? 'upgrading deps' : 'installing'}`,
            cancellable: false,
          }, async (progress) => {
            progress.report({ message: `${this.installingDrivers.join(', ')} dependencies` });
            const interval = setInterval(() => {
              progress.report({ message: `${this.installingDrivers.join(', ')} dependencies` });
            }, 1000);
            const result = await this.client.sendRequest(InstallDepRequest, { driver: conn.driver });
            clearInterval(interval);
            return result;
          });
          this.installingDrivers = this.installingDrivers.filter(v => v !== conn.driver);
          const opt = conn.name ? [`Connect to ${conn.name}`] : [];
          const rr = await Win.showInformationMessage(
            `"${moduleName}@${moduleVersion}" installed!\n
Go ahead and connect!`,
            ...opt
          );
          if (rr === opt[0]) {
            await this.client.sendRequest(ConnectRequest, { conn });
          }
          break;
        case readMore:
          openExternal(`${DOCS_ROOT_URL}/connections/${conn.driver ? conn.driver.toLowerCase() : ''}`);
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