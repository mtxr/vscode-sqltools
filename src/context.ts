import { ExtensionContext } from 'vscode';

let context = null;

const Context = {
  get context(): ExtensionContext {
    return context;
  },

  set context(v: ExtensionContext) {
    context = v;
  },
};

export default Context;
