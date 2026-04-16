import { NSDatabase } from '@sqltools/types';

export const pgCheckEscape = (w: string | { label: string }) =>
  /[^a-z0-9_]/.test((<any>w).label || w)
    ? `"${(<any>w).label || w}"`
    : (<any>w).label || w;


function escapeTableName(table: Partial<NSDatabase.ITable> | string) {
  let items: string[] = [];
  let tableObj = typeof table === 'string' ? <NSDatabase.ITable>{ label: table } : table;
  tableObj.database && items.push(pgCheckEscape(tableObj.database));
  tableObj.schema && items.push(pgCheckEscape(tableObj.schema));
  items.push(pgCheckEscape(tableObj.label));
  return items.join('.');
}

export default escapeTableName;
