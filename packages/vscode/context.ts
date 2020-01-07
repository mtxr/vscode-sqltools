import { ExtensionContext } from 'vscode';
import { InvalidActionError } from '@sqltools/core/exception';

let currentContext: ExtensionContext & { set: typeof setCurrentContext } = {} as any;

export const setCurrentContext = (ctx: ExtensionContext) => {
  currentContext = ctx as (typeof currentContext);
};


const handler = {
  get(_: never, prop: string) {
    if (prop === 'set') return setCurrentContext;
    return currentContext[prop];
  },
  set() {
    throw new InvalidActionError('Cannot set values to extension context directly!');
  },
};

const Context = new Proxy<typeof currentContext>(currentContext, handler);


export default Context;