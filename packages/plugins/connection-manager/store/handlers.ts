import { ConnectionManagerState } from './state';
import Connection from '@sqltools/core/connection';
import { DatabaseInterface } from '@sqltools/core/interface';

export const onConnect = (state: ConnectionManagerState, conn: Connection): ConnectionManagerState => {
  const activeConnections = Object.assign({}, state.activeConnections, { [conn.getId()]: conn });
  const queryResults = Object.assign({}, state.queryResults, { [conn.getId()]: {} });

  return Object.assign({}, state, { activeConnections, queryResults, lastUsedId: conn.getId() });
};

export const onDisconnect = (state: ConnectionManagerState, conn: Connection): ConnectionManagerState => {
  const { activeConnections, queryResults, lastUsedId } = state;
  delete activeConnections[conn.getId()];
  delete queryResults[conn.getId()];

  const newLastUsedId = lastUsedId === conn.getId() ? undefined : lastUsedId;

  return Object.assign({}, state, { activeConnections, queryResults, lastUsedId: newLastUsedId });
};

export const onQuerySuccess = (state: ConnectionManagerState, { conn, query, results }: { conn: Connection, query: string, results: DatabaseInterface.QueryResults }): ConnectionManagerState => {
  let { queryResults } = state;
  queryResults[conn.getId()][query] = results;
  return Object.assign({}, state, { queryResults });
}

export default {
  onConnect,
  onDisconnect,
  onQuerySuccess,
};