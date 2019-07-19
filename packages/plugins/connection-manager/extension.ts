import logger from '@sqltools/core/log/vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface } from '@sqltools/core/interface';
import getTableName from '@sqltools/core/utils/query/prefixed-tablenames';
import SQLTools,  { RequestHandler, DatabaseInterface } from '@sqltools/core/plugin-api';
import { getConnectionDescription, getConnectionId, isEmpty } from '@sqltools/core/utils';
import { getSelectedText, quickPick, readInput, getOrCreateEditor, insertText } from '@sqltools/core/utils/vscode';
import { SidebarConnection, SidebarTableOrView, ConnectionExplorer } from '@sqltools/plugins/connection-manager/explorer';
import ResultsWebviewManager from '@sqltools/plugins/connection-manager/screens/results';
import SettingsWebview from '@sqltools/plugins/connection-manager/screens/settings';
import { commands, QuickPickItem, ExtensionContext, StatusBarAlignment, StatusBarItem, window, workspace, ConfigurationTarget, Uri, TextEditor, TextDocument, Position } from 'vscode';
import { ConnectionDataUpdatedRequest, ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RefreshAllRequest, RunCommandRequest } from './contracts';
import path from 'path';
import CodeLensPlugin from '../codelens/extension';
import { getHome } from '@sqltools/core/utils';
import { extractConnName } from '@sqltools/core/utils/query';

