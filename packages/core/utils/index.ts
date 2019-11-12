import path from 'path';
import * as query from './query';
import commandExists from './command-exists';
import { ConnectionInterface, DatabaseDriver } from '../interface';
export * from './persistence';
export * from './replacer';
export * from './timer';
export * from './get-connection-stuff';

export function sortText(a: string, b: string) { return a.toString().localeCompare(b.toString()); }

export function asArray<T>(obj: any) {
  if (Array.isArray(obj)) {
    return obj as T[];
  }
  return Object.keys(obj).map((k) => obj[k]) as T[];
}

export function getConnectionDescription(c: ConnectionInterface): string | null {
  if (!c) return null;

  if (c.driver === DatabaseDriver.SQLite) {
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

export function isEmpty(v?: string | any[]) {
  return !v || v.length === 0;
}

export function numericVersion(v: string) {
  const n: number[] = v.replace(/^v/, '').split('.')
    .map((a) => parseInt(a.replace(/\D+/, ''), 10));
  if (n.length >= 3) return n[0] * 10000 + n[1] * 100 + n[2];
  if (n.length === 2) return n[0] * 10000 + n[1] * 100;
  return n[0] * 10000;
}

export { query, commandExists };
