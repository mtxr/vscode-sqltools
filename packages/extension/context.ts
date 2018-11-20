import { ExtensionContext } from 'vscode';

let context = null;
let httpServerPort;

const Context = {
  get context(): ExtensionContext {
    return context;
  },

  set context(v: ExtensionContext) {
    context = v;
  },

  get httpServerPort(): number {
    return httpServerPort;
  },

  set httpServerPort(v: number) {
    httpServerPort = v;
  },
};

export default Context;
