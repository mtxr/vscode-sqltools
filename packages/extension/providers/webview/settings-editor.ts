import {
  workspace as Wspc,
} from 'vscode';
import WebviewProvider from './webview-provider';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';

const cfgKey = EXT_NAME.toLowerCase();

export default class SettingsEditor extends WebviewProvider {
  protected id: string = 'settingsEditor';
  protected title: string = 'SQLTools Settings';

  constructor() {
    super();
    this.setMessageCallback(({ action, payload }) => {
      switch (action) {
        case 'createConnection':
          return this.createConnection(payload);
        default:
        break;
      }
    });
  }

  private createConnection = async ({ connInfo }) => {
    const connList = ConfigManager.connections;
    connList.push(connInfo);
    Wspc.getConfiguration(cfgKey).update('connections', connList)
    .then(() => {
      this.postMessage({ action: 'createConnectionSuccess', payload: { connInfo } });
    }, (payload) => {
        this.postMessage({ action: 'createConnectionError', payload });
    });
  }
}