export default class ConnectionManagerPlugin implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  public resultsWebview: ResultsWebviewManager;
  public settingsWebview: SettingsWebview;
  public statusBar: StatusBarItem;;
  private context: ExtensionContext;
  private errorHandler: SQLTools.ExtensionInterface['errorHandler'];
  private explorer: ConnectionExplorer;
  private attachedFilesMap = {};
  private codeLensPlugin: CodeLensPlugin;

  public handler_connectionDataUpdated: RequestHandler<typeof ConnectionDataUpdatedRequest> = (data) => this.explorer.setTreeData(data);
  
  // extension commands
  private ext_refreshAll = () => {
    return this.client.sendRequest(RefreshAllRequest);
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
      this._openResultsWebview();
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
      this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('describeTable', table);
      this.resultsWebview.get(payload[0].connId || this.explorer.getActive().id).updateResults(payload);
    } catch (e) {
      this.errorHandler('Error while describing table records', e);
    }
  }

  private ext_describeCurrent = async () => {
    try {
      let activeEditor = await getOrCreateEditor();
      if (!activeEditor) {
          return;
      }
      let text = activeEditor.document.getText(); 
      let line = activeEditor.selection.active.line;
      let eol = activeEditor.document.eol === 2 ? "\r\n" : "\n";
      let tests = text.split(eol);
      let currentLine = tests[line];
      let col = activeEditor.selection.active.character;
      let startCol = 0;
      for (let i = col; i >= 0; i--) {
        let curLine = currentLine[i] || "";
        if (curLine == " " || curLine == "," || curLine == "(" || curLine == ")" || curLine == "'") {
          startCol = i + 1;
          break;
        }
      }
      let endCol = currentLine.length;
      for (let i = col; i < currentLine.length; i++) {
        let curLine = currentLine[i] || "";
        if (curLine == " " || curLine == "," || curLine == "(" || curLine == ")" || curLine == "'") {
          endCol = i;
          break;
        } 
      }
      let query = "";
      for (let q = startCol; q < endCol; q++) {
        query = query + currentLine[q];
      }
      const conn = await this._connect();
      const s = await this.client.sendRequest(GetConnectionDataRequest, { conn });
      let table = s.tables.find(p => p.name.toUpperCase() == query.toUpperCase());
      let columns = [];
      let tasks = [this._runConnectionCommandWithArgs('getDDL', query.toUpperCase())];
      if (table != null) {
        tasks.push(this._runConnectionCommandWithArgs('describeTable', getTableName(conn.dialect, table))),
        tasks.push(this._runConnectionCommandWithArgs('showRecords', getTableName(conn.dialect, table), 50));
        this._openResultsWebview();
      }
      let res = await Promise.all(tasks);
      if (table != null) {
        let payload = res[1];
        let payload2 = res[2];
        payload.push(payload2[0]);
        payload[0].label = `${payload[0].results.length} Columns`;
        payload[1].label = `${payload[1].results.length} Rows`;
        this.resultsWebview.get(payload[0].connId || this.explorer.getActive().id).updateResults(payload);
        columns = payload[0].results.map(p => p.COLUMN_NAME);
      }
      let ddlText = "";
      if (columns.length > 0) {
        ddlText = `/* ${query.toUpperCase()}\n${columns.join(", ")}\n${columns.map(p => "A." + p).join(", ")}\n*/\n`;
      }
      let ddl: string[] = res[0];
      for (let p of ddl) {
        ddlText = ddlText + "\n" + p;
      }
      if (ddlText != "") {
        await insertText(ddlText, true, true);
      }
      
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

    return this.client.sendRequest(DisconnectRequest, { conn })
      .then(async () => {
        this.client.telemetry.registerInfoMessage('Connection closed!');
        this.explorer.disconnect(conn as ConnectionInterface);
        this._updateStatusBar();
      }, (e) => this.errorHandler('Error closing connection', e));
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

  static parseSqlParams(sql: string): string[] {
    let result: string[] = [];
    let matches = sql.match(/(?::|@)([a-zA-Z][a-zA-Z0-9_]*)/g);
    if (matches) {
        matches.forEach((k, i) => {
            let par = k.substr(1).toUpperCase().trim();
            if (par != "MI" && par != "SS" && result.indexOf(par) === -1) {
                result.push(par);
            }
        });
    }
    return result;
  }

  static parseSqlValues(sql: string): DatabaseInterface.Parameters {
    let result: DatabaseInterface.Parameters = {};
    let matches = sql.match(/(?:%)([a-zA-Z][a-zA-Z0-9_]*=.*)/g);
    if (matches) {
      matches.forEach((k) => {
        let val1 = k.substr(1).toUpperCase().trim();
        let spl = val1.split('=');
        result[spl[0]] = ConnectionManagerPlugin.parseValue(spl[1]);
      });
    }
    return result;
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
      this.errorHandler('Error selecting connection', error);
    }
  }

  private ext_executeQuery = async (query?: string, connNameOrId?: string, queryLine: number = 0) => {
    try {
      query = typeof query === 'string' ? query : await getSelectedText('execute query');
      if (!connNameOrId) {
        connNameOrId = extractConnName(query);
      }
      if (connNameOrId && connNameOrId.trim()) {
        connNameOrId = connNameOrId.trim();
        const conn = this.getConnectionList().find(c => getConnectionId(c) === connNameOrId || c.name === connNameOrId);
        if (!conn) {
          throw new Error(`Trying to run query on '${connNameOrId}' but it does not exist.`)
        }
        await this._setConnection(conn);
      }
      await this._connect();
      this._openResultsWebview();
      let parseParams = ConnectionManagerPlugin.parseSqlParams(query);
      let params: DatabaseInterface.Parameters = {};
      if (parseParams.length > 0) {
        let paramValues = ConnectionManagerPlugin.parseSqlValues(query);
        let missingParams: { param: string, val: any }[] = [];
        for (let param of parseParams){
          if (paramValues.hasOwnProperty(param)) {
            params[param] = { type: paramValues[param].type, value: paramValues[param].value || null, orig: null } ;
            this.context.globalState.update(`SQLTools.Param.${param}`, paramValues[param].orig);
          } else {
            let val1 = this.context.globalState.get<string>(`SQLTools.Param.${param}`);
            params[param] = ConnectionManagerPlugin.parseValue(val1 || 'null');
            missingParams.push({param, val: params[param].value});
          }
        }
        if (missingParams.length > 0) {
          let editor = await getOrCreateEditor();
          let paramsText = missingParams.map(p => `--%${p.param}=${p.val}`).join("\n");
          editor.edit(e => e.insert(new Position(queryLine, 0), paramsText + "\n"));
        }
      }
      
      const payload = await this._runConnectionCommandWithArgs('query', query, params);
      this.resultsWebview.get(payload[0].connId || this.explorer.getActive().id).updateResults(payload);
      return payload;
    } catch (e) {
      this.errorHandler('Error fetching records.', e);
    }
  }
  
  private ext_executeCurrentQuery = async () => {
    
    let activeEditor = await getOrCreateEditor();
    if (!activeEditor) {
        return;
    }
    
    if (!activeEditor.selection.isEmpty) {
      return this.ext_executeQuery();
    }
    let text = activeEditor.document.getText(); 
    let line = activeEditor.selection.active.line;
    let eol = activeEditor.document.eol === 2 ? "\r\n" : "\n";
    let tests = text.split(eol);
    let startLine = 0;
    for (let i = line; i >= 0; i--) {
      let curLine = tests[i] || "";
      if (curLine.trim() == "") {
        startLine = i + 1;
        break;
      }
    }
    let endLine = tests.length;
    for (let i = line; i < tests.length; i++) {
      let curLine = tests[i] || "";
      if (curLine.trim() == "") {
        endLine = i;
        break;
      } 
    }
    let query = "";
    for (let q = startLine; q < endLine; q++) {
      query = query + tests[q] + eol;
    }
    return this.ext_executeQuery(query, undefined, startLine);
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

  private static parseValue(paramValue: string) {
    let theType = DatabaseInterface.ParameterKind.Number;
    let val: any = null;
    const stringVal = paramValue.toString();
    if (stringVal.startsWith('\'') || stringVal.startsWith('\"') || stringVal == "null"  || stringVal == "") {
      theType = DatabaseInterface.ParameterKind.String;
      val = stringVal.replace(/\'/g, "").replace(/\"/g, "");
    } else if (stringVal.indexOf("/") > 0 || stringVal.indexOf(":") > 0 || stringVal.indexOf("-") > 0  ) {
      theType = DatabaseInterface.ParameterKind.Date;
      val = stringVal;
    } else {
      theType = DatabaseInterface.ParameterKind.Number;
      val = parseFloat(stringVal);
    }
    return { type: theType, value: val, orig: paramValue };
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
    this.resultsWebview.get(connId || this.explorer.getActive().id).show();
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
          description: `${table.numberOfColumns} cols`,
          detail: prefixes.length > 1 ? `in ${prefixes.slice(0, prefixes.length - 1).join('.')}` : undefined,
        };
      }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,
        title: `Tables in ${conn.database}`,
      });
  }

  private async _pickConnection(connectedOnly = false): Promise<ConnectionInterface> {
    const connections: ConnectionInterface[] = await this.client.sendRequest(GetConnectionsRequest, { connectedOnly });

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
    this.explorer.setActiveConnection(c);
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
    if (doc && doc.uri && doc.isClosed) {
      this.updateAttachedConnectionsMap(doc.uri);
    }
    // return this.ext_refreshAll();
  }

  public register(extension: SQLTools.ExtensionInterface) {
    if (this.client) return; // do not register twice
    this.client = extension.client;
    this.context = extension.context;
    this.errorHandler = extension.errorHandler;
    this.explorer = new ConnectionExplorer(extension);

    this.client.onRequest(ConnectionDataUpdatedRequest, this.handler_connectionDataUpdated);

    // extension stuff
    this.context.subscriptions.push(
      (this.resultsWebview = new ResultsWebviewManager(this.context, this.client)),
      (this.settingsWebview = new SettingsWebview(this.context)),
      this._updateStatusBar(),
      workspace.onDidCloseTextDocument(this.onDidOpenOrCloseTextDocument),
      workspace.onDidOpenTextDocument(this.onDidOpenOrCloseTextDocument),
      this.explorer.onConnectionDidChange(() => this.ext_refreshAll()),
      window.onDidChangeActiveTextEditor(this.changeTextEditorHandler),
    );

    // register extension commands
    extension.registerCommand(`addConnection`, this.ext_addConnection)
      .registerCommand(`updateConnection`, this.ext_updateConnection)
      .registerCommand(`openAddConnectionScreen`, this.ext_openAddConnectionScreen)
      .registerCommand(`openEditConnectionScreen`, this.ext_openEditConnectionScreen)
      .registerCommand(`closeConnection`, this.ext_closeConnection)
      .registerCommand(`deleteConnection`, this.ext_deleteConnection)
      .registerCommand(`describeCurrent`, this.ext_describeCurrent)
      .registerCommand(`describeFunction`, this.ext_describeFunction)
      .registerCommand(`describeTable`, this.ext_describeTable)
      .registerCommand(`executeFromInput`, this.ext_executeFromInput)
      .registerCommand(`executeQuery`, this.ext_executeQuery)
      .registerCommand(`executeCurrentQuery`, this.ext_executeCurrentQuery)
      .registerCommand(`executeQueryFromFile`, this.ext_executeQueryFromFile)
      .registerCommand(`refreshAll`, this.ext_refreshAll)
      .registerCommand(`saveResults`, this.ext_saveResults)
      .registerCommand(`selectConnection`, this.ext_selectConnection)
      .registerCommand(`showOutputChannel`, this.ext_showOutputChannel)
      .registerCommand(`showRecords`, this.ext_showRecords)
      .registerCommand(`focusOnExplorer`, this.ext_focusOnExplorer)
      .registerCommand(`attachFileToConnection`, this.ext_attachFileToConnection)
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