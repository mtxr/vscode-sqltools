import './patch-console';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME, VERSION } from '@sqltools/core/constants';
import { Settings as SettingsInterface } from '@sqltools/core/interface';
import { Telemetry, Timer } from '@sqltools/core/utils';
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/extension';
import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/extension';
import DependencyManagerPlugin from '@sqltools/plugins/dependency-manager/extension';
import FormatterPlugin from '@sqltools/plugins/formatter/extension';
import { commands, env as VSCodeEnv, ExtensionContext, QuickPickItem, version as VSCodeVersion, window, workspace } from 'vscode';
import BookmarksStorage from './api/bookmarks-storage';
import ErrorHandler from './api/error-handler';
import History from './api/history';
import Utils from './api/utils';
import { getSelectedText, insertText, quickPick, readInput } from './api/vscode-utils';
import SQLToolsLanguageClient from './language-client';
import { SQLToolsExtensionInterface, SQLToolsExtensionPlugin } from '@sqltools/core/interface/plugin';

export class SQLToolsExtension implements SQLToolsExtensionInterface {
  private telemetry: Telemetry;
  private bookmarks: BookmarksStorage;
  private history: History;
  private pluginsQueue: SQLToolsExtensionPlugin<this>[] = [];
  public client: SQLToolsLanguageClient;

  public activate() {
    const activationTimer = new Timer();
    ConfigManager.addOnUpdateHook(() => {
      if (ConfigManager.telemetry) this.telemetry.enable();
      else this.telemetry.disable();
      this.bookmarks = new BookmarksStorage();
      this.history = (this.history || new History(ConfigManager.historySize));
    })
    this.telemetry = new Telemetry({
      product: 'extension',
      vscodeInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    });
    this.client = new SQLToolsLanguageClient(this.context);

    ErrorHandler.setTelemetryClient(this.telemetry);
    ErrorHandler.setOutputFn(window.showErrorMessage);
    this.getAndUpdateConfig();
    this.context.subscriptions.push(
      workspace.onDidChangeConfiguration(this.getAndUpdateConfig),
      this.client.start(),
      commands.registerCommand(`${EXT_NAME}.aboutVersion`, this.aboutVersionHandler),
      // ...getExtCommands(),
    );
    if ((<any>console).outputChannel) {
      this.context.subscriptions.push((<any>console).outputChannel);
    }
    this.loadPlugins();
    activationTimer.end();
    this.telemetry.registerTime('activation', activationTimer);
    this.displayReleaseNotesMessage();
  }

  public deactivate(): void {
    return this.context.subscriptions.forEach((sub) => void sub.dispose());
  }

  private aboutVersionHandler(): void {
    const message = `Using SQLTools ${VERSION}`;
    window.showInformationMessage(message, { modal: true });
  }

  private async cmdEditBookmark(): Promise<void> {
    try {
      const query = (await this.bookmarksMenu()) as QuickPickItem;
      const headerText = ''.replace('{queryName}', query.label);
      insertText(`${headerText}${query.detail}`, true);
    } catch (e) {
      ErrorHandler.create('Could not edit bookmarked query')(e);
    }
  }
  private async cmdBookmarkSelection() {
    try {
      const query = await getSelectedText('bookmark');
      this.bookmarks.set(await readInput('Query name'), query);
    } catch (e) {
      ErrorHandler.create('Error bookmarking query.')(e);
    }
  }

  private async cmdDeleteBookmark(): Promise<void> {
    try {
      this.bookmarks.delete((await this.bookmarksMenu('label')));
    } catch (e) {
      ErrorHandler.create('Error deleting bookmark.')(e);
    }
  }

  private cmdClearBookmarks(): void {
    this.bookmarks.reset();
  }

  private async cmdRunFromHistory(): Promise<void> {
    try {
      const query = await this.historyMenu();
      await commands.executeCommand(`${EXT_NAME}.executeQuery`, query, false);
    } catch (e) {
      ErrorHandler.create('Error while running query.', `${EXT_NAME}.showOutputChannel`)(e);
    }
  }

  private async cmdEditFromHistory(): Promise<void> {
    try {
      const query = (await this.historyMenu());
      insertText(query, true);
    } catch (e) {
      ErrorHandler.create('Could not edit bookmarked query')(e);
    }
  }

