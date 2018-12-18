import Connection from '@sqltools/core/connection';

export function Connect(conn: Connection) {
  return { type: 'connect', payload: conn };
}
Connect.type = 'connect';

export function Disconnect(conn: Connection) {
  return { type: 'disconnect', payload: conn };
}
Disconnect.type = 'disconnect';
