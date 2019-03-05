import { EXT_NAME } from '@sqltools/core/constants';
import { getDbId } from '@sqltools/core/utils';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import { commands } from 'vscode';

export default class SettingsWebview extends WebviewProvider {
  protected id: string = 'Settings';
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
    commands.executeCommand(`${EXT_NAME}.addConnection`, connInfo)
    .then(() => {
      this.postMessage({ action: 'createConnectionSuccess', payload: { connInfo: { ...connInfo, id: getDbId(connInfo) } } });
    }, (payload) => {
        this.postMessage({ action: 'createConnectionError', payload });
    });
  }
}
