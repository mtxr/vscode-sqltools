import { createStore, AnyAction, Store } from 'redux';
import ConnetionManagerPlugin from '@sqltools/plugins/connection-manager/store';

interface DefaultState {};
type State = DefaultState & typeof ConnetionManagerPlugin.ConnectionManagerState; // add plugin state data here
type ActionHandler<S = State> = (state: State & S, payload: any) => State & S;

const actionHandlers: { [type: string]: ActionHandler } = {};
const initialState: State = {
  // add plugin props here
  ...ConnetionManagerPlugin.ConnectionManagerState,
};

function registerActionHandler<S = State>(type: string, handler: ActionHandler<S>) {
  actionHandlers[type] = handler;
}

const store = createStore<State, AnyAction, {}, {}>((state = initialState, action) => {
  if (actionHandlers[action.type]) return actionHandlers[action.type](state, action.payload);
  return state;
});

(<any>store).registerActionHandler = registerActionHandler;

export type LSStore = Store & { registerActionHandler?: typeof registerActionHandler };

/** REGISTER PLUGINS **/
ConnetionManagerPlugin.register(store);

export default <LSStore>store;
