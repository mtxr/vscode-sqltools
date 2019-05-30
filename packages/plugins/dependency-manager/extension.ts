import { window as Win, workspace, ConfigurationTarget, window, ProgressLocation } from 'vscode';
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
    return workspace.getConfiguration(EXT_NAME.toLowerCase()).update('useNodeRuntime', true, ConfigurationTarget.Global);
  }

  private installingDialects: string[] = [];
  private requestToInstall = async ({ moduleName, moduleVersion, conn, action = 'install' }) =>  {
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
          this.installingDialects.push(conn.dialect);
          await window.withProgress({
            location: ProgressLocation.Notification,
            title: `SQLTools is ${action === 'upgrade' ? 'upgrading deps' : 'installing'}`,
            cancellable: false,
          }, async (progress) => {
            progress.report({ message: `${this.installingDialects.join(', ')} dependencies` });
            const interval = setInterval(() => {
              progress.report({ message: `${this.installingDialects.join(', ')} dependencies` });
            }, 1000);
            const result = await this.client.sendRequest(InstallDepRequest, { dialect: conn.dialect });
            clearInterval(interval);
            return result;
          });
          this.installingDialects = this.installingDialects.filter(v => v !== conn.dialect);
          const opt = [`Connect to ${conn.name}`];
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
          openExternal(`${DOCS_ROOT_URL}/connections/${conn.dialect ? conn.dialect.toLowerCase() : ''}`);
          break;
      }
    } catch (error) {
      this.installingDialects = this.installingDialects.filter(v => v !== conn.dialect);
      this.extension.errorHandler(`Failed to install dependencies for ${conn.dialect}`, error);
    }
  }

  private jobRunning = async ({ moduleName, moduleVersion, conn }) =>  {
    return Win.showInformationMessage(`We are installing "${moduleName}@${moduleVersion}" to connect to ${conn.name}. Please wait till it finishes.`);
  }
}