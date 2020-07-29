import Connection from '@sqltools/language-server/src/connection';
import { NSDatabase } from '@sqltools/types';
import connectionStateCache, { ACTIVE_CONNECTIONS_KEY, LAST_USED_ID_KEY } from './connections-state.model';
import queryResultsCache from './query-results.model';

async function CleanUpCache(conn: Connection) {
  return conn && Promise.all([
    queryResultsCache.delStartWith(`[${conn.getId()}]`),
    connectionStateCache.delStartWith(`[${conn.getId()}]`),
  ]).then(() => true);
}

async function Connect(conn: Connection) {
  const activeConnections = (await connectionStateCache.get(ACTIVE_CONNECTIONS_KEY)) || {};
  return Promise.all([
    connectionStateCache.set(ACTIVE_CONNECTIONS_KEY, {
      ...activeConnections,
      [conn.getId()]: conn,
    }),
    connectionStateCache.set(LAST_USED_ID_KEY, conn.getId()),
    CleanUpCache(conn),
  ]);
}

async function Disconnect(conn: Connection) {
  const [ activeConnections = {}, lastUsedId ] = await Promise.all([
    connectionStateCache.get(ACTIVE_CONNECTIONS_KEY),
    connectionStateCache.get(LAST_USED_ID_KEY),
    CleanUpCache(conn),
  ]);
  conn && delete activeConnections[conn.getId()];

  const newLastUsedId = conn && lastUsedId === conn.getId() ? undefined : lastUsedId;

  return Promise.all([
    connectionStateCache.set(ACTIVE_CONNECTIONS_KEY, activeConnections),
    connectionStateCache.set(LAST_USED_ID_KEY, newLastUsedId),
  ]);
}

async function QuerySuccess(results: NSDatabase.IResult[]) {
  return Promise.all(results.map(res => queryResultsCache.set(queryResultsCache.buildKey(res), res)));
}

export default {
  Connect,
  Disconnect,
  QuerySuccess,
}