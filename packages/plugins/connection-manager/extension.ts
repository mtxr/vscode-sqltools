import logger from '@sqltools/core/log/vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface, DatabaseDialect } from '@sqltools/core/interface';
import getTableName from '@sqltools/core/utils/query/prefixed-tablenames';
import SQLTools, { RequestHandler } from '@sqltools/core/plugin-api';
import { getConnectionDescription, getConnectionId, isEmpty } from '@sqltools/core/utils';
import { getSelectedText, quickPick, readInput } from '@sqltools/core/utils/vscode';
import { SidebarConnection, SidebarTableOrView, ConnectionExplorer } from '@sqltools/plugins/connection-manager/explorer';
import ResultsWebviewManager from '@sqltools/plugins/connection-manager/screens/results';
import SettingsWebview from '@sqltools/plugins/connection-manager/screens/settings';
import { commands, QuickPickItem, ExtensionContext, StatusBarAlignment, StatusBarItem, window, workspace, ConfigurationTarget, Uri, TextEditor, TextDocument, ProgressLocation, Progress } from 'vscode';
import { ConnectionDataUpdatedRequest, ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RefreshTreeRequest, RunCommandRequest, ProgressNotificationStart, ProgressNotificationComplete, ProgressNotificationStartParams, ProgressNotificationCompleteParams, TestConnectionRequest } from './contracts';
import path from 'path';
import CodeLensPlugin from '../codelens/extension';
import { getHome } from '@sqltools/core/utils';
import { extractConnName, getQueryParameters } from '@sqltools/core/utils/query';
import { CancellationTokenSource } from 'vscode-jsonrpc';

