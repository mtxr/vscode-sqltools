import { RequestType, RequestType0 } from 'vscode-languageserver-protocol';

export declare type Arg0<T> = ArgsType<T>[0];
export declare type ArgsType<T> = T extends (...args: infer U) => any ? U : never;

export declare type RequestHandler<T> = T extends RequestType<infer P, infer R, any, any>
  ? (params: P) => R | Promise<R>
  : (T extends RequestType0<infer R, any, any> ? () => R | Promise<R> : never);