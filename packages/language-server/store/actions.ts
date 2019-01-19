import Connection from '@sqltools/core/connection';
import { DatabaseInterface } from '@sqltools/core/interface';

export function Connect(conn: Connection) {
  return { type: Connect.type, payload: conn };
}
Connect.type = 'Connect';

export function Disconnect(conn: Connection) {
  return { type: Disconnect.type, payload: conn };
}
Disconnect.type = 'Disconnect';

export function QuerySuccess(conn: Connection, query: string, results: DatabaseInterface.QueryResults) {
  return { type: QuerySuccess.type, payload: { conn, query, results } };
}
QuerySuccess.type = 'QuerySuccess';