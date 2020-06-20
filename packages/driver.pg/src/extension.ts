import * as vscode from 'vscode';
import { IExtension, IExtensionPlugin, IDriverExtensionApi } from '@sqltools/types';
import { ExtensionContext } from 'vscode';
import { DRIVER_ALIASES } from './constants';
const { publisher, name } = require('../package.json');
const driverName = 'PostgreSQL/Redshift';
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
      // postgres
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[0].value}/icons`, {
        active: extContext.asAbsolutePath('icons/pg/active.png'),
        default: extContext.asAbsolutePath('icons/pg/default.png'),
        inactive: extContext.asAbsolutePath('icons/pg/inactive.png'),
      });
      // redshift
      extension.resourcesMap().set(`driver/${DRIVER_ALIASES[1].value}/icons`, {
        active: extContext.asAbsolutePath('icons/redshift/active.png'),
        default: extContext.asAbsolutePath('icons/redshift/default.png'),
        inactive: extContext.asAbsolutePath('icons/redshift/inactive.png'),
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

      ['connectionMethod', 'id'].forEach(p => delete connInfo[p]);

      return connInfo;
    },
    parseBeforeEditConnection: ({ connInfo }) => {
      const formData = {
        ...connInfo,
        connectionMethod: 'Server and Port',
      };
      if (connInfo.socketPath) {
        formData.connectionMethod = 'Socket File';
      } else if (connInfo.connectString) {
        formData.connectionMethod = 'Connection String';
      }
      return formData;
    },
    driverAliases: DRIVER_ALIASES,
  }
}

export function deactivate() {}
