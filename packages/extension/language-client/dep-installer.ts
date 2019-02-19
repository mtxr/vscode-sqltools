import { window as Win } from 'vscode';
import { Telemetry } from '@sqltools/core/utils';
import Utils from '../api/utils';
import { InstallDep, OpenConnectionRequest } from '@sqltools/core/contracts/connection-requests';
import Notification from '@sqltools/core/contracts/notifications';
import { SQLToolsLanguageClient } from '.';

export default class AutoInstaller {
  constructor(public client: SQLToolsLanguageClient, public telemetry: Telemetry) {
    this.registerEvents();
  }

  public async requestToInstall({ moduleName, moduleVersion, conn }) {
    const installNow = 'Install now';
    const readMore = 'Read more';
    const options = [readMore, installNow];
    try {
      const r = await Win.showInformationMessage(
        `You need "${moduleName}@${moduleVersion}" to connect to ${conn.name}.`,
        ...options
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
