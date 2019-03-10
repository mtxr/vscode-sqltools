import * as query from './query';
import commandExists from './command-exists';
import { ConnectionInterface, DatabaseDialect } from '../interface';
export * from './get-home';
export * from './replacer';
export * from './telemetry';
export * from './timer';

const idSep = '|';

export function sortText(a: string, b: string) { return a.toString().localeCompare(b.toString()); }

export function getConnectionId(c: ConnectionInterface): string | null {
  if (!c) return null;
  return c.id || `${c.name}${idSep}${c.database}${idSep}${c.dialect}`;
}

export function getNameFromId(id: string) {
  if (!id) return null;
  return id.split(idSep)[0];
}

export function asArray(obj: any) {
  if (Array.isArray(obj)) {
    return obj;
  }
  return Object.keys(obj).map((k) => obj[k]);
}

export function getConnectionDescription(c: ConnectionInterface): string | null {
  if (!c) return null;

  if (c.dialect === DatabaseDialect.SQLite) {
    return `file://${c.database}`;
  }
  return [
    c.username,
    c.username ? '@' : '',
    c.server,
    c.server && c.port ? ':' : '',
    c.port,
    '/',
    c.database,
  ].filter(Boolean).join('');
}

export function isEmpty(v?: string) {
  return !v || v.length === 0;
}

export { query, commandExists };
