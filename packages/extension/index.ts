import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME, VERSION } from '@sqltools/core/constants';
import { ConnectionInterface, Settings as SettingsInterface } from '@sqltools/core/interface';
import { query as QueryUtils, Telemetry, Timer } from '@sqltools/core/utils';
import Logger from '@sqltools/core/utils/logger';
import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/language-client';
import FormatterPlugin from '@sqltools/plugins/formatter/extension';
import { commands as VSCode, env as VSCodeEnv, ExtensionContext, QuickPickItem, version as VSCodeVersion, window as Win, workspace as Wspc } from 'vscode';
import BookmarksStorage from './api/bookmarks-storage';
import ErrorHandler from './api/error-handler';
import History from './api/history';
import Utils from './api/utils';
import { getOrCreateEditor, getSelectedText, insertSnippet, insertText, quickPick, readInput } from './api/vscode-utils';
import ContextManager from './context';
import LC from './language-client';
import LogWriter from './log-writer';
import ConnectionExplorer, { SidebarDatabaseItem, SidebarTable } from './providers/connection-explorer';

export namespace SQLTools {
  const cfgKey: string = EXT_NAME.toLowerCase();
  const logger = new Logger(LogWriter);

  const CMPlugin = new ConnectionManagerPlugin();

  let telemetry = new Telemetry({
    product: 'extension',
    useLogger: logger,
    vscodeInfo: {
      sessId: VSCodeEnv.sessionId,
      uniqId: VSCodeEnv.machineId,
      version: VSCodeVersion,
    },
  });
  let bookmarks: BookmarksStorage;
  let history: History;
  let activationTimer: Timer;

  export async function activate(context: ExtensionContext): Promise<void> {
    activationTimer = new Timer();
    if (ContextManager.context) return;
    ContextManager.context = context;
    ContextManager.logWriter = LogWriter;
    telemetry.updateOpts({
      product: 'extension',
      useLogger: logger,
      vscodeInfo: {
        sessId: VSCodeEnv.sessionId,
        uniqId: VSCodeEnv.machineId,
        version: VSCodeVersion,
      },
    });
    loadConfigs();
    loadPlugins();
    await registerExtension();
    activationTimer.end();
    logger.log(`Activation Time: ${activationTimer.elapsed()}ms`);
    telemetry.registerTime('activation', activationTimer);
    help();
  }

  export function deactivate(): void {
    return ContextManager.context.subscriptions.forEach((sub) => void sub.dispose());
  }

  export async function cmdEditBookmark(): Promise<void> {
    try {
      const query = (await bookmarksMenu()) as QuickPickItem;
      const headerText = ''.replace('{queryName}', query.label);
      insertText(`${headerText}${query.detail}`, true);
    } catch (e) {
      ErrorHandler.create('Could not edit bookmarked query')(e);
    }
  }
  export async function cmdBookmarkSelection() {
    try {
      const query = await getSelectedText('bookmark');
      bookmarks.set(await readInput('Query name'), query);
    } catch (e) {
      ErrorHandler.create('Error bookmarking query.')(e);
    }
  }

  export async function cmdDeleteBookmark(): Promise<void> {
    try {
      bookmarks.delete((await bookmarksMenu('label')));
    } catch (e) {
      ErrorHandler.create('Error deleting bookmark.')(e);
    }
  }

  export function cmdClearBookmarks(): void {
    bookmarks.reset();
  }

  export async function cmdAppendToCursor(node: SidebarDatabaseItem | string): Promise<void> {
    if (!node) return;
    return insertText(typeof node === 'string' ? node : node.value);
  }

  export async function cmdGenerateInsertQuery(node: SidebarTable): Promise<boolean> {
    return insertSnippet(QueryUtils.generateInsert(node.value, node.items, ConfigManager.format.indentSize));
  }

  export function cmdAboutVersion(): void {
    const message = `Using SQLTools ${VERSION}`;
    logger.info(message);
    Win.showInformationMessage(message, { modal: true });
  }

  export async function cmdNewSqlFile() {
    return await getOrCreateEditor(true);
  }

  export async function cmdRunFromHistory(): Promise<void> {
    try {
      await CMPlugin._connect();
      const query = await historyMenu();
      await CMPlugin._openResultsWebview();
      await CMPlugin._runQuery(query, false);
    } catch (e) {
      ErrorHandler.create('Error while running query.', CMPlugin.ext_showOutputChannel)(e);
    }
  }

  export async function cmdEditFromHistory(): Promise<void> {
    try {
      const query = (await historyMenu());
      insertText(query, true);
    } catch (e) {
      ErrorHandler.create('Could not edit bookmarked query')(e);
    }
  }

