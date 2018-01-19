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
  Connection,
  ConnectionCredentials,
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
  OpenConnectionRequest,
} from './contracts/connection-requests';
import LogWriter from './log-writer';
import {
  // CompletionProvider,
  ConnectionExplorer,
  HTMLPreview,
  SidebarDatabaseItem,
  SidebarTable,
 } from './providers';

namespace SQLTools {
  const cfgKey: string = Constants.extNamespace.toLowerCase();
  const preview = new HTMLPreview(Uri.parse(`sqltools://html`));
  const connectionExplorer = new ConnectionExplorer();
  // const completions = new CompletionProvider();
  const extDatabaseStatus = Win.createStatusBarItem(StatusBarAlignment.Left, 10);
  const editingBufferName = `${Constants.bufferName}`;
  let ctx: ExtensionContext;
  let logger: LoggerInterface;
  let bookmarks: BookmarksStorage;
  let history: History;
  let outputLogs: LogWriter;
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
    const query = (await bookmarksMenu()) as QuickPickItem;
    const headerText = ''.replace('{queryName}', query.label);
    insertText(`${headerText}${query.detail}`, true);
  }
  export async function cmdBookmarkSelection() {
    try {
      const query = await getSelectedText();
      const name = await Win.showInputBox({ prompt: 'Query name' });
      if (!name || name.length === 0) {
        return Win.showInformationMessage('Can\'t bookmark. Name not provided.');
      }
      bookmarks.add(name, query);
    } catch (e) {
      ErrorHandler.create('Error bookmarking query.')(e);
    }
  }

  export async function cmdDeleteBookmark(): Promise<void> {
    try {
      const toDelete = (await bookmarksMenu('label')) as string;
      bookmarks.delete(toDelete);
    } catch (e) {
      ErrorHandler.create('Error deleting bookmark.')(e);
    }
  }

  export function cmdClearBookmarks(): void {
    bookmarks.clear();
  }
  export function editorFormatSql(editor: TextEditor, edit: TextEditorEdit) {
    VSCode.executeCommand('editor.action.formatSelection');
  }

  export async function cmdAppendToCursor(node: SidebarDatabaseItem): Promise<void> {
    insertText(node.value);
  }

  export async function cmdGenerateInsertQuery(node: SidebarTable): Promise<boolean> {
    const indentSize = ConfigManager.get('format.indentSize', 2) as number;
    return insertSnippet(Utils.generateInsertQuery(node.value, node.columns, indentSize));
  }

  export function cmdShowOutputChannel(): void {
    outputLogs.showOutput();
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
    setConnection(null);
  }

  // export async function cmdShowRecords(node?: SidebarTable) {
    // try {
    //   const table = await getTableName(node);
    //   printOutput(await lastUsedConn.showRecords(table), `Some records of ${table} : SQLTools`);
    // } catch (e) {
    //   ErrorHandler.create('Error while showing table records', showOutputChannel)(e);
    // }
  // }

  export async function cmdDescribeTable(node?: SidebarDatabaseItem): Promise<void> {
    // try {
    //   const table = await getTableName(node);
    //   printOutput(await lastUsedConn.describeTable(table), `Describing table ${table} : SQLTools`);
    // } catch (e) {
    //   ErrorHandler.create('Error while describing table records', showOutputChannel)(e);
    // }
  }

  export function cmdDescribeFunction() {
    Win.showInformationMessage('Not implemented yet.');
  }

  export async function editorExecuteQuery(editor: TextEditor, edit: TextEditorEdit): Promise<void> {
    // let range: Range;
    // if (!editor.selection.isEmpty) {
    //   range = editor.selection;
    // }
    // const query: string = editor.document.getText(range);
    // if (!query || query.length === 0) {
    //   Window.showInformationMessage('You should select a query first.');
    //   return;
    // }
    // try {
    //   await connect();
    //   const result = await lastUsedConn.query(query);
    //   history.add(query);
    //   printOutput(result);
    // } catch (e) {
    //   ErrorHandler.create('Error fetching records.', showOutputChannel)(e);
    // }
  }

  export async function cmdRunFromInput(): Promise<void> {
    // await connect();
    // const selectedQuery = await Window.showInputBox({
    //   placeHolder: `Type the query to run on ${lastUsedConn.getName()}`,
    // });

    // if (!selectedQuery || selectedQuery.trim().length === 0) {
    //   return;
    // }
    // try {
    //   const result = await lastUsedConn.query(selectedQuery);
    //   history.add(selectedQuery);
    //   printOutput(result);
    // } catch (e) {
    //   ErrorHandler.create('Error running query.', showOutputChannel)(e);
    // }
  }

  // export async function cmdShowHistory(): Promise<string> {
    // const options = history.all().map((query) => {
    //   return {
    //     description: '',
    //     label: query,
    //   } as QuickPickItem;
    // });
    // const h = await Window.showQuickPick(options);
    // return h.label;
  // }

  export async function cmdRunFromHistory(): Promise<void> {
    // try {
    //   await connect();
    //   const query = await showHistory();
    //   await printOutput(await lastUsedConn.query(query));
    // } catch (e) {
    //   ErrorHandler.create('Error while running query.', showOutputChannel)(e);
    // }
  }

  export async function cmdRunFromBookmarks(): Promise<void> {
    // await connect();
    // const bookmark = await showBookmarks();
    // printOutput(await lastUsedConn.query(bookmark.detail));
  }

  export async function cmdSetupSQLTools() {
    return openHtml(preview.uri.with({ fragment: '/setup' }), 'SQLTools Setup Connection');
  }

  export function cmdRefreshSidebar() {
    connectionExplorer.refresh();
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

  // async function showTableMenu(): Promise<string> {
  //   await connect();
  //   return await quickPick((await lastUsedConn.getTables(true))
  //     .map((table) => {
  //       return { label: table.name } as QuickPickItem;
  //     }));
  // }

  // async function printOutput(results: DatabaseInterface.QueryResults[], outputName: string = 'SQLTools Results') {
  //   await languageClient.sendRequest(SetQueryResultsRequest, { data: results });
  //   openHtml(previewUri.with({ fragment: '/query-results' }), outputName);
  // }

  // function autoConnectIfActive(currConn?: string) {
  //   const defaultConnection: string = currConn || ConfigManager.get('autoConnectTo', null) as string;
  //   logger.info(`Configuration set to auto connect to: ${defaultConnection}`);
  //   if (!defaultConnection) {
  //     return setConnection();
  //   }
  //   const c = ConnectionManager.getConnection(defaultConnection, logger);
  //   if (!c) {
  //     return setConnection();
  //   }
  //   setConnection(c);
  // }
  function loadConfigs() {
    ConfigManager.setSettings(Wspc.getConfiguration(cfgKey) as SettingsInterface);
    bookmarks = new BookmarksStorage();
    history = (history || new History(ConfigManager.get('historySize', 100) as number));
    setupLogger();
    logger.log(`Env: ${process.env.NODE_ENV}`);
  }
  function setupLogger() {
    logger = new Logger(outputLogs = outputLogs || new LogWriter())
      .setLevel(Logger.levels[ConfigManager.get('logLevel', 'DEBUG') as string])
      .setLogging(ConfigManager.get('logging', false) as boolean);
    ErrorHandler.setLogger(logger);
    ErrorHandler.setOutputFn(Win.showErrorMessage);
    Telemetry.setLogger(logger);
  }

  function getExtCommands() {
    return Object.keys(SQLTools).reduce((list, extFn) => {
      let regFn = null;
      if (extFn.startsWith('cmd')) regFn = VSCode.registerCommand;
      if (extFn.startsWith('editor')) regFn = VSCode.registerTextEditorCommand;
      if (!regFn) return list;
      let extCmd = extFn.replace(/^(editor|cmd)/, '');
      extCmd = extCmd.charAt(0).toLocaleLowerCase() + extCmd.substring(1, extCmd.length);
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
    if (ConfigManager.get('showStatusbar', true)) {
      extDatabaseStatus.show();
    } else {
      extDatabaseStatus.hide();
    }
  }

  async function registerExtension() {
    Win.registerTreeDataProvider(`${Constants.extNamespace}.connectionExplorer`, connectionExplorer);
    ctx.subscriptions.push(
      Wspc.onDidChangeConfiguration(reloadConfig),
      await getLanguageServerDisposable(),
      Wspc.registerTextDocumentContentProvider(preview.uri.scheme, preview),
      // Languages.registerCompletionItemProvider(
      //   ConfigManager.get('completionLanguages', ['sql']) as string[],
      //   completions, ...ConfigManager.get('completionTriggers', ['.', ' ']) as string[],
      // ),
      ...getExtCommands(),
      extDatabaseStatus,
    );

    registerLanguageServerRequests();
  }

  async function registerLanguageServerRequests() {
    languageClient.onReady().then(() => {
      languageClient.onRequest(CreateNewConnectionRequest.method, (newConnPostData) => {
        const connList = ConfigManager.get('connections', []) as any[];
        connList.push(newConnPostData.connInfo);
        return setSettings('connections', connList);
      });
    }, ErrorHandler.create('Failed to start language server', cmdShowOutputChannel));
  }
  function reloadConfig() {
    const currentConnection = lastUsedConn ? lastUsedConn.name : null;
    ConfigManager.setSettings(Wspc.getConfiguration(cfgKey) as SettingsInterface);
    logger.info('Config reloaded!');
    loadConfigs();
    // autoConnectIfActive(currentConnection);
    updateStatusBar();
  }

  async function setConnection(c?: SerializedConnection): Promise<SerializedConnection> {
    let password = null;
    if (c && c.needsPassword) password = await askForPassword(c);
    lastUsedConn = c;
    updateStatusBar();
    // suggestionsProvider.setConnection(lastUsedConn);
    // sqlconnectionTreeProvider.setConnection(lastUsedConn);
    if (!lastUsedConn) return null;
    await languageClient.sendRequest(OpenConnectionRequest.method, { conn: c, password });
    return lastUsedConn;
  }

  async function askForPassword(c: SerializedConnection): Promise<string | null> {
    const password = await Win.showInputBox({ prompt: `${c.name} password`, password: true });
    if (!password || password.length === 0) {
      throw new Error('Password not provided.');
    }
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

    const selector = (ConfigManager.get('completionLanguages', ['sql']) as string[])
      .concat(ConfigManager.get('formatLanguages', ['sql']) as string[]);

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
      const doc = await Wspc.openTextDocument(Uri.parse(`untitled:${editingBufferName}`));
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

  async function getSelectedText() {
    const editor = await getOrCreateEditor();
    const query = editor.document.getText(editor.selection);
    if (!query || query.length === 0) {
      Win.showInformationMessage('Can\'t bookmark. You have selected nothing.');
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
  }

  // async function getTableName(node?: SidebarTable): Promise<string> {
  //   if (node && node.value) {
  //     return node.value;
  //   }
  //   return await showTableMenu();
  // }
  async function quickPick(options: QuickPickItem[], prop: string = null): Promise<QuickPickItem | any> {
    const sel: QuickPickItem = await Win.showQuickPick(options);
    if (!sel) throw new DismissedException();
    if (prop && !sel[prop]) throw new DismissedException();
    return prop ? sel[prop] : sel;
  }
}

export const activate = SQLTools.start;
export const deactivate = SQLTools.stop;
