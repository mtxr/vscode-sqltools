import * as vscode from 'vscode';
import { IExtension, IExtensionPlugin, IDriverExtensionApi } from '@sqltools/types';
import { DRIVER_ALIASES } from './constants';
import { parseBeforeSaveConnection, parseBeforeEditConnection } from './connection-parser';
const AUTHENTICATION_PROVIDER = 'sqltools-driver-credentials';
const { publisher, name } = require('../package.json');
const driverName = 'MySQL/MariaDB/TiDB';
export async function activate(extContext: vscode.ExtensionContext): Promise<IDriverExtensionApi> {
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
      // mysql
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[0].value}/icons`, {
        active: extContext.asAbsolutePath('icons/active.png'),
        default: extContext.asAbsolutePath('icons/default.png'),
        inactive: extContext.asAbsolutePath('icons/inactive.png'),
      });
      // mariadb
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[1].value}/icons`, {
        active: extContext.asAbsolutePath('icons/mariadb/active.png'),
        default: extContext.asAbsolutePath('icons/mariadb/default.png'),
        inactive: extContext.asAbsolutePath('icons/mariadb/inactive.png'),
      });
      // tidb
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[2].value}/icons`, {
        active: extContext.asAbsolutePath('icons/tidb/active.png'),
        default: extContext.asAbsolutePath('icons/tidb/default.png'),
        inactive: extContext.asAbsolutePath('icons/tidb/inactive.png'),
      });
      DRIVER_ALIASES.forEach(({ value }) => {
        extension.resourcesMap().set(`driver/${value}/extension-id`, extensionId);
        extension.resourcesMap().set(`driver/${value}/connection-schema`, extContext.asAbsolutePath("connection.schema.json"));
        extension.resourcesMap().set(`driver/${value}/ui-schema`, extContext.asAbsolutePath("ui.schema.json"));
      });

      await extension.client.sendRequest('ls/RegisterPlugin', { path: extContext.asAbsolutePath('out/ls/plugin.js') });
    }
  };
  api.registerPlugin(plugin);
  return {
    driverName,
    parseBeforeSaveConnection,
    parseBeforeEditConnection,
    resolveConnection: async ({ connInfo }) => {
      /**
       * This hook is called after a connection definition has been fetched
       * from settings and is about to be used to connect.
       */
      if (connInfo.password === undefined && !connInfo.askForPassword && !connInfo.connectString && !connInfo.useAwsIamAuth) {
        const scopes = [connInfo.name, (connInfo.username || "")];
        let session = await vscode.authentication.getSession(
          AUTHENTICATION_PROVIDER,
          scopes,
          { silent: true }
        );
        if (!session) {
            session = await vscode.authentication.getSession(
              AUTHENTICATION_PROVIDER,
              scopes,
              { createIfNone: true }
            );
        }
        if (session) {
          connInfo.password = session.accessToken;
          }
      }
      return connInfo;
    },
    driverAliases: DRIVER_ALIASES,
  }
}

export function deactivate() {}
