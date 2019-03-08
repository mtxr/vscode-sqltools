import './patch-console';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME, VERSION } from '@sqltools/core/constants';
import { Settings as SettingsInterface } from '@sqltools/core/interface';
import { Telemetry, Timer } from '@sqltools/core/utils';
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/extension';
import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/extension';
import DependencyManagerPlugin from '@sqltools/plugins/dependency-manager/extension';
import HistoryManagerPlugin from '@sqltools/plugins/history-manager/extension';
import FormatterPlugin from '@sqltools/plugins/formatter/extension';
import { commands, env as VSCodeEnv, ExtensionContext, QuickPickItem, version as VSCodeVersion, window, workspace, EventEmitter } from 'vscode';
import BookmarksStorage from './api/bookmarks-storage';
import ErrorHandler from './api/error-handler';
import History from './api/history';
import Utils from './api/utils';
import { getSelectedText, insertText, quickPick, readInput } from './api/vscode-utils';
import SQLToolsLanguageClient from './language-client';
import SQLTools from '@sqltools/core/plugin-api';

export class SQLToolsExtension implements SQLTools.ExtensionInterface {
  private telemetry: Telemetry;
  private bookmarks: BookmarksStorage;
  private history: History;
  private pluginsQueue: SQLTools.ExtensionPlugin<this>[] = [];
  private onWillRunCommandEmitter: EventEmitter<SQLTools.CommandEvent>;
  private onDidRunCommandSuccessfullyEmitter: EventEmitter<SQLTools.CommandSuccessEvent>;
  private willRunCommandHooks: { [commands: string]: Array<(evt: SQLTools.CommandEvent) => void> } = {};
  private didRunCommandSuccessfullyHooks: { [commands: string]: Array<(evt: SQLTools.CommandSuccessEvent) => void> } = {};
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
    this.onWillRunCommandEmitter = new EventEmitter();
    this.onDidRunCommandSuccessfullyEmitter = new EventEmitter();

    ErrorHandler.setTelemetryClient(this.telemetry);
    ErrorHandler.setOutputFn(window.showErrorMessage);
    this.getAndUpdateConfig();
    this.context.subscriptions.push(
      workspace.onDidChangeConfiguration(this.getAndUpdateConfig),
      this.client.start(),
      this.onWillRunCommandEmitter.event(this.onWillRunCommandHandler),
      this.onDidRunCommandSuccessfullyEmitter.event(this.onDidRunCommandSuccessfullyHandler),
      );
    this.registerCommand('aboutVersion', this.aboutVersionHandler);
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

  private onWillRunCommandHandler = (evt: SQLTools.CommandEvent): void => {
    if (!evt.command) return;
    if (!this.willRunCommandHooks[evt.command]) return;

    this.willRunCommandHooks[evt.command].forEach(hook => hook(evt));
  }
  private onDidRunCommandSuccessfullyHandler = (evt: SQLTools.CommandSuccessEvent): void => {
    if (!evt.command) return;
    if (!this.didRunCommandSuccessfullyHooks[evt.command]) return;
    this.didRunCommandSuccessfullyHooks[evt.command].forEach(hook => hook(evt));
  }

  public beforeCommandHook(command: string, handler: SQLTools.CommandEventHandler<SQLTools.CommandEvent>) {
    if (!this.didRunCommandSuccessfullyHooks[command]) {
      this.didRunCommandSuccessfullyHooks[command] = [];
    }
    this.didRunCommandSuccessfullyHooks[command].push(handler);
    return this;
  }

  public afterCommandSuccessHook(command: string, handler: SQLTools.CommandEventHandler<SQLTools.CommandSuccessEvent>) {
    if (!this.didRunCommandSuccessfullyHooks[command]) {
      this.didRunCommandSuccessfullyHooks[command] = [];
    }
    this.willRunCommandHooks[command].push(handler);
    return this;
  }

  public registerPlugin(plugin: SQLTools.ExtensionPlugin) {
    this.pluginsQueue.push(plugin);
    return this;
  }

  public registerCommand(command: string, handler: Function) {
    this.context.subscriptions.push(
      commands.registerCommand(`${EXT_NAME}.${command}`, async (...args) => {
       this.onWillRunCommandEmitter.fire({ command, args });

       let result = handler(...args);
       if (typeof result.then === 'function') {
         result = await result;
       }
       this.onDidRunCommandSuccessfullyEmitter.fire({ args, command, result });
       return result;
     })
    );
    return this;
  }

  public registerTextEditorCommand(command: string, handler: Function) {
    this.context.subscriptions.push(
      commands.registerTextEditorCommand(`${EXT_NAME}.${command}`, async (...args) => {
        this.onWillRunCommandEmitter.fire({ command, args });

        let result = handler(...args);
        if (typeof result.then === 'function' || typeof result.catch === 'function') {
          result = await result;
          // @TODO: add on fail hook
        }
        this.onDidRunCommandSuccessfullyEmitter.fire({ args, command, result });
        return result;
      })
    );
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
    .registerPlugin(new DependencyManagerPlugin())
    .registerPlugin(new HistoryManagerPlugin());

  return instance.activate();
}

export function deactivate() {
  if (!instance) return;
  instance.deactivate();
  instance = undefined;
}
