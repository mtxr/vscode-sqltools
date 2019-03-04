import { DatabaseInterface } from '@sqltools/core/interface';
import Connection from '@sqltools/core/connection';

export interface ConnectionManagerState {
  lastUsedId: string;
  activeConnections: { [id: string]: Connection };
  queryResults: {
    [connection_id: string]: {
      [query: string]: DatabaseInterface.QueryResults
    }
  }
}

const initialState: ConnectionManagerState = {
  lastUsedId: undefined,
  activeConnections: {},
  queryResults: {}
}

export default initialState;