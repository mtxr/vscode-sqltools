import ConnectionManagerPlugin from '@sqltools/plugins/connection-manager/store';
import { AnyAction, createStore } from 'redux';

interface DefaultState {};
type State = DefaultState & typeof ConnectionManagerPlugin.ConnectionManagerState; // add plugin state data here
type ActionHandler<S = State> = (state: State & S, payload: any) => State & S;

const actionHandlers: { [type: string]: ActionHandler } = {};
const initialState: State = {
  // add plugin props here
  ...ConnectionManagerPlugin.ConnectionManagerState,
};

function registerActionHandler<S extends State = State>(type: string, handler: ActionHandler<S>) {
  let actionHandler = handler;
  if (actionHandlers[type]) {
    const currentHandler = <typeof handler>actionHandlers[type];
    actionHandler = (state, payload) => actionHandler(currentHandler(state, payload), payload);
  }
  actionHandlers[type] = actionHandler;
}

const store = createStore<State, AnyAction, {}, {}>((state = initialState, action) => {
  let newState = state
  if (actionHandlers[action.type]) {
    newState = { ...actionHandlers[action.type](state, action.payload) };
  }
  return newState;
});

(<any>store).registerActionHandler = registerActionHandler;

export type LSStore = typeof store & { registerActionHandler?: typeof registerActionHandler };

/** REGISTER PLUGINS **/
ConnectionManagerPlugin.register(store);

export default <LSStore>store;
