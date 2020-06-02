import * as vscode from 'vscode';
import { IExtension, IExtensionPlugin, IDriverExtensionApi } from '@sqltools/types';
import { ExtensionContext } from 'vscode';
import { DRIVER_ALIASES } from './constants';
const { publisher, name } = require('../package.json');
// import { workspace } from 'vscode';
// import { Uri } from 'vscode';
// import path from 'path';

const driverName = '<%= displayName %>';

export async function activate(extContext: ExtensionContext): Promise<IDriverExtensionApi> {
  const sqltools = vscode.extensions.getExtension<IExtension>('mtxr.sqltools');
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
      /**
       * This hook is called before saving the connecton using the assistant
       * so you can do any transformations before saving it to disk.active
       * EG: relative file path transformation, string manipulation etc
       * Below is the exmaple for SQLite, where we save the DB path relative to workspace
       * and later we transform it back to absolute before editing
       */
      // if (path.isAbsolute(connInfo.database)) {
      //   const databaseUri = Uri.file(connInfo.database);
      //   const dbWorkspace = workspace.getWorkspaceFolder(databaseUri);
      //   if (dbWorkspace) {
      //     connInfo.database = `\$\{workspaceFolder:${dbWorkspace.name}\}/${workspace.asRelativePath(connInfo.database, false)}`;
      //   }
      // }
      return connInfo;
    },
    parseBeforeEditConnection: ({ connInfo }) => {
      /**
       * This hook is called before editing the connecton using the assistant
       * so you can do any transformations before editing it.
       * EG: absolute file path transformation, string manipulation etc
       * Below is the exmaple for SQLite, where we use relative path to save,
       * but we transform to asolute before editing
       */
      // if (!path.isAbsolute(connInfo.database) && /\$\{workspaceFolder:(.+)}/g.test(connInfo.database)) {
      //   const workspaceName = connInfo.database.match(/\$\{workspaceFolder:(.+)}/)[1];
      //   const dbWorkspace = workspace.workspaceFolders.find(w => w.name === workspaceName);
      //   if (dbWorkspace)
      //     connInfo.database = path.resolve(dbWorkspace.uri.fsPath, connInfo.database.replace(/\$\{workspaceFolder:(.+)}/g, './'));
      // }
      return connInfo;
    },
    driverAliases: DRIVER_ALIASES,
  }
}

export function deactivate() {}
