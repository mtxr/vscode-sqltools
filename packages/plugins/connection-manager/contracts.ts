import { RequestType, RequestType0 } from 'vscode-languageserver';
import { DatabaseInterface, ConnectionInterface } from '@sqltools/core/interface';

export const ClientRequestConnections = new RequestType<
  { connectedOnly?: boolean },
  ConnectionInterface[],
  Error,
  void
>('connection/getConnections');
export const RefreshConnectionData = new RequestType0<void, Error, void>(
  'connection/refreshData'
);
export const GetCachedPassword = new RequestType<
  { conn: ConnectionInterface },
  string,
  Error,
  void
>('connection/getCachedPassword');
export const RunCommandRequest = new RequestType<
  { conn: ConnectionInterface; command: string; args: any[] },
  DatabaseInterface.QueryResults[],
  Error,
  void
>('connection/runCommand');
export const OpenConnectionRequest = new RequestType<
  { conn: ConnectionInterface; password?: string },
  ConnectionInterface,
  Error,
  void
>('connection/openConnection');
export const CloseConnectionRequest = new RequestType<
  { conn: ConnectionInterface },
  void,
  Error,
  void
>('connection/closeConnection');
export const UpdateConnectionExplorerRequest = new RequestType<
  {
    conn: ConnectionInterface;
    tables: DatabaseInterface.Table[];
    columns: DatabaseInterface.TableColumn[];
  },
  void,
  Error,
  void
>('connection/updateTableAndColumns');
export const GetTablesAndColumnsRequest = new RequestType<
  { conn: ConnectionInterface },
  {
    tables: DatabaseInterface.Table[];
    columns: DatabaseInterface.TableColumn[];
  },
  Error,
  void
>('connection/getTableAndColumns');

export const SaveResults = new RequestType<
  { connId: string, filename: string, query: string, filetype: 'json' | 'csv' },
  void,
  Error,
  void
>('results/export');