import { ExtensionContext, Uri } from 'vscode';
import path from 'path';

let context = null;
let iconsPath = null;
let viewsPath = null;
let logWriter: Console & { show?: () => void } = console;
const Context = {
  get logWriter() {
    return logWriter;
  },

  set logWriter(l: typeof logWriter) {
    logWriter = l || console;
  },

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
