import { RequestType, RequestType0 } from 'vscode-languageserver';

export const SelectConnectionsRequest = new RequestType0<any, Error, void>('connection/getConnections');

export const SetConnectionRequest = new RequestType<string, any, Error, void>('connection/setConnection');
