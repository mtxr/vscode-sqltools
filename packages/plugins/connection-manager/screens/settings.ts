import { EXT_NAME } from '@sqltools/core/constants';
import { getConnectionId } from '@sqltools/core/utils';
import WebviewProvider from '@sqltools/plugins/connection-manager/screens/provider';
import { commands, ExtensionContext, Uri, workspace } from 'vscode';
import path from 'path';
import { DatabaseDialect } from '@sqltools/core/interface';

const relativeToWorkspace = (file: string) => {
  const fileUri = workspace.asRelativePath(Uri.file(file), true);
  return file === fileUri ? file : `.${path.sep}${fileUri}`;
}

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
        case 'testConnection':
          return this.testConnection(payload);
        default:
        break;
      }
    });
  }

  private updateConnection = async ({ connInfo, globalSetting, editId }) => {
    if (connInfo.dialect === DatabaseDialect.SQLite) {
      connInfo.database = relativeToWorkspace(connInfo.database);
    }
    return commands.executeCommand(`${EXT_NAME}.updateConnection`, editId, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: 'updateConnectionSuccess', payload: { globalSetting, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: 'updateConnectionError', payload });
    });
  }

  private createConnection = async ({ connInfo, globalSetting }) => {
    if (connInfo.dialect === DatabaseDialect.SQLite) {
      connInfo.database = relativeToWorkspace(connInfo.database);
    }
    return commands.executeCommand(`${EXT_NAME}.addConnection`, connInfo, globalSetting ? 'Global' : undefined)
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
    if (connInfo.dialect === DatabaseDialect.SQLite) {
      connInfo.database = relativeToWorkspace(connInfo.database);
    }
    return commands.executeCommand(`${EXT_NAME}.testConnection`, connInfo)
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
}
