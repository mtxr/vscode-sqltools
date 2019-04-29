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
  return c.id || `${c.name}${idSep}${c.database}${idSep}${c.dialect}`.replace(/\./g, ':').replace(/\//g, '\\');
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

  if (c.connectString) {
    return c.connectString.replace(/(.+):.+@/gi, '$1@'); // removes password from string
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

export function numericVersion(v: string) {
  const n: number[] = v.replace(/^v/, '').split('.')
    .map((a) => parseInt(a.replace(/\D+/, ''), 10));
  if (n.length >= 3) return n[0] * 10000 + n[1] * 100 + n[2];
  if (n.length === 2) return n[0] * 10000 + n[1] * 100;
  return n[0] * 10000;
}

export { query, commandExists };
