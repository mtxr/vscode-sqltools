if (process.env.PRODUCT !== 'ext') {
  throw 'Cant use context module outside of VSCode context';
}

import { InvalidActionError } from '@sqltools/util/exception';
import { ExtensionContext } from 'vscode';

let currentContext = {} as ExtensionContext & { set: typeof setCurrentContext; onRegister: typeof onRegister };

const queue = [];

const onRegister = (cb: () => void) => queue.push(cb);

export const setCurrentContext = (ctx: ExtensionContext) => {
  currentContext = ctx as typeof currentContext;
  queue.forEach(cb => cb());
};

const handler = {
  get(_: never, prop: string) {
    if (prop === 'set') return setCurrentContext;
    if (prop === 'onRegister') return onRegister;
    return currentContext[prop];
  },
  set() {
    throw new InvalidActionError('Cannot set values to extension context directly!');
  },
};

const Context = new Proxy<typeof currentContext>(currentContext, handler);

export default Context;
