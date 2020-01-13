import { RequestType, NotificationType } from 'vscode-languageserver-protocol';
import { IConnection, NSDatabase } from '@sqltools/types';
import ContextValue from './context-value';

export const GetConnectionsRequest = new RequestType<
  { connectedOnly?: boolean, sort?: 'connectedFirst' | 'name', connId?: string },
  IConnection[],
  Error,
  void
>('connection/GetConnectionsRequest');
export const RefreshTreeRequest = new RequestType<{ connIds?: string[] }, void, Error, void>(
  'connection/RefreshTreeRequest'
);
export const GetConnectionPasswordRequest = new RequestType<
  { conn: IConnection },
  string,
  Error,
  void
>('connection/GetConnectionPasswordRequest');
export const RunCommandRequest = new RequestType<
  { conn: IConnection; command: string; args: any[] },
  NSDatabase.IResult[],
  Error,
  void
>('connection/RunCommandRequest');
export const ConnectRequest = new RequestType<
  { conn: IConnection; password?: string },
  IConnection,
  Error,
  void
>('connection/ConnectRequest');
export const TestConnectionRequest = new RequestType<
  { conn: IConnection; password?: string },
  IConnection,
  Error,
  void
>('connection/TestConnectionRequest');
export const DisconnectRequest = new RequestType<
  { conn: IConnection },
  void,
  Error,
  void
>('connection/DisconnectRequest');
export const ConnectionDataUpdatedRequest = new RequestType<
  {
    conn: IConnection;
    tables: NSDatabase.ITable[];
    columns: NSDatabase.IColumn[];
    functions: NSDatabase.IFunction[];
  },
  void,
  Error,
  void
>('connection/ConnectionDataUpdatedRequest');
export const GetConnectionDataRequest = new RequestType<
  { conn: IConnection },
  {
    tables: NSDatabase.ITable[];
    columns: NSDatabase.IColumn[];
    functions: NSDatabase.IFunction[];
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

export const GetChildrenForTreeItemRequest = new RequestType<
  { conn: IConnection, contextValue: ContextValue },
  any[], // @TODO define type
  Error,
  void
>('connection/GetChildrenForTreeItemRequest');