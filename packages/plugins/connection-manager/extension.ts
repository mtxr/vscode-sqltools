import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface, DatabaseDialect } from '@sqltools/core/interface';
import SQLTools, { RequestHandler } from '@sqltools/core/plugin-api';
import { getConnectionDescription, getConnectionId, isEmpty } from '@sqltools/core/utils';
import { getSelectedText, quickPick, readInput } from '@sqltools/core/utils/vscode';
import { SidebarConnection, SidebarTableOrView, ConnectionExplorer } from '@sqltools/plugins/connection-manager/explorer';
import ResultsWebview from '@sqltools/plugins/connection-manager/screens/results';
import SettingsWebview from '@sqltools/plugins/connection-manager/screens/settings';
import { commands, QuickPickItem, ExtensionContext, StatusBarAlignment, StatusBarItem, window, workspace, ConfigurationTarget } from 'vscode';
import { ConnectionDataUpdatedRequest, ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RefreshAllRequest, RunCommandRequest } from './contracts';

export default class ConnectionManagerPlugin implements SQLTools.ExtensionPlugin {
  public client: SQLTools.LanguageClientInterface;
  public resultsWebview: ResultsWebview;
  public settingsWebview: SettingsWebview;
  public statusBar: StatusBarItem;;
  private context: ExtensionContext;
  private errorHandler: SQLTools.ExtensionInterface['errorHandler'];
  private explorer: ConnectionExplorer;

  public handler_connectionDataUpdated: RequestHandler<typeof ConnectionDataUpdatedRequest> = (data) => this.explorer.setTreeData(data);

  // extension commands
  private ext_refreshAll = () => {
    return this.client.sendRequest(RefreshAllRequest);
  }

  private ext_executeFromInput = async () => {
    try {
      const query = await readInput('Query', `Type the query to run on ${this.explorer.getActive().name}`);
      return this.ext_executeQuery(query);
    } catch (e) {
      this.errorHandler('Error running query.', e, this.ext_showOutputChannel);
    }
  }

  private ext_showRecords = async (node?: SidebarTableOrView) => {
    try {
      const table = await this._getTableName(node);
      this._openResultsWebview();
      let limit = 50;
      if (ConfigManager.results && ConfigManager.results.limit) {
        limit = ConfigManager.results.limit;
      } else if ((<any>ConfigManager).previewLimit) { // @TODO: this is deprecated! Will be removed.
        limit = (<any>ConfigManager).previewLimit;
      }
      const payload = await this._runConnectionCommandWithArgs('showRecords', table, limit);
      this.resultsWebview.updateResults(payload);

    } catch (e) {
      this.errorHandler('Error while showing table records', e, this.ext_showOutputChannel);
    }
  }

