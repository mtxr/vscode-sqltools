import logger from '@sqltools/vscode/log';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { IConnection, DatabaseDriver, IExtensionPlugin, ILanguageClient, IExtension, RequestHandler } from '@sqltools/types';
import { getDataPath, SESSION_FILES_DIRNAME } from '@sqltools/core/utils/persistence';
import getTableName from '@sqltools/core/utils/query/prefixed-tablenames';
import { getConnectionDescription, getConnectionId, isEmpty, migrateConnectionSettings, getSessionBasename } from '@sqltools/core/utils';
import { getSelectedText, quickPick, readInput, getOrCreateEditor } from '@sqltools/vscode/utils';
import { SidebarConnection, SidebarTableOrView, ConnectionExplorer } from '@sqltools/plugins/connection-manager/explorer';
import ResultsWebviewManager from '@sqltools/plugins/connection-manager/screens/results';
import SettingsWebview from '@sqltools/plugins/connection-manager/screens/settings';
import { commands, QuickPickItem, window, workspace, ConfigurationTarget, Uri, TextEditor, TextDocument, ProgressLocation, Progress, CancellationTokenSource } from 'vscode';
import { ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RunCommandRequest, ProgressNotificationStart, ProgressNotificationComplete, ProgressNotificationStartParams, ProgressNotificationCompleteParams, TestConnectionRequest, GetChildrenForTreeItemRequest } from './contracts';
import path from 'path';
import CodeLensPlugin from '../codelens/extension';
import { extractConnName, getQueryParameters } from '@sqltools/core/utils/query';
import statusBar from './status-bar';
import parseWorkspacePath from '@sqltools/vscode/utils/parse-workspace-path';
import telemetry from '@sqltools/core/utils/telemetry';
import Context from '@sqltools/vscode/context';
import { getIconPaths } from '@sqltools/vscode/icons';
import { getEditorQueryDetails } from '@sqltools/vscode/utils/query';
const log = logger.extend('conn-man');

export default class ConnectionManagerPlugin implements IExtensionPlugin {
  public client: ILanguageClient;
  public resultsWebview: ResultsWebviewManager;
  public settingsWebview: SettingsWebview;
  private errorHandler: IExtension['errorHandler'];
  private explorer: ConnectionExplorer;
  private attachedFilesMap: { [fileUri: string ]: string } = {};
  private codeLensPlugin: CodeLensPlugin;

  // extension commands
  private ext_refreshTree = (connIdOrTreeItem: SidebarConnection | SidebarConnection[]) => {
    if (typeof connIdOrTreeItem === 'string') {
      throw new Error(`Deprecated! ${EXT_NAME}.refreshTree command with strings is now deprecated.`);
    }
    if (!connIdOrTreeItem || (Array.isArray(connIdOrTreeItem) && connIdOrTreeItem.length === 0)) {
      return this.explorer.refresh();
    }
    connIdOrTreeItem = Array.isArray(connIdOrTreeItem) ? connIdOrTreeItem : [connIdOrTreeItem].filter(Boolean);
    connIdOrTreeItem.forEach(item => this.explorer.refresh(item));
  }

  private ext_testConnection = async (c: IConnection) => {
    let password = null;

    if (c.driver !== DatabaseDriver.SQLite && c.askForPassword) password = await this._askForPassword(c);
    if (c.askForPassword && password === null) return;
    return this.client.sendRequest(
      TestConnectionRequest,
      { conn: c, password },
    );
  }

