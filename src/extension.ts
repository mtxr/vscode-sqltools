'use strict';

import { commands as VSCode, ExtensionContext } from 'vscode';
import Constants from './constants';
import { ST } from './sqltools-commands';

export function activate(ctx: ExtensionContext) {
  Object.keys(ST).forEach((cmd) => {
    ctx.subscriptions.push(VSCode.registerTextEditorCommand(`${Constants.extNamespace}.${cmd}`, ST[cmd]));
  });
}
