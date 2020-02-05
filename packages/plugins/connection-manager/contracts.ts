import { RequestType, NotificationType } from 'vscode-languageserver-protocol';
import { IConnection, NSDatabase, MConnectionExplorer } from '@sqltools/types';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

export const GetConnectionsRequest = new RequestType<
  { connectedOnly?: boolean, sort?: 'connectedFirst' | 'name', connId?: string },
  IConnection[],
  Error,
  void
>('connection/GetConnectionsRequest');
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
export const ProgressNotificationStart = new NotificationType<ProgressNotificationStartParams, void>(`${EXT_NAMESPACE}/window/progress/start`);

export interface ProgressNotificationCompleteParams {
  title?: string;
  message?: string;
  id: string;
};
export const ProgressNotificationComplete = new NotificationType<ProgressNotificationCompleteParams, void>(`${EXT_NAMESPACE}/window/progress/complete`);

export const GetChildrenForTreeItemRequest = new RequestType<
  { conn: IConnection, itemType: MConnectionExplorer.TreeItemType, itemId: string },
  MConnectionExplorer.IChildItem[], // @TODO define type
  Error,
  void
>('connection/GetChildrenForTreeItemRequest');