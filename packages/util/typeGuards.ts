import { GenericCallback } from '@sqltools/types';

export const isFunction = (v: unknown): v is GenericCallback => typeof v === 'function';
export const isPromise = (v: unknown | Promise<unknown>): v is Promise<unknown> =>
  typeof v['then'] === 'function' || typeof v['catch'] === 'function';
