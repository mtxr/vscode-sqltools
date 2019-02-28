import { window as Win } from 'vscode';
import Utils from '@sqltools/extension/api/utils';
import { OpenConnectionRequest } from '@sqltools/core/contracts/connection-requests';
import Notification from '@sqltools/core/contracts/notifications';
import { InstallDep } from '@sqltools/plugins/dependency-manager/contracts';
import { LanguageClientPlugin, SQLToolsLanguageClientInterface } from '@sqltools/core/interface/plugin';

export default class DependencyManger implements LanguageClientPlugin {
  public client: SQLToolsLanguageClientInterface;
  register(client: SQLToolsLanguageClientInterface) {
    this.client = client;
    this.registerEvents();
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
          await this.client.sendRequest(InstallDep, { dialect: conn.dialect });
          const opt = [`Connect to ${conn.name}`];
          const rr = await Win.showInformationMessage(
            `"${moduleName}@${moduleVersion}" installed!\n
Go ahead and connect!`,
            ...opt
          );
          if (rr === opt[0]) {
            await this.client.sendRequest(OpenConnectionRequest, { conn });
          }
          break;
        case readMore:
          // @TODO: link to the wiki and create docs
          Utils.open('https://mtxr.gitbook.io/vscode-sqltools');
          break;
      }
    } catch (error) {
      Win.showErrorMessage(error && error.message ? error.message : error.toString());
    }
  }
  private registerEvents() {
    this.client.onNotification(Notification.MissingModule, param => this.requestToInstall(param));
  }
}