export default class ConnectionManagerPlugin implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  public resultsWebview: ResultsWebviewManager;
  public settingsWebview: SettingsWebview;
  public statusBar: StatusBarItem;;
  private context: ExtensionContext;
  private errorHandler: SQLTools.ExtensionInterface['errorHandler'];
  private explorer: ConnectionExplorer;
  private attachedFilesMap: { [fileUri: string ]: string } = {};
  private codeLensPlugin: CodeLensPlugin;

  public handler_connectionDataUpdated: RequestHandler<typeof ConnectionDataUpdatedRequest> = (data) => this.explorer.setTreeData(data);

  // extension commands
  private ext_refreshTree = (connIdOrTreeItem: SidebarConnection | string | string[]) => {
    connIdOrTreeItem = connIdOrTreeItem instanceof SidebarConnection ? connIdOrTreeItem.getId() : connIdOrTreeItem;
    connIdOrTreeItem = Array.isArray(connIdOrTreeItem) ? connIdOrTreeItem : [connIdOrTreeItem].filter(Boolean);

    return this.client.sendRequest(RefreshTreeRequest, { connIds: connIdOrTreeItem.length ? connIdOrTreeItem : null });
  }

  private ext_testConnection = async (c: ConnectionInterface) => {
    let password = null;

    if (c.dialect !== DatabaseDialect.SQLite && c.askForPassword) password = await this._askForPassword(c);
    if (c.askForPassword && password === null) return;
    return this.client.sendRequest(
      TestConnectionRequest,
      { conn: c, password },
    );
  }

  private ext_executeFromInput = async () => {
    try {
      const conn = this.explorer.getActive() ? this.explorer.getActive() : await this._pickConnection(true);
      if (!conn) {
        return;
      }
      const query = await readInput('Query', `Type the query to run on ${conn.name}`);
      return this.ext_executeQuery(query, getConnectionId(conn));
    } catch (e) {
      this.errorHandler('Error running query.', e);
    }
  }

  private ext_showRecords = async (node?: SidebarTableOrView) => {
    try {
      const table = await this._getTableName(node);
      await this._openResultsWebview();
      let limit = 50;
      if (ConfigManager.results && ConfigManager.results.limit) {
        limit = ConfigManager.results.limit;
      }
      const payload = await this._runConnectionCommandWithArgs('showRecords', table, limit);
      this.resultsWebview.get(payload[0].connId || this.explorer.getActive().id).updateResults(payload);

    } catch (e) {
      this.errorHandler('Error while showing table records', e);
    }
  }

  private ext_describeTable = async (node?: SidebarTableOrView) => {
    try {
      const table = await this._getTableName(node);
      await this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('describeTable', table);
      this.resultsWebview.get(payload[0].connId || this.explorer.getActive().id).updateResults(payload);
    } catch (e) {
      this.errorHandler('Error while describing table records', e);
    }
  }

  private ext_describeFunction() {
    window.showInformationMessage('Not implemented yet.');
  }

  private ext_closeConnection = async (node?: SidebarConnection) => {
    const conn = node ? node.conn : await this._pickConnection(true);
    if (!conn) {
      return;
    }

    try {
      await this.client.sendRequest(DisconnectRequest, { conn })
      this.client.telemetry.registerInfoMessage('Connection closed!');
      await this.explorer.updateTreeRoot();
      this._updateStatusBar();

    } catch (e) {
      return this.errorHandler('Error closing connection', e);
    }
  }

  private async updateAttachedConnectionsMap(fileUri: Uri, connId?: string) {
    if (!connId) {
      delete this.attachedFilesMap[fileUri.toString()];
    } else {
      this.attachedFilesMap[fileUri.toString()] = connId;
    }
    await this.context.workspaceState.update('attachedFilesMap', this.attachedFilesMap);
    this.codeLensPlugin.reset();
    this.changeTextEditorHandler(window.activeTextEditor);
  }

  public getAttachedConnection(fileUri: Uri) {
    return this.attachedFilesMap[fileUri.toString()];
  }

  private async openConnectionFile(conn: ConnectionInterface) {
    if (!ConfigManager.autoOpenSessionFiles) return;
    if (!conn) return;
    let baseFolder: Uri;

    if (window.activeTextEditor && window.activeTextEditor.document.uri && workspace.getWorkspaceFolder(window.activeTextEditor.document.uri)) {
      baseFolder = workspace.getWorkspaceFolder(window.activeTextEditor.document.uri).uri;
    }

    if (!baseFolder && workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
      baseFolder = workspace.workspaceFolders && workspace.workspaceFolders[0].uri;
    }

    if (!baseFolder) {
      baseFolder = Uri.file(path.join(getHome(), '.SQLTools'));
    }
    const sessionFilePath = path.join(baseFolder.fsPath, `${conn.name} Session.sql`);
    try {
      this.updateAttachedConnectionsMap(
        await this.openSessionFileWithProtocol(sessionFilePath, 'file'),
        getConnectionId(conn)
      );
    } catch(e) {
      this.updateAttachedConnectionsMap(
        await this.openSessionFileWithProtocol(sessionFilePath),
        getConnectionId(conn)
      );
    }
  }

  private async openSessionFileWithProtocol(uri: string, scheme: 'untitled' | 'file' = 'untitled') {
    const fileUri = Uri.parse(`untitled:${uri}`).with({ scheme });
    await window.showTextDocument(fileUri);
    return fileUri;
  }

  private ext_selectConnection = async (connIdOrNode?: SidebarConnection | string, trySessionFile = true) => {
    if (connIdOrNode) {
      let conn = connIdOrNode instanceof SidebarConnection ? connIdOrNode.conn : this.explorer.getById(connIdOrNode);

      conn = await this._setConnection(conn as ConnectionInterface).catch(e => this.errorHandler('Error opening connection', e));
      if (trySessionFile) await this.openConnectionFile(conn);
      return conn;
    }
    try {
      const conn = await this._connect(true);
      if (trySessionFile) await this.openConnectionFile(conn);
      return conn;
    } catch (error) {
      return this.errorHandler('Error selecting connection', error);
    }
  }

  private replaceParams = async (query: string) => {
    const queryParamsCfg = ConfigManager.queryParams;

    if (!queryParamsCfg || !queryParamsCfg.enableReplace) return query;

    const params = getQueryParameters(query, queryParamsCfg.regex);
    if (params.length > 0) {
      await new Promise((resolve, reject) => {
        const ib = window.createInputBox();
        ib.step = 1;
        ib.totalSteps = params.length;
        ib.ignoreFocusOut = true;
        ib.title = `Value for '${params[ib.step - 1].param}' in '${params[ib.step - 1].string}'`;
        ib.prompt = 'Remember to escape values if neeeded.'
        ib.onDidAccept(() => {
          const r = new RegExp(params[ib.step - 1].param.replace(/([\$\[\]])/g, '\\$1'), 'g');
          query = query.replace(r, `'${ib.value}'`);
          ib.step++;
          if (ib.step > ib.totalSteps) {
            ib.hide();
            return resolve();
          }
          ib.value = '';
          ib.title = `Value for '${params[ib.step - 1].param}' in '${params[ib.step - 1].string}'`;
        });
        ib.onDidHide(() =>ib.step === ib.totalSteps && ib.value.trim() ? resolve() : reject(new Error('Didnt fill all params. Cancelling...')));
        ib.show();
      });
    }

    return query;
  }

  private ext_executeQuery = async (query?: string, connNameOrId?: string) => {
    try {
      query = typeof query === 'string' ? query : await getSelectedText('execute query');
      if (!connNameOrId) { // check query defined connection name
        connNameOrId = extractConnName(query);
      }

      if (!connNameOrId && window.activeTextEditor) { // check if has attached connection
        connNameOrId = this.getAttachedConnection(window.activeTextEditor.document.uri);
      }

      if (connNameOrId && connNameOrId.trim()) {
        connNameOrId = connNameOrId.trim();
        const conn = this.getConnectionList().find(c => getConnectionId(c) === connNameOrId || c.name === connNameOrId);
        if (!conn) {
          throw new Error(`Trying to run query on '${connNameOrId}' but it does not exist.`)
        }
        await this._setConnection(conn);
      } else {
        await this._connect();
      }

      query = await this.replaceParams(query);
      await this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('query', query);
      this.resultsWebview.get(payload[0].connId || this.explorer.getActive().id).updateResults(payload);
      return payload;
    } catch (e) {
      this.errorHandler('Error fetching records.', e);
    }
  }

  private ext_executeQueryFromFile = async () => {
    // @TODO: add option read from file and run
    return this.ext_executeQuery(await getSelectedText('execute file', true));
  }

  private ext_showOutputChannel = () => (<any>logger).show();

  private ext_saveResults = async (filetype: 'csv' | 'json', connId?: string) => {
    connId = typeof connId === 'string' ? connId : undefined;
    filetype = typeof filetype === 'string' ? filetype : undefined;
    let mode: any = filetype || ConfigManager.defaultExportType;
    if (mode === 'prompt') {
      mode = await quickPick<'csv' | 'json' | undefined>([
        { label: 'Save results as CSV', value: 'csv' },
        { label: 'Save results as JSON', value: 'json' },
      ], 'value', {
        title: 'Select a file type to export',
      });
    }

    if (!mode) return;

    return this.resultsWebview.get(connId || this.explorer.getActive().id).saveResults(mode);
  }

  private ext_openAddConnectionScreen = () => {
    return this.settingsWebview.show();
  }

  private ext_openEditConnectionScreen = async (connIdOrNode?: string | SidebarConnection) => {
    let id: string;
    if (connIdOrNode) {
      id = connIdOrNode instanceof SidebarConnection ? connIdOrNode.getId() : <string>connIdOrNode;
    } else {
      const conn = await this._pickConnection();
      id = conn ? getConnectionId(conn) : undefined;
    }

    if (!id) return;

    const conn = this.explorer.getById(id);
    conn.id = conn.id || getConnectionId(conn);
    this.settingsWebview.show();
    this.settingsWebview.postMessage({ action: 'editConnection', payload: { conn } });
  }

  private ext_focusOnExplorer = () => {
    return this.explorer.focus();
  }

  private ext_deleteConnection = async (connIdOrNode?: string | SidebarConnection) => {
    let id: string;
    if (connIdOrNode) {
      id = connIdOrNode instanceof SidebarConnection ? connIdOrNode.getId() : <string>connIdOrNode;
    } else {
      const conn = await this._pickConnection();
      id = conn ? getConnectionId(conn) : undefined;
    }

    if (!id) return;

    const conn = this.explorer.getById(id);

    const res = await window.showInformationMessage(`Are you sure you want to remove ${conn.name}?`, { modal: true }, 'Yes');

    if (!res) return;

    const {
      workspaceFolderValue = [],
      workspaceValue = [],
      globalValue = [],
    } = workspace.getConfiguration(EXT_NAME.toLowerCase()).inspect('connections');

    const findIndex = (arr = []) => arr.findIndex(c => getConnectionId(c) == id);

    let index = findIndex(workspaceFolderValue);
    if (index >= 0) {
      workspaceFolderValue.splice(index, 1);
      return this.saveConnectionList(workspaceFolderValue, ConfigurationTarget.WorkspaceFolder);
    }

    index = findIndex(workspaceValue);
    if (index >= 0) {
      workspaceValue.splice(index, 1);
      return this.saveConnectionList(workspaceValue, ConfigurationTarget.Workspace);
    }

    index = findIndex(globalValue);
    if (index >= 0) {
      globalValue.splice(index, 1);
      return this.saveConnectionList(globalValue, ConfigurationTarget.Global);
    }
    return Promise.resolve(true);
  }

  private ext_addConnection = (connInfo: ConnectionInterface, writeTo?: keyof typeof ConfigurationTarget) => {
    if (!connInfo) {
      logger.warn('Nothing to do. No parameter received');
      return;
    }

    const connList = this.getConnectionList(ConfigurationTarget[writeTo] || undefined);
    connList.push(connInfo);
    return this.saveConnectionList(connList, ConfigurationTarget[writeTo]);
  }

  private ext_updateConnection = (oldId: string, connInfo: ConnectionInterface, writeTo?: keyof typeof ConfigurationTarget) => {
    if (!connInfo) {
      logger.warn('Nothing to do. No parameter received');
      return;
    }

    const connList = this.getConnectionList(ConfigurationTarget[writeTo] || undefined)
      .filter(c => getConnectionId(c) !== oldId);
    connList.push(connInfo);
    return this.saveConnectionList(connList, ConfigurationTarget[writeTo]);
  }

  // internal utils
  private async _getTableName(node?: SidebarTableOrView): Promise<string> {
    if (node && node.conn) {
      await this._setConnection(node.conn as ConnectionInterface);
      return getTableName(node.conn.dialect, node.table);
    }

    const conn = await this._connect();
    return this._pickTable(conn, 'value');
  }

  private _openResultsWebview(connId?: string) {
    return this.resultsWebview.get(connId || this.explorer.getActive().id).show();
  }
  private _connect = async (force = false): Promise<ConnectionInterface> => {
    if (!force && this.explorer.getActive()) {
      return this.explorer.getActive();
    }
    const c: ConnectionInterface = await this._pickConnection(!force);
    // history.clear();
    return this._setConnection(c);
  }

  private async _pickTable(conn: ConnectionInterface, prop?: string): Promise<string> {
    const { tables } = await this.client.sendRequest(GetConnectionDataRequest, { conn });
    return quickPick(tables
      .map((table) => {
        const prefixedTableName = getTableName(conn.dialect, table);
        const prefixes  = prefixedTableName.split('.');

        return <QuickPickItem>{
          label: table.name,
          value: getTableName(conn.dialect, table),
          description: typeof table.numberOfColumns !== 'undefined' ? `${table.numberOfColumns} cols` : '',
          detail: prefixes.length > 1 ? `in ${prefixes.slice(0, prefixes.length - 1).join('.')}` : undefined,
        };
      }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,
        title: `Tables in ${conn.database}`,
      });
  }

  private ext_getConnectionStatus = async ({ connectedOnly, connId, sort }: (typeof GetConnectionsRequest)['_']['0'] = {}) => {
    return this.client.sendRequest(GetConnectionsRequest, { connectedOnly, connId, sort });
  }
  private async _pickConnection(connectedOnly = false): Promise<ConnectionInterface> {
    const connections: ConnectionInterface[] = await this.ext_getConnectionStatus({ connectedOnly });

    if (connections.length === 0 && connectedOnly) return this._pickConnection();

    if (connectedOnly && connections.length === 1) return connections[0];

    const sel = (await quickPick(connections.map((c) => {
      return <QuickPickItem>{
        description: c.isConnected ? 'Currently connected' : '',
        detail: (c.isConnected ? '$(zap) ' : '') + getConnectionDescription(c),
        label: c.name,
        value: getConnectionId(c)
      };
    }), 'value', {
      matchOnDescription: true,
      matchOnDetail: true,
      placeHolder: 'Pick a connection',
      placeHolderDisabled: 'You don\'t have any connections yet.',
      title: 'Connections',
      buttons: [
        {
          iconPath: {
            dark: this.context.asAbsolutePath('icons/add-connection-dark.svg'),
            light: this.context.asAbsolutePath('icons/add-connection-light.svg'),
          },
          tooltip: 'Add new Connection',
          cb: () => commands.executeCommand(`${EXT_NAME}.openAddConnectionScreen`),
        } as any,
      ],
    })) as string;
    return connections.find((c) => getConnectionId(c) === sel);
  }

  private _runConnectionCommandWithArgs(command, ...args) {
    return this.client.sendRequest(RunCommandRequest, { conn: this.explorer.getActive(), command, args });
  }

  private async _askForPassword(c: ConnectionInterface): Promise<string | null> {
    const cachedPass = await this.client.sendRequest(GetConnectionPasswordRequest, { conn: c });
    return cachedPass || await window.showInputBox({

      prompt: `${c.name} password`,
      password: true,
      validateInput: (v) => isEmpty(v) ? 'Password not provided.' : null,
    });
  }
  private async _setConnection(c?: ConnectionInterface): Promise<ConnectionInterface> {
    let password = null;

    if (c && getConnectionId(c) !== this.explorer.getActiveId()) {
      if (c.askForPassword) password = await this._askForPassword(c);
      if (c.askForPassword && password === null) return;
      c = await this.client.sendRequest(
        ConnectRequest,
        { conn: c, password },
      );
    }
    await this.explorer.focusActiveConnection(c);
    this._updateStatusBar();
    return this.explorer.getActive();
  }

  private _updateStatusBar() {
    if (!this.statusBar) {
      this.statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 10);
      this.statusBar.tooltip = 'Select a connection';
      this.statusBar.command = `${EXT_NAME}.selectConnection`;
    }
    if (this.explorer.getActive()) {
      this.statusBar.text = `$(database) ${this.explorer.getActive().name}`;
    } else {
      this.statusBar.text = '$(database) Connect';
    }
    if (ConfigManager.showStatusbar) {
      this.statusBar.show();
    } else {
      this.statusBar.hide();
    }

    return this.statusBar;
  }

  private async saveConnectionList(connList: ConnectionInterface[], writeTo?: ConfigurationTarget) {
    if (!writeTo && (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0)) {
      writeTo = ConfigurationTarget.Global;
    }
    return workspace.getConfiguration(EXT_NAME.toLowerCase()).update('connections', connList, writeTo);
  }

  private getConnectionList(from?: ConfigurationTarget): ConnectionInterface[] {
    if (!from) return workspace.getConfiguration(EXT_NAME.toLowerCase()).get('connections') || [];

    const config = workspace.getConfiguration(EXT_NAME.toLowerCase()).inspect('connections');
    if (from === ConfigurationTarget.Global) {
      return <ConnectionInterface[]>(config.globalValue || config.defaultValue) || [];
    }
    if (from === ConfigurationTarget.WorkspaceFolder) {
      return <ConnectionInterface[]>(config.workspaceFolderValue || config.defaultValue) || [];
    }

    return <ConnectionInterface[]>(config.workspaceValue || config.defaultValue) || [];
  }

  private ext_attachFileToConnection = async (fileUri: Uri) => {
    if (!fileUri && !window.activeTextEditor) return;
    fileUri = fileUri || window.activeTextEditor.document.uri;

    const conn = await this._pickConnection();
    if (!conn) return;
    this.updateAttachedConnectionsMap(fileUri, getConnectionId(conn));
    window.showTextDocument(fileUri);
  }

  private ext_detachConnectionFromFile = async (fileUri: Uri) => {
    if (!fileUri && !window.activeTextEditor) return;
    fileUri = fileUri || window.activeTextEditor.document.uri;
    const doc = workspace.textDocuments.find(doc => doc.uri.toString() === fileUri.toString());
    if (!doc) return;

    this.updateAttachedConnectionsMap(fileUri);
  }

  private changeTextEditorHandler = async (editor: TextEditor) => {
    if (!editor || !editor.document) return;

    const connId = this.getAttachedConnection(editor.document.uri);
    if (!connId) {
      return commands.executeCommand('setContext', `sqltools.file.connectionAttached`, false);
    }

    await this.ext_selectConnection(connId, editor.document.uri.scheme === EXT_NAME.toLocaleLowerCase());
    await commands.executeCommand('setContext', `sqltools.file.connectionAttached`, true);
  }

  private onDidOpenOrCloseTextDocument = (doc: TextDocument) => {
    if (
      !doc
      || !doc.uri
      || doc.uri.scheme === 'output'
      || doc.uri.scheme === 'git'
    ) return;
    if (doc.isClosed) {
      return this.updateAttachedConnectionsMap(doc.uri);
    }
    this.explorer.updateTreeRoot();
  }

  private notifications: {
    [id: string]: {
      progress: Progress<any>,
      tokenSource: CancellationTokenSource,
      interval: NodeJS.Timeout,
      resolve: Function,
      reject: Function,
    }
  } = {};
  private handler_progressStart = (params: ProgressNotificationStartParams) => {
    const tokenSource = new CancellationTokenSource();
    window.withProgress({
      location: ProgressLocation.Notification,
      title: params.title,
      cancellable: false,
    }, (progress) => {
      return new Promise((resolve, reject) => {
        progress.report({ message: params.message });
        let executions = 60;
        const complete = fn => () => {
          delete this.notifications[params.id];
          clearInterval(interval);
          return fn();
        }
        const interval = setInterval(() => {
          if (tokenSource.token.isCancellationRequested) {
            return complete(resolve)();
          }
          executions--;
          if (executions === 0) {
            return complete(reject)();
          }
        }, 500);
        const notification: typeof ConnectionManagerPlugin.prototype.notifications[string] = {
          progress,
          tokenSource,
          interval,
          resolve: complete(resolve),
          reject: complete(reject),
        }
        this.notifications[params.id] = notification;
      });
    });
  }

  private handler_progressComplete = (params: ProgressNotificationCompleteParams) => {
    if (!this.notifications[params.id]) return;
    if (!params.message) {
      return this.notifications[params.id].tokenSource.cancel();
    }
    clearInterval(this.notifications[params.id].interval);
    this.notifications[params.id].progress.report({ message: params.message, increment: 100 });
    setTimeout(() => {
      this.notifications[params.id].resolve();
    }, 3000);
  }

  public register(extension: SQLTools.ExtensionInterface) {
    if (this.client) return; // do not register twice
    this.client = extension.client;
    this.context = extension.context;
    this.errorHandler = extension.errorHandler;
    this.explorer = new ConnectionExplorer(extension);

    this.client.onRequest(ConnectionDataUpdatedRequest, this.handler_connectionDataUpdated);
    this.client.onNotification(ProgressNotificationStart, this.handler_progressStart);
    this.client.onNotification(ProgressNotificationComplete, this.handler_progressComplete);

    // extension stuff
    this.context.subscriptions.push(
      (this.resultsWebview = new ResultsWebviewManager(this.context, this.client)),
      (this.settingsWebview = new SettingsWebview(this.context)),
      this._updateStatusBar(),
      workspace.onDidCloseTextDocument(this.onDidOpenOrCloseTextDocument),
      workspace.onDidOpenTextDocument(this.onDidOpenOrCloseTextDocument),
      window.onDidChangeActiveTextEditor(this.changeTextEditorHandler),
    );

    // register extension commands
    extension.registerCommand(`addConnection`, this.ext_addConnection)
      .registerCommand(`updateConnection`, this.ext_updateConnection)
      .registerCommand(`openAddConnectionScreen`, this.ext_openAddConnectionScreen)
      .registerCommand(`openEditConnectionScreen`, this.ext_openEditConnectionScreen)
      .registerCommand(`closeConnection`, this.ext_closeConnection)
      .registerCommand(`deleteConnection`, this.ext_deleteConnection)
      .registerCommand(`describeFunction`, this.ext_describeFunction)
      .registerCommand(`describeTable`, this.ext_describeTable)
      .registerCommand(`executeFromInput`, this.ext_executeFromInput)
      .registerCommand(`executeQuery`, this.ext_executeQuery)
      .registerCommand(`executeQueryFromFile`, this.ext_executeQueryFromFile)
      .registerCommand(`refreshTree`, this.ext_refreshTree)
      .registerCommand(`saveResults`, this.ext_saveResults)
      .registerCommand(`selectConnection`, this.ext_selectConnection)
      .registerCommand(`showOutputChannel`, this.ext_showOutputChannel)
      .registerCommand(`showRecords`, this.ext_showRecords)
      .registerCommand(`focusOnExplorer`, this.ext_focusOnExplorer)
      .registerCommand(`attachFileToConnection`, this.ext_attachFileToConnection)
      .registerCommand(`testConnection`, this.ext_testConnection)
      .registerCommand(`getConnectionStatus`, this.ext_getConnectionStatus)
      .registerCommand(`detachConnectionFromFile`, this.ext_detachConnectionFromFile);

    // hooks
    ConfigManager.addOnUpdateHook(() => {
      this._updateStatusBar();
    });

    if (window.activeTextEditor) {
      setTimeout(() => {
        this.changeTextEditorHandler(window.activeTextEditor);
      }, 5000);
    }
  }

  constructor(extension: SQLTools.ExtensionInterface) {
    this.attachedFilesMap = extension.context.workspaceState.get('attachedFilesMap', {});
    this.codeLensPlugin = new CodeLensPlugin;
    extension.registerPlugin(this.codeLensPlugin);
  }
}