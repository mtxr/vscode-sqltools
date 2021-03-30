import { InvalidActionError } from '@sqltools/util/exception';
import { IConnectionDriverConstructor, LSContextMap } from '@sqltools/types';
import { createLogger } from '@sqltools/log/src';

const log = createLogger('ls-context');

const Context: Omit<LSContextMap, 'drivers'> = new Map();
class DriverMap<V = IConnectionDriverConstructor> extends Map<string, V> {
  set(key: string, value: V): this {
    if (typeof key !== 'string') throw 'invalid driver name!';
    key = key.toLowerCase();
    log.info({ place: 'driver-map' }, 'Driver %s registered!', key);
    return super.set(key, value);
  }
  get(key: string) {
    return super.get(key.toLowerCase());
  }
  has(key: string) {
    return super.has(key.toLowerCase());
  }
  delete(key: string) {
    return super.delete(key.toLowerCase());
  }
}
const DriversContext: LSContextMap['drivers'] = new DriverMap();

const handler = {
  get(_: never, prop: string) {
    if (prop === 'clear' || prop === 'delete') {
      throw new InvalidActionError(`Cannot ${prop} on LSContext!`);
    }
    if (prop === 'drivers') return DriversContext;
    return Context[prop];
  },
  set() {
    throw new InvalidActionError('Cannot set values to extension context directly!');
  },
};

const LSContext = new Proxy<LSContextMap>(Context as any, handler);
export default LSContext;
