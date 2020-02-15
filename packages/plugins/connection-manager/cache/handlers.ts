import Connection from '@sqltools/language-server/connection';
import { NSDatabase } from '@sqltools/types';
import connectionStateCache, { ACTIVE_CONNECTIONS_KEY, LAST_USED_ID_KEY } from './connections-state.model';
import queryResultsCache from './query-results.model';

async function Connect(conn: Connection) {
  const activeConnections = (await connectionStateCache.get(ACTIVE_CONNECTIONS_KEY)) || {};
  return Promise.all([
    connectionStateCache.set(ACTIVE_CONNECTIONS_KEY, {
      ...activeConnections,
      [conn.getId()]: conn,
    }),
    connectionStateCache.set(LAST_USED_ID_KEY, conn.getId()),
    queryResultsCache.delStartWith(`[${conn.getId()}]`),
    connectionStateCache.delStartWith(`[${conn.getId()}]`),
  ]);
}

async function Disconnect(conn: Connection) {
  const [ activeConnections = {}, lastUsedId ] = await Promise.all([
    connectionStateCache.get(ACTIVE_CONNECTIONS_KEY),
    connectionStateCache.get(LAST_USED_ID_KEY),
    queryResultsCache.delStartWith(`[${conn.getId()}]`),
    connectionStateCache.delStartWith(`[${conn.getId()}]`),
  ]);
  delete activeConnections[conn.getId()];

  const newLastUsedId = lastUsedId === conn.getId() ? undefined : lastUsedId;

  return Promise.all([
    connectionStateCache.set(ACTIVE_CONNECTIONS_KEY, activeConnections),
    connectionStateCache.set(LAST_USED_ID_KEY, newLastUsedId),
  ]);
}

async function QuerySuccess(conn: Connection, { results }: { results: NSDatabase.IResult[] }) {
  return Promise.all(results.map(res => queryResultsCache.set(`[${conn.getId()}][QUERY=${res.query}]`, res)));
}

async function ConnectionData(
  conn: Connection,
  data: {
    tables: NSDatabase.ITable[];
    columns?: NSDatabase.IColumn[];
    functions: NSDatabase.IFunction[];
  }
) {
  return Promise.all(Object.keys(data).map(key => queryResultsCache.set(`[${conn.getId()}][${key}]`, data[key])));
}

export default {
  Connect,
  Disconnect,
  QuerySuccess,
  ConnectionData,
}