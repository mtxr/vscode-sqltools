import { window as Win, workspace, ConfigurationTarget, window, StatusBarAlignment, StatusBarItem } from 'vscode';
import { InstallDepRequest, MissingModuleNotification, ElectronNotSupportedNotification, DependeciesAreBeingInstalledNotification } from '@sqltools/plugins/dependency-manager/contracts';
import SQLTools from '@sqltools/core/plugin-api';
import { ConnectRequest } from '@sqltools/plugins/connection-manager/contracts';
import { openExternal } from '@sqltools/core/utils/vscode';
import { EXT_NAME, DOCS_ROOT_URL } from '@sqltools/core/constants';
import ErrorHandler from '@sqltools/extension/api/error-handler';

export default class DependencyManager implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  register(extension: SQLTools.ExtensionInterface) {
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
          this.installingDialects.push(conn.dialect);
          this.updateStatusBar();
          await this.client.sendRequest(InstallDepRequest, { dialect: conn.dialect });
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
          openExternal(`${DOCS_ROOT_URL}/connections`);
          break;
      }
    } catch (error) {
      this.installingDialects = this.installingDialects.filter(v => v !== conn.dialect);
      ErrorHandler.create(`Failed to install dependencies for ${conn.dialect}`, (<any>console).show)(error);
    }
  }

  private jobRunning = async ({ moduleName, moduleVersion, conn }) =>  {
    return Win.showInformationMessage(`We are installing "${moduleName}@${moduleVersion}" to connect to ${conn.name}. Please wait till it finishes.`);
  }

  private statusbarProgress: StatusBarItem = null;
  private statusbarProgressTimer = null;

  private updateStatusBar = (position = 0) => {
    if (!this.statusbarProgress && this.installingDialects.length > 0) {
      this.statusbarProgress = window.createStatusBarItem(StatusBarAlignment.Left, 0);
    }
    if (this.statusbarProgress) {
      this.statusbarProgress.tooltip = `Installing dependencies for ${this.installingDialects.join(', ')}`
      const chars = '\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588';
      this.statusbarProgress.text = `Installing deps ${this.installingDialects.join(', ')} [${chars.charAt(position)}]`;
      this.statusbarProgress.show();
      this.statusbarProgress.color = 'cyan'
      this.statusbarProgressTimer = this.statusbarProgressTimer || setInterval(() => this.updateStatusBar(++position % chars.length), 100);
    }

    if (this.statusbarProgress && this.installingDialects.length === 0) {
      this.statusbarProgress.dispose();
      this.statusbarProgress = null;
      clearInterval(this.statusbarProgressTimer);
      this.statusbarProgressTimer = null;
    }
  }
}