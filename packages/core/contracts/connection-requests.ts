import { RequestType, RequestType0 } from 'vscode-languageserver';
import { DatabaseInterface, SerializedConnection } from '../interface';

export const ClientRequestConnections = new RequestType0
  <SerializedConnection[], Error, void>('connection/getConnections');
export const RefreshConnectionData = new RequestType0
  <void, Error, void>('connection/refreshData');
export const RunCommandRequest = new RequestType
  <{ conn: SerializedConnection, command: string, args: any[] }, DatabaseInterface.QueryResults[] | boolean, Error, void>('connection/runCommand');
export const OpenConnectionRequest = new RequestType
  <{ conn: SerializedConnection, password?: string }, SerializedConnection, Error, void>('connection/openConnection');
export const CloseConnectionRequest = new RequestType
  <{ conn: SerializedConnection }, void, Error, void>('connection/closeConnection');
export const UpdateConnectionExplorerRequest = new RequestType
  <{ conn: SerializedConnection, tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[] }, void, Error, void>
  ('connection/updateTableAndColumns');
export const GetTablesAndColumnsRequest = new RequestType
  <{ tables: DatabaseInterface.Table[], columns: DatabaseInterface.TableColumn[] }, boolean, Error, void>
  ('connection/getTableAndColumns');
