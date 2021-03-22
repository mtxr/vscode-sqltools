import Cache from '@sqltools/util/cache';

const connectionStateCache = new Cache('manager', {
  maxAge: 2*60*60*1000,
  maxEntries: 50,
});

export default connectionStateCache;

export const ACTIVE_CONNECTIONS_KEY = 'activeConnections';
export const LAST_USED_ID_KEY = 'lastUsedId';
