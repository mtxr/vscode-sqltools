import MSSQLLib, { IResult, Binary } from 'mssql';
import { replacer } from '@sqltools/util/text';
import queries from './queries';
import AbstractDriver from '@sqltools/base-driver';
import get from 'lodash/get';
import { IConnectionDriver, NSDatabase } from '@sqltools/types';
import { parse as queryParse } from '@sqltools/util/query';

export default class MSSQL extends AbstractDriver<MSSQLLib.ConnectionPool, any> implements IConnectionDriver {
  queries = queries;

  private retryCount = 0;
  public async open(encryptOverride?: boolean) {
    if (this.connection) {
      return this.connection;
    }

    const { encrypt, ...mssqlOptions }: any = this.credentials.mssqlOptions || { encrypt: true };

    let encryptAttempt = typeof encrypt !== 'undefined'
      ? encrypt : true;
    if (typeof encryptOverride !== 'undefined') {
      encryptAttempt = encryptOverride;
    }

    if (this.credentials.askForPassword && get(mssqlOptions, 'authentication.type') && get(mssqlOptions, 'authentication.options.userName')) {
      mssqlOptions.authentication.options.password = mssqlOptions.authentication.options.password || this.credentials.password;
      this.credentials.password = null;
    }


    const pool = new MSSQLLib.ConnectionPool(this.credentials.connectString || {
      database: this.credentials.database,
      connectionTimeout: this.credentials.connectionTimeout * 1000,
      server: this.credentials.server,
      user: this.credentials.username,
      password: this.credentials.password,
      domain: this.credentials.domain || undefined,
      port: this.credentials.port,
      ...mssqlOptions,
      options: {
        ...((mssqlOptions || {}).options || {}),
        encrypt: encryptAttempt,
      },
    });

    await new Promise((resolve, reject) => {
      pool.on('error', reject);
      pool.connect().then(resolve).catch(reject);
    }).catch(e => {
      if (this.retryCount === 0) {
        this.retryCount++;
        return this.open(!encryptAttempt)
        .catch(() => {
          this.retryCount = 0;
          return Promise.reject(e);
        });
      }
      return Promise.reject(e);
    });

    this.connection = Promise.resolve(pool);

    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();

    const pool = await this.connection;
    await pool.close();
    this.connection = null;
  }

  public async query(query: string): Promise<NSDatabase.IResult[]> {
    const pool = await this.open();
    const request = pool.request();
    request.multiple = true;
    query = query.replace(/^[ \t]*GO;?[ \t]*$/gmi, '');
    const { recordsets = [], rowsAffected, error } = <IResult<any> & { error: any }>(await request.query(query).catch(error => Promise.resolve({ error, recordsets: [], rowsAffected: [] })));
    const queries = queryParse(query, 'mssql');
    return queries.map((q, i): NSDatabase.IResult => {
      const r = recordsets[i] || [];
      const columnNames = [];
      const bufferCols = [];
      Object.values((<any>r).columns || []).forEach((col: any) => {
        columnNames.push(col.name);
        if (col && col.type && col.type.name === Binary.name) {
          bufferCols.push(col.name);
        }
      })
      const messages = [];
      if (error) {
        messages.push(error.message || error.toString());
      }
      if (typeof rowsAffected[i] === 'number')
        messages.push(`${rowsAffected[i]} rows were affected.`);

      return {
        connId: this.getId(),
        cols: columnNames,
        messages,
        error,
        query: q,
        results: Array.isArray(r) ? r.map((row) => {
          bufferCols.forEach(c => {
            try {
              row[c] = `0x${Buffer.from(row[c]).toString('hex').toUpperCase()}`
            } catch (_ee) {}
          })
          return row;
        }) : [],
      };
    })
  }

  public getTables(): Promise<NSDatabase.ITable[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.tableName,
              isView: !!obj.isView,
              numberOfColumns: parseInt(obj.numberOfColumns, 10),
              tableCatalog: obj.tableCatalog,
              tableDatabase: obj.dbName,
              tableSchema: obj.tableSchema,
              tree: obj.tree,
            } as NSDatabase.ITable;
          });
      });
  }

  public getColumns(): Promise<NSDatabase.IColumn[]> {
    return this.query(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return <NSDatabase.IColumn>{
              ...obj,
              isNullable: !!obj.isNullable ? obj.isNullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableDatabase: obj.dbName,
              isPk: (obj.constraintType || '').toLowerCase() === 'primary key',
              isFk: (obj.constraintType || '').toLowerCase() === 'foreign key',
              tree: obj.tree,
            };
          });
      });
  }

  public getFunctions(): Promise<NSDatabase.IFunction[]> {
    return this.query(this.queries.fetchFunctions)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              ...obj,
              source: obj.source || '',
              args: obj.args ? obj.args.split(/, */g) : [],
              database: obj.dbName,
              schema: obj.dbSchema,
            } as NSDatabase.IFunction;
          });
      });
  }

  public describeTable(prefixedTable: string) {
    prefixedTable.split('].[').reverse().join('], [');
    return this.query(replacer(this.queries.describeTable, { table: prefixedTable.split(/\.(?=\[)/g).reverse().join(',') }));
  }
}
