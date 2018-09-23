import {
  commands as VSCode,
  ExtensionContext,
  languages as Languages,
  MarkdownString,
  Position,
  QuickPickItem,
  Range,
  SnippetString,
  StatusBarAlignment,
  StatusBarItem,
  TextEditor,
  TextEditorEdit,
  Uri,
  ViewColumn,
  window as Win,
  workspace as Wspc,
} from 'vscode';
import {
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
} from 'vscode-languageclient';
import {
  BookmarksStorage,
  ConfigManager,
  DatabaseInterface,
  DismissedException,
  ErrorHandler,
  History,
  Logger,
  LoggerInterface,
  SerializedConnection,
  SettingsInterface,
  Telemetry,
  Utils,
} from './api';
import Constants from './constants';
import {
  CreateNewConnectionRequest,
  GetConnectionListRequest,
  GetTablesAndColumnsRequest,
  OpenConnectionRequest,
  RefreshDataRequest,
  RunCommandRequest,
  UpdateTableAndColumnsRequest,
} from './contracts/connection-requests';
import LogWriter from './log-writer';
import {
  ConnectionExplorer,
  HTMLPreview,
  SidebarDatabaseItem,
  SidebarTable,
  SidebarView,
 } from './providers';

namespace SQLTools {
  const cfgKey: string = Constants.extNamespace.toLowerCase();
  const preview = new HTMLPreview(Uri.parse(`sqltools://html`));
  const connectionExplorer = new ConnectionExplorer();
  const extDatabaseStatus = Win.createStatusBarItem(StatusBarAlignment.Left, 10);
  const editingBufferName = `${Constants.bufferName}`;
  const logger = new Logger(LogWriter);
  let ctx: ExtensionContext;
  let bookmarks: BookmarksStorage;
  let history: History;
  let lastUsedConn: SerializedConnection;
  let languageClient: LanguageClient;
  let activationTimer: Utils.Timer;

  export async function start(context: ExtensionContext): Promise<void> {
    activationTimer = new Utils.Timer();
    if (ctx) return;
    ctx = context;
    const localData = Utils.localSetupInfo();
    Telemetry.register();
    loadConfigs();
    const httpServerPort: number = await require('get-port')({ port: localData.httpServerPort || 5123 });
    Utils.writeLocalSetupInfo({ httpServerPort });
    preview.setPort(httpServerPort);
    await registerExtension();
    updateStatusBar();
    activationTimer.end();
    logger.log(`Activation Time: ${activationTimer.elapsed()}ms`);
    Telemetry.registerTime('activation', activationTimer);
    help();
  }

  export function stop(): void {
    return ctx.subscriptions.forEach((sub) => void sub.dispose());
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
      edit.replace(editor.selection, Utils.formatSql(editor.document.getText(editor.selection), indentSize));
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
    return insertSnippet(Utils.generateInsertQuery(node.value, node.items, ConfigManager.format.indentSize));
  }

