'use strict';

import { commands as VSCode, ExtensionContext } from 'vscode';
import Constants from './constants';
import { ST } from './sqltools-commands';

export function activate(ctx: ExtensionContext) {
  Object.keys(ST.textEditor).forEach((cmd) => {
    ctx.subscriptions.push(VSCode.registerTextEditorCommand(`${Constants.extNamespace}.${cmd}`, ST.textEditor[cmd]));
  });
  Object.keys(ST.workspace).forEach((cmd) => {
    ctx.subscriptions.push(VSCode.registerCommand(`${Constants.extNamespace}.${cmd}`, ST.workspace[cmd]));
  });
}
