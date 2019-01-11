import { RequestType, RequestType0 } from 'vscode-languageserver';
import { DatabaseInterface, SerializedConnection } from '../interface';

export const GetConnectionListRequest = new RequestType0
  <SerializedConnection[], Error, void>('connection/getConnections');

export const RefreshDataRequest = new RequestType0
  <boolean, Error, void>('connection/refreshData');
export const RunCommandRequest = new RequestType
  <{ conn: SerializedConnection, command: string }, boolean, Error, void>('connection/runCommand');
export const OpenConnectionRequest = new RequestType
  <{ conn: SerializedConnection, password?: string }, SerializedConnection, Error, void>('connection/openConnection');
export const UpdateTableAndColumnsRequest = new RequestType
  <{ conn: SerializedConnection, tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[] }, boolean, Error, void>
  ('connection/updateTableAndColumns');

export const GetTablesAndColumnsRequest = new RequestType
  <{ tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[] }, boolean, Error, void>
  ('connection/getTableAndColumns');
