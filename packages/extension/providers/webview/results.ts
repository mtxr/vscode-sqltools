import WebviewProvider from './webview-provider';
import { SQLToolsLanguageClient } from '@sqltools/extension/language-client/client';
import { SaveResultsRequest } from '@sqltools/plugins/connection-manager/contracts';
import QueryResultsState from '@sqltools/ui/screens/Results/State';
import vscode from 'vscode';
import { ConnectionExplorer } from '../connection-explorer';

export default class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = 'SQLTools Results';

  constructor(private client: SQLToolsLanguageClient, private connectionExplorer: ConnectionExplorer) {
    super();
  }

  public async saveResults(filetype: 'csv' | 'json' = 'csv') {
    const { connId, activeTab } = await this.getState();
    let filters = undefined;

    if (filetype === 'csv') {
      filters = {
        'CSV File': ['csv', 'txt']
      };
    } else if (filetype === 'json') {
      filters = {
        'JSON File': ['json']
      };
    }
    const file = await vscode.window.showSaveDialog({
      filters,
      saveLabel: 'Export'
    });
    if (!file) return;
    const filename = file.fsPath;
    await this.client.sendRequest(SaveResultsRequest, { connId, query: activeTab, filename, filetype });
    return vscode.commands.executeCommand('vscode.open', file);
  }

  updateResults(payload) {
    const conn = this.connectionExplorer.getActive();
    const connId = conn ? conn.id : null;

    this.postMessage({ action: 'queryResults', payload, connId });
  }
}
