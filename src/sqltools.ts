/// <reference path="./../node_modules/@types/node/index.d.ts" />

import { EventEmitter } from 'events';
import * as Path from 'path';
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
import * as ConfigManager from './api/config-manager';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import DatabaseInterface from './api/interface/database-interface';
import Connection from './connection';
import ConnectionManager from './connection-manager';
import Constants from './constants';
import errorHandler from './error-handler';
import { SelectionFormatter } from './formatting-provider';
import { Settings } from './interface/settings';
import LogWriter from './log-writer';
import QueryResultsProvider from './query-results-provider';
import { SidebarTableColumnProvider } from './sidebar-provider';
import { SidebarColumn, SidebarTable } from './sidebar-tree-items';
import StatisticsProvider from './statistics-provider';
import { SuggestionsProvider } from './suggestions-provider';
import Telemetry from './telemetry';

const {
  registerCommand,
  registerTextEditorCommand,
} = VSCode;

/* tslint:disable: no-var-requires */
const openurl = require('opn');
const fs = require('fs');

export default class SQLTools {
  public static bootstrap(context: ExtensionContext): SQLTools {
    if (SQLTools.instance) {
      return SQLTools.instance;
    }
    SQLTools.instance = new SQLTools(context);

    return SQLTools.instance;
  }
  private static instance: SQLTools = null;
  private logger: Logger;
  private bookmarks: BookmarksStorage;
  private history: History;
  private outputLogs: LogWriter;
  private activeConnection: Connection;
  private extStatus: StatusBarItem;
  private extDatabaseStatus: StatusBarItem;
  private events: EventEmitter;
  private outputProvider: QueryResultsProvider;
  private statisticsProvider: StatisticsProvider;
  private sqlconnectionTreeProvider: SidebarTableColumnProvider;
  private suggestionsProvider: SuggestionsProvider;
  private previewUri = Uri.parse('sqltools-query://results');
  private statisticsUri = Uri.parse('sqltools-reports://statistics');
  private languageClient: LanguageClient;

  private constructor(private context: ExtensionContext) {
    this.events = new EventEmitter();
    this.loadConfigs();
    this.setupLogger();
    this.registerProviders();
    this.registerEvents();
    this.registerCommands();
    this.registerStatusBar();
    this.autoConnectIfActive();
    this.help();
    this.registerLanguageServer();
  }

  /**
   * Bookmark commands
   */
  public editBookmark(): void {
    this.showBookmarks()
      .then((query) => {
        if (!query) return;
        this.logger.debug(`Selected bookmarked query ${query.label}`);

        const editingBufferName = `${Constants.bufferName}`;
        Workspace.openTextDocument(Uri.parse(`untitled:${editingBufferName}`)).then((document: TextDocument) => {
          Window.showTextDocument(document, 1, false).then((editor) => {
            editor.edit((edit) => {
              const headerText = ''.replace('{queryName}', query.label);
              edit.insert(new Position(0, 0), `${headerText}${query.detail}`);
            });
          });
        }, (error) => errorHandler(this.logger, 'Ops, we\'ve got an error!', error, this.showOutputChannel));
      }, (error) => errorHandler(this.logger, 'Ops, we\'ve got an error!', error, this.showOutputChannel));
  }
  public bookmarkSelection(editor: TextEditor, edit: TextEditorEdit) {
    try {
      const query = editor.document.getText(editor.selection);
      if (!query || query.length === 0) {
        return Window.showInformationMessage('Can\'t bookmark. You have selected nothing.');
      }
      Window.showInputBox({ prompt: 'Query name' })
        .then((name) => {
          if (!name || name.length === 0) {
            return Window.showInformationMessage('Can\'t bookmark. Name not provided.');
          }
          this.bookmarks.add(name, query);
          this.logger.debug(`Bookmarked query named '${name}'`);
        });
    } catch (error) {
      errorHandler(this.logger, 'Error bookmarking query.', error);
    }
  }

  public showBookmarks(): Thenable<QuickPickItem> {
    const all: Object = this.bookmarks.all();
    const options: QuickPickItem[] = [];

    Object.keys(all).forEach((key) => {
      options.push({
        description: '',
        detail: all[key],
        label: key,
      });
    });
    return Window.showQuickPick(options);
  }

