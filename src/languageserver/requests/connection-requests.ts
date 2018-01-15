import { RequestType, RequestType0 } from 'vscode-languageserver';
import DatabaseInterface from '../../api/interface/database-interface';

export const SelectConnectionsRequest = new RequestType0<any, Error, void>('connection/getConnections');
export const SetQueryResults = new RequestType
  <{ data: DatabaseInterface.QueryResults[] }, boolean, Error, void>('connection/setQueryResults');
export const SetConnectionRequest = new RequestType<string, any, Error, void>('connection/setConnection');
export const createNewConnection = new RequestType<any, any, Error, void>('connection/createNewConnection');
