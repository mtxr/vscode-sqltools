import './patch-console';
import https from 'https';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME, VERSION, AUTHOR } from '@sqltools/core/constants';
import { Settings as SettingsInterface } from '@sqltools/core/interface';
import { Telemetry, Timer } from '@sqltools/core/utils';
import { commands, env as VSCodeEnv, ExtensionContext, version as VSCodeVersion, window, workspace, EventEmitter } from 'vscode';
import ErrorHandler from './api/error-handler';
import Utils from './api/utils';
import { openExternal } from '@sqltools/core/utils/vscode';
import SQLToolsLanguageClient from './language-client';
import SQLTools from '@sqltools/core/plugin-api';

// plugins
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/extension';
import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/extension';
import DependencyManagerPlugin from '@sqltools/plugins/dependency-manager/extension';
import HistoryManagerPlugin from '@sqltools/plugins/history-manager/extension';
import BookmarksManagerPlugin from '@sqltools/plugins/bookmarks-manager/extension';
import FormatterPlugin from '@sqltools/plugins/formatter/extension';

export class SQLToolsExtension implements SQLTools.ExtensionInterface {
  private telemetry: Telemetry;
  private pluginsQueue: SQLTools.ExtensionPlugin<this>[] = [];
  private onWillRunCommandEmitter: EventEmitter<SQLTools.CommandEvent>;
  private onDidRunCommandSuccessfullyEmitter: EventEmitter<SQLTools.CommandSuccessEvent>;
  private willRunCommandHooks: { [commands: string]: Array<(evt: SQLTools.CommandEvent) => void> } = {};
  private didRunCommandSuccessfullyHooks: { [commands: string]: Array<(evt: SQLTools.CommandSuccessEvent) => void> } = {};
  public client: SQLToolsLanguageClient;

