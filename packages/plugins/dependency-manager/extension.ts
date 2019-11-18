import { window as Win, workspace, ConfigurationTarget, window, ProgressLocation, commands } from 'vscode';
import { InstallDepRequest, MissingModuleNotification, ElectronNotSupportedNotification, DependeciesAreBeingInstalledNotification } from '@sqltools/plugins/dependency-manager/contracts';
import SQLTools from '@sqltools/core/plugin-api';
import { openExternal } from '@sqltools/core/utils/vscode';
import { EXT_NAME, DOCS_ROOT_URL } from '@sqltools/core/constants';
import { getConnectionId } from '@sqltools/core/utils';
import ConfigManager from '@sqltools/core/config-manager';

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

  private installingDialects: string[] = [];
  private requestToInstall = async ({ moduleName, moduleVersion, conn, action = 'install' }) => {
    conn = conn || {};
    const installNow = action === 'upgrade' ? 'Upgrade now' : 'Install now';
    const readMore = 'Read more';
    const options = [readMore, installNow];
    const dependencyManagerSettings = ConfigManager.dependencyManager;
    const autoUpdateOrInstall = dependencyManagerSettings && dependencyManagerSettings.autoAccept;
    try {
      const r = autoUpdateOrInstall ? installNow : await Win.showInformationMessage(
        `You need to ${action} "${moduleName}@${moduleVersion}" to connect to ${conn.name}.`,
        ...options,
      );
      switch (r) {
        case installNow:
          this.installingDialects.push(conn.dialect);
          await window.withProgress({
            location: ProgressLocation.Notification,
            title: 'SQLTools',
            cancellable: false,
          }, async (progress) => {
            progress.report({ message: `${action === 'upgrade' ? 'upgrading' : 'installing'} ${this.installingDialects.join(', ')} dependencies` });
            const result = await this.client.sendRequest(InstallDepRequest, { dialect: conn.dialect });
            return result;
          });
          this.installingDialects = this.installingDialects.filter(v => v !== conn.dialect);
          const opt = conn.name ? [`Connect to ${conn.name}`] : [];
          const rr = conn.name && autoUpdateOrInstall ? opt[0] : await Win.showInformationMessage(
            `"${moduleName}@${moduleVersion}" installed!\n
Go ahead and connect!`,
            ...opt
          );
          if (rr === opt[0]) {
            await commands.executeCommand(`${EXT_NAME}.selectConnection`, getConnectionId(conn));
          }
          break;
        case readMore:
          openExternal(`${DOCS_ROOT_URL}/driver/${conn.dialect ? conn.dialect.toLowerCase() : ''}`);
          break;
      }
    } catch (error) {
      this.installingDialects = this.installingDialects.filter(v => v !== conn.dialect);
      this.extension.errorHandler(`Failed to install dependencies for ${conn.dialect}:`, error);
    }
  }

  private jobRunning = async ({ moduleName, moduleVersion, conn }) =>  {
    return Win.showInformationMessage(`We are installing "${moduleName}@${moduleVersion}" to connect to ${conn.name}. Please wait till it finishes.`);
  }
}