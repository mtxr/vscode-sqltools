import { NSDatabase, InternalID } from '@sqltools/types';
import WebviewProvider from '@sqltools/vscode/webview-provider';
import { QueryResultsState } from '../ui/screens/Results/interfaces';
import vscode from 'vscode';
import Config from '@sqltools/util/config-manager';
import { getNameFromId } from '@sqltools/util/connection';
import { DISPLAY_NAME } from '@sqltools/util/constants';
import { UIAction } from '../actions';

class ResultsWebview extends WebviewProvider<QueryResultsState> {
  protected id: string = 'Results';
  protected title: string = `${DISPLAY_NAME} Results`;
  protected isOpen = false;

  constructor(public requestId: string, private syncConsoleMessages: ((messages: NSDatabase.IResult['messages']) => void)) {
    super();

    this.onDidDispose(() => {
      this.isOpen = false;
    });
  }

  protected messagesHandler = ({ action, payload }) => {
    switch (action) {
      case UIAction.NOTIFY_VIEW_READY:
        this.isOpen = payload;
        return;
      case UIAction.REQUEST_SYNC_CONSOLE_MESSAGES:
        return this.syncConsoleMessages(payload);
    }
  };

  onViewActive = async (active: boolean) => {
    if (!active) {
      this.syncConsoleMessages(['Not focused to results view']);
      return;
    };
    try {
      const state = await this.getState();
      this.syncConsoleMessages(state.resultTabs[state.activeTab].messages);
    } catch(e) {}
  }

  public get cssVariables() {
    if (!Config.results.customization) {
      return super.cssVariables;
    }
    return <any>Config.results.customization;
  }

  show() {
    if (!this.isOpen) {
      this.whereToShow = null;
      switch (Config.results.location) {
        case 'active': // fallback older version
        case 'current':
          this.whereToShow = vscode.ViewColumn.Active;
          break;
        case 'end':
          this.whereToShow = vscode.ViewColumn.Three;
          break;
        case 'beside': // fallback
        default:
          if (!vscode.window.activeTextEditor) {
            this.whereToShow = vscode.ViewColumn.One;
          } else if (Config.results && typeof Config.results.location === 'number' && Config.results.location >= -1 && Config.results.location <= 9 && Config.results.location !== 0) {
            this.whereToShow = Config.results.location;
          } else if (vscode.window.activeTextEditor.viewColumn === vscode.ViewColumn.One) {
              this.whereToShow = vscode.ViewColumn.Two;
          } else {
              this.whereToShow = vscode.ViewColumn.Three;
          }
          break;
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
    this.sendMessage(UIAction.RESPONSE_QUERY_RESULTS, payload);
  }

  whereToShow = vscode.ViewColumn.Active;
}

export default class ResultsWebviewManager {
  private viewsMap: { [id: string]: ResultsWebview } = {};
  constructor(private syncConsoleMessages: ((messages: NSDatabase.IResult['messages']) => void)) { }

  dispose = () => {
    return Promise.all(Object.keys(this.viewsMap).map(id => this.viewsMap[id].dispose()));
  }

  private createForId = (requestId: InternalID) => {
    this.viewsMap[requestId] = new ResultsWebview(requestId, this.syncConsoleMessages);
    this.viewsMap[requestId].onDidDispose(() => {
      delete this.viewsMap[requestId];
    });
    return this.viewsMap[requestId];
  }

  get = (requestId: InternalID) => {
    if (!requestId) throw new Error('Missing request id to create results view');

    return this.viewsMap[requestId] || this.createForId(requestId);
  }

  public getActiveView = () => {
    return this.viewsMap[Object.keys(this.viewsMap).find(k => this.viewsMap[k] && this.viewsMap[k].isActive)];
  }
}