  public deleteBookmark(): void {
    this.showBookmarks()
      .then((toDelete) => {
        if (!toDelete) return;
        this.bookmarks.delete(toDelete.label);
        this.logger.debug(`Bookmarked query '${toDelete.label}' deleted!`);
      });
  }

  public clearBookmarks(): void {
    this.bookmarks.clear();
    this.logger.debug(`Bookmark cleared!`);
  }
  /**
   * End of Bookmark commands
   */

  /**
   * Utils commands
   */
  public formatSql(editor: TextEditor, edit: TextEditorEdit) {
    VsCommands.executeCommand('editor.action.formatSelection');
  }

  /**
   * Utils commands
   */
  public appendToCursor(node: SidebarColumn | SidebarTable): void {
    this.getOrCreateEditor()
    .then((editor) => {
      editor.edit((edit) => {
        const cursors: Selection[] = editor.selections;
        cursors.forEach((cursor: Selection) => {
          edit.insert(cursor.active, node.value);
        });
      });
    }, (error) => {
      errorHandler(this.logger, 'Error adding table/column to editor.', error);
    });
  }

  public generateInsertQuery(node: SidebarTable): void {
    this.getOrCreateEditor()
    .then((editor) => {
      const indentSize = ConfigManager.get('format.indentSize', 2) as number;
      return editor.insertSnippet(
        new SnippetString(Utils.generateInsertQuery(node.value, [ ...node.columns.values() ], indentSize)),
      );
    }, (error) => {
      errorHandler(this.logger, 'Error adding table/column to editor.', error);
    });
  }

  public showOutputChannel(): void {
    this.outputLogs.showOutput();
  }
  public aboutVersion(): void {
    const message = `Using SQLTools ${Constants.version}`;
    this.logger.info(message);
    Window.showInformationMessage(message);
  }
  /**
   * End utils commands
   */

  /**
   * Connection commands
   */

  public selectConnection(): Thenable<Connection> {
    return this.showConnectionMenu().then((selection: QuickPickItem) => {
      if (!selection || !selection.label) return;
      this.history.clear();
      return this.setConnection(ConnectionManager.getConnection(selection.label));
    }, (reason) => {
      this.setConnection(null);
      errorHandler(this.logger, 'Error while selecting the connection.', reason, this.showOutputChannel);
      // throw reason;
    });
  }

  public closeConnection(): void {
    this.setConnection(null);
  }

  public showConnectionMenu(): Thenable<QuickPickItem> {
    const options: QuickPickItem[] = ConnectionManager.getConnections(this.logger).map((connection: Connection) => {
      return {
        detail: `${connection.getUsername()}@${connection.getServer()}:${connection.getPort()}`,
        label: connection.getName(),
      } as QuickPickItem;
    });
    return Window.showQuickPick(options);
  }

  public showTableMenu(): Thenable<QuickPickItem> {
    return this.checkIfConnected().then(() => {
      return this.activeConnection.getTables(true)
        .then((tables) => {
          const options: QuickPickItem[] = tables.map((table) => {
            return { label: table.name } as QuickPickItem;
          });
          return Window.showQuickPick(options);
        })
        .catch ((error) => errorHandler(this.logger, 'Error fetching tables.', error, this.showOutputChannel));
    }, (error) => errorHandler(this.logger, 'Error showing tables.', error, this.showOutputChannel));
  }

  public showRecords(node?: SidebarTable) {
    let tablePromise: PromiseLike<string>;
    if (node && node.value) {
      tablePromise = Promise.resolve(node.value);
    } else {
      tablePromise = this.showTableMenu().then((selected) => selected.label);
    }
    tablePromise
      .then((table) => {
        this.activeConnection.showRecords(table)
          .then((results) => this.printOutput(results, `Some records of ${table} : SQLTools`))
          .catch((error) => errorHandler(this.logger, 'Error fetching records.', error, this.showOutputChannel));
      });
  }

