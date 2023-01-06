import { ConnectionExplorer, SidebarConnection, SidebarItem } from '@sqltools/plugins/connection-manager/explorer';
import ResultsWebviewManager from '@sqltools/plugins/connection-manager/webview/results';
import SettingsWebview from '@sqltools/plugins/connection-manager/webview/settings';
import { ContextValue, IConnection, IExtension, IExtensionPlugin, ILanguageClient, IQueryOptions, NSDatabase, RequestHandler } from '@sqltools/types';
import Config from '@sqltools/util/config-manager';
import { getConnectionDescription, getConnectionId, getSessionBasename, migrateConnectionSettings } from '@sqltools/util/connection';
import { EXT_CONFIG_NAMESPACE, EXT_NAMESPACE } from '@sqltools/util/constants';
import generateId from '@sqltools/util/internal-id';
import { default as logger, createLogger } from '@sqltools/log/src';
import { getDataPath, SESSION_FILES_DIRNAME } from '@sqltools/util/path';
import { extractConnName, getQueryParameters } from '@sqltools/util/query';
import { isEmpty } from '@sqltools/util/validation';
import Context from '@sqltools/vscode/context';
import { getIconPaths } from '@sqltools/vscode/icons';
import { getOrCreateEditor, getSelectedText, readInput } from '@sqltools/vscode/utils';
import { getEditorQueryDetails } from '@sqltools/vscode/utils/query';
import { quickPick, quickPickSearch } from '@sqltools/vscode/utils/quickPick';
import path from 'path';
import { promises as fs } from 'fs';
import { file } from 'tempy';
import { CancellationTokenSource, commands, ConfigurationTarget, env as vscodeEnv, Progress, ProgressLocation, QuickPickItem, TextDocument, TextEditor, Uri, window, workspace } from 'vscode';
import CodeLensPlugin from '../codelens/extension';
import { ConnectRequest, DisconnectRequest, ForceListRefresh, GetChildrenForTreeItemRequest, GetConnectionPasswordRequest, GetConnectionsRequest, GetInsertQueryRequest, ProgressNotificationComplete, ProgressNotificationCompleteParams, ProgressNotificationStart, ProgressNotificationStartParams, ReleaseResultsRequest, RunCommandRequest, GetResultsRequest, SearchConnectionItemsRequest, TestConnectionRequest } from './contracts';
import DependencyManager from './dependency-manager/extension';
import { getExtension, resolveConnection } from './extension-util';
import statusBar from './status-bar';
import { removeAttachedConnection, attachConnection, getAttachedConnection } from './attached-files';

const log = createLogger('conn-man');

export class ConnectionManagerPlugin implements IExtensionPlugin {
  public readonly name = plugin.name;
  public client: ILanguageClient;
  public resultsWebview: ResultsWebviewManager;
  public settingsWebview: SettingsWebview;
  private errorHandler: IExtension['errorHandler'];
  private explorer: ConnectionExplorer;
  private codeLensPlugin: CodeLensPlugin;

  // extension commands
  private ext_refreshTree = (connIdOrTreeItem: SidebarConnection | SidebarConnection[]) => {
    if (typeof connIdOrTreeItem === 'string') {
      throw new Error(`Deprecated! ${EXT_NAMESPACE}.refreshTree command with strings is now deprecated.`);
    }
    if (!connIdOrTreeItem || (Array.isArray(connIdOrTreeItem) && connIdOrTreeItem.length === 0)) {
      return this.explorer.refresh();
    }
    connIdOrTreeItem = Array.isArray(connIdOrTreeItem) ? connIdOrTreeItem : [connIdOrTreeItem].filter(Boolean);
    connIdOrTreeItem.forEach(item => this.explorer.refresh(item));
  }