  private ext_getChildrenForTreeItem: RequestHandler<typeof GetChildrenForTreeItemRequest> = async (params) => {
    return this.client.sendRequest(
      GetChildrenForTreeItemRequest,
      params,
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

  private ext_showRecords = async (node?: SidebarTableOrView | string, page: number = 0) => {
    try {
      const table = typeof node === 'string' ? node : await this._getTableName(node);
      await this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('showRecords', table, page);
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
      telemetry.registerMessage('info', 'Connection closed!');
      await this.explorer.refresh();
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
    await Context.workspaceState.update('attachedFilesMap', this.attachedFilesMap);
    this.codeLensPlugin.reset();
    this.changeTextEditorHandler(window.activeTextEditor);
  }

  public getAttachedConnection(fileUri: Uri) {
    return this.attachedFilesMap[fileUri.toString()];
  }

  private async openConnectionFile(conn: IConnection) {
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
      baseFolder = Uri.file(getDataPath(SESSION_FILES_DIRNAME));
    }
    const sessionFilePath = path.resolve(baseFolder.fsPath, getSessionBasename(conn.name));
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
      let conn = await this.getConnFromIdOrNode(connIdOrNode);

      conn = await this._setConnection(conn as IConnection).catch(e => this.errorHandler('Error opening connection', e));
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
          query = query.replace(r, ib.value);
          ib.step++;
          if (ib.step > ib.totalSteps) {
            ib.hide();
            return resolve();
          }
          ib.value = '';
          ib.title = `Value for '${params[ib.step - 1].param}' in '${params[ib.step - 1].string}'`;
        });
        ib.onDidHide(() => ib.step >= ib.totalSteps && ib.value.trim() ? resolve() : reject(new Error('Didnt fill all params. Cancelling...')));
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
        const conn = (await this.ext_getConnections({ connectedOnly: false, sort: 'connectedFirst'})).find(c => getConnectionId(c) === connNameOrId || c.name === connNameOrId);
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
  
  private ext_executeCurrentQuery = async () => {
    const activeEditor = await getOrCreateEditor();
    if (!activeEditor) {
        return;
    }
    if (!activeEditor.selection.isEmpty) {
      return this.ext_executeQuery();
    }
    const { currentQuery } = getEditorQueryDetails(activeEditor);
    return this.ext_executeQuery(currentQuery);
  }

  private ext_executeQueryFromFile = async () => {
    // @TODO: add option read from file and run
    return this.ext_executeQuery(await getSelectedText('execute file', true));
  }

  private ext_showOutputChannel = () => logger.show();

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
    const conn = await this.getConnFromIdOrNode(connIdOrNode);
    if (!conn) return;
    this.settingsWebview.show();
    this.settingsWebview.postMessage({ action: 'editConnection', payload: { conn } });
  }

  private ext_openSettings = async () => {
    // TEMP SOlUTION
    // in the future this should open correct json file to edit connections
    return commands.executeCommand('workbench.action.openSettings', 'sqltools.connections');
  }

  private ext_focusOnExplorer = () => {
    return this.explorer.focus();
  }

  private ext_deleteConnection = async (connIdOrNode?: string | SidebarConnection) => {
    const conn = await this.getConnFromIdOrNode(connIdOrNode);
    if (!conn) return;

    const res = await window.showInformationMessage(`Are you sure you want to remove ${conn.name}?`, { modal: true }, 'Yes');

    if (!res) return;

    const {
      workspaceFolderValue = [],
      workspaceValue = [],
      globalValue = [],
    } = workspace.getConfiguration(EXT_NAME.toLowerCase()).inspect('connections');

    const findIndex = (arr = []) => arr.findIndex(c => getConnectionId(c) === conn.id);

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
  }

  private ext_addConnection = (connInfo: IConnection, writeTo?: keyof typeof ConfigurationTarget) => {
    if (!connInfo) {
      log.extend('warn')('Nothing to do. No parameter received');
      return;
    }

    const connList = this.getConnectionList(ConfigurationTarget[writeTo] || undefined);
    connList.push(connInfo);
    return this.saveConnectionList(connList, ConfigurationTarget[writeTo]);
  }

  private ext_updateConnection = (oldId: string, connInfo: IConnection, writeTo?: keyof typeof ConfigurationTarget) => {
    if (!connInfo) {
      log.extend('warn')('Nothing to do. No parameter received');
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
      await this._setConnection(node.conn as IConnection);
      return getTableName(node.conn.driver, node.table);
    }

    const conn = await this._connect();
    return this._pickTable(conn, 'value');
  }

  private _openResultsWebview(connId?: string) {
    return this.resultsWebview.get(connId || this.explorer.getActive().id).show();
  }
  private _connect = async (force = false): Promise<IConnection> => {
    if (!force && this.explorer.getActive()) {
      return this.explorer.getActive();
    }
    const c: IConnection = await this._pickConnection(!force);
    // history.clear();
    return this._setConnection(c);
  }

