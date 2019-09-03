import { RequestType, RequestType0, NotificationType } from 'vscode-languageserver-protocol';
import { ConnectionInterface } from '@sqltools/core/interface';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

export const GetConnectionsRequest = new RequestType<
  { connectedOnly?: boolean },
  ConnectionInterface[],
  Error,
  void
>('connection/GetConnectionsRequest');
export const RefreshAllRequest = new RequestType0<void, Error, void>(
  'connection/RefreshAllRequest'
);
export const GetConnectionPasswordRequest = new RequestType<
  { conn: ConnectionInterface },
  string,
  Error,
  void
>('connection/GetConnectionPasswordRequest');
export const RunCommandRequest = new RequestType<
  { conn: ConnectionInterface; command: string; args: any[] },
  DatabaseInterface.QueryResults[],
  Error,
  void
>('connection/RunCommandRequest');
export const ConnectRequest = new RequestType<
  { conn: ConnectionInterface; password?: string },
  ConnectionInterface,
  Error,
  void
>('connection/ConnectRequest');
export const TestConnectionRequest = new RequestType<
  { conn: ConnectionInterface; password?: string },
  ConnectionInterface,
  Error,
  void
>('connection/TestConnectionRequest');
export const DisconnectRequest = new RequestType<
  { conn: ConnectionInterface },
  void,
  Error,
  void
>('connection/DisconnectRequest');
export const ConnectionDataUpdatedRequest = new RequestType<
  {
    conn: ConnectionInterface;
    tables: DatabaseInterface.Table[];
    columns: DatabaseInterface.TableColumn[];
    functions: DatabaseInterface.Function[];
  },
  void,
  Error,
  void
>('connection/ConnectionDataUpdatedRequest');
export const GetConnectionDataRequest = new RequestType<
  { conn: ConnectionInterface },
  {
    tables: DatabaseInterface.Table[];
    columns: DatabaseInterface.TableColumn[];
    functions: DatabaseInterface.Function[];
  },
  Error,
  void
>('connection/GetConnectionDataRequest');

export const SaveResultsRequest = new RequestType<
  { connId: string, filename: string, query: string, filetype: 'json' | 'csv' },
  void,
  Error,
  void
>('connection/SaveResultsRequest');


// @TODO: later this will be replace by the native library when available
export interface ProgressNotificationStartParams {
  title: string;
  message: string;
  id: string;
};
export const ProgressNotificationStart = new NotificationType<ProgressNotificationStartParams, void>('sqltools/window/progress/start');

export interface ProgressNotificationCompleteParams {
  title?: string;
  message?: string;
  id: string;
};
export const ProgressNotificationComplete = new NotificationType<ProgressNotificationCompleteParams, void>('sqltools/window/progress/complete');

