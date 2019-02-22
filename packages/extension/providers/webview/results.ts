import WebviewProvider from './webview-provider';
import { SQLToolsLanguageClient } from '@sqltools/extension/language-client';
import { ExportResults } from '@sqltools/core/contracts/connection-requests';
import QueryResultsState from '@sqltools/ui/screens/Results/State';
import vscode from 'vscode';

export default class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = 'SQLTools Results';

  constructor(private client: SQLToolsLanguageClient) {
    super();
  }

  public async exportResults(type: 'csv' | 'json' = 'csv') {
    const { connId, activeTab } = await this.getState();
    let filters = undefined;

    if (type === 'csv') {
      filters = {
        'CSV Files': ['csv', 'txt']
      };
    } else if (type === 'json') {
      filters = {
        'CSV Files': ['json']
      };
    }
    const file = await vscode.window.showSaveDialog({
      filters,
      saveLabel: 'Export'
    });
    if (!file) return;
    const filename = file.toString();
    return this.client.sendRequest(ExportResults, { connId, query: activeTab, filename });
  }
}
