import { window as Win } from 'vscode';
import { InstallDepRequest, MissingModuleNotification } from '@sqltools/plugins/dependency-manager/contracts';
import SQLTools from '@sqltools/core/plugin-api';
import { ConnectRequest } from '@sqltools/plugins/connection-manager/contracts';
import { openExternal } from '@sqltools/core/utils';

export default class DependencyManger implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  register(extension: SQLTools.ExtensionInterface) {
    this.client = extension.client;
    this.client.onNotification(MissingModuleNotification, param => this.requestToInstall(param));
  }

  public async requestToInstall({ moduleName, moduleVersion, conn }) {
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
          openExternal('https://mtxr.gitbook.io/vscode-sqltools/connections');
          break;
      }
    } catch (error) {
      Win.showErrorMessage(error && error.message ? error.message : error.toString());
    }
  }
}