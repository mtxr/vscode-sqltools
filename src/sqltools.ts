/// <reference path="./../node_modules/@types/node/index.d.ts" />

import { EventEmitter } from 'events';
import * as Path from 'path';
import {
  commands as VSCode,
  commands as VsCommands,
  Disposable,
  ExtensionContext,
  languages as Languages,
  OutputChannel,
  Position,
  QuickPickItem,
  Selection,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
  TextDocumentChangeEvent,
  TextEditor,
  TextEditorEdit,
  TextEditorSelectionChangeEvent,
  Uri,
  ViewColumn,
  window as Window,
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import { BookmarksStorage, History, Logger, Utils } from './api';
import { ConnectionCredentials } from './api/interface/connection-credentials';
import Connection from './connection';
import ConnectionManager from './connection-manager';
import Constants from './constants';
import LogWriter from './log-writer';
import OutputProvider from './output-provider';
import { SidebarTableColumnProvider } from './sidebar-provider';
import { SuggestionsProvider } from './suggestions-provider';
import Telemetry from './telemetry';
const {
  registerCommand,
  registerTextEditorCommand,
} = VSCode;

/* tslint:disable: no-var-requires */
const openurl = require('opn');

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
  private config: WorkspaceConfiguration;
  private connectionsManager: ConnectionManager;
  private activeConnection: Connection;
  private extStatus: StatusBarItem;
  private extDatabaseStatus: StatusBarItem;
  private events: EventEmitter;
  private outputProvider: OutputProvider;
  private sqlconnectionTreeProvider: SidebarTableColumnProvider;
  private suggestionsProvider: SuggestionsProvider;
  private previewUri = Uri.parse('sqltools://results');

  private constructor(private context: ExtensionContext) {
    this.events = new EventEmitter();
    this.loadConfigs();
    this.setupLogger();
    this.registerProviders();
    this.registerEvents();
    this.registerCommands();
    this.registerStatusBar();
    this.autoConnectIfActive();
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
        }, (error) => this.errorHandler('Ops, we\'ve got an error!', error));
      }, (error) => this.errorHandler('Ops, we\'ve got an error!', error));
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
      this.errorHandler('Error bookmarking query.', error);
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
  public formatSql(editor: TextEditor, edit: TextEditorEdit): void {
    try {
      const indentSize: number = this.config.get('format.indent_size', 2);
      edit.replace(editor.selection, Utils.formatSql(editor.document.getText(editor.selection), indentSize));
      VsCommands.executeCommand('revealLine', { lineNumber: editor.selection.active.line, at: 'center' });
      this.logger.debug('Query formatted!');
    } catch (error) {
      this.errorHandler('Error formatting query.', error);
    }
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
      this.history.clear();
      this.setConnection(new Connection(this.connectionsManager.getConnection(selection.label)));
      return this.activeConnection;
    });
  }

  public showConnectionMenu(): Thenable<QuickPickItem> {
    const options: QuickPickItem[] = this.connectionsManager.getConnections().map((connection) => {
      return {
        detail: `${connection.username}@${connection.server}:${connection.port}`,
        label: connection.name,
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
        });
    });
  }

  public showRecords() {
    this.showTableMenu()
      .then((selected) => {
        this.activeConnection.showRecords(selected.label)
          .then((results) => this.printOutput(results))
          .catch((error) => this.errorHandler('Error fetching records.', error));
      });
  }

  public describeTable(): void {
    this.showTableMenu()
    .then((selected) => {
      this.activeConnection.describeTable(selected.label)
        .then((results) => this.printOutput(results))
        .catch((error) => this.errorHandler('Error describing table.', error));
    });
  }

  public describeFunction() {
    Window.showInformationMessage('Not implemented yet.');
  }

  public executeQuery(editor: TextEditor, edit: TextEditorEdit): void {
    const selectedQuery: string = editor.document.getText(editor.selection);
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
      .catch((error) => this.errorHandler('Error fetching records.', error));
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
            .catch((error) => this.errorHandler('Error while running query.', error));      });
    });
  }

  public runFromBookmarks(): void {
    this.checkIfConnected().then(() => {
      this.showBookmarks()
        .then((selected) => {
          this.activeConnection.query((selected.detail))
            .then((results) => this.printOutput(results))
            .catch((error) => this.errorHandler('Error while running bookmarked query.', error));
        });
    });
  }

  /**
   * Management functions
   */
  private printOutput(results) {
    this.outputProvider.setResults(results);
    this.outputProvider.update(this.previewUri);
    return VsCommands.executeCommand('vscode.previewHtml', this.previewUri, ViewColumn.One, 'SQLTools Results')
      .then(undefined, (reason) => this.errorHandler('Failed to show results', reason));
  }

  private autoConnectIfActive() {
    const defaultConnection: string = this.config.get('autoConnectTo', null);
    this.logger.debug(`Configuration set to auto connect to: ${defaultConnection}`);
    if (defaultConnection) {
      this.setConnection(new Connection(this.connectionsManager.getConnection(defaultConnection)));
    } else {
      this.setConnection();
    }
  }
  private loadConfigs() {
    this.config = Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase());
    this.bookmarks = new BookmarksStorage();
    this.connectionsManager = new ConnectionManager(this.config);
    if (this.history) {
      this.history.setMaxSize(this.config.get('history_size', 100));
    } else {
      this.history = new History(this.config.get('history_size', 100));
    }
    this.setupLogger();
    this.registerTelemetry();
  }
  private setupLogger() {
    this.outputLogs = new LogWriter();
    this.logger = (new Logger(this.outputLogs))
      .setLevel(Logger.levels[this.config.get('log_level', 'DEBUG')])
      .setLogging(this.config.get('logging', false));
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
    this.registerCommand('showHistory', registerCommand);
    this.registerCommand('showOutputChannel', registerCommand);
    this.registerCommand('showRecords', registerCommand);
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
    if (this.config.get('show_statusbar', true)) {
      this.extStatus.show();
      this.extDatabaseStatus.show();
    } else {
      this.extStatus.hide();
      this.extDatabaseStatus.hide();
    }
  }

  private errorHandler(message: string, error?: Error) {
    if (error) {
      this.logger.error(`${message}: `, error.stack);
    }
    return Window.showErrorMessage(`${message} Would you like to see the logs?`, 'Yes', 'No')
      .then((res) => {
        if (res === 'Yes') {
          this.showOutputChannel();
        }
        return res;
      });
  }

  private registerProviders() {
    this.outputProvider = new OutputProvider();
    this.context.subscriptions.push(Workspace.registerTextDocumentContentProvider('sqltools', this.outputProvider));
    this.suggestionsProvider = new SuggestionsProvider();
    const completionTriggers = ['.', ' '];
    this.context.subscriptions.push(
      Languages.registerCompletionItemProvider(['sql', 'plaintext'],
      this.suggestionsProvider, ...completionTriggers));

    if (typeof Window.registerTreeDataProvider !== 'function') {
      return;
    }
    this.sqlconnectionTreeProvider = new SidebarTableColumnProvider(this.activeConnection);
    Window.registerTreeDataProvider('sqltoolsConnection', this.sqlconnectionTreeProvider);
  }

  private registerEvents() {
    const event: Disposable = Workspace.onDidChangeConfiguration(this.reloadConfig.bind(this));
    this.context.subscriptions.push(event);
  }

  private reloadConfig() {
    this.logger.debug('Config reloaded!');
    this.loadConfigs();
    this.autoConnectIfActive();
    this.updateStatusBar();
  }

  private setConnection(connection?: Connection) {
    if (connection && this.activeConnection) {
      this.activeConnection.close();
    }
    this.activeConnection = connection;
    this.updateStatusBar();
    this.suggestionsProvider.setConnection(connection);
    this.sqlconnectionTreeProvider.setConnection(connection);
  }

  private checkIfConnected(): Promise<Connection> {
    if (this.activeConnection) {
      return Promise.resolve(this.activeConnection);
    }
    return this.selectConnection().then(() => {
      return Promise.resolve(this.activeConnection);
    }) as Promise<Connection>;
  }

  private help(): void {
    const moreInfo = 'More Info';
    const supportProject = 'Support This Project';
    const message = 'Do you like SQLTools? Help us to keep making it better.';
    Window.showInformationMessage(message, moreInfo, supportProject)
      .then((value) => {
        Telemetry.infoMessage(message, value);
        if (value === moreInfo) {
          openurl('https://github.com/mtxr/vscode-sqltools#donate');
        } else if (value === supportProject) {
          openurl('https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=RSMB6DGK238V8');
        }
      });
  }

  private registerTelemetry(): void {
    Telemetry.register(this.config, this.logger);
  }
}
