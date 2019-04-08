import Connection from '@sqltools/core/connection';
import { DatabaseInterface } from '@sqltools/core/plugin-api';

function Connect(conn: Connection) {
  return { type: Connect.type, payload: conn };
}
Connect.type = 'Connect';

function Disconnect(conn: Connection) {
  return { type: Disconnect.type, payload: conn };
}
Disconnect.type = 'Disconnect';

function QuerySuccess(conn: Connection, { results }: { results: DatabaseInterface.QueryResults[] }) {
  return { type: QuerySuccess.type, payload: { conn, results } };
}
QuerySuccess.type = 'QuerySuccess';

function ConnectionData(
  conn: Connection,
  data: {
    tables: DatabaseInterface.Table[];
    columns?: DatabaseInterface.TableColumn[];
    functions: DatabaseInterface.Function[];
  }
) {
  return { type: ConnectionData.type, payload: { conn, ...data } };
}
ConnectionData.type = 'ConnectionData';



export default {
  Connect,
  Disconnect,
  QuerySuccess,
  ConnectionData,
}