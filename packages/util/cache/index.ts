import LRUCache from '../node_modules/lru-cache';
import { createLogger } from '@sqltools/log/src';

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

type Key = string;
type Value = any;

interface CacheOptions {
  maxEntries?: number;
  maxAge?: number;
  persist?: boolean;
};

class Cache<K = Key, V = Value> {
  private instance: LRUCache<K, V>;
  private log: ReturnType<typeof createLogger>;
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
    this.log = createLogger(`cache:${this.namespace}`);
  }

  set = async (key: K, value: V, maxAge?: number): Promise<boolean> => {
    this.log.debug('SET %s', key);
    return Promise.resolve(this.instance.set(key, value, maxAge));
  }

  peek = async (key: K) => Promise.resolve(this.instance.peek(key));

  get = async (key: K, getUpdatedValue?: (() => Promise<V> | V) | V): Promise<V> => {
    const value = this.instance.get(key);
    if (value) {
      this.log.debug('HIT for %s', key);
      return Promise.resolve(value);
    }

    this.log.debug('MISS for %s', key);
    if (typeof getUpdatedValue === 'undefined') return undefined;
    const result = await Promise.resolve(typeof getUpdatedValue !== 'function' ? getUpdatedValue : (<Function>getUpdatedValue)());
    await this.set(key, result);
    return result;
  }

  del = async (keysOrKeys: K | K[]): Promise<boolean> => {
    const keys = Array.isArray(keysOrKeys) ? keysOrKeys : (keysOrKeys ? [keysOrKeys] : []);
    for(const key of keys) {
      this.log.debug('DELETE  %s', key);
      this.instance.del(key);
    }
    return true;
  }

  keys = () => this.instance.keys() as string[];

  delStartWith = async (startStr: string): Promise<boolean> => {
    this.log.debug('DELETE keys starting with %s...', startStr);
    if (!startStr) {
      return;
    }

    const keys: string[] = this.keys();
    for (const key of keys) {
      if (key.startsWith(startStr)) {
        await this.del(<any>key);
      }
    }
    this.log.debug('DELETE keys starting with %s completed!', startStr);
    return true;
  }

  clear = async () => {
    this.log.debug('CLEAR all');
    return Promise.resolve(this.instance.reset());
  }

  forceClearOld = async () => {
    this.log.debug('PRUNE old');
    return Promise.resolve(this.instance.prune());
  }

  buildKey = (opts: any) => JSON.stringify(opts);

  private onDeleted = async (key: K, _value?: V) => {
    this.log.debug('DELETED %s', key);
  }
}


export default Cache;