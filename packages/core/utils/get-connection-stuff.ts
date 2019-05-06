import { ConnectionInterface } from '../interface';

export const idSep = '|';

export function getConnectionId(c: ConnectionInterface): string | null {
  if (!c)
    return null;
  if (c.id) return c.id;

  if (c.connectString) `${c.name}${idSep}${c.connectString}`.replace(/\./g, ':').replace(/\//g, '\\')
  return `${c.name}${idSep}${c.dialect}${idSep}${c.server}${idSep}${c.database}`.replace(/\./g, ':').replace(/\//g, '\\');
}

export function getNameFromId(id: string) {
  if (!id) return null;
  return id.split(idSep)[0];
}
