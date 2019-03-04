import { createStore, AnyAction, Store } from 'redux';

interface DefaultState {};

type State = DefaultState; // add plugin state data here

const initialState: State = {
  // add plugin props here
};

const actionHandlers: { [type: string]: (state: State, payload: any) => State } = {};

export function registerActionHandler(type: string, handler: typeof actionHandlers[string]) {
  actionHandlers[type] = handler;
}

const store = createStore<State, AnyAction, {}, {}>((state = initialState, action) => {
  if (actionHandlers[action.type]) return actionHandlers[action.type](state, action.payload);
  return state;
});

(<any>store).registerActionHandler = registerActionHandler;

export default <Store & { registerActionHandler?: typeof registerActionHandler }>store;
