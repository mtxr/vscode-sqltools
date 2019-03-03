import * as query from './query';
import commandExists from './command-exists';
import { ConnectionInterface, DatabaseDialect } from '../interface';

export * from './get-home';
export * from './replacer';
export * from './telemetry';
export * from './timer';

export function sortText(a: string, b: string) { return a.toString().localeCompare(b.toString()); }

export function getDbId(c: ConnectionInterface): string | null {
  if (!c) return null;
  return `${c.name}#${c.database}#${c.dialect}`;
}

export function getDbDescription(c: ConnectionInterface): string | null {
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

export { query, commandExists };