  private ext_describeTable = async (node?: SidebarTableOrView) => {
    try {
      const table = await this._getTableName(node);
      this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('describeTable', table);
      this.resultsWebview.updateResults(payload);
    } catch (e) {
      this.errorHandler('Error while describing table records', e, this.ext_showOutputChannel);
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

  private ext_selectConnection = async (connIdOrNode?: SidebarConnection | string) => {
    if (connIdOrNode) {
      const conn = connIdOrNode instanceof SidebarConnection ? connIdOrNode.conn : this.explorer.getById(connIdOrNode);

      return this._setConnection(conn as ConnectionInterface).catch(e => this.errorHandler('Error opening connection', e));
    }
    this._connect(true).catch(e => this.errorHandler('Error selecting connection', e));
  }

  private ext_executeQuery = async (query?: string) => {
    try {
      query = query || await getSelectedText('execute query');
      await this._connect();
      this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('query', query);
      this.resultsWebview.updateResults(payload);
      return payload;
    } catch (e) {
      this.errorHandler('Error fetching records.', e, this.ext_showOutputChannel);
    }
  }

  private ext_executeQueryFromFile = async () => {
    // @TODO: add option read from file and run
    return this.ext_executeQuery(await getSelectedText('execute file', true));
  }

  private ext_showOutputChannel = () => (<any>console).show();

  private ext_saveResults = async (filetype: 'csv' | 'json') => {
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

    return this.resultsWebview.saveResults(mode);
  }

  private ext_openAddConnectionScreen = () => {
    return this.settingsWebview.show();
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
      console.warn('Nothing to do. No parameter received');
      return;
    }

    const connList = this.getConnectionList(ConfigurationTarget[writeTo] || undefined);
    connList.push(connInfo);
    return this.saveConnectionList(connList, ConfigurationTarget[writeTo]);
  }

  // internal utils
  private async _getTableName(node?: SidebarTableOrView): Promise<string> {
    if (node && node.value) {
      await this._setConnection(node.conn as ConnectionInterface);
      switch(node.conn.dialect) {
        case DatabaseDialect.PostgreSQL:
          return [node.table.tableDatabase, node.table.tableSchema, node.table.name].join('.');
        case DatabaseDialect.MySQL:
          return [node.table.tableSchema, node.table.name].join('.');
        case DatabaseDialect.OracleDB:
          return [node.table.tableSchema, node.table.name].join('.');
      }
      return node.value;
    }

    const conn = await this._connect();

    return this._pickTable(conn, 'label');
  }

  private _openResultsWebview() {
    this.resultsWebview.show();
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
        return { label: table.name } as QuickPickItem;
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
        detail: getConnectionDescription(c),
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
    if (!from) return workspace.getConfiguration(EXT_NAME.toLowerCase()).get('connections');

    const config = workspace.getConfiguration(EXT_NAME.toLowerCase()).inspect('connections');
    if (from === ConfigurationTarget.Global) {
      return <ConnectionInterface[]>(config.globalValue || config.defaultValue);
    }
    if (from === ConfigurationTarget.WorkspaceFolder) {
      return <ConnectionInterface[]>(config.workspaceFolderValue || config.defaultValue);
    }

    return <ConnectionInterface[]>(config.workspaceValue || config.defaultValue);
  }

  public register(extension: SQLTools.ExtensionInterface) {
    if (this.client) return; // do not register twice
    this.client = extension.client;
    this.context = extension.context;
    this.errorHandler = extension.errorHandler;
    this.explorer = new ConnectionExplorer(this.context);

    this.client.onRequest(ConnectionDataUpdatedRequest, this.handler_connectionDataUpdated);

    // extension stuff
    this.context.subscriptions.push(
      (this.resultsWebview = new ResultsWebview(this.context, this.client)),
      (this.settingsWebview = new SettingsWebview(this.context)),
      this._updateStatusBar(),
      workspace.onDidCloseTextDocument(this.ext_refreshAll),
      workspace.onDidOpenTextDocument(this.ext_refreshAll),
      this.explorer.onConnectionDidChange(() => this.ext_refreshAll()),
    );

    // register extension commands
    extension.registerCommand(`addConnection`, this.ext_addConnection)
      .registerCommand(`openAddConnectionScreen`, this.ext_openAddConnectionScreen)
      .registerCommand(`closeConnection`, this.ext_closeConnection)
      .registerCommand(`deleteConnection`, this.ext_deleteConnection)
      .registerCommand(`describeFunction`, this.ext_describeFunction)
      .registerCommand(`describeTable`, this.ext_describeTable)
      .registerCommand(`executeFromInput`, this.ext_executeFromInput)
      .registerCommand(`executeQuery`, this.ext_executeQuery)
      .registerCommand(`executeQueryFromFile`, this.ext_executeQueryFromFile)
      .registerCommand(`refreshAll`, this.ext_refreshAll)
      .registerCommand(`saveResults`, this.ext_saveResults)
      .registerCommand(`selectConnection`, this.ext_selectConnection)
      .registerCommand(`showOutputChannel`, this.ext_showOutputChannel)
      .registerCommand(`showRecords`, this.ext_showRecords)
      .registerCommand(`focusOnExplorer`, this.ext_focusOnExplorer);

    // hooks
    ConfigManager.addOnUpdateHook(() => {
      this._updateStatusBar();
    });
  }
}