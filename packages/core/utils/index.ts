import * as query from './query';
import * as persistence from './persistence';
import { ConnectionCredentials, SerializedConnection } from '../interface';

export * from './get-home';
export * from './replacer';
export * from './telemetry';
export * from './timer';

export function sortText(a: string, b: string) { return a.toString().localeCompare(b.toString()); }

export function getDbId(c: SerializedConnection | ConnectionCredentials) {
  return `${c.name}#${c.database}#${c.dialect}`;
}

export { query, persistence };
