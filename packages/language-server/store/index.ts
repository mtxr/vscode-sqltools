import { createStore } from 'redux';
import Connection from '@sqltools/core/connection';
import * as actions from './actions';
import { DatabaseInterface } from '@sqltools/core/interface';

interface State {
  activeConnections: { [id: string]: Connection };
  queryResults: {
    [connection_id: string]: {
      [query: string]: DatabaseInterface.QueryResults
    }
  }
}

const initialState: State = {
  activeConnections: {},
  queryResults: {}
}

const onConnect = (state: State, conn: Connection) => {
  const activeConnections = Object.assign({}, state.activeConnections, { [conn.getId()]: conn });
  const queryResults = Object.assign({}, state.queryResults, { [conn.getId()]: {} });
  return Object.assign({}, state, { activeConnections, queryResults });
};

const onDisconnect = (state: State, conn: Connection) => {
  const { activeConnections, queryResults } = state;
  delete activeConnections[conn.getId()];
  delete queryResults[conn.getId()];
  return Object.assign({}, state, { activeConnections, queryResults });
};

const onQuerySuccess = (state: State, { conn, query, results }: { conn: Connection, query: string, results: DatabaseInterface.QueryResults }) => {
  let { queryResults } = state;
  queryResults[conn.getId()][query] = results;
  return Object.assign({}, state, { queryResults });
}

function connectionsReducer(state = initialState, action) {
  switch(action.type) {
    case actions.Connect.type:
      return onConnect(state, action.payload);
    case actions.Disconnect.type:
      return onDisconnect(state, action.payload);
    case actions.QuerySuccess.type:
      return onQuerySuccess(state, action.payload);
    default:
      return state;
  }
}

const store = createStore(connectionsReducer);

export default store;
