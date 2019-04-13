import SQLTools, { DatabaseInterface } from '@sqltools/core/plugin-api';
import { SaveResultsRequest } from '@sqltools/plugins/connection-manager/contracts';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import QueryResultsState from '@sqltools/ui/screens/Results/State';
import vscode from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';

export default class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = 'SQLTools Results';

  constructor(context: vscode.ExtensionContext, private client: SQLTools.LanguageClientInterface) {
    super(context);
  }

  public get cssVariables() {
    if (!ConfigManager.results.customization) {
      return super.cssVariables;
    }
    return <any>ConfigManager.results.customization;
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

  show() {
    this.wereToShow = vscode.ViewColumn.Active;
    this.preserveFocus = false;

    if (vscode.window.activeTextEditor) {
      this.wereToShow = vscode.window.activeTextEditor.viewColumn;
    }
        if (ConfigManager.results) {
      if (ConfigManager.results.location === 'beside') {
        this.wereToShow = vscode.ViewColumn.Beside;
        this.preserveFocus = true;
      }
    }

    return super.show();
  }
  updateResults(payload: DatabaseInterface.QueryResults[]) {
    this.postMessage({ action: 'queryResults', payload });
  }

  wereToShow = vscode.ViewColumn.Active;
  preserveFocus = false;
}
