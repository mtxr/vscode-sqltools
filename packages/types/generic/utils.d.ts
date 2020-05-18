import { RequestType, RequestType0 } from 'vscode-languageserver-protocol';

export type Arg0<T> = ArgsType<T>[0];
export type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export type RequestHandler<T> = T extends RequestType<infer P, infer R, any, any>
  ? (params: P) => R | Promise<R>
  : (T extends RequestType0<infer R, any, any> ? () => R | Promise<R> : never);