import { ConnectionInterface } from '../interface';
import { ResponseError } from 'vscode-jsonrpc';

export function decorateException(e: Error & { code?: number; data?: { [key: string]: any } }, { conn }: { conn?: ConnectionInterface } = {}) {
  let data: { [key: string]: any } = {};
  if (conn && conn.dialect) {
    data.dialect = conn.dialect;
    data.dialectOptions = {
      mssqlOptions: conn.mssqlOptions,
      mysqlOptions: conn.mysqlOptions,
      pgOptions: conn.pgOptions,
      oracleOptions: JSON.stringify(conn.oracleOptions),
    };
  }
  e = new ResponseError<typeof e.data>(e.code || -1, e.message, { ...e.data, ...data });

  return e;
}