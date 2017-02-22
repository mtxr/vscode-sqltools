'use strict';

import {
  ExtensionContext,
  commands as VsCommands
} from 'vscode';

import * as ST from './sqltools-commands';

import {
  extensionNamespace,
  version
} from './constants';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(VsCommands.registerCommand(`${extensionNamespace}.aboutVersion`, ST.aboutVersion));
  context.subscriptions.push(VsCommands.registerTextEditorCommand(`${extensionNamespace}.formatSql`, ST.formatSql));
  context.subscriptions.push(VsCommands.registerTextEditorCommand(`${extensionNamespace}.saveQuery`, ST.saveQuery));
  context.subscriptions.push(VsCommands.registerCommand(`${extensionNamespace}.deleteSavedQuery`, ST.deleteSavedQuery));
  context.subscriptions.push(VsCommands.registerCommand(`${extensionNamespace}.editSavedQuery`, ST.editSavedQuery));
}
