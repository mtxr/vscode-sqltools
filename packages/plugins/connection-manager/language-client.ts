import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface } from '@sqltools/core/interface';
import { LanguageClientPlugin, RequestHandler as RHandler, SQLToolsLanguageClientInterface } from '@sqltools/core/interface/plugin';
import { getDbDescription, getDbId } from '@sqltools/core/utils';
import ErrorHandler from '@sqltools/extension/api/error-handler';
import Utils from '@sqltools/extension/api/utils';
import { getSelectedText, quickPick, readInput } from '@sqltools/extension/api/vscode-utils';
import ContextManager from '@sqltools/extension/context';
import ConnectionExplorer, { SidebarConnection, SidebarTable, SidebarView } from '@sqltools/extension/providers/connection-explorer';
import ResultsWebview from '@sqltools/extension/providers/webview/results';
import SettingsWebview from '@sqltools/extension/providers/webview/settings';
import { commands, QuickPickItem, StatusBarAlignment, StatusBarItem, window, workspace } from 'vscode';
import { ConnectionDataUpdatedRequest, ConnectRequest, DisconnectRequest, GetConnectionDataRequest, GetConnectionPasswordRequest, GetConnectionsRequest, RefreshAllRequest, RunCommandRequest } from './contracts';

export default class ConnectionManagerPlugin implements LanguageClientPlugin {
  public client: SQLToolsLanguageClientInterface;
  public resultsWebview: ResultsWebview;
  private settingsWebview: SettingsWebview;
  private statusBar: StatusBarItem;;

  public handler_connectionDataUpdated: RHandler<typeof ConnectionDataUpdatedRequest> = ({ conn, tables, columns }) => {
    ConnectionExplorer.setTreeData(conn, tables, columns);
    if (conn && getDbId(ConnectionExplorer.getActive()) === getDbId(conn) && !conn.isConnected) {
      ConnectionExplorer.setActiveConnection();
    } else {
      ConnectionExplorer.setActiveConnection(ConnectionExplorer.getActive());
    }
  }

  // extension commands
  public ext_refreshAll = () => {
    return this.client.sendRequest(RefreshAllRequest);
  }

  public ext_runFromInput = async () => {
    try {
      const query = await readInput('Query', `Type the query to run on ${ConnectionExplorer.getActive().name}`);
      this._openResultsWebview();
      await this._connect();
      await this._runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error running query.', this.ext_showOutputChannel)(e);
    }
  }

  public ext_showRecords = async (node?: SidebarTable | SidebarView) => {
    try {
      const table = await this._getTableName(node);
      this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('showRecords', table, ConfigManager.previewLimit);
      this.resultsWebview.updateResults(payload);

    } catch (e) {
      ErrorHandler.create('Error while showing table records', this.ext_showOutputChannel)(e);
    }
  }

  public ext_describeTable = async (node?: SidebarTable | SidebarView) => {
    try {
      const table = await this._getTableName(node);
      this._openResultsWebview();
      const payload = await this._runConnectionCommandWithArgs('describeTable', table);
      this.resultsWebview.updateResults(payload);
    } catch (e) {
      ErrorHandler.create('Error while describing table records', this.ext_showOutputChannel)(e);
    }
  }

  public ext_describeFunction() {
    window.showInformationMessage('Not implemented yet.');
  }

  public ext_closeConnection = async (node?: SidebarConnection) => {
    const conn = node ? node.conn : await this._pickConnection(true);
    if (!conn) {
      return;
    }

    return this.client.sendRequest(DisconnectRequest, { conn })
      .then(async () => {
        this.client.logger.registerInfoMessage('Connection closed!');
        ConnectionExplorer.disconnect(conn as ConnectionInterface);
        this._updateStatusBar();
      }, ErrorHandler.create('Error closing connection'));
  }

  public ext_selectConnection = async (connIdOrNode?: SidebarConnection | string) => {
    if (connIdOrNode) {
      const conn = connIdOrNode instanceof SidebarConnection ? connIdOrNode.conn : ConnectionExplorer.getById(connIdOrNode);

      await this._setConnection(conn as ConnectionInterface, true).catch(ErrorHandler.create('Error opening connection'));
      return;
    }
    this._connect(true).catch(ErrorHandler.create('Error selecting connection'));
  }

