import { NSDatabase, ILanguageClient } from '@sqltools/types';
import { SaveResultsRequest } from '@sqltools/plugins/connection-manager/contracts';
import WebviewProvider from '@sqltools/vscode/webview-provider';
import QueryResultsState from '@sqltools/plugins/connection-manager/ui/screens/Results/State';
import vscode from 'vscode';
import Config from '@sqltools/util/config-manager';
import { getNameFromId } from '@sqltools/util/connection';
import path from 'path';
import Context from '@sqltools/vscode/context';
import { DISPLAY_NAME } from '@sqltools/util/constants';

class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = `${DISPLAY_NAME} Results`;

  protected isOpen = false;

  constructor(private client: ILanguageClient, iconsPath: vscode.Uri, viewsPath: vscode.Uri) {
    super(iconsPath, viewsPath);

    this.onDidDispose(() => {
      this.isOpen = false;
    });

    this.setMessageCallback(({ action, payload }) => {
      switch (action) {
        case 'viewReady':
          this.isOpen = payload;
          break;
        default:
        break;
      }
    });
  }

  public get cssVariables() {
    if (!Config.results.customization) {
      return super.cssVariables;
    }
    return <any>Config.results.customization;
  }

  public saveResults = async (filetype: 'csv' | 'json' = 'csv') => {
    const { connId, activeTab, queries } = await this.getState();
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
    await this.client.sendRequest(SaveResultsRequest, { connId, query: queries[activeTab], filename, filetype });
    return vscode.commands.executeCommand('vscode.open', file);
  }

  show() {
    this.wereToShow = null;
    switch (Config.results.location) {
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
        } else if (Config.results && typeof Config.results.location === 'number' && Config.results.location >= -1 && Config.results.location <= 9 && Config.results.location !== 0) {
          this.wereToShow = Config.results.location;
        } else if (vscode.window.activeTextEditor.viewColumn === vscode.ViewColumn.One) {
            this.wereToShow = vscode.ViewColumn.Two;
        } else {
            this.wereToShow = vscode.ViewColumn.Three;
        }
    }

    super.show();

    return new Promise((resolve, reject) => {
      let count = 0;
      let interval = setInterval(() => {
        if (this.isOpen) {
          clearInterval(interval);
          return resolve();
        }
        if (count >= 5) {
          clearInterval(interval);
          return reject(new Error('Can\'t open results screen'));
        }
      }, 500);
    });
  }
  updateResults = (payload: NSDatabase.IResult[]) => {
    this.title = `${DISPLAY_NAME} Results`;
    try {
      if (payload && payload.length > 0) {
        this.title = payload.length === 1 && payload[0].label ? payload[0].label : `${getNameFromId(payload[0].connId)} Results`;
      }
    } catch (error) {}
    this.updatePanelName();
    this.postMessage({ action: 'queryResults', payload });
  }

  wereToShow = vscode.ViewColumn.Active;
}

export default class ResultsWebviewManager {
  private resultsMap: { [id: string]: ResultsWebview } = {};
  private iconsPath: vscode.Uri;
  private viewsPath: vscode.Uri;

  constructor(private client: ILanguageClient) {
    this.iconsPath = vscode.Uri.file(path.resolve(Context.extensionPath, 'icons')).with({ scheme: 'vscode-resource' });
    this.viewsPath = vscode.Uri.file(path.resolve(Context.extensionPath, 'ui')).with({ scheme: 'vscode-resource' });
  }

  dispose = () => {
    return Promise.all(Object.keys(this.resultsMap).map(id => this.resultsMap[id].dispose()));
  }

  private createForId = (connId: string) => {
    this.resultsMap[connId] = new ResultsWebview(this.client, this.iconsPath, this.viewsPath);
    return this.resultsMap[connId];
  }

  get = (connId: string) => {
    if (!connId) throw new Error('Missing connection id to create results view');

    return this.resultsMap[connId] || this.createForId(connId);
  }
}