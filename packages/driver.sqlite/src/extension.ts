import { IExtension, IExtensionPlugin, IDriverExtensionApi } from '@sqltools/types';
import { ExtensionContext, extensions, workspace, Uri } from 'vscode';
import { DRIVER_ALIASES } from './constants';
const { publisher, name } = require('../package.json');
import path from 'path';

const driverName = 'SQLite';

export async function activate(extContext: ExtensionContext): Promise<IDriverExtensionApi> {
  const sqltools = extensions.getExtension<IExtension>('mtxr.sqltools');
  if (!sqltools) {
    throw new Error('SQLTools not installed');
  }
  await sqltools.activate();

  const api = sqltools.exports;

  const extensionId = `${publisher}.${name}`;
  const plugin: IExtensionPlugin = {
    extensionId,
    name: `${driverName} Plugin`,
    type: 'driver',
    async register(extension) {
      // register ext part here
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[0].value}/icons`, {
        active: extContext.asAbsolutePath('icons/active.png'),
        default: extContext.asAbsolutePath('icons/default.png'),
        inactive: extContext.asAbsolutePath('icons/inactive.png'),
      });
      DRIVER_ALIASES.forEach(({ value }) => {
        extension.resourcesMap().set(`driver/${value}/extension-id`, extensionId);
        extension.resourcesMap().set(`driver/${value}/connection-schema`, extContext.asAbsolutePath('connection.schema.json'));
        extension.resourcesMap().set(`driver/${value}/ui-schema`, extContext.asAbsolutePath('ui.schema.json'));
      });
      await extension.client.sendRequest('ls/RegisterPlugin', { path: extContext.asAbsolutePath('out/ls/plugin.js') });
    }
  };
  api.registerPlugin(plugin);
  return {
    driverName,
    parseBeforeSaveConnection: ({ connInfo }) => {
      const formData: typeof connInfo = {
        ...connInfo,
      };

      if (!connInfo.database) {
        throw new Error('Database is required');
      }

      if (path.isAbsolute(connInfo.database)) {
        const databaseUri = Uri.file(connInfo.database);
        const dbWorkspace = workspace.getWorkspaceFolder(databaseUri);
        if (dbWorkspace) {
          formData.database = `\$\{workspaceFolder:${dbWorkspace.name}\}/${workspace.asRelativePath(connInfo.database, false)}`;
        }
      }

      const propsToRemove = ['connectionMethod', 'id', 'usePassword', 'askForPassword'];
      propsToRemove.forEach(p => delete formData[p]);

      return formData;
    },
    parseBeforeEditConnection: ({ connInfo }) => {
      const formData: typeof connInfo = {
        ...connInfo,
      };
      const propsToRemove = ['connectionMethod', 'usePassword', 'askForPassword'];
      propsToRemove.forEach(p => delete formData[p]);

      if (!path.isAbsolute(connInfo.database) && /\$\{workspaceFolder:(.+)}/g.test(connInfo.database)) {
        const workspaceName = connInfo.database.match(/\$\{workspaceFolder:(.+)}/)[1];
        const dbWorkspace = workspace.workspaceFolders.find(w => w.name === workspaceName);
        if (dbWorkspace)
          formData.database = path.resolve(dbWorkspace.uri.fsPath, connInfo.database.replace(/\$\{workspaceFolder:(.+)}/g, './'));
      }
      return formData;
    },
    driverAliases: DRIVER_ALIASES,
  }
}

export function deactivate() {}
