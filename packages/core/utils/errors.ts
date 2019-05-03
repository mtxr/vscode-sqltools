import { ConnectionInterface } from '../interface';
import { ResponseError } from 'vscode-jsonrpc';

class DecoratedException<A> extends ResponseError<A> {
  constructor(error: Error & { code?: number; data?: A }, data: A) {
    super(error.code || -1, error.message, { ...error.data, ...data });
    this.name = error.name || 'DecoratedException';
    this.stack = error.stack;
  }
}

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
  return new DecoratedException<typeof e.data>(e, data);
}