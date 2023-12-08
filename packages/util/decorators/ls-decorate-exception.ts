import { IConnection } from '@sqltools/types';
import { ResponseError } from 'vscode-languageserver';

class DecoratedException<A> extends ResponseError<A> {
  constructor(error: Error & { code?: number; data?: A }, data: A) {
    super(error.code || -1, error.message, { ...error.data, ...data });
    this.name = error.name || 'DecoratedException';
    this.stack = error.stack;
  }
}

export default function decorateLSException(e: Error & { code?: number; data?: { [key: string]: any } }, { conn }: { conn?: IConnection } = {}) {
  let data: { [key: string]: any } = {};
  if (conn && conn.driver) {
    data.driver = conn.driver;
    data.driverOptions = {
      mssqlOptions: conn.mssqlOptions,
      mysqlOptions: conn.mysqlOptions,
      pgOptions: conn.pgOptions,
      oracleOptions: conn.oracleOptions,
      cqlOptions: conn.cqlOptions,
    };
  }
  return new DecoratedException<typeof e.data>(e, data);
}
