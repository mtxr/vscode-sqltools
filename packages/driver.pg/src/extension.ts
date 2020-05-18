import * as vscode from 'vscode';
import { IExtension, IExtensionPlugin } from '@sqltools/types';
import { ExtensionContext } from 'vscode';

export async function activate(extContext: ExtensionContext) {
  const sqltools = vscode.extensions.getExtension<IExtension>('mtxr.sqltools');
  if (!sqltools) {
    throw new Error('SQLTools not installed');
  }
  await sqltools.activate();
  const api = sqltools.exports;
  const plugin: IExtensionPlugin = {
    async register(extension) {
      // register ext part here
      await extension.client.sendRequest('ls/RegisterPlugin', { path: extContext.asAbsolutePath('out/ls/plugin.js') });
    }
  };
  api.registerPlugin(plugin);
}

export function deactivate() {}