  public activate() {
    const activationTimer = new Timer();
    ConfigManager.addOnUpdateHook(() => {
      if (this.telemetry) {
        if (ConfigManager.telemetry) this.telemetry.enable();
        else this.telemetry.disable();
      }
    });
    this.telemetry = new Telemetry({
      product: 'extension',
      vscodeInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    });
    this.getAndUpdateConfig();
    this.client = new SQLToolsLanguageClient(this.context);
    this.onWillRunCommandEmitter = new EventEmitter();
    this.onDidRunCommandSuccessfullyEmitter = new EventEmitter();

    ErrorHandler.setTelemetryClient(this.telemetry);
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

  private getIssueTemplate(name: string) {
    const url = `https://raw.githubusercontent.com/mtxr/vscode-sqltools/master/.github/ISSUE_TEMPLATE/${name}`;
    return new Promise<string>((resolve) => {
      https.get(url, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk.toString());
        resp.on('end', () => resolve(data));
      }).on('error', () => resolve(null));
    });
  }

  private aboutVersionHandler = async () => {
    const FoundABug = 'Found a bug?';
    const FeatureRequest = 'Feature Request';
    const message = [
      `SQLTools v${VERSION}`,
      '',
      `Platform: ${process.platform}, ${process.arch}`,
      `Using Node Runtime: ${ConfigManager.useNodeRuntime ? 'yes' : 'no'}`,
      '',
      `by @mtxr ${AUTHOR}`
    ];
    const res = await window.showInformationMessage(message.join('\n'), { modal: true }, FeatureRequest, FoundABug);
    if (!res) return;
    const newIssueUrl = 'https://github.com/mtxr/vscode-sqltools/issues/new';

    try {
      let template: string;
      let body: string;

      switch (res) {
        case FoundABug:
          template = 'bug_report.md';
          break;
        case FeatureRequest:
          template = 'feature_request.md';
          break;
      }
      body = await this.getIssueTemplate(template);
      if (body) {
        body = encodeURIComponent(
          body
          .replace(/---([^\-]+---\n\n)/gim, '')
          .replace(/(- OS).+/gi, `$1: ${process.platform}, ${process.arch}`)
          .replace(/(- Version).+/gi, `$1: v${VERSION}`));
      }

      if (!template && !body) {
        return openExternal(`${newIssueUrl}/choose`);
      }
      let issueUrl = `${newIssueUrl}?assignees=&labels=feature+request&template=${template}&body=${body}`;
      openExternal(issueUrl);
    } catch (e) {
      const res = await window.showInformationMessage('Could not open a issue. Please go to GitHub to open.', 'Open Github');
      if (res) {
        openExternal(`${newIssueUrl}/choose`);
      }
    }

  }

  /**
   * Management functions
   */
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
          openExternal('https://github.com/mtxr/vscode-sqltools#donate');
          break;
        case releaseNotes:
          openExternal(current.releaseNotes);
          break;
        case supportProject:
          openExternal('https://www.patreon.com/mteixeira');
          break;
      }
    } catch (e) { /***/ }
  }

  private loadPlugins() {
    this.pluginsQueue.forEach(plugin => plugin.register(this));
  }

  private onWillRunCommandHandler = (evt: SQLTools.CommandEvent): void => {
    if (!evt.command) return;
    if (!this.willRunCommandHooks[evt.command] || this.willRunCommandHooks[evt.command].length === 0) return;

    console.log(`Will run ${this.willRunCommandHooks[evt.command].length} attached handler for 'beforeCommandHooks'`)
    this.willRunCommandHooks[evt.command].forEach(hook => hook(evt));
  }
  private onDidRunCommandSuccessfullyHandler = (evt: SQLTools.CommandSuccessEvent): void => {
    if (!evt.command) return;
    if (!this.didRunCommandSuccessfullyHooks[evt.command] || this.didRunCommandSuccessfullyHooks[evt.command].length === 0) return;

    console.log(`Will run ${this.didRunCommandSuccessfullyHooks[evt.command].length} attached handler for 'afterCommandSuccessfullyHooks'`)
    this.didRunCommandSuccessfullyHooks[evt.command].forEach(hook => hook(evt));
  }

  public addBeforeCommandHook(command: string, handler: SQLTools.CommandEventHandler<SQLTools.CommandEvent>) {
    if (!this.willRunCommandHooks[command]) {
      this.willRunCommandHooks[command] = [];
    }
    this.willRunCommandHooks[command].push(handler);
    return this;
  }

  public addAfterCommandSuccessHook(command: string, handler: SQLTools.CommandEventHandler<SQLTools.CommandSuccessEvent>) {
    if (!this.didRunCommandSuccessfullyHooks[command]) {
      this.didRunCommandSuccessfullyHooks[command] = [];
    }
    this.didRunCommandSuccessfullyHooks[command].push(handler);
    return this;
  }

  public registerPlugin(plugin: SQLTools.ExtensionPlugin) {
    this.pluginsQueue.push(plugin);
    return this;
  }

  public registerCommand(command: string, handler: Function) {
    return this.decorateAndRegisterCommand(command, handler);
  }

  public registerTextEditorCommand(command: string, handler: Function) {
    return this.decorateAndRegisterCommand(command, handler, 'registerTextEditorCommand');
  }

  public errorHandler = (message: string, error: any) => {
    return ErrorHandler.create(message)(error);
  }

  private decorateAndRegisterCommand(command: string, handler: Function, type: 'registerCommand' | 'registerTextEditorCommand' = 'registerCommand') {
    this.context.subscriptions.push(
      commands[type](`${EXT_NAME}.${command}`, async (...args) => {
        console.info(`Executing ${EXT_NAME}.${command}`)
        this.onWillRunCommandEmitter.fire({ command, args });

        let result = handler(...args);
        if (typeof result !== 'undefined' && (typeof result.then === 'function' || typeof result.catch === 'function')) {
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
  instance = new SQLToolsExtension(context);
  instance
    .registerPlugin(FormatterPlugin)
    .registerPlugin(AutoRestartPlugin)
    .registerPlugin(new ConnectionManagerPlugin(instance))
    .registerPlugin(new DependencyManagerPlugin)
    .registerPlugin(new HistoryManagerPlugin)
    .registerPlugin(new BookmarksManagerPlugin);

  return instance.activate();
}

export function deactivate() {
  if (!instance) return;
  instance.deactivate();
  instance = undefined;
}
