import { ConnectionCredentials } from './api/interface/connection-credentials';
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
import { BookmarksStorage, Logger, Utils } from './api';
import Connection from './connection';
import ConnectionManager from './connection-manager';
import Constants from './constants';
import LogWriter from './log-writer';
import OutputProvider from './output-provider';

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
  private activeConnection: Connection;
  private extStatus: StatusBarItem;
  private extDatabaseStatus: StatusBarItem;
  private events: EventEmitter;
  private provider: OutputProvider;
  private previewUri = Uri.parse('sqltools://results');

  private set Connection(connection: Connection) {
    this.activeConnection = connection;
    this.updateStatusBar(this.activeConnection.credentials.name);
  }

  private constructor(private context: ExtensionContext) {
    this.events = new EventEmitter();
    this.loadConfigs();
    this.setupLogger();
    this.registerCommands();
    this.registerStatusBar();
    this.autoConnectIfActive();
    this.registerProviders();
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

  public selectConnection(): Thenable<Connection> {
    return this.showConnectionMenu().then((selection: QuickPickItem) => {
      if (this.activeConnection) {
        this.activeConnection.close();
        this.updateStatusBar();
      }
      this.Connection = new Connection(this.connectionsManager.getConnection(selection.label));
      return this.Connection;
    });
  }

  public showConnectionMenu(): Thenable<QuickPickItem> {
    const options: QuickPickItem[] = [];

    this.connectionsManager.getConnections().forEach((connection) => {
      options.push({
        description: '',
        detail: `${connection.username}@${connection.server}:${connection.port}`,
        label: connection.name,
      });
    });
    return Window.showQuickPick(options);
  }

  public showTableMenu(): Thenable<QuickPickItem> {
    return this.activeConnection.getTables(true)
      .then((tables) => {
        const options: QuickPickItem[] = tables.map((table) => {
          return { label: table } as QuickPickItem;
        });
        return Window.showQuickPick(options);
      });
  }
  // tslint:disable-next-line:no-empty
  public showRecords() { }

  public describeTable(): void {
    this.showTableMenu()
    .then((selected) => {
      this.activeConnection.describeTable(selected.label)
      .then((description) => {
        this.provider.setResults(description);
        this.provider.update(this.previewUri);
        return VsCommands.executeCommand('vscode.previewHtml', this.previewUri, ViewColumn.Two, 'SQLTools Results')
          .then(undefined, (reason) => this.errorHandler('Failed to show results', reason));
      });
    });
  }
  // tslint:disable-next-line:no-empty
  public describeFunction() { }

  // tslint:disable-next-line:no-empty
  public executeQuery() { }

  // tslint:disable-next-line:no-empty
  public showHistory() { }

  /**
   * Management functions
   */
  private autoConnectIfActive() {
    const defaultConnection: string = this.config.get('autoConnectTo', null);
    if (defaultConnection) {
      this.Connection = new Connection(this.connectionsManager.getConnection(defaultConnection));
    }
  }
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
    this.events.on(command, (...event) => {
      this.logger.debug(`Event received: ${command}`, ...event);
      this[command](...event);
    });
    this.context.subscriptions.push(registerFunction(`${Constants.extNamespace}.${command}`, (...args) => {
      this.logger.debug(`Triggering command: ${command}`, ...args);
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
    this.extDatabaseStatus.text = '$(database) Connect to database';
    this.extStatus.show();
    this.extDatabaseStatus.show();
  }

  private updateStatusBar(databaseName: string = null) {
    if (databaseName) {
      this.extDatabaseStatus.text = `$(database) ${databaseName}`;
    } else {
      this.extDatabaseStatus.text = '$(database) Connect to database';
    }
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

  private registerProviders() {
    this.provider = new OutputProvider();
    this.context.subscriptions.push(Workspace.registerTextDocumentContentProvider('sqltools', this.provider));

    // Workspace.onDidChangeTextDocument((e: TextDocumentChangeEvent) => {
    //   if (e.document === Window.activeTextEditor.document) {
    //     provider.update(this.previewUri);
    //   }
    // });

    // Window.onDidChangeTextEditorSelection((e: TextEditorSelectionChangeEvent) => {
    //   if (e.textEditor === Window.activeTextEditor) {
    //     provider.update(this.previewUri);
    //   }
    // });

    // const disposable = registerCommand('extension.showCssPropertyPreview', () => {
    //   return VsCommands.executeCommand('vscode.previewHtml', previewUri, ViewColumn.Two, 'CSS Property Preview')
    //   .then((success) => false, (reason) => {
    //     Window.showErrorMessage(reason);
    //   });
    // });

    // let highlight = Window.createTextEditorDecorationType({ backgroundColor: 'rgba(200,200,200,.35)' });

    // vscode.commands.registerCommand('extension.revealCssRule', (uri: vscode.Uri,
    // propStart: number, propEnd: number) => {

    //   for (let editor of Window.visibleTextEditors) {
    //     if (editor.document.uri.toString() === uri.toString()) {
    //       let start = editor.document.positionAt(propStart);
    //       let end = editor.document.positionAt(propEnd + 1);

    //       editor.setDecorations(highlight, [new vscode.Range(start, end)]);
    //       setTimeout(() => editor.setDecorations(highlight, []), 1500);
    //     }
    //   }
    // });
  }
}
