import {
  commands as VSCode,
  ExtensionContext,
  QuickPickItem,
  SnippetString,
  StatusBarAlignment,
  TextEditor,
  TextEditorEdit,
  window as Win,
  workspace as Wspc,
  TreeView,
  QuickPickOptions,
  QuickPick,
} from 'vscode';
import {
  CloseAction,
  ErrorAction,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient';
import ConfigManager from '@sqltools/core/config-manager';

import { EXT_NAME, VERSION } from '@sqltools/core/constants';
import ContextManager from './context';

import {
  ClientRequestConnections,
  GetTablesAndColumnsRequest,
  OpenConnectionRequest,
  RefreshConnectionData,
  RunCommandRequest,
  UpdateConnectionExplorerRequest,
  GetCachedPassword,
  CloseConnectionRequest,
} from '@sqltools/core/contracts/connection-requests';
import Notification from '@sqltools/core/contracts/notifications';
import LogWriter from './log-writer';
import {
  ConnectionExplorer,
  SidebarDatabaseItem,
  SidebarTable,
  SidebarView,
  SidebarConnection,
 } from './providers';
import QueryResultsPreviewer from './providers/webview/query-results-previewer';
import SettingsEditor from './providers/webview/settings-editor';
import { Logger, BookmarksStorage, History, ErrorHandler, Utils } from './api';
import { SerializedConnection, Settings as SettingsInterface } from '@sqltools/core/interface';
import { Timer, Telemetry, query as QueryUtils, getDbId } from '@sqltools/core/utils';
import { DismissedException } from '@sqltools/core/exception';

namespace SQLTools {
  const cfgKey: string = EXT_NAME.toLowerCase();
  const logger = new Logger(LogWriter);
  const connectionExplorer = new ConnectionExplorer(logger);
  let connectionExplorerView: TreeView<any>;
  const extDatabaseStatus = Win.createStatusBarItem(StatusBarAlignment.Left, 10);
  const queryResults = new QueryResultsPreviewer();
  const settingsEditor = new SettingsEditor();

  let bookmarks: BookmarksStorage;
  let history: History;
  let languageClient: LanguageClient;
  let activationTimer: Timer;

  export async function start(context: ExtensionContext): Promise<void> {
    activationTimer = new Timer();
    if (ContextManager.context) return;
    ContextManager.context = context;
    loadConfigs();
    Telemetry.register('extension', ConfigManager.telemetry, logger);
    await registerExtension();
    updateStatusBar();
    activationTimer.end();
    logger.log(`Activation Time: ${activationTimer.elapsed()}ms`);
    Telemetry.registerTime('activation', activationTimer);
    help();
  }

  export function stop(): void {
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
      bookmarks.add(await readInput('Query name'), query);
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
    bookmarks.clear();
  }

  // inplace format for any lang
  export function editorFormatSql(editor: TextEditor, edit: TextEditorEdit): void {
    try {
      const indentSize: number = ConfigManager.format.indentSize;
      edit.replace(editor.selection, QueryUtils.format(editor.document.getText(editor.selection), indentSize));
      VSCode.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
      logger.debug('Query formatted!');
    } catch (error) {
      ErrorHandler.create('Error formatting query.')(error);
    }
  }

  export async function cmdAppendToCursor(node: SidebarDatabaseItem): Promise<void> {
    insertText(node.value);
  }

  export async function cmdGenerateInsertQuery(node: SidebarTable): Promise<boolean> {
    return insertSnippet(QueryUtils.generateInsert(node.value, node.items, ConfigManager.format.indentSize));
  }

  export function cmdShowOutputChannel(): void {
    LogWriter.showOutput();
  }
  export function cmdAboutVersion(): void {
    const message = `Using SQLTools ${VERSION}`;
    logger.info(message);
    Win.showInformationMessage(message, { modal: true });
  }
  export async function cmdSelectConnection(node?: SidebarConnection): Promise<void> {
    if (node) {
      await setConnection(node.conn as SerializedConnection).catch(ErrorHandler.create('Error opening connection'));
      return;
    }
    connect(true).catch(ErrorHandler.create('Error selecting connection'));
  }

  export async function cmdCloseConnection(node?: SidebarConnection): Promise<void> {
    const conn = node ? node.conn : await connectionMenu(true);
    if (!conn) {
      return;
    }

    return languageClient.sendRequest(CloseConnectionRequest, { conn })
      .then(async () => {
        // if (getDbId(connectionExplorer.getActive()) === getDbId(conn)) {
        //   connectionExplorer.getActive() = null;
        // }
        connectionExplorer.disconnect(conn as SerializedConnection);
        updateStatusBar();

      }, ErrorHandler.create('Error closing connection'));
  }

  export async function cmdShowRecords(node?: SidebarTable | SidebarView) {
    try {
      const table = await getTableName(node);
      printOutput();
      const payload = await runConnectionCommand('showRecords', table, ConfigManager.previewLimit);
      queryResults.postMessage({ action: 'queryResults', payload });

    } catch (e) {
      ErrorHandler.create('Error while showing table records', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdDescribeTable(node?: SidebarTable | SidebarView): Promise<void> {
    try {
      const table = await getTableName(node);
      printOutput();
      const payload = await runConnectionCommand('describeTable', table);
      queryResults.postMessage({ action: 'queryResults', payload });
    } catch (e) {
      ErrorHandler.create('Error while describing table records', cmdShowOutputChannel)(e);
    }
  }

  export function cmdDescribeFunction() {
    Win.showInformationMessage('Not implemented yet.');
  }

  export async function cmdExecuteQuery(): Promise<void> {
    try {
      const query: string = await getSelectedText('execute query');
      await connect();
      printOutput();
      await runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error fetching records.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdExecuteQueryFromFile(): Promise<void> {
    try {
      const query: string = await getSelectedText('execute file', true);
      await connect();
      printOutput();
      await runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error fetching records.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdNewSqlFile() {
    return await getOrCreateEditor(true);
  }

  export async function cmdRunFromInput(): Promise<void> {

    try {
      await connect();
      const query = await readInput('Query', `Type the query to run on ${connectionExplorer.getActive().name}`);
      printOutput();
      await runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdRunFromHistory(): Promise<void> {
    try {
      await connect();
      const query = await historyMenu();
      await printOutput();
      await runQuery(query, false);
    } catch (e) {
      ErrorHandler.create('Error while running query.', cmdShowOutputChannel)(e);
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
      await connect();
      printOutput();
      await runQuery(await bookmarksMenu('detail'));
    } catch (e) {
      ErrorHandler.create('Error while running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdAddNewConnection() {
    settingsEditor.show();
  }

  export function cmdRefreshSidebar() {
    languageClient.sendRequest(RefreshConnectionData);
  }

  /**
   * Management functions
   */

  async function connectionMenu(onlyActive = false): Promise<SerializedConnection> {
    const connections: SerializedConnection[] = await languageClient.sendRequest(ClientRequestConnections);

    const availableConns = connections.filter(c => onlyActive ? c.isConnected : true);

    if (availableConns.length === 0 && onlyActive) return connectionMenu();

    if (availableConns.length === 1) return availableConns[0];

    const sel = (await quickPick(availableConns.map((c) => {
      return {
        description: c.isConnected ? 'Currently connected' : '',
        detail: `${c.username}@${c.server}:${c.port}`,
        label: c.name,
      } as QuickPickItem;
    }), 'label', {
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: 'Pick a connection',
      placeHolderDisabled: 'You don\'t have any connections yet.',
      title: 'Connections',
    })) as string;
    return connections.find((c) => c.name === sel);
  }

  async function bookmarksMenu(prop?: string): Promise<QuickPickItem | string> {
    const all = bookmarks.all();

    return await quickPick(Object.keys(all).map((key) => {
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

  function runConnectionCommand(command, ...args) {
    return languageClient.sendRequest(RunCommandRequest, { conn: connectionExplorer.getActive(), command, args });
  }

  async function runQuery(query, addHistory = true) {
    const payload = await runConnectionCommand('query', query);

    if (addHistory) history.add(query);
    queryResults.postMessage({ action: 'queryResults', payload });
  }

  async function tableMenu(conn: SerializedConnection, prop?: string): Promise<string> {
    const { tables } = await getConnData(conn);
    return await quickPick(tables
      .map((table) => {
        return { label: table.name } as QuickPickItem;
      }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,
        title: `Tables in ${conn.database}`,
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

  function printOutput() {
    queryResults.show();
    queryResults.postMessage({ action: 'reset' });
  }

  async function getConnData(conn: SerializedConnection) {
    return await languageClient.sendRequest(GetTablesAndColumnsRequest, { conn });
  }

  async function autoConnectIfActive(currConn?: SerializedConnection) {
    let defaultConnections: SerializedConnection[] = currConn ? [currConn] : [];
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
        .filter((conn) => autoConnectTo.indexOf(conn.name) >= 0) as SerializedConnection[];
    }
    if (defaultConnections.length === 0) {
      return setConnection();
    }
    logger.info(`Configuration set to auto connect to: ${defaultConnections.map(({name}) => name).join(', ')}`);
    try {
      await Promise.all(defaultConnections.slice(1).map(c =>
        setConnection(c)
          .catch(e => {
            ErrorHandler.create(`Failed to auto connect to  ${c.name}`)(e);
            Promise.resolve();
          }),
      ));

      await setConnection(defaultConnections[0]);
      // first should be the active
    } catch (error) {
      ErrorHandler.create('Auto connect failed')(error);
    }
  }
  function loadConfigs() {
    ConfigManager.setSettings(Wspc.getConfiguration(cfgKey) as SettingsInterface);
    setupLogger();
    bookmarks = new BookmarksStorage();
    history = (history || new History(ConfigManager.historySize));
    logger.log(`Env: ${process.env.NODE_ENV}`);
  }
  function setupLogger() {
    logger.setLevel(Logger.levels[ConfigManager.logLevel])
      .setLogging(ConfigManager.logging);
    ErrorHandler.setLogger(logger);
    ErrorHandler.setOutputFn(Win.showErrorMessage);
    Telemetry.setLogger(logger);
  }

  function getExtCommands() {
    return Object.keys(SQLTools).reduce((list, extFn) => {
      if (!extFn.startsWith('cmd') && !extFn.startsWith('editor')) return list;
      let extCmd = extFn.replace(/^(editor|cmd)/, '');
      logger.log(`Registering ${EXT_NAME}.${extCmd}`);
      extCmd = extCmd.charAt(0).toLocaleLowerCase() + extCmd.substring(1, extCmd.length);
      const regFn = extFn.startsWith('editor') ? VSCode.registerTextEditorCommand : VSCode.registerCommand;
      list.push(regFn(`${EXT_NAME}.${extCmd}`, (...args) => {
        logger.log(`Command triggered: ${extCmd}`);
        Telemetry.registerCommand(extCmd);
        SQLTools[extFn](...args);
      }));
      logger.log(`Command ${EXT_NAME}.${extCmd} registered.`);
      return list;
    }, []);
  }

  function updateStatusBar() {
    extDatabaseStatus.tooltip = 'Select a connection';
    extDatabaseStatus.command = `${EXT_NAME}.selectConnection`;
    extDatabaseStatus.text = '$(database) Connect';
    if (connectionExplorer.getActive()) {
      extDatabaseStatus.text = `$(database) ${connectionExplorer.getActive().name}`;
    }
    if (ConfigManager.showStatusbar) {
      extDatabaseStatus.show();
    } else {
      extDatabaseStatus.hide();
    }
  }

  async function registerExtension() {
    connectionExplorerView = Win.createTreeView(`${EXT_NAME}.tableExplorer`, { treeDataProvider: connectionExplorer });
    ContextManager.context.subscriptions.push(
      LogWriter.getOutputChannel(),
      Wspc.onDidChangeConfiguration(reloadConfig),
      Wspc.onDidCloseTextDocument(cmdRefreshSidebar),
      Wspc.onDidOpenTextDocument(cmdRefreshSidebar),
      await getLanguageServerDisposable(),
      settingsEditor,
      queryResults,
      ...getExtCommands(),
      extDatabaseStatus,
    );
    queryResults.onDidDispose(cmdRefreshSidebar);

    registerLanguageServerRequests();
    connectionExplorer.setConnections(ConfigManager.connections);
  }

  async function registerLanguageServerRequests() {
    languageClient.onReady().then(() => {
      languageClient.onRequest(UpdateConnectionExplorerRequest, ({ conn, tables, columns }) => {
        connectionExplorer.setTreeData(conn, tables, columns, connectionExplorerView);
        if (getDbId(connectionExplorer.getActive()) === getDbId(conn) && !conn.isConnected) {
          connectionExplorer.setActiveConnection();
        } else {
          connectionExplorer.setActiveConnection(connectionExplorer.getActive());
        }
      });
      autoConnectIfActive(connectionExplorer.getActive());
    }, ErrorHandler.create('Failed to start language server', cmdShowOutputChannel));
  }
  function reloadConfig() {
    loadConfigs();
    logger.info('Config reloaded!');
    autoConnectIfActive(connectionExplorer.getActive());
    updateStatusBar();
    if (connectionExplorer.setConnections(ConfigManager.connections)) cmdRefreshSidebar();
  }

  async function setConnection(c?: SerializedConnection): Promise<SerializedConnection> {
    let password = null;
    if (c) {
      if (c.askForPassword) password = await askForPassword(c);
      if (c.askForPassword && password === null) return;
      await languageClient.sendRequest(
        OpenConnectionRequest,
        { conn: c, password },
      );
    }
    connectionExplorer.setActiveConnection(c);
    updateStatusBar();
    return connectionExplorer.getActive();
  }

  async function askForPassword(c: SerializedConnection): Promise<string | null> {
    const cachedPass = await languageClient.sendRequest(GetCachedPassword, { conn: c });
    return cachedPass || await Win.showInputBox({
      prompt: `${c.name} password`,
      password: true,
      validateInput: (v) => isEmpty(v) ? 'Password not provided.' : null,
    });
  }
  async function connect(force = false): Promise<SerializedConnection> {
    if (!force && connectionExplorer.getActive()) {
      return connectionExplorer.getActive();
    }
    const c: SerializedConnection = await connectionMenu(true);
    history.clear();
    return setConnection(c);
  }

  async function getLanguageServerDisposable() {
    const serverModule = ContextManager.context.asAbsolutePath('languageserver.js');
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] };

    const serverOptions: ServerOptions = {
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
      run: { module: serverModule, transport: TransportKind.ipc },
    };

    const selector = ConfigManager.completionLanguages.concat(ConfigManager.formatLanguages)
      .reduce((agg, language) => {
        if (typeof language === 'string') {
          agg.push({ language, scheme: 'untitled' });
          agg.push({ language, scheme: 'file' });
        } else {
          agg.push(language);
        }
        return agg;
      }, []);
    let avoidRestart = false;
    const clientOptions: LanguageClientOptions = {
      documentSelector: selector,
      synchronize: {
        configurationSection: 'sqltools',
        fileEvents: Wspc.createFileSystemWatcher('**/.sqltoolsrc'),
      },
      initializationFailedHandler: (error) => {
        Telemetry.registerException(error, { message: 'Server initialization failed.' });
        languageClient.error('Server initialization failed.', error);
        languageClient.outputChannel.show(true);
        return false;
      },
      errorHandler: {
        error: (error, message, count): ErrorAction => {
          logger.error('Language server error', error, message, count);
          Telemetry.registerException(error, { message: 'Language Server error.', givenMessage: message, count });
          return languageClientErrorHandler.error(error, message, count);
        },
        closed: (): CloseAction => {
          if (avoidRestart) {
            return CloseAction.DoNotRestart;
          }

          return languageClientErrorHandler.closed();
        },
      },
    };

    languageClient = new LanguageClient(
      'sqltools-language-server',
      'SQLTools Language Server',
      serverOptions,
      clientOptions,
    );
    languageClient.onReady().then(() => {
      languageClient.onNotification(Notification.ExitCalled, () => {
        avoidRestart = true;
      });
      languageClient.onNotification(Notification.OnError, ({ err = '', errMessage, message }) => {
        ErrorHandler.create(message, cmdShowOutputChannel)((errMessage || err.message || err).toString());
      });
      languageClient.onNotification(Notification.LanguageServerReady, () => {
        logger.debug('Language server is ready!');
      });
    });
    const languageClientErrorHandler = languageClient.createDefaultErrorHandler();

    return await languageClient.start();
  }

  async function getOrCreateEditor(forceCreate = false): Promise<TextEditor> {
    if (forceCreate || !Win.activeTextEditor) {
      const doc = await Wspc.openTextDocument({ language: 'sql' });
      await Win.showTextDocument(doc, 1, false);
    }
    return Win.activeTextEditor;
  }

  async function getSelectedText(action = 'proceed', fullText = false) {
    const editor = await getOrCreateEditor();
    const query = editor.document.getText(fullText ? undefined : editor.selection);
    if (isEmpty(query)) {
      Win.showInformationMessage(`Can't ${action}. You have selected nothing.`);
      throw new DismissedException();
    }
    return query;
  }
  async function insertText(text: string, forceCreate = false) {
    const editor = await getOrCreateEditor(forceCreate);
    editor.edit((edit) => {
      editor.selections.forEach((cursor) => edit.insert(cursor.active, text));
    });
  }

  async function insertSnippet(text: string, forceCreate = false) {
    const editor = await getOrCreateEditor(forceCreate);
    return editor.insertSnippet(new SnippetString(text));
  }

  async function help() {
    try {
      const { current = { } } = await Utils.getlastRunInfo();
      const { lastNotificationDate = 0, updated } = current;
      const lastNDate = parseInt(new Date(lastNotificationDate).toISOString().substr(0, 10).replace(/\D/g, ''), 10);
      const today = parseInt(new Date().toISOString().substr(0, 10).replace(/\D/g, ''), 10);
      const updatedRecently = (today - lastNDate) < 2;

      if (
        ConfigManager.disableReleaseNotifications
        || !updated
        || updatedRecently
      ) return;

      await Utils.updateLastRunInfo({ lastNotificationDate: +new Date() });

      const moreInfo = 'More Info';
      const supportProject = 'Support This Project';
      const releaseNotes = 'Release Notes';
      const message = `SQLTools updated! Check out the release notes for more information.`;
      const options = [ moreInfo, supportProject, releaseNotes ];
      const res: string = await Win.showInformationMessage(message, ...options);
      Telemetry.registerInfoMessage(message, res);
      switch (res) {
        case moreInfo:
          require('opn')('https://github.com/mtxr/vscode-sqltools#donate');
          break;
        case releaseNotes:
          require('opn')(current.releaseNotes);
          break;
        case supportProject:
          require('opn')('https://www.patreon.com/mteixeira');
          break;
      }
    } catch (e) { /***/ }
  }

  async function getTableName(node?: SidebarTable | SidebarView): Promise<string> {
    if (node && node.value) {
      await setConnection(node.conn as SerializedConnection);
      return node.value;
    }

    const conn = await connect(true);

    return await tableMenu(conn, 'label');
  }

  /**
   * @deprecated Will be removed in newer versions.
   */
  async function quickPickOldApi(
    options: QuickPickItem[],
    prop?: string,
  ): Promise<QuickPickItem | any> {
    const sel: QuickPickItem = await Win.showQuickPick(options);
    if (!sel || (prop && !sel[prop])) throw new DismissedException();
    return prop ? sel[prop] : sel;
  }

  type ExtendedQuickPickOptions<T extends QuickPickItem = QuickPickItem | any> = Partial<QuickPickOptions & {
    title: QuickPick<T>['title'];
    placeHolderDisabled?: QuickPick<T>['placeholder'];
  }>;

  async function quickPick(
    options: QuickPickItem[],
    prop?: string,
    quickPickOptions?: ExtendedQuickPickOptions,
  ): Promise<QuickPickItem | any> {
    if (typeof Win.createQuickPick !== 'function') return quickPickOldApi(options, prop);

    const qPick = Win.createQuickPick();
    const sel = await (new Promise<QuickPickItem | any>((resolve) => {
      const { placeHolderDisabled, ...qPickOptions } = quickPickOptions || {} as ExtendedQuickPickOptions;
      qPick.onDidHide(() => qPick.dispose());
      qPick.onDidChangeSelection((selection = []) => {
        qPick.hide();
        return resolve(qPickOptions.canPickMany ? selection : selection[0]);
      });
      qPick.onDidTriggerButton((btn: any) => {
        if (btn.cb) btn.cb();
        qPick.hide();
      });

      Object.keys(qPickOptions).forEach(k => {
        qPick[k] = qPickOptions[k];
      });
      qPick.items = options;
      qPick.enabled = options.length > 0;
      qPick.buttons = [
        {
          iconPath: {
            dark: ContextManager.context.asAbsolutePath('icons/add-connection-dark.svg'),
            light: ContextManager.context.asAbsolutePath('icons/add-connection-light.svg'),
          },
          tooltip: ' Add new Connection',
          cb: cmdAddNewConnection,
        } as any,
      ];

      if (!qPick.enabled) qPick.placeholder = placeHolderDisabled || qPick.placeholder;

      qPick.title = `${qPick.title || 'Items'} (${options.length})`;

      qPick.show();
    }));
    if (!sel || (prop && !sel[prop])) throw new DismissedException();
    return prop ? sel[prop] : sel;
  }

  async function readInput(prompt: string, placeholder?: string) {
    const data = await Win.showInputBox({ prompt, placeHolder: placeholder || prompt });
    if (isEmpty(data)) throw new DismissedException();
    return data;
  }

  function isEmpty(v) {
    return !v || v.length === 0;
  }
}

export const activate = SQLTools.start;
export const deactivate = SQLTools.stop;
