import { RequestType, RequestType0 } from 'vscode-languageserver';
import Connection, { SerializedConnection } from '../api/connection';
import DatabaseInterface from './../api/interface/database-interface';

export const GetConnectionListRequest = new RequestType0
  <SerializedConnection[], Error, void>('connection/getConnections');
export const SetQueryResultsRequest = new RequestType
  <{ data: DatabaseInterface.QueryResults[] }, boolean, Error, void>('connection/setQueryResults');

export const OpenConnectionRequest = new RequestType
  <{ conn: SerializedConnection, password?: string }, boolean, Error, void>('connection/openConnection');
export const CreateNewConnectionRequest = new RequestType<any, any, Error, void>('connection/createNewConnection');