  private async cmdRunFromBookmarks(): Promise<void> {
    try {
      await commands.executeCommand(`${EXT_NAME}.executeQuery`, await this.bookmarksMenu('detail'));
    } catch (e) {
      ErrorHandler.create('Error while running query.', `${EXT_NAME}.showOutputChannel`)(e);
    }
  }

  /**
   * Management functions
   */
  private async bookmarksMenu<R = QuickPickItem | string>(prop?: string): Promise<R> {
    const all = this.bookmarks.all();

    return await quickPick<R>(Object.keys(all).map((key) => {
      return {
        description: '',
        detail: all[key],
        label: key,
      };
    }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Pick a bookmarked query',
        placeHolderDisabled: 'You don\'t have any bookmarks yet.',
        title: 'Bookmarks',
      });
  }

  private async historyMenu(prop: string = 'label'): Promise<string> {
    return await quickPick(this.history.all().map((query) => {
      return {
        description: '',
        label: query,
      } as QuickPickItem;
    }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolderDisabled: 'You don\'t have any queries on your history.',
        title: 'History',
      });
  }

  // getExtCommands() {
  //   const extCommands = Object.keys(SQLTools).reduce((list, extFn) => {
  //     if (!extFn.startsWith('cmd') && !extFn.startsWith('editor')) return list;
  //     let extCmd = extFn.replace(/^(editor|cmd)/, '');
  //     extCmd = extCmd.charAt(0).toLocaleLowerCase() + extCmd.substring(1, extCmd.length);
  //     const regFn = extFn.startsWith('editor') ? commands.registerTextEditorCommand : commands.registerCommand;
  //     list.push(regFn(`${EXT_NAME}.${extCmd}`, (...args) => {
  //       console.log(`Command triggered: ${extCmd}`);
  //       telemetry.registerCommand(extCmd);
  //       SQLTools[extFn](...args);
  //     }));
  //     return list;
  //   }, []);

  //   console.log(`${extCommands.length} commands to register.`);
  //   return extCommands;
  // }

  private getAndUpdateConfig() {
    ConfigManager.update(<SettingsInterface>workspace.getConfiguration(EXT_NAME.toLowerCase()));
  }

  private async displayReleaseNotesMessage() {
    try {
      const current = Utils.getlastRunInfo();
      const { lastNotificationDate = 0, updated } = current;
      const lastNDate = parseInt(new Date(lastNotificationDate).toISOString().substr(0, 10).replace(/\D/g, ''), 10);
      const today = parseInt(new Date().toISOString().substr(0, 10).replace(/\D/g, ''), 10);
      const updatedRecently = (today - lastNDate) < 2;

      if (
        ConfigManager.disableReleaseNotifications
        || !updated
        || updatedRecently
      ) return;

      Utils.updateLastRunInfo({ lastNotificationDate: +new Date() });

      const moreInfo = 'More Info';
      const supportProject = 'Support This Project';
      const releaseNotes = 'Release Notes';
      const message = `SQLTools updated! Check out the release notes for more information.`;
      const options = [ moreInfo, supportProject, releaseNotes ];
      const res: string = await window.showInformationMessage(message, ...options);
      this.telemetry.registerInfoMessage(message, res);
      switch (res) {
        case moreInfo:
          Utils.open('https://github.com/mtxr/vscode-sqltools#donate');
          break;
        case releaseNotes:
          Utils.open(current.releaseNotes);
          break;
        case supportProject:
          Utils.open('https://www.patreon.com/mteixeira');
          break;
      }
    } catch (e) { /***/ }
  }

  private loadPlugins() {
    this.pluginsQueue.forEach(plugin => plugin.register(this));
  }

  public registerPlugin(plugin: SQLToolsExtensionPlugin) {
    this.pluginsQueue.push(plugin);
    return this;
  }
  constructor(public context: ExtensionContext) {}
}

let instance: SQLToolsExtension;
export function activate(context: ExtensionContext) {
  if (instance) return;
  instance = new SQLToolsExtension(context)
    .registerPlugin(FormatterPlugin)
    .registerPlugin(AutoRestartPlugin)
    .registerPlugin(new ConnectionManagerPlugin())
    .registerPlugin(new DependencyManagerPlugin());

  return instance.activate();
}

export function deactivate() {
  if (!instance) return;
  instance.deactivate();
  instance = undefined;
}
