import path from 'path';
import { ExtensionContext, Uri } from 'vscode';

let context = null;
let iconsPath = null;
let viewsPath = null;

const Context = {
  get context(): ExtensionContext {
    return context;
  },

  set context(v: ExtensionContext) {
    context = v;
    iconsPath = Uri.file(path.join(context.extensionPath, 'icons')).with({ scheme: 'vscode-resource' });
    viewsPath = Uri.file(path.join(context.extensionPath, 'ui')).with({ scheme: 'vscode-resource' });
  },
  get iconsPath() {
    return iconsPath;
  },

  get viewsPath() {
    return viewsPath;
  },
};

export default Context;


// @TODO: should remove this file to allow plugins to detach from extension package completely