  public describeTable(node?: SidebarTable): void {
    let tablePromise: PromiseLike<string>;
    if (node && node.value) {
      tablePromise = Promise.resolve(node.value);
    } else {
      tablePromise = this.showTableMenu().then((selected) => selected.label);
    }
    tablePromise
    .then((table) => {
      this.activeConnection.describeTable(table)
        .then((results) => this.printOutput(results, `Describring table ${table} : SQLTools`))
        .catch((error) => errorHandler(this.logger, 'Error describing table.', error, this.showOutputChannel));
    });
  }

  public describeFunction() {
    Window.showInformationMessage('Not implemented yet.');
  }

  public executeQuery(editor: TextEditor, edit: TextEditorEdit): void {
    let range: Range;
    if (!editor.selection.isEmpty) {
      range = editor.selection;
    }
    const selectedQuery: string = editor.document.getText(range);
    if (!selectedQuery || selectedQuery.length === 0) {
      Window.showInformationMessage('You should select a query first.');
      return;
    }
    this.checkIfConnected().then(() => {
    return this.activeConnection.query(selectedQuery)
      .then((result) => {
        this.history.add(selectedQuery);
        this.printOutput(result);
      })
      .catch((error) => errorHandler(this.logger, 'Error fetching records.', error, this.showOutputChannel));
    });
  }

  public showHistory(): Thenable<QuickPickItem> {
    const options: QuickPickItem[] = this.history.all().map((query) => {
      return {
        description: '',
        label: query,
      } as QuickPickItem;
    });
    return Window.showQuickPick(options);
  }

  public runFromHistory(): void {
    this.checkIfConnected().then(() => {
      this.showHistory()
        .then((selected) => {
          this.activeConnection.query((selected.label))
            .then((results) => this.printOutput(results))
            .catch((error) => errorHandler(this.logger, 'Error while running query.', error, this.showOutputChannel));
          });
    });
  }

  public runFromBookmarks(): void {
    this.checkIfConnected().then(() => {
      this.showBookmarks()
        .then((selected) => {
          this.activeConnection.query((selected.detail))
            .then((results) => this.printOutput(results))
            .catch((error) => errorHandler(
              this.logger,
              'Error while running bookmarked query.', error,
              this.showOutputChannel,
            ));
        });
    });
  }

  public showStatistics() {
    this.statisticsProvider.update(this.statisticsUri);
    let viewColumn: ViewColumn = ViewColumn.One;
    const editor = Window.activeTextEditor;
    if (editor && editor.viewColumn) {
      viewColumn = editor.viewColumn;
    }

    return VsCommands.executeCommand('vscode.previewHtml', this.statisticsUri, viewColumn, 'SQLTools')
      .then(undefined, (reason) => errorHandler(this.logger, 'Failed to show results', reason, this.showOutputChannel));
  }

  /**
   * Management functions
   */
  private printOutput(results: DatabaseInterface.QueryResults[], outputName: string = 'SQLTools Results') {
    this.outputProvider.setResults(results);

    let viewColumn: ViewColumn = ViewColumn.One;
    const editor = Window.activeTextEditor;
    if (editor && editor.viewColumn) {
      viewColumn = editor.viewColumn;
    }

    return VsCommands.executeCommand('vscode.previewHtml', this.previewUri, viewColumn, outputName)
      .then(undefined, (reason) => errorHandler(this.logger, 'Failed to show results', reason, this.showOutputChannel));
  }

