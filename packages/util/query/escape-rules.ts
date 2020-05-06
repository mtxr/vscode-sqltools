export const pgCheckEscape = (w: string | { label: string }) =>
  /[^a-z0-9_]/.test((<any>w).label || w)
    ? `"${(<any>w).label || w}"`
    : (<any>w).label || w;
