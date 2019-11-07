export interface WebviewMessageType<T = any> {
  action: string;
  payload?: T;
  connId?: string;
}

export interface VSCodeWebviewAPI {
  getState<State>(): State,
  setState<State>(newState: State): State,
  postMessage<T>(message: WebviewMessageType<T>): void;
}