  public ext_executeQuery = async (action = 'execute query', fullText = false) => {
    try {
      const query: string = await getSelectedText(action, fullText);
      this._openResultsWebview();
      await this._connect();
      await this._runQuery(query);
    } catch (e) {
      ErrorHandler.create('Error fetching records.', this.ext_showOutputChannel)(e);
    }
  }

  public ext_executeQueryFromFile = async () => {
    return this.ext_executeQuery('execute file', true);
  }

  public ext_showOutputChannel = () => {
    ContextManager.logWriter.show();
  }

  public ext_saveResults = async (filetype: 'csv' | 'json') => {
    filetype = typeof filetype === 'string' ? filetype : undefined;
    let mode: any = filetype || ConfigManager.defaultExportType;
    if (mode === 'prompt') {
      mode = await quickPick<'csv' | 'json' | undefined>([
        { label: 'Save as CSV', value: 'csv' },
        { label: 'Save as JSON', value: 'json' },
      ], 'value', {
        title: 'Select a file type to export',
      });
    }

    if (!mode) return;

    return this.resultsWebview.saveResults(mode);
  }

  private ext_addNewConnection = () => {
    return this.settingsWebview.show();
  }

  private ext_deleteConnection = async (connIdOrNode?: string | SidebarConnection) => {
    let id: string;
    if (connIdOrNode) {
      id = connIdOrNode instanceof SidebarConnection ? connIdOrNode.getId() : <string>connIdOrNode;
    } else {
      const conn = await this._pickConnection();
      id = conn ? getDbId(conn) : undefined;
    }

    if (!id) return;

    const conn = ConnectionExplorer.getById(id);

    const res = await window.showInformationMessage(`Are you sure you want to remove ${conn.name}?`, { modal: true }, 'Yes');

    if (!res) return;

    return ConnectionExplorer.deleteConnection(id);
  }

  // internal utils
  public async _getTableName(node?: SidebarTable | SidebarView): Promise<string> {
    if (node && node.value) {
      await this._setConnection(node.conn as ConnectionInterface);
      return node.value;
    }

    const conn = await this._connect(true);

    return await this._pickTable(conn, 'label');
  }

  public _openResultsWebview() {
    this.resultsWebview.show();
  }
  public async _connect(force = false): Promise<ConnectionInterface> {
    if (!force && ConnectionExplorer.getActive()) {
      return ConnectionExplorer.getActive();
    }
    const c: ConnectionInterface = await this._pickConnection(true);
    // history.clear();
    return this._setConnection(c);
  }

  public async _pickTable(conn: ConnectionInterface, prop?: string): Promise<string> {
    const { tables } = await this.client.sendRequest(GetConnectionDataRequest, { conn });
    return await quickPick(tables
      .map((table) => {
        return { label: table.name } as QuickPickItem;
      }), prop, {
        matchOnDescription: true,
        matchOnDetail: true,

        title: `Tables in ${conn.database}`,
      });
  }

