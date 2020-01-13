import { IConnection } from '@sqltools/types';

export const idSep = '|';

export function getConnectionId(c: IConnection): string | null {
  c = migrateConnectionSetting(c);
  if (!c)
    return null;
  if (c.id) return c.id;

  if (c.connectString) `${c.name}${idSep}${c.connectString}`.replace(/\./g, ':').replace(/\//g, '\\')
  return `${c.name}${idSep}${c.driver}${idSep}${c.server}${idSep}${c.database}`.replace(/\./g, ':').replace(/\//g, '\\');
}

export function getNameFromId(id: string) {
  if (!id) return null;
  return id.split(idSep)[0];
}


export function migrateConnectionSetting(c: IConnection) {
  c.driver = c.driver || (<any>c).dialect;
  return c;
}

export function migrateConnectionSettings(connections: IConnection[]): IConnection[] {
  if (!connections) return connections;

  return (<IConnection[]>connections).map(migrateConnectionSetting);
}

export function getSessionBasename(connName: string) {
  return `${connName}.session.sql`;
}