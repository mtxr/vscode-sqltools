import * as vscode from 'vscode';
import { IConnection, IExtension, IExtensionPlugin, IDriverExtensionApi } from '@sqltools/types';
import { ExtensionContext } from 'vscode';
import { DRIVER_ALIASES, DRIVER_ID, DRIVER_NAME } from './constants';
import { selectedTextOrCurrentLine } from './q-text';
import KdbDriver from './ls/driver';
import { emptyColumnarPanelResult } from './kdb-results';
import { QValue, qValueToColumnarPanel } from './ls/q-ipc';
import { KdbPanelResult, KdbResultsPanel } from './results-panel';
import { configurePerfTrace, endPerfSpan, perfSpan } from './perf';
const { publisher, name, displayName } = require('../package.json');

const SQLTOOLS_EXECUTE_QUERY = 'sqltools.executeQuery';
const RESULTS_TARGET_SETTING = 'results.target';
const PERFORMANCE_TRACE_SETTING = 'performance.trace';
const LAST_PANEL_CONNECTION_KEY = 'kdb-sqltools.lastPanelConnectionId';
const OPEN_USER_SETTINGS_JSON_ACTION = 'Open User Settings JSON';
const OPEN_SQLTOOLS_SETTINGS_ACTION = 'Open SQLTools Settings';

type ResultsTarget = 'sqltools' | 'kdbPanel';

interface KdbConnectionPick extends vscode.QuickPickItem {
  connection: IConnection<any>;
}