  public async _pickConnection(connectedOnly = false): Promise<ConnectionInterface> {
    const connections: ConnectionInterface[] = await this.client.sendRequest(GetConnectionsRequest, { connectedOnly });

    if (connections.length === 0 && connectedOnly) return this._pickConnection();

    if (connections.length === 1) return connections[0];

    const sel = (await quickPick(connections.map((c) => {
      return <QuickPickItem>{
        description: c.isConnected ? 'Currently connected' : '',
        detail: getDbDescription(c),
        label: c.name,
        value: getDbId(c)
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
            dark: ContextManager.context.asAbsolutePath('icons/add-connection-dark.svg'),
            light: ContextManager.context.asAbsolutePath('icons/add-connection-light.svg'),
          },
          tooltip: 'Add new Connection',
          cb: () => commands.executeCommand(`${EXT_NAME}.addNewConnection`),
        } as any,
      ],
    })) as string;
    return connections.find((c) => getDbId(c) === sel);
  }

  public async _runQuery(query: string, addHistory = true) {
    const payload = await this._runConnectionCommandWithArgs('query', query);

    // if (addHistory) history.add(query);
    this.resultsWebview.updateResults(payload);
  }

  public _runConnectionCommandWithArgs(command, ...args) {
    return this.client.sendRequest(RunCommandRequest, { conn: ConnectionExplorer.getActive(), command, args });
  }

  public async _askForPassword(c: ConnectionInterface): Promise<string | null> {
    const cachedPass = await this.client.sendRequest(GetConnectionPasswordRequest, { conn: c });
    return cachedPass || await window.showInputBox({

      prompt: `${c.name} password`,
      password: true,
      validateInput: (v) => Utils.isEmpty(v) ? 'Password not provided.' : null,
    });
  }
  public async _setConnection(c?: ConnectionInterface, reveal?: boolean): Promise<ConnectionInterface> {
    let password = null;

    if (c) {
      if (c.askForPassword) password = await this._askForPassword(c);
      if (c.askForPassword && password === null) return;
      c = await this.client.sendRequest(
        ConnectRequest,
        { conn: c, password },
      );
    }
    if (c && c.isConnected)
      ConnectionExplorer.setActiveConnection(c, reveal);
    this._updateStatusBar();
    return ConnectionExplorer.getActive();
  }

  private _updateStatusBar() {
    if (!this.statusBar) {
      this.statusBar = window.createStatusBarItem(StatusBarAlignment.Left, 10);
      this.statusBar.tooltip = 'Select a connection';
      this.statusBar.command = `${EXT_NAME}.selectConnection`;
    }
    if (ConnectionExplorer.getActive()) {
      this.statusBar.text = `$(database) ${ConnectionExplorer.getActive().name}`;
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

  public register(client: SQLToolsLanguageClientInterface) {
    if (this.client) return; // do not register twice
    this.client = client;

    this.client.onRequest(ConnectionDataUpdatedRequest, this.handler_connectionDataUpdated);

    // extension stuff
    ContextManager.context.subscriptions.push(
      (this.resultsWebview = new ResultsWebview(this.client)),
      (this.settingsWebview = new SettingsWebview()),
      this._updateStatusBar(),
      workspace.onDidCloseTextDocument(this.ext_refreshAll),
      workspace.onDidOpenTextDocument(this.ext_refreshAll),
    );

    // register extension commands
    commands.registerCommand(`${EXT_NAME}.addNewConnection`, this.ext_addNewConnection);
    commands.registerCommand(`${EXT_NAME}.closeConnection`, this.ext_closeConnection);
    commands.registerCommand(`${EXT_NAME}.deleteConnection`, this.ext_deleteConnection);
    commands.registerCommand(`${EXT_NAME}.describeFunction`, this.ext_describeFunction);
    commands.registerCommand(`${EXT_NAME}.describeTable`, this.ext_describeTable);
    commands.registerCommand(`${EXT_NAME}.executeQuery`, this.ext_executeQuery);
    commands.registerCommand(`${EXT_NAME}.executeQueryFromFile`, this.ext_executeQueryFromFile);
    commands.registerCommand(`${EXT_NAME}.refreshAll`, this.ext_refreshAll);
    commands.registerCommand(`${EXT_NAME}.runFromInput`, this.ext_runFromInput);
    commands.registerCommand(`${EXT_NAME}.saveResults`, this.ext_saveResults);
    commands.registerCommand(`${EXT_NAME}.selectConnection`, this.ext_selectConnection);
    commands.registerCommand(`${EXT_NAME}.showOutputChannel`, this.ext_showOutputChannel);
    commands.registerCommand(`${EXT_NAME}.showRecords`, this.ext_showRecords);

    // hooks
    ConfigManager.addOnUpdateHook(() => {
      this._updateStatusBar();
      if (ConnectionExplorer.setConnections(ConfigManager.connections)) this.ext_refreshAll();
    });
  }
}