  export function cmdShowOutputChannel(): void {
    LogWriter.showOutput();
  }
  export function cmdAboutVersion(): void {
    const message = `Using SQLTools ${Constants.version}`;
    logger.info(message);
    Win.showInformationMessage(message, { modal: true });
  }
  export async function cmdSelectConnection(): Promise<void> {
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
      await runConnectionCommand('showRecords', table, ConfigManager.previewLimit);
      printOutput(`Some records of ${table} : SQLTools`);
    } catch (e) {
      ErrorHandler.create('Error while showing table records', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdDescribeTable(node?: SidebarTable | SidebarView): Promise<void> {
    try {
      const table = await getTableName(node);
      await runConnectionCommand('describeTable', table);
      printOutput(`Describing table ${table} : SQLTools`);
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
      runQuery(query);
      printOutput();
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
      runQuery(query);
      printOutput();
    } catch (e) {
      ErrorHandler.create('Error running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdRunFromHistory(): Promise<void> {
    try {
      await connect();
      runQuery(await historyMenu(), false);
      await printOutput();
    } catch (e) {
      ErrorHandler.create('Error while running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdRunFromBookmarks(): Promise<void> {
    try {
      await connect();
      runQuery(await bookmarksMenu('detail'));
      printOutput();
    } catch (e) {
      ErrorHandler.create('Error while running query.', cmdShowOutputChannel)(e);
    }
  }

  export async function cmdSetupSQLTools() {
    return openHtml(preview.uri.with({ fragment: '/setup' }), 'SQLTools Setup Connection');
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

  async function runConnectionCommand(command, ...args) {
    return await languageClient.sendRequest(RunCommandRequest.method, { conn: lastUsedConn, command, args });
  }

  async function runQuery(query, addHistory = true, handleError: boolean = false) {
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
  async function printOutput(outputName: string = 'SQLTools Results') {
    openHtml(preview.uri.with({ fragment: '/query-results' }), outputName);
  }

  async function getConnData() {
    return await languageClient.sendRequest(GetTablesAndColumnsRequest.method) as {
      tables: DatabaseInterface.Table[],
      coluuns: DatabaseInterface.TableColumn[],
    };
  }

  function autoConnectIfActive(currConn?: SerializedConnection) {
    let defaultConnection = currConn || null;
    const a = ConfigManager.autoConnectTo;
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
      list.push(regFn(`${Constants.extNamespace}.${extCmd}`, (...args) => {
        logger.log(`Command triggered: ${extCmd}`);
        Telemetry.registerCommand(extCmd);
        SQLTools[extFn](...args);
      }));
      logger.log(`Command ${Constants.extNamespace}.${extCmd} registered.`);
      return list;
    }, []);
  }

  function updateStatusBar() {
    extDatabaseStatus.tooltip = 'Select a connection';
    extDatabaseStatus.command = `${Constants.extNamespace}.selectConnection`;
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
    Win.registerTreeDataProvider(`${Constants.extNamespace}.tableExplorer`, connectionExplorer);
    ctx.subscriptions.push(
      LogWriter.getOutputChannel(),
      Wspc.onDidChangeConfiguration(reloadConfig),
      await getLanguageServerDisposable(),
      Wspc.registerTextDocumentContentProvider(preview.uri.scheme, preview),
      ...getExtCommands(),
      extDatabaseStatus,
    );

    registerLanguageServerRequests();
  }

  async function registerLanguageServerRequests() {
    languageClient.onReady().then(() => {
      languageClient.onRequest(CreateNewConnectionRequest.method, (newConnPostData) => {
        const connList = ConfigManager.connections;
        connList.push(newConnPostData.connInfo);
        return setSettings('connections', connList);
      });
      languageClient.onRequest(UpdateTableAndColumnsRequest.method, ({ tables, columns }) => {
        connectionExplorer.setTreeData(tables, columns);
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
    if (c && c.needsPassword) password = await askForPassword(c);
    lastUsedConn = c;
    updateStatusBar();
    lastUsedConn = (await languageClient.sendRequest(
      OpenConnectionRequest.method,
      { conn: c, password },
    )) as SerializedConnection;
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
    const serverModule = ctx.asAbsolutePath(require('path').join('dist', 'languageserver', 'index.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6010'] };

    const serverOptions: ServerOptions = {
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
      run: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
    };

    const selector = ConfigManager.completionLanguages.concat(ConfigManager.formatLanguages);

    const clientOptions: LanguageClientOptions = {
      documentSelector: selector,
      synchronize: {
        configurationSection: 'sqltools',
        fileEvents: Wspc.createFileSystemWatcher('**/.sqltoolsrc'),
      },
    };

    languageClient = new LanguageClient(
      'sqltools-language-server',
      'SQLTools Language Server',
      serverOptions,
      clientOptions,
    );

    return await languageClient.start();
  }

  async function getOrCreateEditor(forceCreate = false): Promise<TextEditor> {
    if (forceCreate || !Win.activeTextEditor) {
      const doc = await Wspc.openTextDocument({ language: 'sql' });
      await Win.showTextDocument(doc, 1, false);
    }
    return Win.activeTextEditor;
  }

  function getCurrentViewColumn() {
    let viewColumn: ViewColumn = ViewColumn.One;
    if (Win.activeTextEditor && Win.activeTextEditor.viewColumn) {
      viewColumn = Win.activeTextEditor.viewColumn;
    }
    return viewColumn;
  }

  async function getSelectedText(action = 'proceed') {
    const editor = await getOrCreateEditor();
    const query = editor.document.getText(editor.selection);
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
        require('opn')('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8');
        break;
    }
  }

  async function openHtml(htmlUri: Uri, outputName: string) {
    let viewColumn: ViewColumn = ViewColumn.One;
    if (Win.activeTextEditor && Win.activeTextEditor.viewColumn) {
      viewColumn = Win.activeTextEditor.viewColumn;
    }
    await VSCode.executeCommand('vscode.previewHtml', htmlUri, viewColumn, outputName);
  }

  async function setSettings(key: string, value: any) {
    await Wspc.getConfiguration(cfgKey).update(key, value);
    ConfigManager.setSettings(Wspc.getConfiguration(cfgKey) as SettingsInterface);
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
