import { EXT_NAMESPACE, DISPLAY_NAME, EXT_CONFIG_NAMESPACE } from '@sqltools/util/constants';
import { getConnectionId } from '@sqltools/util/connection';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import { commands, Uri } from 'vscode';
import path from 'path';
import { DatabaseDriver } from '@sqltools/types';
import relativeToWorkspace from '@sqltools/vscode/utils/relative-to-workspace';
import Context from '@sqltools/vscode/context';

export default class SettingsWebview extends WebviewProvider {
  protected id: string = 'Settings';
  protected title: string = `${DISPLAY_NAME} Settings`;

  constructor() {
    super(
      Uri.file(path.resolve(Context.extensionPath, 'icons')).with({ scheme: 'vscode-resource' }),
      Uri.file(path.resolve(Context.extensionPath, 'ui')).with({ scheme: 'vscode-resource' })
    );
    this.setMessageCallback(({ action, payload }) => {
      switch (action) {
        case 'createConnection':
          return this.createConnection(payload);
        case 'updateConnection':
          return this.updateConnection(payload);
        case 'testConnection':
          return this.testConnection(payload);
        case 'openConnectionFile':
          this.openConnectionFile();
        default:
        break;
      }
    });
  }

  private updateConnection = async ({ connInfo, globalSetting, transformToRelative, editId }) => {
    if (connInfo.driver === DatabaseDriver.SQLite && transformToRelative) {
      connInfo.database = relativeToWorkspace(connInfo.database);
    }
    return commands.executeCommand(`${EXT_NAMESPACE}.updateConnection`, editId, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: 'updateConnectionSuccess', payload: { globalSetting, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: 'updateConnectionError', payload });
    });
  }

  private createConnection = async ({ connInfo, globalSetting, transformToRelative }) => {
    if (connInfo.driver === DatabaseDriver.SQLite && transformToRelative) {
      connInfo.database = relativeToWorkspace(connInfo.database);
    }
    return commands.executeCommand(`${EXT_NAMESPACE}.addConnection`, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: 'createConnectionSuccess', payload: { globalSetting, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: 'createConnectionError', payload });
    });
  }

  private testConnection = async ({ connInfo }) => {
    if (connInfo.driver === DatabaseDriver.SQLite) {
      connInfo.database = relativeToWorkspace(connInfo.database);
    }
    return commands.executeCommand(`${EXT_NAMESPACE}.testConnection`, connInfo)
    .then((res: any) => {
      if (res && res.notification) {
        const message = `You need to fix some issues in your machine first. Check the notifications on bottom-right before moving forward.`
        return this.postMessage({ action: 'testConnectionWarning', payload: { message } });
      }
      this.postMessage({ action: 'testConnectionSuccess', payload: { connInfo } });
    }, (payload = {}) => {
      payload = {
        message: (payload.message || payload || '').toString(),
      }
      this.postMessage({ action: 'testConnectionError', payload });
    });
  }

  private openConnectionFile = async () => {
    return commands.executeCommand('workbench.action.openSettings', `${EXT_CONFIG_NAMESPACE}.connections`);
  }
}
