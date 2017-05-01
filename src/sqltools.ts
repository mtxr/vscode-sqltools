// tslint:disable:no-reference
/// <reference path="./../node_modules/@types/node/index.d.ts" />

import { EventEmitter } from 'events';
import * as Path from 'path';
import {
  commands as VSCode,
  commands as VsCommands,
  ExtensionContext,
  OutputChannel,
  Position,
  QuickPickItem,
  Selection,
  StatusBarAlignment,
  StatusBarItem,
  TextDocument,
  TextEditor,
  TextEditorEdit,
  Uri,
  window as Window,
  workspace as Workspace,
  WorkspaceConfiguration,
} from 'vscode';
import { BookmarksStorage, Logger, Utils } from './api';
import ConnectionManager from './connection-manager';
import Constants from './constants';
import LogWriter from './log-writer';

const {
  registerCommand,
  registerTextEditorCommand,
} = VSCode;
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
  private outputLogs: LogWriter;
  private config: WorkspaceConfiguration;
  private connectionsManager: ConnectionManager;
  private extStatus: StatusBarItem;
  private extDatabaseStatus: StatusBarItem;
  private events: EventEmitter;

  private constructor(private context: ExtensionContext) {
    this.events = new EventEmitter();
    this.loadConfigs();
    this.setupLogger();
    this.registerCommands();
    this.registerStatusBar();
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
        }, (error: any) => {
          this.errorHandler('Ops, we\'ve got an error!', error);
        });
      }, (error) => {
        this.errorHandler('Ops, we\'ve got an error!', error);
      });
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
      edit.replace(editor.selection, Utils.formatSql(editor.document.getText(editor.selection)));
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

  public selectConnection() {
    const options: QuickPickItem[] = [];

    this.connectionsManager.getConnections().forEach((connection) => {

      options.push({
        description: '',
        detail: `${connection.username}@${connection.server}:${connection.port}`,
        label: connection.name,
      });
    });
    Window.showQuickPick(options).then((selection) => {
      this.logger.info('', selection);
    });
  }
  /**
   * TO-DO:
   */

  // tslint:disable-next-line:no-empty
  public showConnectionMenu() { }

  // tslint:disable-next-line:no-empty
  public showRecords() { }

  // tslint:disable-next-line:no-empty
  public describeTable() { }
  // tslint:disable-next-line:no-empty
  public describeFunction() { }

  // tslint:disable-next-line:no-empty
  public describepublic() { }

  // tslint:disable-next-line:no-empty
  public executeQuery() { }

  // tslint:disable-next-line:no-empty
  public showHistory() { }

  /**
   * Management functions
   */
  private loadConfigs() {
    this.config = Workspace.getConfiguration(Constants.extNamespace.toLocaleLowerCase());
    this.bookmarks = new BookmarksStorage();
    this.connectionsManager = new ConnectionManager(this.config);
  }
  private setupLogger() {
    this.outputLogs = new LogWriter();
    this.logger = (new Logger(this.outputLogs))
      .setLevel(Logger.levels[this.config.get('log_level', 'DEBUG')])
      .setLogging(this.config.get('logging', false));
  }

  private registerCommands(): void {
    this.logger.debug('Registering commands');
    this.registerCommand('formatSql', registerTextEditorCommand);
    this.registerCommand('executeQuery', registerTextEditorCommand);
    this.registerCommand('bookmarkSelection', registerTextEditorCommand);

    this.registerCommand('selectConnection', registerCommand);
    this.registerCommand('showRecords', registerCommand);
    this.registerCommand('describeTable', registerCommand);
    this.registerCommand('describeFunction', registerCommand);
    this.registerCommand('aboutVersion', registerCommand);
    this.registerCommand('showHistory', registerCommand);
    this.registerCommand('deleteBookmark', registerCommand);
    this.registerCommand('clearBookmarks', registerCommand);
    this.registerCommand('editBookmark', registerCommand);
    this.registerCommand('showOutputChannel', registerCommand);
  }

  private registerCommand(command: string, registerFunction: Function) {
    this.logger.debug(`Registering command ${Constants.extNamespace}.${command}`);
    const self = this;
    this.events.on(command, (...event) => {
      self[command](...event);
    });
    this.context.subscriptions.push(registerFunction(`${Constants.extNamespace}.${command}`, function() {
      self.events.emit(command, ...arguments);
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
    this.extDatabaseStatus.text = '$(database) Connect to database';
    this.extStatus.show();
    this.extDatabaseStatus.show();
  }

  private updateStatusBar(databaseName: string) {
    this.extDatabaseStatus.text = `$(database) ${databaseName}`;
  }

  private errorHandler(message: string, error?: Error) {
    if (error) {
      this.logger.error(`${message}: `, error);
    }
    return Window.showErrorMessage(`${message} Would you like to see the logs?`, 'Yes', 'No')
      .then((res) => {
        if (res === 'Yes') {
          this.showOutputChannel();
        }
        return res;
      });
  }
}