  private ext_testConnection = async (c: IConnection) => {
    let password = null;
    c = await resolveConnection(c);

    if (c.askForPassword) password = await this._askForPassword(c);
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

  private ext_getInsertQuery: RequestHandler<typeof GetInsertQueryRequest> = async (params) => {
    return this.client.sendRequest(
      GetInsertQueryRequest,
      params,
    );
  }

  private ext_executeFromInput = async () => {
    try {
      const conn = await this.explorer.getActive() || await this._pickConnection(true);
      if (!conn) {
        return;
      }
      const query = await readInput('Query', `Type the query to run on ${conn.name}`);
      return this.ext_executeQuery(query, { connNameOrId: getConnectionId(conn) });
    } catch (e) {
      this.errorHandler('Error running query.', e);
    }
  }

  private ext_showRecords = async (node?: SidebarItem<NSDatabase.ITable> | NSDatabase.ITable, opt: IQueryOptions & { page?: number, pageSize?: number } = {}) => {
    try {
      const table = await this._getTable(node);
      const conn = await this.explorer.getActive()
      const view = await this._openResultsWebview(conn && conn.id, opt.requestId);
      const payload = await this._runConnectionCommandWithArgs('showRecords', table, { ...opt, requestId: view.requestId });
      this.updateViewResults(view, payload);
    } catch (e) {
      this.errorHandler('Error while showing table records', e);
    }
  }

  private ext_describeTable = async (node?: SidebarItem<NSDatabase.ITable> | NSDatabase.ITable) => {
    try {
      const table = await this._getTable(node);
      const conn = await this.explorer.getActive()
      const view = await this._openResultsWebview(conn && conn.id, undefined);
      const payload = await this._runConnectionCommandWithArgs('describeTable', table, { requestId: view.requestId });
      this.updateViewResults(view, payload);
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
      await this.explorer.refresh();
    } catch (e) {
      return this.errorHandler('Error closing connection', e);
    }
  }

  private updateViewResults = (view: ResultsWebviewManager['viewsMap'][string], results: NSDatabase.IResult[]) => {
    view.updateResults(results);
    if (results.length > 0)
      this.syncConsoleMessages(results[0].messages);
  }

  private syncConsoleMessages = (messages: NSDatabase.IResult['messages']) => {
    this.explorer.addConsoleMessages(messages || []);
  }

  private async updateAttachedConnectionsMap(fileUri: Uri, connId?: string) {
    if (!connId) {
      await removeAttachedConnection(fileUri);
    } else {
      await attachConnection(fileUri, connId);
    }
    this.codeLensPlugin.reset();
    this.changeTextEditorHandler(window.activeTextEditor);
  }

  private async openConnectionFile(conn: IConnection) {
    if (!Config.autoOpenSessionFiles) return;
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

    if (Config.sessionFilesFolder && Config.sessionFilesFolder != '') {
      baseFolder = Uri.file(Config.sessionFilesFolder);
    }

    const sessionFilePath = path.resolve(baseFolder.fsPath, getSessionBasename(conn.name));
    try {
      this.updateAttachedConnectionsMap(
        await this.openSessionFileWithProtocol(sessionFilePath, 'file'),
        getConnectionId(conn)
      );
    } catch (e) {
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
    try {
      const dependencies: string[] = (Context.globalState.get<any>('extPlugins') || {}).drivers || [];

      await Promise.all(dependencies.map(getExtension));

      if (connIdOrNode) {
        let conn = await this.getConnFromIdOrNode(connIdOrNode);

        conn = await this._setConnection(conn as IConnection).catch(e => this.errorHandler('Error opening connection', e));
        if (trySessionFile) await this.openConnectionFile(conn);
        return conn;
      }
      const conn = await this._connect(true);
      if (trySessionFile) await this.openConnectionFile(conn);
      return conn;
    } catch (error) {
      return this.errorHandler('Error selecting connection', error);
    }
  }

  private replaceParams = async (query: string, conn: IConnection) => {
    if (!Config['queryParams.enableReplace']) return query;

    const regex = Config['queryParams.regex']
    const params = getQueryParameters(query, regex);
    if (params.length > 0) {
      const connVariables = conn.variables || {}
      const connParams = params.filter(p => p.varName && Object.keys(connVariables).includes(p.varName))
      for (const connParam of connParams) {
        const r = new RegExp(connParam.param.replace(/([\$\[\]])/g, '\\$1'), 'g');
        query = query.replace(r, connVariables[connParam.varName]);
      }
      const promptParams = params.filter(p => connParams.indexOf(p) === -1)
      if (promptParams.length > 0) {
        await new Promise<void>((resolve, reject) => {
          const ib = window.createInputBox();
          ib.step = 1;
          ib.totalSteps = promptParams.length;
          ib.ignoreFocusOut = true;
          ib.title = `Value for '${promptParams[ib.step - 1].param}' in '${promptParams[ib.step - 1].string}'`;
          ib.prompt = 'Remember to escape values if needed.'
          ib.onDidAccept(() => {
            const r = new RegExp(promptParams[ib.step - 1].param.replace(/([\$\[\]])/g, '\\$1'), 'g');
            query = query.replace(r, ib.value);
            ib.step++;
            if (ib.step > ib.totalSteps) {
              ib.hide();
              return resolve();
            }
            ib.value = '';
            ib.title = `Value for '${promptParams[ib.step - 1].param}' in '${promptParams[ib.step - 1].string}'`;
          });
          ib.onDidHide(() => ib.step >= ib.totalSteps && ib.value.trim() ? resolve() : reject(new Error('Didn\'t fill all params. Cancelling...')));
          ib.show();
        });
      }
    }

    return query;
  }

  private ext_executeQuery = async (query?: string, { connNameOrId, connId, ...opt }: IQueryOptions = {}) => {
    try {
      query = typeof query === 'string' ? query : await getSelectedText('execute query');
      connNameOrId = connId || connNameOrId;
      if (!connNameOrId) { // check query defined connection name
        connNameOrId = extractConnName(query);
      }

      if (!connNameOrId && window.activeTextEditor) { // check if has attached connection
        connNameOrId = getAttachedConnection(window.activeTextEditor.document.uri);
      }

      if (connNameOrId && connNameOrId.trim()) {
        connNameOrId = connNameOrId.trim();
        const conn = (await this.ext_getConnections({ connectedOnly: false, sort: 'connectedFirst' })).find(c => getConnectionId(c) === connNameOrId || c.name === connNameOrId);
        if (!conn) {
          throw new Error(`Trying to run query on '${connNameOrId}' but it does not exist.`)
        }
        await this._setConnection(conn);
      } else {
        await this._connect();
      }

      const conn = await this.explorer.getActive()
      query = await this.replaceParams(query, conn);
      
      const view = await this._openResultsWebview(conn && conn.id, opt.requestId);
      const payload = await this._runConnectionCommandWithArgs('query', query, { ...opt, requestId: view.requestId });
      this.updateViewResults(view, payload);
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
    return this.ext_executeQuery(await getSelectedText('execute file', true));
  }

  private ext_showOutputChannel = async () => logger.show();

  private ext_saveResults = async (arg: (IQueryOptions & { formatType?: 'csv' | 'json' | 'prompt' }) | Uri = {}) => {
    let formatType: string | null = null;
    let opt: IQueryOptions = {};
    if (arg instanceof Uri) {
      // if clicked on editor title actions
      const view = this.resultsWebview.getActiveView();
      if (!view) {
        throw 'Can\'t find active results view';
      }
      const state = await view.getState();
      const activeResult = state.resultTabs[state.activeTab];
      opt = {
        requestId: activeResult.requestId,
        resultId: activeResult.resultId,
        baseQuery: activeResult.baseQuery,
        connId: activeResult.connId,
      }
    } else if (arg.requestId) {
      // used context menu inside of a view
      const { formatType: optFileType, ...rest } = arg;
      formatType = optFileType;
      opt = rest;
    }

    if (!opt || !opt.requestId) throw 'Can\'t find active results view';

    let showSaveDialog = true;
    formatType = formatType || Config.defaultExportType;
    if (formatType === 'prompt') {
      ({ formatType, showSaveDialog } = (await quickPick<{ formatType: 'csv' | 'json'; showSaveDialog: boolean }>([
        { label: 'Save results as CSV', value: { formatType: 'csv', showSaveDialog: true } },
        { label: 'Save results as JSON', value: { formatType: 'json', showSaveDialog: true } },
        { label: 'Copy results as CSV to clipboard', value: { formatType: 'csv', showSaveDialog: false } },
        { label: 'Copy results as JSON to clipboard', value: { formatType: 'json', showSaveDialog: false } },
      ], 'value', {
        title: 'Select a file type to export',
      }) || {}));
    }

    if (!formatType || formatType === 'prompt') return;

    if (showSaveDialog) { // When saving to file
      const filters = formatType === 'csv' ? { 'CSV File': ['csv', 'txt'] } : { 'JSON File': ['json'] };
      const file = await window.showSaveDialog({
        filters,
        saveLabel: 'Export'
      });
      if (!file) return;
      const filename = file.fsPath;

      const results = await this.client.sendRequest(GetResultsRequest, { ...opt, formatType });

      await fs.writeFile(filename, results);
      return commands.executeCommand('vscode.open', file);
    } else { // When saving to clipboard
      const results = await this.client.sendRequest(GetResultsRequest, { ...opt, formatType });
      return vscodeEnv.clipboard.writeText(results);
    }
  }

  private ext_openResults = async (arg: (IQueryOptions & { formatType?: 'csv' | 'json' | 'prompt' }) | Uri = {}) => {
    let formatType: string | null = null;
    let opt: IQueryOptions = {};
    if (arg instanceof Uri) {
      // if clicked on editor title actions
      const view = this.resultsWebview.getActiveView();
      if (!view) {
        throw 'Can\'t find active results view';
      }
      const state = await view.getState();
      const activeResult = state.resultTabs[state.activeTab];
      opt = {
        requestId: activeResult.requestId,
        resultId: activeResult.resultId,
        baseQuery: activeResult.baseQuery,
        connId: activeResult.connId,
      }
    } else if (arg.requestId) {
      // used context menu inside of a view
      const { formatType: optFileType, ...rest } = arg;
      formatType = optFileType;
      opt = rest;
    }

    if (!opt || !opt.requestId) throw 'Can\'t find active results view';

    formatType = formatType || Config.defaultOpenType;
    if (formatType === 'prompt') {
      formatType = await quickPick<'csv' | 'json' | undefined>([
        { label: 'Open results as CSV', value: 'csv' },
        { label: 'Open results as JSON', value: 'json' },
      ], 'value', {
        title: 'Select a file type',
      });
    }

    if (!formatType || formatType === 'prompt') return;

    const filename = file({
      extension: formatType,
    });

    const fileUri = Uri.file(filename);
    const results = await this.client.sendRequest(GetResultsRequest, { ...opt, formatType });
    await fs.writeFile(filename, results);

    return vscodeEnv.openExternal(fileUri);
  }

  private ext_openAddConnectionScreen = () => {
    this.settingsWebview.show();
    return this.settingsWebview.reset();
  }

  private ext_openEditConnectionScreen = async (connIdOrNode?: string | SidebarConnection) => {
    let conn: IConnection;
    try {
      conn = await this.getConnFromIdOrNode(connIdOrNode);
      if (!conn) return;
      return await this.settingsWebview.editConnection({ conn });
    } catch (error) {
      return this.errorHandler(`Error while trying to edit ${(conn && conn.name) || 'connection'}:`, error);
    }
  }

  private ext_openSettings = async () => {
    // TEMP SOlUTION
    // in the future this should open correct json file to edit connections
    return commands.executeCommand('workbench.action.openSettings', `${EXT_NAMESPACE}.connections`);
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
    } = workspace.getConfiguration(EXT_CONFIG_NAMESPACE).inspect<any[]>('connections');

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
      log.warn('Nothing to do. No parameter received');
      return;
    }

    const connList = this.getConnectionList(ConfigurationTarget[writeTo] || undefined);
    this._throwIfNotUnique(connInfo, connList);
    connList.push(connInfo);
    return this.saveConnectionList(connList, ConfigurationTarget[writeTo]);
  }

  private ext_updateConnection = (oldId: string, connInfo: IConnection, writeTo?: keyof typeof ConfigurationTarget) => {
    if (!connInfo) {
      log.warn('Nothing to do. No parameter received');
      return;
    }

    const connList = this.getConnectionList(ConfigurationTarget[writeTo] || undefined)
      .filter(c => getConnectionId(c) !== oldId);
    this._throwIfNotUnique(connInfo, connList);
    connList.push(connInfo);
    return this.saveConnectionList(connList, ConfigurationTarget[writeTo]);
  }

  // internal utils

  private _throwIfNotUnique(connInfo: IConnection, connList: IConnection[]) {
    const connId = getConnectionId(connInfo);
    if (connList.filter((c) => getConnectionId(c) === connId).length > 0) {
      throw new Error(`A connection definition already exists with id '${connId}'. Change name or another id element to make it unique.`);
    }
  }

  private async _getTable(node?: SidebarItem<NSDatabase.ITable> | NSDatabase.ITable): Promise<NSDatabase.ITable> {
    if (node instanceof SidebarItem && node.conn) {
      await this._setConnection(node.conn as IConnection);
      return node.metadata;
    } else if (node) {
      return node as NSDatabase.ITable;
    }

    const conn = await this._connect();
    const loadOptions = (search: string) => this.client.sendRequest(SearchConnectionItemsRequest, { conn, itemType: ContextValue.TABLE, search }).then(({ results }) => results);
    return quickPickSearch<NSDatabase.ITable>(loadOptions, {
      matchOnDescription: true,
      matchOnDetail: true,
      title: `Tables in ${conn.database}`,
      placeHolder: 'Type something to search tables...',
    });
  }


  private async _openResultsWebview(connId: string, reUseId: string) {
    const requestId = reUseId || Config.results.reuseTabs === 'connection' ? connId : generateId();
    const view = this.resultsWebview.get(requestId);
    view.onDidDispose(() => {
      this.client.sendRequest(ReleaseResultsRequest, { connId, requestId });
    });
    await view.show();
    return view;
  }
  private _connect = async (force = false): Promise<IConnection> => {
    if (!force) {
      const active = await this.explorer.getActive();
      if (active) return active;
    }
    const c: IConnection = await this._pickConnection(!force);
    return this._setConnection(c);
  }

  private ext_getConnections = async ({ connectedOnly, connId, sort }: (typeof GetConnectionsRequest)['_']['0'] = {}) => {
    try {
      return this.client.sendRequest(GetConnectionsRequest, { connectedOnly, connId, sort });
    } catch (error) {
      console.log(error);
    }
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
          tooltip: 'Add New Connection',
          cb: () => commands.executeCommand(`${EXT_NAMESPACE}.openAddConnectionScreen`),
        } as any,
      ],
    })) as string;
    return connections.find((c) => getConnectionId(c) === sel);
  }

  private async _runConnectionCommandWithArgs(command: string, ...args: any[]) {
    return this.client.sendRequest(RunCommandRequest, { conn: await this.explorer.getActive(), command, args });
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

    if (c) {
      c = await resolveConnection(c);
      c.id = getConnectionId(c);
    }

    if (c && getConnectionId(c) !== (await this.explorer.getActiveId())) {
      if (c.askForPassword) password = await this._askForPassword(c);
      if (c.askForPassword && password === null) return;
      c = await this.client.sendRequest(ConnectRequest, { conn: c, password });
    }
    this.explorer.refresh();
    return c;
  }

  private async saveConnectionList(connList: IConnection[], writeTo?: ConfigurationTarget) {
    if (!writeTo && (!workspace.workspaceFolders || workspace.workspaceFolders.length === 0)) {
      writeTo = ConfigurationTarget.Global;
    }
    return workspace.getConfiguration(EXT_CONFIG_NAMESPACE).update('connections', migrateConnectionSettings(connList), writeTo);
  }

  private getConnectionList(from?: ConfigurationTarget): IConnection[] {
    if (!from) return migrateConnectionSettings(workspace.getConfiguration(EXT_CONFIG_NAMESPACE).get('connections') || []);

    const config = workspace.getConfiguration(EXT_CONFIG_NAMESPACE).inspect('connections');
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
    return commands.executeCommand(`${EXT_NAMESPACE}.copyText`, null, nodes);
  }

  private async getConnFromIdOrNode(connIdOrNode?: string | SidebarConnection): Promise<IConnection | null> {
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

    const connId = getAttachedConnection(editor.document.uri);
    if (!connId) {
      return commands.executeCommand('setContext', `${EXT_NAMESPACE}.file.connectionAttached`, false);
    }

    await this.ext_selectConnection(connId, editor.document.uri.scheme === EXT_NAMESPACE);
    await commands.executeCommand('setContext', `${EXT_NAMESPACE}.file.connectionAttached`, true);
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
      interval: NodeJS.Timeout,
      resolve: Function,
      reject: Function,
    }
  } = {};
  private handler_progressStart = (params: ProgressNotificationStartParams) => {
    if (this.notifications[params.id]) return;
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
    this.notifications[params.id].resolve();
  }

  public register(extension: IExtension) {
    if (this.client) return; // do not register twice

    extension.registerPlugin(this.codeLensPlugin);
    extension.registerPlugin(new DependencyManager);

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
      .registerCommand(`openResults`, this.ext_openResults)
      .registerCommand(`selectConnection`, this.ext_selectConnection)
      .registerCommand(`showOutputChannel`, this.ext_showOutputChannel)
      .registerCommand(`showRecords`, this.ext_showRecords)
      .registerCommand(`attachFileToConnection`, this.ext_attachFileToConnection)
      .registerCommand(`testConnection`, this.ext_testConnection)
      .registerCommand(`getConnections`, this.ext_getConnections)
      .registerCommand(`detachConnectionFromFile`, this.ext_detachConnectionFromFile)
      .registerCommand(`copyTextFromTreeItem`, this.ext_copyTextFromTreeItem)
      .registerCommand(`getChildrenForTreeItem`, this.ext_getChildrenForTreeItem)
      .registerCommand(`getInsertQuery`, this.ext_getInsertQuery);

    this.errorHandler = extension.errorHandler;
    this.explorer = new ConnectionExplorer();
    this.explorer.onDidChangeActiveConnection((active: IConnection) => {
      statusBar.setText(active ? active.name : null);
    });
    this.client.onNotification(ProgressNotificationStart, this.handler_progressStart);
    this.client.onNotification(ProgressNotificationComplete, this.handler_progressComplete);
    this.client.onRequest(ForceListRefresh, () => {
      this.explorer.refresh();
    });

    // extension stuff
    Context.subscriptions.push(
      (this.resultsWebview = new ResultsWebviewManager(this.syncConsoleMessages)),
      (this.settingsWebview = new SettingsWebview()),
      statusBar,
      workspace.onDidCloseTextDocument(this.onDidOpenOrCloseTextDocument),
      workspace.onDidOpenTextDocument(this.onDidOpenOrCloseTextDocument),
      window.onDidChangeActiveTextEditor(this.changeTextEditorHandler),
    );

    this.explorer.refresh();
    this.changeTextEditorHandler(window.activeTextEditor);
    setTimeout(() => {
      this.explorer.refresh();
    }, 2000);
  }

  private constructor() {
    this.codeLensPlugin = new CodeLensPlugin;
  }
  private static _instance: ConnectionManagerPlugin;

  public static instance = () => {
    if (!ConnectionManagerPlugin._instance) {
      ConnectionManagerPlugin._instance = new ConnectionManagerPlugin();
    }
    return ConnectionManagerPlugin._instance;
  }
}

const plugin: IExtensionPlugin = {
  name: 'Connection Manager Plugin',
  register(extension: IExtension) {
    return ConnectionManagerPlugin.instance().register(extension);
  }
}

export default plugin;
