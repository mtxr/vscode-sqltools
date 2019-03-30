import { DatabaseInterface } from '@sqltools/core/interface';
import Connection from '@sqltools/core/connection';

export interface ConnectionManagerState {
  lastUsedId: string;
  activeConnections: { [id: string]: Connection };
  queryResults: {
    [connection_id: string]: {
      [query: string]: DatabaseInterface.QueryResults
    }
  };
  connectionInfo: {
    [id: string]: {
      tables: DatabaseInterface.Table[];
      columns: DatabaseInterface.TableColumn[];
    };
  };
}

const initialState: ConnectionManagerState = {
  lastUsedId: undefined,
  activeConnections: {},
  queryResults: {},
  connectionInfo: {},
}

export default initialState;