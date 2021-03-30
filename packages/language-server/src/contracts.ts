import { RequestType } from 'vscode-languageserver-protocol';

export const RegisterPlugin = new RequestType<{ path: string }, void, Error, void>('ls/RegisterPlugin');
