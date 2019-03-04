import Actions from './actions';
import { LSStore } from '@sqltools/language-server/store';
import handlers from './handlers';
import ConnectionManagerState, { ConnectionManagerState as State } from './state';

function register(store: LSStore) {
  store.registerActionHandler<State>(Actions.Connect.type, handlers.onConnect);
  store.registerActionHandler<State>(Actions.Disconnect.type, handlers.onDisconnect);
  store.registerActionHandler<State>(Actions.QuerySuccess.type, handlers.onQuerySuccess);
}
export default {
  ConnectionManagerState,
  Actions,
  register,
}


