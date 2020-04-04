import LRUCache from 'lru-cache';
import logger from '@sqltools/util/log';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type Key = string;
type Value = any; // @todo check types later

interface CacheOptions {
  maxEntries?: number;
  maxAge?: number;
  persist?: boolean;
};

class Cache<K = Key, V = Value> {
  private instance: LRUCache<K, V>;
  private log: typeof logger;
  constructor(private namespace: string, {
    maxEntries = 50,
    maxAge = ONE_DAY_MS,
  }: CacheOptions) {
    this.instance = new LRUCache<K, V>({
      max: maxEntries,
      maxAge,
      updateAgeOnGet: true,
      dispose: this.onDeleted,
    });
    this.log = logger.extend(`cache:${this.namespace}`);
  }

  set = async (key: K, value: V, maxAge?: number): Promise<boolean> => {
    this.log.extend('debug')('SET %s', key);
    return Promise.resolve(this.instance.set(key, value, maxAge));
  }

  peek = async (key: K) => Promise.resolve(this.instance.peek(key));

  get = async (key: K, getUpdatedValue?: (() => Promise<V> | V) | V): Promise<V> => {
    const value = this.instance.get(key);
    if (value) {
      this.log.extend('debug')('HIT for %s', key);
      return Promise.resolve(value);
    }

    this.log.extend('debug')('MISS for %s', key);
    if (typeof getUpdatedValue === 'undefined') return undefined;
    const result = await Promise.resolve(typeof getUpdatedValue !== 'function' ? getUpdatedValue : (<Function>getUpdatedValue)());
    await this.set(key, result);
    return result;
  }

  del = async (keysOrKeys: K | K[]): Promise<boolean> => {
    const keys = Array.isArray(keysOrKeys) ? keysOrKeys : (keysOrKeys ? [keysOrKeys] : []);
    for(const key of keys) {
      this.log.extend('debug')('DELETE  %s', key);
      this.instance.del(key);
    }
    return true;
  }

  keys = () => this.instance.keys() as string[];

  delStartWith = async (startStr: string): Promise<boolean> => {
    this.log.extend('info')('DELETE keys starting with %s...', startStr);
    if (!startStr) {
      return;
    }

    const keys: string[] = this.keys();
    for (const key of keys) {
      if (key.startsWith(startStr)) {
        await this.del(<any>key);
      }
    }
    this.log.extend('info')('DELETE keys starting with %s completed!', startStr);
    return true;
  }

  clear = async () => {
    this.log.extend('debug')('CLEAR all');
    return Promise.resolve(this.instance.reset());
  }

  forceClearOld = async () => {
    this.log.extend('debug')('PRUNE old');
    return Promise.resolve(this.instance.prune());
  }

  buildKey = (opts: any) => JSON.stringify(opts);

  private onDeleted = async (key: K, _value?: V) => {
    this.log.extend('debug')('DELETED %s', key);
  }
}


export default Cache;