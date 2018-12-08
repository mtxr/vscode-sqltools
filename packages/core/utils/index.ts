import * as query from './query';
import * as persistence from './persistence';

export * from './get-home';
export * from './replacer';
export * from './telemetry';
export * from './timer';

export function sortText(a: string, b: string) { return a.toString().localeCompare(b.toString()); }

export { query, persistence };
