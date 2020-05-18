import { InvalidActionError } from '@sqltools/util/exception';
import { IConnectionDriverConstructor } from '@sqltools/types';

const Context = new Map();
const DriversContext = new Map<string, IConnectionDriverConstructor>();

const handler = {
  get(_: never, prop: string) {
    if (
      prop === 'clear'
      || prop === 'delete'
    ) {
      throw new InvalidActionError(`Cannot ${prop} on LSContext!`);
    }
    if (prop === 'drivers') return DriversContext;
    return Context[prop];
  },
  set() {
    throw new InvalidActionError('Cannot set values to extension context directly!');
  },
};

const LSContext = new Proxy<Omit<typeof Context, 'clear' | 'delete'> & { drivers: typeof DriversContext }>(Context as any, handler);
export default LSContext;