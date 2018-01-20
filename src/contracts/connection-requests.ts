import { RequestType, RequestType0 } from 'vscode-languageserver';
import { Connection, SerializedConnection } from '../api';
import { DatabaseInterface } from './../api/interface';

export const GetConnectionListRequest = new RequestType0
  <SerializedConnection[], Error, void>('connection/getConnections');

export const RefreshDataRequest = new RequestType0
  <boolean, Error, void>('connection/refreshData');
export const SetQueryResultsRequest = new RequestType
  <{ data: DatabaseInterface.QueryResults[] }, boolean, Error, void>('connection/setQueryResults');

export const RunQueryRequest = new RequestType
  <{ conn: SerializedConnection, query: string }, boolean, Error, void>('connection/runQuery');

export const RunCommandRequest = new RequestType
  <{ conn: SerializedConnection, command: string }, boolean, Error, void>('connection/runCommand');
export const OpenConnectionRequest = new RequestType
  <{ conn: SerializedConnection, password?: string }, SerializedConnection, Error, void>('connection/openConnection');
export const UpdateTableAndColumnsRequest = new RequestType
  <{ tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[] }, boolean, Error, void>
  ('connection/updateTableAndColumns');

export const GetTablesAndColumnsRequest = new RequestType
  <{ tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[] }, boolean, Error, void>
  ('connection/getTableAndColumns');
export const CreateNewConnectionRequest = new RequestType<any, any, Error, void>('connection/createNewConnection');
