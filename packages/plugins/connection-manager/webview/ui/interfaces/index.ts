export interface IWebviewMessage<T = any> {
  action: string;
  payload?: T;
  connId?: string;
}

export interface IVSCodeWebviewAPI {
  getState<State>(): State,
  setState<State>(newState: State): State,
  postMessage<T>(message: IWebviewMessage<T>): void;
}

export interface ReducerAction<A extends string = string, S extends object = any> {
  type: A;
  payload?: Partial<S> & { [k: string]: any };
  callback?: () => any;
}