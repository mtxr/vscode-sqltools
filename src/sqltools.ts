/// <reference path="./../node_modules/@types/node/index.d.ts" />

import getPort = require('get-port');
import Path = require('path');
import {
  commands as VSCode,
  commands as VsCommands,
  Disposable,
  ExtensionContext,
  FormattingOptions,
  languages as Languages,
  OutputChannel,
  Position,
  QuickPickItem,
  Range,
  Selection,
  SnippetString,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
  TextDocumentChangeEvent,
  TextEdit,
  TextEditor,
  TextEditorEdit,
  TextEditorSelectionChangeEvent,
  ThemeColor,
  Uri,
  ViewColumn,
  window as Window,
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import {
  DocumentRangeFormattingParams,
  DocumentRangeFormattingRequest,
  LanguageClient,
  LanguageClientOptions,
  RequestType,
  RequestType0,
  ServerOptions,
  TextDocumentIdentifier,
  TransportKind,
} from 'vscode-languageclient';
import { BookmarksStorage, History, Logger, Utils } from './api';
import ConfigManager from './api/config-manager';
import Connection from './api/connection';
import ConnectionManager from './api/connection-manager';
import ErrorHandler from './api/error-handler';
import { DismissedException } from './api/exception';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import DatabaseInterface from './api/interface/database-interface';
import Settings from './api/interface/settings';
import Telemetry from './api/telemetry';
import Constants from './constants';
import {
  CreateNewConnectionRequest,
  GetConnectionListRequest,
  SetQueryResultsRequest,
} from './contracts/connection-requests';
import LogWriter from './log-writer';
import HttpContentProvider from './providers/http-provider';
import { SidebarTableColumnProvider } from './providers/sidebar-provider';
import { SidebarColumn, SidebarTable } from './providers/sidebar-provider/sidebar-tree-items';
import { SuggestionsProvider } from './providers/suggestions-provider';

const {
  registerCommand,
  registerTextEditorCommand,
} = VSCode;

/* tslint:disable: no-var-requires */
const openurl = require('opn');
const fs = require('fs');

namespace SQLTools {
  let ctx: ExtensionContext;
  let logger: Logger;
  let bookmarks: BookmarksStorage;
  let history: History;
  let outputLogs: LogWriter;
  // let connection: { name: string, isConnected: boolean } = { isConnected: false };
  let activeConnection: Connection;
  let extDatabaseStatus: StatusBarItem;
  let sqlconnectionTreeProvider: SidebarTableColumnProvider;
  let suggestionsProvider: SuggestionsProvider;
  let previewProvider: HttpContentProvider;
  let languageClient: LanguageClient;
  let httpServerPort: number;
  let activationTimer: Utils.Timer;
  let languageServerTimer: Utils.Timer;
  const previewUri: Uri = Uri.parse(`sqltools://html`);
  const setupUri: Uri = previewUri.with({ fragment: '/setup' });
  const resultsUri: Uri = previewUri.with({ fragment: '/query-results' });
  const cfgKey: string = Constants.extNamespace.toLowerCase();

  export async function start(context: ExtensionContext): Promise<void> {
    activationTimer = new Utils.Timer();
    languageServerTimer = new Utils.Timer();
    if (ctx) return;
    ctx = context;
    const localData = Utils.localSetupInfo();
    loadConfigs();
    httpServerPort = await getPort({ port: localData.httpServerPort || 5123 });
    Utils.writeLocalSetupInfo({ httpServerPort });
    registerProviders();
    registerEvents();
    registerCommands();
    registerStatusBar();
    help();
    registerLanguageServer();
    autoConnectIfActive();
    activationTimer.end();
    logger.debug(`Activation Time: ${activationTimer.elapsed()}ms`);
    Telemetry.registerTime('activation', activationTimer);
  }

  export function stop(): void {
    return ctx.subscriptions.forEach((sub) => void sub.dispose());
  }

  /**
   * Bookmark commands
   */
  export async function editBookmark(): Promise<void> {
    const query = await showBookmarks();
    if (!query) return;
    const editingBufferName = `${Constants.bufferName}`;
    const doc = await Workspace.openTextDocument(Uri.parse(`untitled:${editingBufferName}`));
    const editor = await Window.showTextDocument(doc, 1, false);
    editor.edit((edit) => {
      const headerText = ''.replace('{queryName}', query.label);
      edit.insert(new Position(0, 0), `${headerText}${query.detail}`);
    });
  }
  export async function bookmarkSelection(editor: TextEditor, edit: TextEditorEdit) {
    try {
      const query = editor.document.getText(editor.selection);
      if (!query || query.length === 0) {
        return Window.showInformationMessage('Can\'t bookmark. You have selected nothing.');
      }
      const name = await Window.showInputBox({ prompt: 'Query name' });
      if (!name || name.length === 0) {
        return Window.showInformationMessage('Can\'t bookmark. Name not provided.');
      }
      bookmarks.add(name, query);
      logger.debug(`Bookmarked query named '${name}'`);
    } catch (e) {
      ErrorHandler.create('Error bookmarking query.')(e);
    }
  }

  export async function showBookmarks(): Promise<QuickPickItem> {
    const all = bookmarks.all();

    const options = Object.keys(all).map((key) => {
      return {
        description: '',
        detail: all[key],
        label: key,
      };
    });
    const res = await Window.showQuickPick(options);
    if (!res || !res.detail) throw new DismissedException();
    return res;
  }

  export async function deleteBookmark(): Promise<void> {
    const toDelete = await showBookmarks();
    if (!toDelete) return;
    bookmarks.delete(toDelete.label);
    logger.debug(`Bookmarked query '${toDelete.label}' deleted!`);
  }

  export function clearBookmarks(): void {
    bookmarks.clear();
  }
  /**
   * End of Bookmark commands
   */

  /**
   * Utils commands
   */
  export function formatSql(editor: TextEditor, edit: TextEditorEdit) {
    VsCommands.executeCommand('editor.action.formatSelection');
  }

  /**
   * Utils commands
   */
  export async function appendToCursor(node: SidebarColumn | SidebarTable): Promise<void> {
    const editor = await getOrCreateEditor();
    editor.edit((edit) => {
      const cursors: Selection[] = editor.selections;
      cursors.forEach((cursor) => edit.insert(cursor.active, node.value));
    });
  }

  export async function generateInsertQuery(node: SidebarTable): Promise<boolean> {
    const indentSize = ConfigManager.get('format.indentSize', 2) as number;
    const snippet = new SnippetString(Utils.generateInsertQuery(node.value, node.columns, indentSize));
    const editor = await getOrCreateEditor();
    return await editor.insertSnippet(snippet);
  }

  export function showOutputChannel(): void {
    outputLogs.showOutput();
  }
  export function aboutVersion(): void {
    const message = `Using SQLTools ${Constants.version}`;
    logger.info(message);
    Window.showInformationMessage(message, { modal: true });
  }
  export async function selectConnection(): Promise<void> {
    connect().catch(ErrorHandler.create('Error selecting connection'));
  }

  export function closeConnection(): void {
    setConnection(null);
  }

  export async function showRecords(node?: SidebarTable) {
    try {
      const table = await getTableName(node);
      printOutput(await activeConnection.showRecords(table), `Some records of ${table} : SQLTools`);
    } catch (e) {
      ErrorHandler.create('Error while showing table records', showOutputChannel)(e);
    }
  }

  export async function describeTable(node?: SidebarTable): Promise<void> {
    try {
      const table = await getTableName(node);
      printOutput(await activeConnection.describeTable(table), `Describing table ${table} : SQLTools`);
    } catch (e) {
      ErrorHandler.create('Error while describing table records', showOutputChannel)(e);
    }
  }

  export function describeFunction() {
    Window.showInformationMessage('Not implemented yet.');
  }

  export async function executeQuery(editor: TextEditor, edit: TextEditorEdit): Promise<void> {
    let range: Range;
    if (!editor.selection.isEmpty) {
      range = editor.selection;
    }
    const query: string = editor.document.getText(range);
    if (!query || query.length === 0) {
      Window.showInformationMessage('You should select a query first.');
      return;
    }
    try {
      await connect();
      const result = await activeConnection.query(query);
      history.add(query);
      printOutput(result);
    } catch (e) {
      ErrorHandler.create('Error fetching records.', showOutputChannel)(e);
    }
  }

  export async function runFromInput(): Promise<void> {
    await connect();
    const selectedQuery = await Window.showInputBox({
      placeHolder: `Type the query to run on ${activeConnection.getName()}`,
    });

    if (!selectedQuery || selectedQuery.trim().length === 0) {
      return;
    }
    try {
      const result = await activeConnection.query(selectedQuery);
      history.add(selectedQuery);
      printOutput(result);
    } catch (e) {
      ErrorHandler.create('Error running query.', showOutputChannel)(e);
    }
  }

  export async function showHistory(): Promise<string> {
    const options = history.all().map((query) => {
      return {
        description: '',
        label: query,
      } as QuickPickItem;
    });
    const h = await Window.showQuickPick(options);
    return h.label;
  }

  export async function runFromHistory(): Promise<void> {
    try {
      await connect();
      const query = await showHistory();
      await printOutput(await activeConnection.query(query));
    } catch (e) {
      ErrorHandler.create('Error while running query.', showOutputChannel)(e);
    }
  }

  export async function runFromBookmarks(): Promise<void> {
    await connect();
    const bookmark = await showBookmarks();
    printOutput(await activeConnection.query(bookmark.detail));
  }

  export function setupSQLTools() {
    // test language server
    return openHtml(setupUri, 'SQLTools Setup Connection');
  }

  export function refreshSidebar() {
    sqlconnectionTreeProvider.refresh();
  }

  /**
   * Management functions
   */

  async function showConnectionMenu(): Promise<string> {
    const options: QuickPickItem[] = ConnectionManager.getConnections(logger).map((connection: Connection) => {
      return {
        description: (activeConnection && connection.getName() === activeConnection.getName())
          ? 'Currently connected' : '',
        detail: `${connection.getUsername()}@${connection.getServer()}:${connection.getPort()}`,
        label: connection.getName(),
      } as QuickPickItem;
    });
    const sel: QuickPickItem = await Window.showQuickPick(options);
    if (!sel || !sel.label) throw new DismissedException();
    return sel.label;
  }

  async function showTableMenu(): Promise<string> {
    await connect();
    const tables = await activeConnection.getTables(true);
    const sel: QuickPickItem = await Window.showQuickPick(tables
      .map((table) => {
        return { label: table.name } as QuickPickItem;
      }));
    if (!sel || !sel.label) throw new DismissedException();
    return sel.label;
  }

  async function printOutput(results: DatabaseInterface.QueryResults[], outputName: string = 'SQLTools Results') {
    await languageClient.sendRequest(SetQueryResultsRequest.method, { data: results });
    openHtml(resultsUri, outputName);
  }

  function autoConnectIfActive(currConn?: string) {
    const defaultConnection: string = currConn || ConfigManager.get('autoConnectTo', null) as string;
    logger.info(`Configuration set to auto connect to: ${defaultConnection}`);
    if (!defaultConnection) {
      return setConnection();
    }
    const c = ConnectionManager.getConnection(defaultConnection, logger);
    if (!c) {
      return setConnection();
    }
    setConnection(c);
  }
  function loadConfigs() {
    ConfigManager.setSettings(Workspace.getConfiguration(cfgKey) as Settings);
    bookmarks = new BookmarksStorage();
    const size = ConfigManager.get('historySize', 100) as number;
    history = (history || new History(size));
    setupLogger();
    logger.debug(`Env: ${process.env.NODE_ENV}`);
  }
  function setupLogger() {
    outputLogs = new LogWriter();
    logger = (new Logger(outputLogs))
    .setLevel(Logger.levels[ConfigManager.get('logLevel', 'DEBUG') as string])
    .setLogging(ConfigManager.get('logging', false) as boolean);
    ErrorHandler.setLogger(logger);
    ErrorHandler.setOutputFn(Window.showErrorMessage);
    Telemetry.register(logger);
  }

  function registerCommands(): void {
    [
      'bookmarkSelection',
      'executeQuery',
      'formatSql',
    ].forEach((c) => registerExtCmd(c, registerTextEditorCommand));

    [
      'aboutVersion',
      'appendToCursor',
      'clearBookmarks',
      'closeConnection',
      'deleteBookmark',
      'describeFunction',
      'describeTable',
      'editBookmark',
      'generateInsertQuery',
      'refreshSidebar',
      'runFromBookmarks',
      'runFromHistory',
      'runFromInput',
      'selectConnection',
      'setupSQLTools',
      'showHistory',
      'showOutputChannel',
      'showRecords',
    ].forEach((c) => registerExtCmd(c, registerCommand));
  }

  function registerExtCmd(cmd: string, regFn: Function) {
    ctx.subscriptions.push(regFn(`${Constants.extNamespace}.${cmd}`, (...args) => {
      logger.debug(`Command triggered: ${cmd}`);
      Telemetry.registerCommand(cmd);
      SQLTools[cmd](...args);
    }));
  }

  function registerStatusBar(): void {
    extDatabaseStatus = Window.createStatusBarItem(StatusBarAlignment.Left, 10);
    ctx.subscriptions.push(extDatabaseStatus);
    extDatabaseStatus.command = `${Constants.extNamespace}.selectConnection`;
    extDatabaseStatus.tooltip = 'Select a connection';
    updateStatusBar();
  }

  function updateStatusBar() {
    extDatabaseStatus.text = '$(database) Connect';
    if (activeConnection) {
      extDatabaseStatus.text = `$(database) ${activeConnection.getName()}`;
    }
    if (ConfigManager.get('showStatusbar', true)) {
      extDatabaseStatus.show();
    } else {
      extDatabaseStatus.hide();
    }
  }

  function registerProviders() {
    previewProvider = new HttpContentProvider(httpServerPort, previewUri);
    ctx.subscriptions.push(
      Workspace.registerTextDocumentContentProvider(previewUri.scheme, previewProvider),
    );
    sqlconnectionTreeProvider = new SidebarTableColumnProvider(activeConnection, logger);
    Window.registerTreeDataProvider(`${Constants.extNamespace}.connectionExplorer`, sqlconnectionTreeProvider);
    suggestionsProvider = new SuggestionsProvider(logger);
    const completionTriggers = ['.', ' '];
    ctx.subscriptions.push(
      Languages.registerCompletionItemProvider(
        ConfigManager.get('completionLanguages', ['sql']) as string[],
        suggestionsProvider, ...completionTriggers,
      ),
    );
  }

  function registerEvents() {
    const event: Disposable = Workspace.onDidChangeConfiguration(reloadConfig);
    ctx.subscriptions.push(event);
  }

  function reloadConfig() {
    const currentConnection = activeConnection ? activeConnection.getName() : null;
    ConfigManager.setSettings(Workspace.getConfiguration(cfgKey) as Settings);
    logger.info('Config reloaded!');
    loadConfigs();
    autoConnectIfActive(currentConnection);
    updateStatusBar();
  }

  async function setConnection(connection?: Connection): Promise<Connection> {
    if (activeConnection) activeConnection.close();
    if (connection && connection.needsPassword()) await askForPassword(connection);
    activeConnection = connection;
    updateStatusBar();
    suggestionsProvider.setConnection(activeConnection);
    sqlconnectionTreeProvider.setConnection(activeConnection);
    if (!activeConnection) return null;
    await activeConnection.connect();
    return activeConnection;
  }

  async function askForPassword(connection): Promise<Connection> {
    const password = await Window.showInputBox({ prompt: `${connection.getName()} password`, password: true });
    if (!password || password.length === 0) {
      throw new Error('Password not provided.');
    }
    connection.setPassword(password);
    return connection;
  }
  async function connect(): Promise<Connection> {
    if (activeConnection && activeConnection.isConnected) {
      return activeConnection;
    }
    const connName: string = await showConnectionMenu();
    history.clear();
    return setConnection(ConnectionManager.getConnection(connName, logger));
  }

  async function registerLanguageServer() {
    const serverModule = ctx.asAbsolutePath(Path.join('dist', 'languageserver', 'index.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] };

    const serverOptions: ServerOptions = {
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
      run: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
    };

    const selector = (ConfigManager.get('completionLanguages', ['sql']) as string[])
      .concat(ConfigManager.get('formatLanguages', ['sql']) as string[]);

    const clientOptions: LanguageClientOptions = {
      documentSelector: selector,
      synchronize: {
        configurationSection: 'sqltools',
        fileEvents: Workspace.createFileSystemWatcher('**/.sqltoolsrc'),
      },
    };

    languageClient = new LanguageClient(
      'language-server',
      'SQLTools Language Server',
      serverOptions,
      clientOptions,
    );
    ctx.subscriptions.push(languageClient.start());
    await languageClient.onReady();
    languageClient.onRequest(CreateNewConnectionRequest.method, (newConnPostData) => {
      const connList = ConfigManager.get('connections', []) as any[];
      connList.push(newConnPostData.connInfo);
      return setSettings('connections', connList);
    });
    languageServerTimer.end();
    logger.info(`Language server started in ${languageServerTimer.elapsed()}ms`);
  }

  async function getOrCreateEditor(): Promise<TextEditor> {
    if (!Window.activeTextEditor) {
      await VsCommands.executeCommand('workbench.action.files.newUntitledFile');
    }
    return Window.activeTextEditor;
  }

  async function help() {
    const moreInfo = 'More Info';
    const supportProject = 'Support This Project';
    const releaseNotes = 'Release Notes';
    const localConfig = await Utils.getlastRunInfo();

    let message = 'Do you like SQLTools? Help us to keep making it better.';

    if (localConfig.current.numericVersion <= localConfig.installed.numericVersion) {
      return;
    }
    const options = [ moreInfo, supportProject ];
    if (localConfig.installed.numericVersion !== 0) {
      message = `SQLTools updated! Check out the release notes for more information.`;
      options.push(releaseNotes);
    }
    const res: string = await Window.showInformationMessage(message, ...options);
    Telemetry.registerInfoMessage(message, res);
    switch (res) {
      case moreInfo:
        openurl('https://github.com/mtxr/vscode-sqltools#donate');
        break;
      case releaseNotes:
        openurl(localConfig.current.releaseNotes);
        break;
      case supportProject:
        openurl('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8');
        break;
    }
  }

  async function openHtml(htmlUri: Uri, outputName: string) {
    let viewColumn: ViewColumn = ViewColumn.One;
    const editor = Window.activeTextEditor;
    if (editor && editor.viewColumn) {
      viewColumn = editor.viewColumn;
    }
    await VsCommands.executeCommand('vscode.previewHtml', htmlUri, viewColumn, outputName);
  }

  async function setSettings(key: string, value: any) {
    await Workspace.getConfiguration(cfgKey).update(key, value);
  }

  async function getTableName(node?: SidebarTable): Promise<string> {
    if (node && node.value) {
      return node.value;
    }
    return await showTableMenu();
  }
}

export const activate = SQLTools.start;
export const deactivate = SQLTools.stop;
