import { createStore } from 'redux';
import Connection from '@sqltools/core/connection';
import * as actions from './actions';

interface State {
  activeConnections: { [id: string]: Connection };
}

const initialState: State = {
  activeConnections: {}
}

const onConnect = (state: State, conn: Connection) => {
  const activeConnections = Object.assign({}, state.activeConnections, { [conn.getId()]: conn });
  return Object.assign({}, state, { activeConnections });
};

const onDisconnect = (state: State, conn: Connection) => {
  const activeConnections = state.activeConnections;
  delete activeConnections[conn.getId()];
  return Object.assign({}, state, { activeConnections });
};

function connectionsReducer(state = initialState, action) {
  switch(action.type) {
    case actions.Connect.type:
      return onConnect(state, action.payload);
    case actions.Disconnect.type:
      return onDisconnect(state, action.payload);
    default:
      return state;
  }
}

const store = createStore(connectionsReducer);

store.subscribe(() => console.log(store.getState()));

export default store;
