import { EXT_NAME } from '@sqltools/core/constants';
import { getConnectionId } from '@sqltools/core/utils';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import { commands, ExtensionContext, Uri } from 'vscode';
import path from 'path';

export default class SettingsWebview extends WebviewProvider {
  protected id: string = 'Settings';
  protected title: string = 'SQLTools Settings';

  constructor(context: ExtensionContext) {
    super(
      context,
      Uri.file(path.join(context.extensionPath, 'icons')).with({ scheme: 'vscode-resource' }),
      Uri.file(path.join(context.extensionPath, 'ui')).with({ scheme: 'vscode-resource' })
    );
    this.setMessageCallback(({ action, payload }) => {
      switch (action) {
        case 'createConnection':
          return this.createConnection(payload);
        case 'updateConnection':
          return this.updateConnection(payload);
        default:
        break;
      }
    });
  }

  private updateConnection = async ({ connInfo, isGlobal, editId }) => {
    console.log({ connInfo, isGlobal, editId });
    commands.executeCommand(`${EXT_NAME}.updateConnection`, editId, connInfo, isGlobal ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: 'updateConnectionSuccess', payload: { isGlobal, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: 'updateConnectionError', payload });
    });
  }

  private createConnection = async ({ connInfo, isGlobal }) => {
    commands.executeCommand(`${EXT_NAME}.addConnection`, connInfo, isGlobal ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: 'createConnectionSuccess', payload: { isGlobal, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: 'createConnectionError', payload });
    });
  }
}