export async function activate(extContext: ExtensionContext): Promise<IDriverExtensionApi> {
  const sqltools = vscode.extensions.getExtension<IExtension>('mtxr.sqltools');
  if (!sqltools) {
    throw new Error('SQLTools not installed');
  }
  await sqltools.activate();

  const api = sqltools.exports;
  updatePerfTraceSetting();

  extContext.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('kdb-sqltools.performance.trace')) {
        updatePerfTraceSetting();
      }
    }),
    vscode.commands.registerCommand('kdb-sqltools.runFile', () => runQFile(extContext)),
    vscode.commands.registerCommand('kdb-sqltools.runSelectionOrBlock', () => runQSelectionOrLine(extContext)),
    vscode.commands.registerCommand('kdb-sqltools.runFileInSqltools', () => runQFile(extContext, 'sqltools')),
    vscode.commands.registerCommand('kdb-sqltools.runSelectionOrBlockInSqltools', () => runQSelectionOrLine(extContext, 'sqltools')),
    vscode.commands.registerCommand('kdb-sqltools.runFileInKdbPanel', () => runQFile(extContext, 'kdbPanel')),
    vscode.commands.registerCommand('kdb-sqltools.runSelectionOrBlockInKdbPanel', () => runQSelectionOrLine(extContext, 'kdbPanel')),
    vscode.commands.registerCommand('kdb-sqltools.copyExampleConnectionSettings', copyExampleConnectionSettings),
    vscode.languages.registerCodeLensProvider([{ language: 'q' }, { pattern: '**/*.q' }], new QRunCodeLensProvider())
  );

  const extensionId = `${publisher}.${name}`;
  const plugin: IExtensionPlugin = {
    extensionId,
    name: `${displayName} Plugin`,
    type: 'driver',
    async register(extension) {
      // register ext part here
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[0].value}/icons`, {
        active: extContext.asAbsolutePath('icons/active.png'),
        default: extContext.asAbsolutePath('icons/default.png'),
        inactive: extContext.asAbsolutePath('icons/inactive.png'),
      });
      DRIVER_ALIASES.forEach(({ value }) => {
        extension.resourcesMap().set(`driver/${value}/extension-id`, extensionId);
        extension
          .resourcesMap()
          .set(`driver/${value}/connection-schema`, extContext.asAbsolutePath('connection.schema.json'));
        extension.resourcesMap().set(`driver/${value}/ui-schema`, extContext.asAbsolutePath('ui.schema.json'));
      });
      await extension.client.sendRequest('ls/RegisterPlugin', { path: extContext.asAbsolutePath('out/ls/plugin.js') });
    },
  };
  api.registerPlugin(plugin);
  return {
    driverName: DRIVER_NAME || displayName,
    parseBeforeSaveConnection: ({ connInfo }) => connInfo,
    parseBeforeEditConnection: ({ connInfo }) => connInfo,
    driverAliases: DRIVER_ALIASES,
  };
}

export function deactivate() {}

async function runQFile(extContext: ExtensionContext, target?: ResultsTarget): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Open a q file before running q code.');
    return;
  }

  await executeQText(extContext, editor.document.getText(), target);
}

async function runQSelectionOrLine(extContext: ExtensionContext, target?: ResultsTarget): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('Open a q file before running q code.');
    return;
  }

  const selectionText = editor.selection.isEmpty ? '' : editor.document.getText(editor.selection);
  const text = selectedTextOrCurrentLine(editor.document.getText(), selectionText, editor.selection.active.line);
  await executeQText(extContext, text, target);
}

async function executeQText(extContext: ExtensionContext, text: string, target?: ResultsTarget): Promise<void> {
  if (!text || text.trim().length === 0) {
    vscode.window.showWarningMessage('No q code selected to run.');
    return;
  }

  if ((target || configuredResultsTarget()) === 'sqltools') {
    await vscode.commands.executeCommand(SQLTOOLS_EXECUTE_QUERY, text);
    return;
  }

  await executeQTextInKdbPanel(extContext, text);
}

function configuredResultsTarget(): ResultsTarget {
  const target = vscode.workspace.getConfiguration('kdb-sqltools').get<string>(RESULTS_TARGET_SETTING, 'kdbPanel');
  return target === 'sqltools' ? 'sqltools' : 'kdbPanel';
}

function updatePerfTraceSetting(): void {
  const enabled = vscode.workspace.getConfiguration('kdb-sqltools').get<boolean>(PERFORMANCE_TRACE_SETTING, false);
  configurePerfTrace(enabled);
}

async function copyExampleConnectionSettings(): Promise<void> {
  await vscode.env.clipboard.writeText(exampleGlobalConnectionSettings());
  const action = await vscode.window.showInformationMessage(
    'Copied a kdb SQLTools User-settings example. Paste it into User settings JSON to keep the connection across workspaces.',
    OPEN_USER_SETTINGS_JSON_ACTION,
    OPEN_SQLTOOLS_SETTINGS_ACTION
  );

  if (action === OPEN_USER_SETTINGS_JSON_ACTION) {
    await vscode.commands.executeCommand('workbench.action.openSettingsJson');
  } else if (action === OPEN_SQLTOOLS_SETTINGS_ACTION) {
    await vscode.commands.executeCommand('sqltools.openSettings');
  }
}

function exampleGlobalConnectionSettings(): string {
  return JSON.stringify({
    'sqltools.connections': [
      {
        name: 'local kdb',
        driver: DRIVER_ID,
        server: 'localhost',
        port: 5000,
        username: '',
        password: '',
        database: '.',
        connectionTimeout: 30,
      },
    ],
  }, null, 2);
}

async function executeQTextInKdbPanel(extContext: ExtensionContext, text: string): Promise<void> {
  const connection = await pickKdbConnection(extContext);
  if (!connection) {
    return;
  }

  KdbResultsPanel.showLoading(extContext, { query: text, connectionName: connection.name });

  const driver = new KdbDriver(connection, async () => []);
  const started = Date.now();
  try {
    const ipcQuerySpan = perfSpan('extension.kdbPanel.ipc.query', {
      connectionName: connection.name,
      queryChars: text.length,
    });
    let value: QValue | undefined;
    try {
      value = await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `Running q on ${connection.name}`,
          cancellable: false,
        },
        async () => {
          const client = await driver.open();
          return client.query(text);
        }
      );
    } finally {
      endPerfSpan(ipcQuerySpan, {
        error: value === undefined,
      });
    }
    const panelResultSpan = perfSpan('extension.kdbPanel.toColumnarResult', {
      connectionName: connection.name,
      queryChars: text.length,
    });
    let panelResult: KdbPanelResult | undefined;
    try {
      const columnar = qValueToColumnarPanel(value);
      panelResult = {
        table: columnar.result,
        query: text,
        connectionName: connection.name,
        elapsedMs: Date.now() - started,
        messages: [
          `q returned ${columnar.kind} with ${columnar.result.rowCount} row${columnar.result.rowCount === 1 ? '' : 's'} in ${Date.now() - started} ms.`,
        ],
      };
      endPerfSpan(panelResultSpan, {
        rows: columnar.result.rowCount,
        columns: columnar.result.columns.length,
        kind: columnar.kind,
        rowMaterialized: columnar.rowsMaterialized,
        error: false,
      });
    } finally {
      if (!panelResult) {
        endPerfSpan(panelResultSpan, { error: true });
      }
    }
    KdbResultsPanel.showResult(extContext, panelResult);
  } catch (error) {
    const err = toError(error);
    KdbResultsPanel.showResult(extContext, {
      table: emptyColumnarPanelResult(),
      query: text,
      connectionName: connection.name,
      elapsedMs: Date.now() - started,
      messages: [err.message],
      error: true,
    });
    vscode.window.showErrorMessage(err.message);
  } finally {
    await driver.close();
  }
}

async function pickKdbConnection(extContext: ExtensionContext): Promise<IConnection<any> | undefined> {
  const connections = vscode.workspace.getConfiguration('sqltools').get<Array<Partial<IConnection<any>>>>('connections', []);
  const kdbConnections = connections
    .filter(isKdbConnection)
    .map(normalizeConnection);

  if (kdbConnections.length === 0) {
    const action = await vscode.window.showWarningMessage(
      'No SQLTools kdb connections are configured.',
      'Open SQLTools Connection Settings'
    );
    if (action) {
      await vscode.commands.executeCommand('sqltools.openAddConnectionScreen');
    }
    return undefined;
  }

  let connection = kdbConnections[0];
  if (kdbConnections.length > 1) {
    const lastId = extContext.globalState.get<string>(LAST_PANEL_CONNECTION_KEY);
    const picks = kdbConnections.map(conn => connectionPick(conn, conn.id === lastId));
    const picked = await vscode.window.showQuickPick(picks, {
      placeHolder: 'Select a kdb connection for the kdb results panel',
      ignoreFocusOut: true,
    });
    if (!picked) {
      return undefined;
    }
    connection = picked.connection;
  }

  await extContext.globalState.update(LAST_PANEL_CONNECTION_KEY, connection.id);
  return resolvePassword(connection);
}

function connectionPick(connection: IConnection<any>, lastUsed: boolean): KdbConnectionPick {
  return {
    label: connection.name,
    description: [connection.server || 'localhost', connection.port ? String(connection.port) : null, lastUsed ? 'last used' : null]
      .filter(Boolean)
      .join(':'),
    detail: connection.database ? `Namespace ${connection.database}` : undefined,
    connection,
  };
}

async function resolvePassword(connection: IConnection<any>): Promise<IConnection<any> | undefined> {
  if (!connection.askForPassword || connection.password) {
    return connection;
  }

  const password = await vscode.window.showInputBox({
    prompt: `Password for ${connection.name}`,
    password: true,
    ignoreFocusOut: true,
  });
  if (password === undefined) {
    return undefined;
  }

  return { ...connection, password };
}

function isKdbConnection(connection: Partial<IConnection<any>>): boolean {
  return DRIVER_ALIASES.some(alias => connection.driver === alias.value) || connection.driver === DRIVER_NAME;
}

function normalizeConnection(connection: Partial<IConnection<any>>): IConnection<any> {
  return {
    ...connection,
    id: connection.id || connectionId(connection),
    name: connection.name || 'kdb',
    driver: DRIVER_ID,
    username: connection.username || '',
  } as IConnection<any>;
}

function connectionId(connection: Partial<IConnection<any>>): string {
  const connectString = (connection as any).connectString;
  const parts = [connection.name || 'kdb', connection.driver || DRIVER_ID];
  if (connectString) {
    parts.push(String(connectString));
  } else {
    parts.push(String(connection.server || 'localhost'), String(connection.database || '.'));
  }
  return parts.join('|').replace(/\./g, ':').replace(/\//g, '\\');
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}

class QRunCodeLensProvider implements vscode.CodeLensProvider {
  public provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    const top = new vscode.Range(0, 0, 0, 0);
    const lenses = [
      new vscode.CodeLens(top, {
        title: '$(play) Run q Script',
        command: 'kdb-sqltools.runFile',
      }),
    ];

    if (document.lineCount > 1) {
      lenses.push(new vscode.CodeLens(top, {
        title: '$(run) Run Selection',
        command: 'kdb-sqltools.runSelectionOrBlock',
      }));
    }

    return lenses;
  }
}
