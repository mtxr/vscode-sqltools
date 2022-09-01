import { RequestType, NotificationType } from 'vscode-languageserver-protocol';
import { IConnection, NSDatabase, MConnectionExplorer, ContextValue, IQueryOptions } from '@sqltools/types';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

export const GetConnectionsRequest = new RequestType<
  { connectedOnly?: boolean, sort?: 'connectedFirst' | 'name', connId?: string },
  IConnection[],
  Error,
  void
>('connection/GetConnectionsRequest');

export const ForceListRefresh = new RequestType<
  void,
  void,
  Error,
  void
>('connection/ForceListRefresh');
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
export const ReleaseResultsRequest = new RequestType<
  { connId: string, requestId: string },
  void,
  Error,
  void
>('connection/ReleaseResultsRequest');
export const ConnectRequest = new RequestType<
  { conn: IConnection; password?: string, [id: string]: any },
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
export const SearchConnectionItemsRequest = new RequestType<
  { conn: IConnection; itemType: ContextValue; search: string; extraParams?: any },
  {
    results: NSDatabase.SearchableItem[];
  },
  Error,
  void
>('connection/SearchConnectionItemsRequest');

export const GetResultsRequest = new RequestType<
  IQueryOptions & { formatType: 'json' | 'csv' },
  string,
  Error,
  void
>('connection/GetResultsRequest');

export const GetChildrenForTreeItemRequest = new RequestType<
  { conn: IConnection, item: MConnectionExplorer.IChildItem, parent?: MConnectionExplorer.IChildItem },
  MConnectionExplorer.IChildItem[],
  Error,
  void
>('connection/GetChildrenForTreeItemRequest');

export const GetInsertQueryRequest = new RequestType<
  { conn: IConnection, item: NSDatabase.ITable, columns: Array<NSDatabase.IColumn>},
  string,
  Error,
  void
>('connection/GetInsertQueryRequest');


// @OPTIMIZE: later this will be replace by the native library when available
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
