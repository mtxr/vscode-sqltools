import { SQLToolsLanguageClientInterface } from '@sqltools/core/interface/plugin';
import { SaveResultsRequest } from '@sqltools/plugins/connection-manager/contracts';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import QueryResultsState from '@sqltools/ui/screens/Results/State';
import vscode from 'vscode';
import { DatabaseInterface } from '@sqltools/core/interface';

export default class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = 'SQLTools Results';

  constructor(context: vscode.ExtensionContext, private client: SQLToolsLanguageClientInterface) {
    super(context);
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

  updateResults(payload: DatabaseInterface.QueryResults[]) {
    this.postMessage({ action: 'queryResults', payload });
  }
}