  export async function cmdRunFromBookmarks(): Promise<void> {
    try {
      await CMPlugin._connect();
      CMPlugin._openResultsWebview();
      await CMPlugin._runQuery(await bookmarksMenu('detail'));
    } catch (e) {
      ErrorHandler.create('Error while running query.', CMPlugin.ext_showOutputChannel)(e);
    }
  }

  /**
   * Management functions
   */
  async function bookmarksMenu<R = QuickPickItem | string>(prop?: string): Promise<R> {
    const all = bookmarks.all();

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

  async function historyMenu(prop: string = 'label'): Promise<string> {
    return await quickPick(history.all().map((query) => {
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

  async function autoConnectIfActive(currConn?: ConnectionInterface) {
    let defaultConnections: ConnectionInterface[] = currConn ? [currConn] : [];
    if (defaultConnections.length === 0
      && (
        typeof ConfigManager.autoConnectTo === 'string'
        || (
          Array.isArray(ConfigManager.autoConnectTo) && ConfigManager.autoConnectTo.length > 0
          )
        )
    ) {
      const autoConnectTo = Array.isArray(ConfigManager.autoConnectTo)
      ? ConfigManager.autoConnectTo
      : [ConfigManager.autoConnectTo];

      defaultConnections = ConfigManager.connections
        .filter((conn) => conn && autoConnectTo.indexOf(conn.name) >= 0)
        .filter(Boolean) as ConnectionInterface[];
    }
    if (defaultConnections.length === 0) {
      return CMPlugin._setConnection();
    }
    logger.info(`Configuration set to auto connect to: ${defaultConnections.map(({name}) => name).join(', ')}`);
    try {
      await Promise.all(defaultConnections.slice(1).map(c =>
        CMPlugin._setConnection(c)
          .catch(e => {
            ErrorHandler.create(`Failed to auto connect to  ${c.name}`)(e);
            Promise.resolve();
          }),
      ));

      await CMPlugin._setConnection(defaultConnections[0]);
      // first should be the active
    } catch (error) {
      ErrorHandler.create('Auto connect failed')(error);
    }
  }
  function loadConfigs() {
    ConfigManager.update(Wspc.getConfiguration(cfgKey) as SettingsInterface);
    setupLogger();
    bookmarks = new BookmarksStorage();
    history = (history || new History(ConfigManager.historySize));
    logger.log(`Env: ${process.env.NODE_ENV}`);
  }
  function setupLogger() {
    logger.setLevel(Logger.levels[ConfigManager.logLevel])
      .setLogging(ConfigManager.logging);
    ErrorHandler.setLogger(telemetry);
    ErrorHandler.setOutputFn(Win.showErrorMessage);
  }

  function getExtCommands() {
    const commands = Object.keys(SQLTools).reduce((list, extFn) => {
      if (!extFn.startsWith('cmd') && !extFn.startsWith('editor')) return list;
      let extCmd = extFn.replace(/^(editor|cmd)/, '');
      extCmd = extCmd.charAt(0).toLocaleLowerCase() + extCmd.substring(1, extCmd.length);
      const regFn = extFn.startsWith('editor') ? VSCode.registerTextEditorCommand : VSCode.registerCommand;
      list.push(regFn(`${EXT_NAME}.${extCmd}`, (...args) => {
        logger.log(`Command triggered: ${extCmd}`);
        telemetry.registerCommand(extCmd);
        SQLTools[extFn](...args);
      }));
      return list;
    }, []);

    logger.log(`${commands.length} commands to register.`);
    return commands;
  }

  async function registerExtension() {
    ContextManager.context.subscriptions.push(
      LogWriter.getOutputChannel(),
      Wspc.onDidChangeConfiguration(reloadConfig),
      LC().start(),
      ...getExtCommands(),
    );
    LC().registerPlugin(CMPlugin);
    ConnectionExplorer.setConnections(ConfigManager.connections);
  }

  function reloadConfig() {
    loadConfigs();
    logger.info('Config reloaded!');
    autoConnectIfActive(ConnectionExplorer.getActive());
    if (ConnectionExplorer.setConnections(ConfigManager.connections)) CMPlugin.ext_refreshAll();
  }

  async function help() {
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
      const res: string = await Win.showInformationMessage(message, ...options);
      telemetry.registerInfoMessage(message, res);
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

  function loadPlugins() {
    FormatterPlugin.register();
  }
}

export const activate = SQLTools.activate;
export const deactivate = SQLTools.deactivate;