  private autoConnectIfActive() {
    const defaultConnection: string = ConfigManager.get('autoConnectTo', null) as string;
    this.logger.debug(`Configuration set to auto connect to: ${defaultConnection}`);
    if (defaultConnection) {
      this.setConnection(new Connection(ConnectionManager.getConnection(defaultConnection), this.logger));
    } else {
      this.setConnection();
    }
  }
  private loadConfigs() {
    ConfigManager.setSettings(Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase()) as Settings);
    this.bookmarks = new BookmarksStorage();
    if (this.history) {
      this.history.setMaxSize(ConfigManager.get('historySize', 100) as number);
    } else {
      this.history = new History(ConfigManager.get('historySize', 100) as number);
    }
    this.setupLogger();
    this.registerTelemetry();
  }
  private setupLogger() {
    this.outputLogs = new LogWriter();
    this.logger = (new Logger(this.outputLogs))
      .setLevel(Logger.levels[ConfigManager.get('logLevel', 'DEBUG') as string])
      .setLogging(ConfigManager.get('logging', false) as boolean);
  }

  private registerCommands(): void {
    this.logger.debug('Registering commands');
    this.registerCommand('bookmarkSelection', registerTextEditorCommand);
    this.registerCommand('executeQuery', registerTextEditorCommand);
    this.registerCommand('formatSql', registerTextEditorCommand);

    this.registerCommand('aboutVersion', registerCommand);
    this.registerCommand('clearBookmarks', registerCommand);
    this.registerCommand('deleteBookmark', registerCommand);
    this.registerCommand('describeFunction', registerCommand);
    this.registerCommand('describeTable', registerCommand);
    this.registerCommand('editBookmark', registerCommand);
    this.registerCommand('runFromBookmarks', registerCommand);
    this.registerCommand('runFromHistory', registerCommand);
    this.registerCommand('selectConnection', registerCommand);
    this.registerCommand('closeConnection', registerCommand);
    this.registerCommand('showHistory', registerCommand);
    this.registerCommand('showOutputChannel', registerCommand);
    this.registerCommand('showRecords', registerCommand);
    this.registerCommand('appendToCursor', registerCommand);
    this.registerCommand('generateInsertQuery', registerCommand);
    this.registerCommand('showStatistics', registerCommand);
  }

  private registerCommand(command: string, registerFunction: Function) {
    this.logger.debug(`Registering command ${Constants.extNamespace}.${command}`);
    this.events.on(command, (...event) => {
      this.logger.debug(`Event received: ${command}`);
      this[command](...event);
    });
    this.context.subscriptions.push(registerFunction(`${Constants.extNamespace}.${command}`, (...args) => {
      this.logger.debug(`Triggering command: ${command}`);
      Telemetry.registerCommandUsage(command);
      this.events.emit(command, ...args);
    }));
  }

  private registerStatusBar(): void {
    this.logger.debug('Registering status bar');
    this.extStatus = Window.createStatusBarItem(StatusBarAlignment.Left, 10);
    this.context.subscriptions.push(this.extStatus);
    this.extStatus.command = `${Constants.extNamespace}.showOutputChannel`;
    this.extStatus.text = `${Constants.extName}`;

    this.extDatabaseStatus = Window.createStatusBarItem(StatusBarAlignment.Left, 9);
    this.context.subscriptions.push(this.extDatabaseStatus);
    this.extDatabaseStatus.command = `${Constants.extNamespace}.selectConnection`;
    this.updateStatusBar();
  }

  private updateStatusBar() {
    this.extDatabaseStatus.text = '$(database) Connect to database';
    if (this.activeConnection) {
      this.extDatabaseStatus.text = `$(database) ${this.activeConnection.getName()}`;
    }
    if (ConfigManager.get('showStatusbar', true)) {
      this.extStatus.show();
      this.extDatabaseStatus.show();
    } else {
      this.extStatus.hide();
      this.extDatabaseStatus.hide();
    }
  }

  private registerProviders() {
    this.outputProvider = new QueryResultsProvider(this.context.extensionPath, this.previewUri);
    this.context.subscriptions.push(
      Workspace.registerTextDocumentContentProvider(this.previewUri.scheme, this.outputProvider),
    );
    this.statisticsProvider = new StatisticsProvider(this.context.extensionPath);
    this.context.subscriptions.push(
      Workspace.registerTextDocumentContentProvider(this.statisticsUri.scheme, this.statisticsProvider),
    );

    if (typeof Window.registerTreeDataProvider !== 'function') {
      return;
    }
    this.sqlconnectionTreeProvider = new SidebarTableColumnProvider(this.activeConnection, this.logger);
    Window.registerTreeDataProvider(`${Constants.extNamespace}.connectionExplorer`, this.sqlconnectionTreeProvider);
    this.suggestionsProvider = new SuggestionsProvider(this.logger);
    const completionTriggers = ['.', ' '];
    this.context.subscriptions.push(
      Languages.registerCompletionItemProvider(
        ConfigManager.get('completionLanguages', ['sql', 'plaintext']) as string[],
        this.suggestionsProvider, ...completionTriggers,
      ),
    );
  }

  private registerEvents() {
    const event: Disposable = Workspace.onDidChangeConfiguration(this.reloadConfig.bind(this));
    this.context.subscriptions.push(event);
  }

  private reloadConfig() {
    ConfigManager.setSettings(Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase()) as Settings);
    this.logger.debug('Config reloaded!');
    this.loadConfigs();
    this.autoConnectIfActive();
    this.updateStatusBar();
  }

  private setConnection(connection?: Connection): Thenable<Connection> {
    if (this.activeConnection) {
      if (this.activeConnection.needsPassword()) {
        this.activeConnection.setPassword(null);
      }
      this.activeConnection.close();
    }
    let result: Thenable<Connection> = Promise.resolve(connection);

    if (connection && connection.needsPassword()) {
      result = this.askForPassword(connection);
    }
    return result.then((conn): Connection => {
      this.activeConnection = conn;
      this.updateStatusBar();
      this.suggestionsProvider.setConnection(conn);
      this.sqlconnectionTreeProvider.setConnection(conn);
      return this.activeConnection;
    })
    .then((conn) => {
      if (!this.activeConnection) return this.activeConnection;
      return this.activeConnection.connect();
    })
    .then(() => this.activeConnection, (reason) => {
      errorHandler(this.logger, 'Error during connection.', reason, this.showOutputChannel);
      if (connection !== null) this.setConnection(null);
    });
  }

  private askForPassword(connection): Thenable<Connection> {
    return Window.showInputBox({ prompt: `${connection.getName()} password`, password: true })
      .then((password: string): Connection => {
        if (!password || password.length === 0) {
          throw new Error('Password not provided.');
        }
        connection.setPassword(password);
        return connection;
      });
  }
  private checkIfConnected(): Thenable<Connection> {
    if (this.activeConnection && this.activeConnection.isConnected()) {
      return Promise.resolve(this.activeConnection);
    }
    return this.selectConnection();
  }

  private help(): void {
    const moreInfo = 'More Info';
    const supportProject = 'Support This Project';
    const message = 'Do you like SQLTools? Help us to keep making it better.';
    const file = require('path').join(Utils.getHome(), '.sqltools-lasrun');
    fs.readFile(file, (err, data) => {
      let last = new Date(0);
      if (!err) {
        try {
          last = new Date(parseInt(data.toString(), 10));
          if (isNaN(last.getTime())) last = new Date(0);
        } catch (e) {
          last = new Date(0);
        }
      }
      if (new Date().getTime() - last.getTime() <= 604800000) {
        return;
      }
      fs.writeFile(file, `${new Date().getTime()}`);
      Window.showInformationMessage(message, moreInfo, supportProject)
        .then((value) => {
          Telemetry.infoMessage(message, value);
          if (value === moreInfo) {
            openurl('https://github.com/mtxr/vscode-sqltools#donate');
          } else if (value === supportProject) {
            openurl('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8');
          }
        });
    });
  }

  private registerTelemetry(): void {
    Telemetry.register(this.logger);
  }

  private registerLanguageServer() {
    const serverModule = this.context.asAbsolutePath(Path.join('dist', 'languageserver', 'server.js'));
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

    const serverOptions: ServerOptions = {
      debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
      run: { module: serverModule, transport: TransportKind.ipc, options: debugOptions },
    };

    const clientOptions: LanguageClientOptions = {
      documentSelector: ConfigManager.get('completionLanguages', ['sql', 'plaintext']) as string[],
      synchronize: {
        configurationSection: 'sqltools',
        fileEvents: Workspace.createFileSystemWatcher('**/.sqltoolsrc'),
      },
    };

    const languageClient = new LanguageClient(
      'sqltools.language-server',
      'SQLTools Language Server',
      serverOptions,
      clientOptions,
    );

    languageClient.onReady().then(() => {
      this.logger.debug('Language server started!');
      this.languageClient = languageClient;
    }, (error) => errorHandler(this.logger, 'Ops, we\'ve got an error!', error, this.showOutputChannel));
    this.context.subscriptions.push(languageClient.start());
  }

  private async getOrCreateEditor(): Promise<TextEditor> {
    if (!Window.activeTextEditor) {
      await VsCommands.executeCommand('workbench.action.files.newUntitledFile');
    }
    return Promise.resolve(Window.activeTextEditor);
  }
}
