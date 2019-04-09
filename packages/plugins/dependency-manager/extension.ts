import { window as Win, workspace, ConfigurationTarget } from 'vscode';
import { InstallDepRequest, MissingModuleNotification, ElectronNotSupportedNotification } from '@sqltools/plugins/dependency-manager/contracts';
import SQLTools from '@sqltools/core/plugin-api';
import { ConnectRequest } from '@sqltools/plugins/connection-manager/contracts';
import { openExternal } from '@sqltools/core/utils/vscode';
import { EXT_NAME, DOCS_ROOT_URL } from '@sqltools/core/constants';

export default class DependencyManger implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  register(extension: SQLTools.ExtensionInterface) {
    this.client = extension.client;
    this.client.onNotification(MissingModuleNotification, param => this.requestToInstall(param));
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
  private requestToInstall = async ({ moduleName, moduleVersion, conn }) =>  {
    const installNow = 'Install now';
    const readMore = 'Read more';
    const options = [readMore, installNow];
    try {
      const r = await Win.showInformationMessage(
        `You need "${moduleName}@${moduleVersion}" to connect to ${conn.name}.`,
        ...options,
      );
      switch (r) {
        case installNow:
          await this.client.sendRequest(InstallDepRequest, { dialect: conn.dialect });
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
          openExternal(`${DOCS_ROOT_URL}/connections`);
          break;
      }
    } catch (error) {
      Win.showErrorMessage(error && error.message ? error.message : error.toString());
    }
  }
}