import { NSDatabase, InternalID } from '@sqltools/types';
import WebviewProvider from '@sqltools/vscode/webview-provider';
import { QueryResultsState } from '../ui/screens/Results/interfaces';
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

  constructor(public requestId: string, iconsPath: vscode.Uri, viewsPath: vscode.Uri) {
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
    this.title = `${DISPLAY_NAME} Console`;
    try {
      const prefix = getNameFromId(payload[0].connId);
      let suffix = 'query results';
      if (payload && payload.length > 0) {
        if (payload.length === 1) {
          suffix = payload[0].label ? payload[0].label : payload[0].query.replace(/(\r?\n\s*)/gim, ' ');
        } else {
          suffix = 'multiple query results';
        }
      }
      this.title = `${prefix}: ${suffix}`;
    } catch (error) {}
    this.updatePanelName();
    this.postMessage({ action: 'queryResults', payload });
  }

  wereToShow = vscode.ViewColumn.Active;
}

export default class ResultsWebviewManager {
  private viewsMap: { [id: string]: ResultsWebview } = {};
  private iconsPath: vscode.Uri;
  private viewsPath: vscode.Uri;

  constructor() {
    this.iconsPath = vscode.Uri.file(path.resolve(Context.extensionPath, 'icons')).with({ scheme: 'vscode-resource' });
    this.viewsPath = vscode.Uri.file(path.resolve(Context.extensionPath, 'ui')).with({ scheme: 'vscode-resource' });
  }

  dispose = () => {
    return Promise.all(Object.keys(this.viewsMap).map(id => this.viewsMap[id].dispose()));
  }

  private createForId = (requestId: InternalID) => {
    this.viewsMap[requestId] = new ResultsWebview(requestId, this.iconsPath, this.viewsPath);
    this.viewsMap[requestId].onDidDispose(() => {
      delete this.viewsMap[requestId];
    });
    return this.viewsMap[requestId];
  }

  get = (requestId: InternalID) => {
    if (!requestId) throw new Error('Missing request id to create results view');

    return this.viewsMap[requestId] || this.createForId(requestId);
  }
}