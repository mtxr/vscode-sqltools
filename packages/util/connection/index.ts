import { IConnection } from '@sqltools/types';
import path from 'path';
export const idSep = '|';

export function getConnectionId(c: IConnection): string | null {
  c = migrateConnectionSetting(c);
  if (!c)
    return null;
  if (c.id) return c.id;

  const parts = [c.name, c.driver];
  if (c.connectString) {
    parts.push(c.connectString);
  } else {
    parts.push(
      c.server,
      c.database
    );
  }
  return parts.join(idSep).replace(/\./g, ':').replace(/\//g, '\\');
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

export function getConnectionDescription(c: IConnection): string | null {
  if (!c) return null;

  if (/workspaceFolder:/.test(c.database)) {
    return c.database.replace(/\$\{workspaceFolder:(.+)}/g, '$1').replace(/\$\{workspaceFolder}/g, '.');
  }

  if (c.connectString) {
    return c.connectString.replace(/(.+):.+@/gi, '$1@'); // removes password from string
  }
  return [
    c.username,
    c.username ? '@' : '',
    !c.socketPath && c.server,
    !c.socketPath && c.server && c.port ? ':' : '',
    c.socketPath && `socket:${path.basename(c.socketPath)}`,
    c.port,
    '/',
    c.database,
  ].filter(Boolean).join('');
}