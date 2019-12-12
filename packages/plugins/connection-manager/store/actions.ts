import Connection from '@sqltools/language-server/connection';
import { NSDatabase } from '@sqltools/types';

function Connect(conn: Connection) {
  return { type: Connect.type, payload: conn };
}
Connect.type = 'Connect';

function Disconnect(conn: Connection) {
  return { type: Disconnect.type, payload: conn };
}
Disconnect.type = 'Disconnect';

function QuerySuccess(conn: Connection, { results }: { results: NSDatabase.IResult[] }) {
  return { type: QuerySuccess.type, payload: { conn, results } };
}
QuerySuccess.type = 'QuerySuccess';

function ConnectionData(
  conn: Connection,
  data: {
    tables: NSDatabase.ITable[];
    columns?: NSDatabase.IColumn[];
    functions: NSDatabase.IFunction[];
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