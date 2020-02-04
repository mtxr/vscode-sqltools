import { migrateFilesToNewPaths } from '@sqltools/core/utils/persistence';
import https from 'https';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAMESPACE, VERSION, AUTHOR, DISPLAY_NAME, EXT_CONFIG_NAMESPACE } from '@sqltools/core/constants';
import { ISettings, IExtension, IExtensionPlugin, ICommandEvent, ICommandSuccessEvent, CommandEventHandler } from '@sqltools/types';
import { Timer } from '@sqltools/core/utils';
import { commands, env as VSCodeEnv, ExtensionContext, version as VSCodeVersion, window, workspace, EventEmitter, ConfigurationChangeEvent } from 'vscode';
import ErrorHandler from './api/error-handler';
import Utils from './api/utils';
import { openExternal } from '@sqltools/vscode/utils';
import SQLToolsLanguageClient from './language-client';
import logger from '@sqltools/vscode/log';
import Context from '@sqltools/vscode/context';

const log = logger.extend('main');
// plugins
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/extension';
import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/extension';
import DependencyManagerPlugin from '@sqltools/plugins/dependency-manager/extension';
import HistoryManagerPlugin from '@sqltools/plugins/history-manager/extension';
import BookmarksManagerPlugin from '@sqltools/plugins/bookmarks-manager/extension';
import FormatterPlugin from '@sqltools/plugins/formatter/extension';
import telemetry from '@sqltools/core/utils/telemetry';

export class SQLToolsExtension implements IExtension {
  private pluginsQueue: IExtensionPlugin<this>[] = [];
  private onWillRunCommandEmitter: EventEmitter<ICommandEvent>;
  private onDidRunCommandSuccessfullyEmitter: EventEmitter<ICommandSuccessEvent>;
  private willRunCommandHooks: { [commands: string]: Array<(evt: ICommandEvent) => void> } = {};
  private didRunCommandSuccessfullyHooks: { [commands: string]: Array<(evt: ICommandSuccessEvent) => void> } = {};
  public client: SQLToolsLanguageClient;

  public activate() {
    const activationTimer = new Timer();
    telemetry.updateOpts({
      extraInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    });
    this.getAndUpdateConfig(null);
    this.client = new SQLToolsLanguageClient();
    this.onWillRunCommandEmitter = new EventEmitter();
    this.onDidRunCommandSuccessfullyEmitter = new EventEmitter();

    Context.subscriptions.push(
      workspace.onDidChangeConfiguration(this.getAndUpdateConfig),
      this.client.start(),
      this.onWillRunCommandEmitter.event(this.onWillRunCommandHandler),
      this.onDidRunCommandSuccessfullyEmitter.event(this.onDidRunCommandSuccessfullyHandler),
    );

    this.registerCommand('aboutVersion', this.aboutVersionHandler);

    if (logger.outputChannel) {
      Context.subscriptions.push(logger.outputChannel);
    }
    this.loadPlugins();
    activationTimer.end();
    setTimeout(() => {
      telemetry.registerTime('activation', activationTimer);
    }, 5000);
    this.displayReleaseNotesMessage();
  }

  public deactivate(): void {
    return Context.subscriptions.forEach((sub) => void sub.dispose());
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
      `${DISPLAY_NAME} v${VERSION}`,
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
  private getAndUpdateConfig(event?: ConfigurationChangeEvent) {
    ConfigManager.update(<ISettings>workspace.getConfiguration(EXT_CONFIG_NAMESPACE), event);
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
      const message = `${DISPLAY_NAME} updated! Check out the release notes for more information.`;
      const options = [ moreInfo, supportProject, releaseNotes ];
      const res: string = await window.showInformationMessage(message, ...options);
      telemetry.registerMessage('info', message, res);
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

  private onWillRunCommandHandler = (evt: ICommandEvent): void => {
    if (!evt.command) return;
    if (!this.willRunCommandHooks[evt.command] || this.willRunCommandHooks[evt.command].length === 0) return;

    log.extend('debug')(`Will run ${this.willRunCommandHooks[evt.command].length} attached handler for 'beforeCommandHooks'`)
    this.willRunCommandHooks[evt.command].forEach(hook => hook(evt));
  }
  private onDidRunCommandSuccessfullyHandler = (evt: ICommandSuccessEvent): void => {
    if (!evt.command) return;
    if (!this.didRunCommandSuccessfullyHooks[evt.command] || this.didRunCommandSuccessfullyHooks[evt.command].length === 0) return;

    log.extend('debug')(`Will run ${this.didRunCommandSuccessfullyHooks[evt.command].length} attached handler for 'afterCommandSuccessfullyHooks'`)
    this.didRunCommandSuccessfullyHooks[evt.command].forEach(hook => hook(evt));
  }

  public addBeforeCommandHook(command: string, handler: CommandEventHandler<ICommandEvent>) {
    if (!this.willRunCommandHooks[command]) {
      this.willRunCommandHooks[command] = [];
    }
    this.willRunCommandHooks[command].push(handler);
    return this;
  }

  public addAfterCommandSuccessHook(command: string, handler: CommandEventHandler<ICommandSuccessEvent>) {
    if (!this.didRunCommandSuccessfullyHooks[command]) {
      this.didRunCommandSuccessfullyHooks[command] = [];
    }
    this.didRunCommandSuccessfullyHooks[command].push(handler);
    return this;
  }

  public registerPlugin(plugin: IExtensionPlugin) {
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
    Context.subscriptions.push(
      commands[type](`${EXT_NAMESPACE}.${command}`, async (...args) => {
        log.extend('info')(`Executing ${EXT_NAMESPACE}.${command}`)
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
}

let instance: SQLToolsExtension;
export function activate(ctx: ExtensionContext) {try {
  
    Context.set(ctx);
    if (instance) return;
    migrateFilesToNewPaths();
    instance = new SQLToolsExtension();
    instance
      .registerPlugin(FormatterPlugin)
      .registerPlugin(AutoRestartPlugin)
      .registerPlugin(new ConnectionManagerPlugin(instance))
      .registerPlugin(new DependencyManagerPlugin)
      .registerPlugin(new HistoryManagerPlugin)
      .registerPlugin(new BookmarksManagerPlugin);
  
    return instance.activate();
  
} catch (err) {
  console.error(err);
  setTimeout(() => {
    console.error(err);
  }, 5000);
}}

export function deactivate() {
  if (!instance) return;
  instance.deactivate();
  instance = undefined;
}
