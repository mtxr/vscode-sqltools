import {
  commands as VSCode,
  ExtensionContext,
  QuickPickItem,
  SnippetString,
  StatusBarAlignment,
  TextEditor,
  TextEditorEdit,
  Uri,
  ViewColumn,
  window as Win,
  workspace as Wspc,
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

import { DISPLAY_NAME, VERSION } from '@sqltools/core/constants';
import ContextManager from './context';

import {
  GetConnectionListRequest,
  GetTablesAndColumnsRequest,
  OpenConnectionRequest,
  RefreshDataRequest,
  RunCommandRequest,
  UpdateTableAndColumnsRequest,
  QueryResults,
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
import { SerializedConnection, DatabaseInterface, Settings as SettingsInterface } from '@sqltools/core/interface';
import { Timer, Telemetry, query as QueryUtils } from '@sqltools/core/utils';
import { DismissedException } from '@sqltools/core/exception';

namespace SQLTools {
  const cfgKey: string = DISPLAY_NAME.toLowerCase();
  const connectionExplorer = new ConnectionExplorer();
  const extDatabaseStatus = Win.createStatusBarItem(StatusBarAlignment.Left, 10);
  const logger = new Logger(LogWriter);
  const queryResults = new QueryResultsPreviewer();
  const settingsEditor = new SettingsEditor();

  let bookmarks: BookmarksStorage;
  let history: History;
  let lastUsedConn: SerializedConnection;
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

  export function cmdCloseConnection(): void {
    setConnection(null)
      .then(() => languageClient.sendRequest(RefreshDataRequest))
      .catch(ErrorHandler.create('Error closing connection'));
  }

  export async function cmdShowRecords(node?: SidebarTable | SidebarView) {
    try {
      const table = await getTableName(node);
      printOutput();
      await runConnectionCommand('showRecords', table, ConfigManager.previewLimit);
    } catch (e) {
      ErrorHandler.create('Error while showing table records', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdDescribeTable(node?: SidebarTable | SidebarView): Promise<void> {
    try {
      const table = await getTableName(node);
      printOutput();
      await runConnectionCommand('describeTable', table);
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
      runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error fetching records.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdExecuteQueryFromFile(): Promise<void> {
    try {
      const query: string = await getSelectedText('execute file', true);
      await connect();
      printOutput();
      runQuery(query);
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
      const query = await readInput('Query', `Type the query to run on ${lastUsedConn.name}`);
      printOutput();
      runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdRunFromHistory(): Promise<void> {
    try {
      await connect();
      await printOutput();
      runQuery(await historyMenu(), false);
    } catch (e) {
      ErrorHandler.create('Error while running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdRunFromBookmarks(): Promise<void> {
    try {
      await connect();
      printOutput();
      runQuery(await bookmarksMenu('detail'));
    } catch (e) {
      ErrorHandler.create('Error while running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdAddNewServer() {
    settingsEditor.show();
  }

  export function cmdRefreshSidebar() {
    languageClient.sendRequest(RefreshDataRequest);
  }

  /**
   * Management functions
   */

  async function connectionMenu(): Promise<SerializedConnection> {
    const connections: SerializedConnection[] = await languageClient.sendRequest(GetConnectionListRequest);

    const sel = (await quickPick(connections.map((c) => {
      return {
        description: c.isConnected ? 'Currently connected' : '',
        detail: `${c.username}@${c.server}:${c.port}`,
        label: c.name,
      } as QuickPickItem;
    }), 'label')) as string;
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
    }), prop);
  }

  function runConnectionCommand(command, ...args) {
    return languageClient.sendRequest(RunCommandRequest.method, { conn: lastUsedConn, command, args });
  }

  async function runQuery(query, addHistory = true) {
    const res = await languageClient.sendRequest(RunCommandRequest.method, {
      conn: lastUsedConn,
      command: 'query',
      args: [query],
    });
    if (addHistory) history.add(query);
    return res;
  }

  async function tableMenu(prop?: string): Promise<string> {
    const { tables } = await getConnData();
    return await quickPick(tables
      .map((table) => {
        return { label: table.name } as QuickPickItem;
      }), prop);
  }

  async function historyMenu(prop: string = 'label'): Promise<string> {
    return await quickPick(history.all().map((query) => {
      return {
        description: '',
        label: query,
      } as QuickPickItem;
    }), prop);
  }

  function printOutput() {
    queryResults.show();
  }

  async function getConnData() {
    return await languageClient.sendRequest(GetTablesAndColumnsRequest.method) as {
      tables: DatabaseInterface.Table[],
      coluuns: DatabaseInterface.TableColumn[],
    };
  }

  function autoConnectIfActive(currConn?: SerializedConnection) {
    let defaultConnection = currConn || null;
    if (!defaultConnection && ConfigManager.autoConnectTo) {
      defaultConnection = {
        name: ConfigManager.connections
          .find((conn) => conn.name === ConfigManager.autoConnectTo).name,
      } as SerializedConnection;
    }
    if (!defaultConnection) {
      return setConnection();
    }
    logger.info(`Configuration set to auto connect to: ${defaultConnection.name}`);
    setConnection(defaultConnection);
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
      logger.log(`Registering SQLTools.${extCmd}`);
      extCmd = extCmd.charAt(0).toLocaleLowerCase() + extCmd.substring(1, extCmd.length);
      const regFn = extFn.startsWith('editor') ? VSCode.registerTextEditorCommand : VSCode.registerCommand;
      list.push(regFn(`${DISPLAY_NAME}.${extCmd}`, (...args) => {
        logger.log(`Command triggered: ${extCmd}`);
        Telemetry.registerCommand(extCmd);
        SQLTools[extFn](...args);
      }));
      logger.log(`Command ${DISPLAY_NAME}.${extCmd} registered.`);
      return list;
    }, []);
  }

  function updateStatusBar() {
    extDatabaseStatus.tooltip = 'Select a connection';
    extDatabaseStatus.command = `${DISPLAY_NAME}.selectConnection`;
    extDatabaseStatus.text = '$(database) Connect';
    if (lastUsedConn) {
      extDatabaseStatus.text = `$(database) ${lastUsedConn.name}`;
    }
    if (ConfigManager.showStatusbar) {
      extDatabaseStatus.show();
    } else {
      extDatabaseStatus.hide();
    }
  }

  async function registerExtension() {
    Win.registerTreeDataProvider(`${DISPLAY_NAME}.tableExplorer`, connectionExplorer);
    ContextManager.context.subscriptions.push(
      LogWriter.getOutputChannel(),
      Wspc.onDidChangeConfiguration(reloadConfig),
      await getLanguageServerDisposable(),
      settingsEditor,
      queryResults,
      ...getExtCommands(),
      extDatabaseStatus,
    );

    registerLanguageServerRequests();
    connectionExplorer.setConnections(ConfigManager.connections);
  }

  async function registerLanguageServerRequests() {
    languageClient.onReady().then(() => {
      languageClient.onRequest(UpdateTableAndColumnsRequest.method, ({ conn, tables, columns }) => {
        connectionExplorer.setTreeData(conn, tables, columns);
      });
      languageClient.onRequest(QueryResults.method, (payload) => {
        queryResults.postMessage({action: 'queryResults', payload });
      });
      autoConnectIfActive(lastUsedConn);
    }, ErrorHandler.create('Failed to start language server', cmdShowOutputChannel));
  }
  function reloadConfig() {
    loadConfigs();
    logger.info('Config reloaded!');
    autoConnectIfActive(lastUsedConn);
    updateStatusBar();
  }

  async function setConnection(c?: SerializedConnection): Promise<SerializedConnection> {
    let password = null;
    if (c && c.askForPassword) password = await askForPassword(c);
    lastUsedConn = c;
    updateStatusBar();
    lastUsedConn = (await languageClient.sendRequest(
      OpenConnectionRequest.method,
      { conn: c, password },
    ));
    return lastUsedConn;
  }

  async function askForPassword(c: SerializedConnection): Promise<string | null> {
    const password = await Win.showInputBox({
      prompt: `${c.name} password`,
      password: true,
      validateInput: (v) => isEmpty(v) ? 'Password not provided.' : null,
    });
    return password;
  }
  async function connect(force = false): Promise<SerializedConnection> {
    if (!force && lastUsedConn) {
      return lastUsedConn;
    }
    const c: SerializedConnection = await connectionMenu();
    history.clear();
    return setConnection(c);
  }

  async function getLanguageServerDisposable() {
    const serverModule = ContextManager.context.asAbsolutePath('languageserver.js');
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] };

    const serverOptions: ServerOptions = {
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
      run: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
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
        languageClient.error('Server initialization failed.', error);
        languageClient.outputChannel.show(true);
        return false;
      },
      errorHandler: {
        error: (error, message, count): ErrorAction => {
          logger.error('Language server error', error, message, count);
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
    const localConfig = await Utils.getlastRunInfo();
    if (localConfig.current.numericVersion <= localConfig.installed.numericVersion) {
      return;
    }
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
        require('opn')(localConfig.current.releaseNotes);
        break;
      case supportProject:
        require('opn')('https://www.patreon.com/mteixeira');
        break;
    }
  }

  async function setSettings(key: string, value: any) {
    await Wspc.getConfiguration(cfgKey).update(key, value);
  }

  async function getTableName(node?: SidebarTable | SidebarView): Promise<string> {
    if (node && node.value) {
      return node.value;
    }
    return await tableMenu('label');
  }
  async function quickPick(options: QuickPickItem[], prop: string = null): Promise<QuickPickItem | any> {
    const sel: QuickPickItem = await Win.showQuickPick(options);
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
