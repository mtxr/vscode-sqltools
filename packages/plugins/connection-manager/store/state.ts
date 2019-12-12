import Connection from '@sqltools/language-server/connection';
import { NSDatabase } from '@sqltools/types';

export interface ConnectionManagerState {
  lastUsedId: string;
  activeConnections: { [id: string]: Connection };
  queryResults: {
    [connection_id: string]: {
      [query: string]: NSDatabase.IResult
    }
  };
  connectionInfo: {
    [id: string]: {
      tables: NSDatabase.ITable[];
      columns: NSDatabase.IColumn[];
      functions: NSDatabase.IFunction[];
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