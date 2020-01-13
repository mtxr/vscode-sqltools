import { ConnectionManagerState } from './state';
import Connection from '@sqltools/language-server/connection';
import { NSDatabase } from '@sqltools/types';

export const onConnect = (state: ConnectionManagerState, conn: Connection): ConnectionManagerState => {
  return {
    ...state,
    activeConnections: {
      ...state.activeConnections,
      [conn.getId()]: conn,
    },
    queryResults: {
      ...state.queryResults,
      [conn.getId()]: {},
    },
    connectionInfo: {
      ...state.connectionInfo,
      [conn.getId()]: { tables: [], columns: [], functions: [] },
    },
    lastUsedId: conn.getId(),
  };
};

export const onDisconnect = (state: ConnectionManagerState, conn: Connection): ConnectionManagerState => {
  const { activeConnections, connectionInfo, queryResults, lastUsedId } = state;
  delete activeConnections[conn.getId()];
  delete queryResults[conn.getId()];
  delete connectionInfo[conn.getId()];

  const newLastUsedId = lastUsedId === conn.getId() ? undefined : lastUsedId;

  return {
    ...state,
    activeConnections,
    queryResults,
    lastUsedId: newLastUsedId,
    connectionInfo,
  };
};

export const onQuerySuccess = (state: ConnectionManagerState, { conn, results }: { conn: Connection, results: NSDatabase.IResult[] }): ConnectionManagerState => {
  let { queryResults } = state;
  queryResults[conn.getId()] = results.reduce((agg, res) => ({ ...agg, [res.query]: res }), {});
  return {
    ...state,
    queryResults
  };
}

export const onConnectionData = (state: ConnectionManagerState, { conn, tables, columns, functions }: { conn: Connection, tables: NSDatabase.ITable[], columns: NSDatabase.IColumn[], functions: NSDatabase.IFunction[] }): ConnectionManagerState => {
  let { connectionInfo } = state;

  const newState = {
    ...state,
    connectionInfo: {
      ...connectionInfo,
      [conn.getId()]: { tables, columns, functions },
    }
  };
  return newState;
}

export default {
  onConnect,
  onDisconnect,
  onQuerySuccess,
  onConnectionData,
};