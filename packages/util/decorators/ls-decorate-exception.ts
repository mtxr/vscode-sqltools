import { IConnection } from '@sqltools/types';
import { ResponseError } from 'vscode-languageserver';

class DecoratedException<A> extends ResponseError<A> {
  constructor(error: Error & { code?: number; data?: A }, data: A) {
    super(error.code || -1, error.message, { ...error.data, ...data });
    this.name = error.name || 'DecoratedException';
    this.stack = error.stack;
  }
}

export default function decorateLSException(
  e: Error & { code?: number; data?: any },
  { conn }: { conn?: IConnection } = {}
) {
  const data: IConnection = {
    ...conn,
  };
  if (conn && conn.driver) {
    data.driver = conn.driver;
    data.driverOptions = conn.driverOptions || {
      mssqlOptions: (conn as any).mssqlOptions,
      mysqlOptions: (conn as any).mysqlOptions,
      pgOptions: (conn as any).pgOptions,
      oracleOptions: (conn as any).oracleOptions,
    };
  }
  return new DecoratedException<IConnection>(e, data);
}