  private async _pickTable(conn: IConnection, prop?: string): Promise<string> {
    const { tables } = await this.client.sendRequest(GetConnectionDataRequest, { conn });
    return quickPick(tables
      .map((table) => {
        const prefixedTableName = getTableName(conn.driver, table);
        const prefixes  = prefixedTableName.split('.');

        return <QuickPickItem>{
          label: table.name,
          value: getTableName(conn.driver, table),
          description: typeof table.numberOfColumns !== 'undefined' ? `${table.numberOfColumns} cols` : '',
          detail: prefixes.length > 1 ? `in ${prefixes.slice(0, prefixes.length - 1).join('.')}` : undefined,
        };
      }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,
        title: `Tables in ${conn.database}`,
      });
  }

  private ext_getConnections = async ({ connectedOnly, connId, sort }: (typeof GetConnectionsRequest)['_']['0'] = {}) => {
    return this.client.sendRequest(GetConnectionsRequest, { connectedOnly, connId, sort });
  }
  private async _pickConnection(connectedOnly = false): Promise<IConnection> {
    const connections: IConnection[] = await this.ext_getConnections({ connectedOnly });

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
          iconPath: getIconPaths('add-connection'),
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

  private async _askForPassword(c: IConnection): Promise<string | null> {
    const cachedPass = await this.client.sendRequest(GetConnectionPasswordRequest, { conn: c });
    return cachedPass || await window.showInputBox({

      prompt: `${c.name} password`,
      password: true,
      validateInput: (v) => isEmpty(v) ? 'Password not provided.' : null,
    });
  }
  private async _setConnection(c?: IConnection): Promise<IConnection> {
    let password = null;

    if (c && getConnectionId(c) !== this.explorer.getActiveId()) {
      if (c.driver === DatabaseDriver.SQLite) {
        c.database = parseWorkspacePath(c.database);
      }
      if (c.driver === DatabaseDriver.PostgreSQL && c.pgOptions && typeof c.pgOptions.ssl === 'object') {
        Object.keys(c.pgOptions.ssl).forEach(key => {
          if (typeof c.pgOptions.ssl[key] === 'string' && c.pgOptions.ssl[key].startsWith('file://')) return;
          c.pgOptions.ssl[key] = `file://${parseWorkspacePath(c.pgOptions.ssl[key].replace('file://', ''))}`;
        });
      }
      if (c.askForPassword) password = await this._askForPassword(c);
      if (c.askForPassword && password === null) return;
      c = await this.client.sendRequest(ConnectRequest, { conn: c, password });
    }
    this.explorer.refresh();
    if (c) {
      await this.explorer.focusByConn(c);
    }
    return this.explorer.getActive();
  }

  private async saveConnectionList(connList: IConnection[], writeTo?: ConfigurationTarget) {
    if (!writeTo && (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0)) {
      writeTo = ConfigurationTarget.Global;
    }
    return workspace.getConfiguration(EXT_NAME.toLowerCase()).update('connections', migrateConnectionSettings(connList), writeTo);
  }

  private getConnectionList(from?: ConfigurationTarget): IConnection[] {
    if (!from) return migrateConnectionSettings(workspace.getConfiguration(EXT_NAME.toLowerCase()).get('connections') || []);

    const config = workspace.getConfiguration(EXT_NAME.toLowerCase()).inspect('connections');
    if (from === ConfigurationTarget.Global) {
      return migrateConnectionSettings(<IConnection[]>(config.globalValue || config.defaultValue) || []);
    }
    if (from === ConfigurationTarget.WorkspaceFolder) {
      return migrateConnectionSettings(<IConnection[]>(config.workspaceFolderValue || config.defaultValue) || []);
    }

    return migrateConnectionSettings(<IConnection[]>(config.workspaceValue || config.defaultValue) || []);
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

  private ext_copyTextFromTreeItem = async () => {
    const nodes = this.explorer.getSelection();
    if (!nodes || nodes.length === 0) return;
    return commands.executeCommand(`${EXT_NAME}.copyText`, null, nodes);
  }

  private async getConnFromIdOrNode(connIdOrNode?: string | SidebarConnection) {
    let id: string;
    let conn: IConnection = null;
    if (connIdOrNode) {
      id = connIdOrNode instanceof SidebarConnection ? connIdOrNode.getId() : <string>connIdOrNode;
    } else {
      conn = await this._pickConnection();
      id = conn ? getConnectionId(conn) : undefined;
    }

    if (!id) return null;

    if (!conn) {
      conn = conn || await this.explorer.getConnectionById(id);
    }
    if (!conn) return null;
    conn.id = getConnectionId(conn);
    return conn;
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
    this.explorer.refresh();
  }

  private notifications: {
    [id: string]: {
      progress: Progress<any>,
      tokenSource: CancellationTokenSource,
      interval: number,
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

  public register(extension: IExtension) {
    if (this.client) return; // do not register twice
    this.client = extension.client;

    // register extension commands
    extension.registerCommand(`addConnection`, this.ext_addConnection)
      .registerCommand(`updateConnection`, this.ext_updateConnection)
      .registerCommand(`openAddConnectionScreen`, this.ext_openAddConnectionScreen)
      .registerCommand(`openEditConnectionScreen`, this.ext_openEditConnectionScreen)
      .registerCommand(`openSettings`, this.ext_openSettings)
      .registerCommand(`closeConnection`, this.ext_closeConnection)
      .registerCommand(`deleteConnection`, this.ext_deleteConnection)
      .registerCommand(`describeFunction`, this.ext_describeFunction)
      .registerCommand(`describeTable`, this.ext_describeTable)
      .registerCommand(`executeFromInput`, this.ext_executeFromInput)
      .registerCommand(`executeQuery`, this.ext_executeQuery)
      .registerCommand(`executeCurrentQuery`, this.ext_executeCurrentQuery)
      .registerCommand(`executeQueryFromFile`, this.ext_executeQueryFromFile)
      .registerCommand(`refreshTree`, this.ext_refreshTree)
      .registerCommand(`saveResults`, this.ext_saveResults)
      .registerCommand(`selectConnection`, this.ext_selectConnection)
      .registerCommand(`showOutputChannel`, this.ext_showOutputChannel)
      .registerCommand(`showRecords`, this.ext_showRecords)
      .registerCommand(`focusOnExplorer`, this.ext_focusOnExplorer)
      .registerCommand(`attachFileToConnection`, this.ext_attachFileToConnection)
      .registerCommand(`testConnection`, this.ext_testConnection)
      .registerCommand(`getConnections`, this.ext_getConnections)
      .registerCommand(`detachConnectionFromFile`, this.ext_detachConnectionFromFile)
      .registerCommand(`copyTextFromTreeItem`, this.ext_copyTextFromTreeItem)
      .registerCommand(`getChildrenForTreeItem`, this.ext_getChildrenForTreeItem);

    this.errorHandler = extension.errorHandler;
    this.explorer = new ConnectionExplorer();
    this.explorer.onDidChangeActiveConnection((active: IConnection) => {
      statusBar.setText(active ? active.name : null);
    });
    this.client.onNotification(ProgressNotificationStart, this.handler_progressStart);
    this.client.onNotification(ProgressNotificationComplete, this.handler_progressComplete);

    // extension stuff
    Context.subscriptions.push(
      (this.resultsWebview = new ResultsWebviewManager(this.client)),
      (this.settingsWebview = new SettingsWebview()),
      statusBar,
      workspace.onDidCloseTextDocument(this.onDidOpenOrCloseTextDocument),
      workspace.onDidOpenTextDocument(this.onDidOpenOrCloseTextDocument),
      window.onDidChangeActiveTextEditor(this.changeTextEditorHandler),
    );

    if (window.activeTextEditor) {
      setTimeout(() => {
        this.changeTextEditorHandler(window.activeTextEditor);
      }, 5000);
    }
  }

  constructor(extension: IExtension) {
    this.attachedFilesMap = Context.workspaceState.get('attachedFilesMap', {});
    this.codeLensPlugin = new CodeLensPlugin;
    extension.registerPlugin(this.codeLensPlugin);
  }
}