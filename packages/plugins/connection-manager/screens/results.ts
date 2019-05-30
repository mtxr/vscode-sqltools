import SQLTools, { DatabaseInterface } from '@sqltools/core/plugin-api';
import { SaveResultsRequest } from '@sqltools/plugins/connection-manager/contracts';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import QueryResultsState from '@sqltools/ui/screens/Results/State';
import vscode, { Uri } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { getNameFromId } from '@sqltools/core/utils';
import path from 'path';

class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = 'SQLTools Results';

  constructor(context: vscode.ExtensionContext, private client: SQLTools.LanguageClientInterface, iconsPath: Uri, viewsPath: Uri) {
    super(context, iconsPath, viewsPath);
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
    this.wereToShow = null;
    switch (ConfigManager.results.location) {
      case 'active': // fallback older version
      case 'current':
        this.wereToShow = vscode.ViewColumn.Active;
        break;
      case 'end':
        this.wereToShow = vscode.ViewColumn.Three;
        break;
      case 'beside': // fallback
      default:
        if (!vscode.window.activeTextEditor) {
          this.wereToShow = vscode.ViewColumn.One;
        } else if (ConfigManager.results && typeof ConfigManager.results.location === 'number' && ConfigManager.results.location >= -1 && ConfigManager.results.location <= 9 && ConfigManager.results.location !== 0) {
          this.wereToShow = ConfigManager.results.location;
        } else if (vscode.window.activeTextEditor.viewColumn === vscode.ViewColumn.One) {
            this.wereToShow = vscode.ViewColumn.Two;
        } else {
            this.wereToShow = vscode.ViewColumn.Three;
        }
    }

    return super.show();
  }
  updateResults(payload: DatabaseInterface.QueryResults[]) {
    this.title = 'SQLTools Results';
    try {
      if (payload && payload.length > 0) {
        this.title = `${getNameFromId(payload[0].connId)} Results`;
      }
    } catch (error) {}
    this.updatePanelName();
    this.postMessage({ action: 'queryResults', payload });
  }

  wereToShow = vscode.ViewColumn.Active;
}

export default class ResultsWebviewManager {
  private resultsMap: { [id: string]: ResultsWebview } = {};
  private iconsPath: Uri;
  private viewsPath: Uri;

  constructor(private context: vscode.ExtensionContext, private client: SQLTools.LanguageClientInterface) {
    this.iconsPath = Uri.file(path.join(this.context.extensionPath, 'icons')).with({ scheme: 'vscode-resource' });
    this.viewsPath = Uri.file(path.join(this.context.extensionPath, 'ui')).with({ scheme: 'vscode-resource' });
  }

  dispose() {
    return Promise.all(Object.keys(this.resultsMap).map(id => this.resultsMap[id].dispose()));
  }

  private createForId(connId: string) {
    this.resultsMap[connId] = new ResultsWebview(this.context, this.client, this.iconsPath, this.viewsPath);
    return this.resultsMap[connId];
  }

  get(connId: string) {
    if (!connId) throw new Error('Missing connection id to create results view');

    return this.resultsMap[connId] || this.createForId(connId);
  }
}