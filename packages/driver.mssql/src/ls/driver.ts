import MSSQLLib, { IResult, Binary } from 'mssql';
import * as Queries from './queries';
import AbstractDriver from '@sqltools/base-driver';
import get from 'lodash/get';
import { IConnectionDriver, IExpectedResult, NSDatabase, ContextValue, Arg0, MConnectionExplorer } from '@sqltools/types';
import { parse as queryParse } from '@sqltools/util/query';
import generateId from '@sqltools/util/internal-id';
import reservedWordsCompletion from './reserved-words';

export default class MSSQL extends AbstractDriver<MSSQLLib.ConnectionPool, any> implements IConnectionDriver {
  queries = Queries;

  private retryCount = 0;
  private SYSTEM_DATABASES = ['master', 'model', 'msdb', 'tempdb']
  public async open(encryptOverride?: boolean) {
    if (this.connection) {
      return this.connection;
    }

    const { encrypt, trustServerCertificate, ...mssqlOptions }: any = this.credentials.mssqlOptions || { encrypt: true };

    let encryptAttempt = typeof encrypt !== 'undefined'
      ? encrypt : true;
    if (typeof encryptOverride !== 'undefined') {
      encryptAttempt = encryptOverride;
    }

    if (this.credentials.askForPassword && get(mssqlOptions, 'authentication.type') && get(mssqlOptions, 'authentication.options.userName')) {
      mssqlOptions.authentication.options.password = mssqlOptions.authentication.options.password || this.credentials.password;
      this.credentials.password = null;
    }

    let pool: MSSQLLib.ConnectionPool;

    if (this.credentials.connectString) {
      pool = new MSSQLLib.ConnectionPool(this.credentials.connectString);
    } else {
      const poolConfig = {
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
          trustServerCertificate: trustServerCertificate,
        },
      };

      if (this.credentials.ssh === 'Enabled' && this.credentials.sshOptions) {
        const { port: localPort } = await this.createSshTunnel(
          {
            host: this.credentials.sshOptions.host,
            port: this.credentials.sshOptions.port,
            username: this.credentials.sshOptions.username,
            password: this.credentials.sshOptions.password,
            privateKeyPath: this.credentials.sshOptions.privateKeyPath,
          },
          {
            host: this.credentials.server,
            port: this.credentials.port,
          }
        );
        Object.assign(poolConfig, {
          server: 'localhost',
          port: localPort,
        });
      }

      pool = new MSSQLLib.ConnectionPool(poolConfig);
    }

    await new Promise((resolve, reject) => {
      pool.on('error', reject);
      pool.connect().then(resolve).catch(reject);
    }).catch(e => {
      // The errors below are relevant to database configuration
      if (e.code === "ESOCKET" || e.code === "ELOGIN" || e.code === "EINSTLOOKUP") {
        throw e;
      }
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

  public query: (typeof AbstractDriver)['prototype']['query'] = async (originalQuery, opt = {}) => {
    const pool = await this.open();
    const { requestId } = opt;
    const request = pool.request();
    request.multiple = true;
    const query = originalQuery.toString().replace(/^[ \t]*GO;?[ \t]*$/gmi, '');
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
        messages.push(this.prepareMessage(error.message || error.toString()));
      }
      if (typeof rowsAffected[i] === 'number')
        messages.push(this.prepareMessage(`${rowsAffected[i]} rows were affected.`));

      return {
        requestId,
        resultId: generateId(),
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

  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        const databases = await this.queryResults(this.queries.fetchDatabases());
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'System databases', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.DATABASE },
          ...databases.filter(database => !this.SYSTEM_DATABASES.includes(database.label)),
          { label: 'Instance triggers', type: ContextValue.RESOURCE_GROUP, iconId: 'server-process', childType: ContextValue.TRIGGER },
        ];
      case ContextValue.DATABASE:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Schemas', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.SCHEMA },
          { label: 'Database triggers', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TRIGGER },
        ];
      case ContextValue.SCHEMA:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
          { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
          { label: 'Functions', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.FUNCTION },
          { label: 'Procedures', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.PROCEDURE },
        ];
      case ContextValue.TABLE:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Columns', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.COLUMN },
          // { label: 'Keys', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.KEY },
          // { label: 'Constraints', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.CONSTRAINT },
          { label: 'Indexes', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.INDEX },
          { label: 'Triggers', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TRIGGER },
        ];
      case ContextValue.VIEW:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Columns', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.COLUMN },
          { label: 'Indexes', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.INDEX },
          { label: 'Triggers', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TRIGGER },
        ];
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
    }
    return [];
  }

  public async getDefinitionForItem({ item }: Arg0<IConnectionDriver['getDefinitionForItem']>) {
    let query: IExpectedResult<string>;
    switch (item.type) {
      case ContextValue.TABLE:
        query = this.queries.fetchTableDefinition(item as NSDatabase.ITable);
        break;
      case ContextValue.VIEW:
        query = this.queries.fetchViewDefinition(item as unknown as NSDatabase.ITable);
        break;
      case ContextValue.FUNCTION:
        query = this.queries.fetchFunctionDefinition(item as NSDatabase.IFunction);
        break;
      case ContextValue.PROCEDURE:
        query = this.queries.fetchProcedureDefinition(item as NSDatabase.IProcedure);
        break;
      case ContextValue.INDEX:
        query = this.queries.fetchIndexDefinition(item as NSDatabase.IIndex);
        break;
      case ContextValue.TRIGGER:
        query = this.queries.fetchTriggerDefinition(item as NSDatabase.ITrigger);
        break;
    }
    const result = await this.singleQuery(query, {});
    return result.results[0].definition;
  }

  public showRecords(table, opt) {
    return this.searchItems(ContextValue.COLUMN, '', { tables: [table], limit: 1 })
    .then(col => {
      opt.orderCol = col[0].label;
      return super.showRecords(table, opt);
    });
  }
  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.DATABASE:
        const databases = await this.queryResults(this.queries.fetchDatabases());
        return databases.filter(database => this.SYSTEM_DATABASES.includes(database.label));
      case ContextValue.SCHEMA:
        try {
          const result = await this.queryResults(
            this.queries.fetchSchemas(parent as NSDatabase.IDatabase)
          );
          return result;
        } catch (error) {
          this.close();
          return [];
        }
      case ContextValue.TABLE:
        return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema));
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema));
      case ContextValue.COLUMN:
        return this.getColumns(parent as NSDatabase.ITable);
      case ContextValue.FUNCTION:
        return this.queryResults(this.queries.searchFunctions({search: null, parent: parent as NSDatabase.ParentItem}));
      case ContextValue.PROCEDURE:
        return this.queryResults(this.queries.searchProcedures({search: null, parent: parent as NSDatabase.ParentItem}));
      case ContextValue.INDEX:
        return this.getIndexes(parent as NSDatabase.ITable)
      case ContextValue.TRIGGER:
        if (parent.type === ContextValue.CONNECTION || parent.type === ContextValue.CONNECTED_CONNECTION)
          return this.getTriggers();
        else
          return this.getTriggers(parent as (NSDatabase.IDatabase | NSDatabase.ITable));
      // case ContextValue.KEY:
      //   return [];
      // case ContextValue.CONSTRAINT:
      //   return [];
    }
    return [];
  }

  private async getColumns(parent: NSDatabase.ITable): Promise<NSDatabase.IColumn[]> {
    const results = await this.queryResults(this.queries.fetchColumns(parent));
    return results.map(col => ({
      ...col,
      iconName: col.isPk ? 'pk' : (col.isFk ? 'fk' : null),
      childType: ContextValue.NO_CHILD,
      table: parent
    }));
  }

  private async getIndexes(parent?: NSDatabase.ITable): Promise<NSDatabase.IIndex[]> {
    const results = await this.queryResults(this.queries.searchIndexes({search: null, parent: parent as NSDatabase.ITable}));
    return results.map(index => ({
      ...index,
      childType: ContextValue.NO_CHILD,
      database: parent ? parent.database : '',
      schema: parent ? parent.schema : '',
      parent: parent,
    }));
  }

  private async getTriggers(parent?: NSDatabase.IDatabase | NSDatabase.ITable): Promise<NSDatabase.ITrigger[]> {
    const results = await this.queryResults(this.queries.searchTriggers({search: null, parent: parent}));
    return results.map(trigger => ({
      ...trigger,
      iconId: 'symbol-event',
      childType: ContextValue.NO_CHILD,
      database: parent ? parent.database : '',
      schema: parent ? parent.schema : '',
      parent: parent ?? null,
    }));
  }

  public searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.TABLE:
      case ContextValue.VIEW:
        return this.queryResults(this.queries.searchTables({ search }));
      case ContextValue.COLUMN:
        return this.queryResults(this.queries.searchColumns({ search, ...extraParams }));
      case ContextValue.FUNCTION:
        return this.queryResults(this.queries.searchFunctions({ search, ...extraParams }));
      case ContextValue.PROCEDURE:
        return this.queryResults(this.queries.searchProcedures({ search, ...extraParams }));
      case ContextValue.INDEX:
        return this.queryResults(this.queries.searchIndexes({ search, ...extraParams }));
      case ContextValue.TRIGGER:
        return this.queryResults(this.queries.searchTriggers({ search, ...extraParams }));
    }
  }

  public getStaticCompletions = async () => {
    return reservedWordsCompletion;
  }

    // public getColumns(): Promise<NSDatabase.IColumn[]> {
  //   return this.query(this.queries.fetchColumns)
  //     .then(([queryRes]) => {
  //       return queryRes.results
  //         .reduce((prev, curr) => prev.concat(curr), [])
  //         .map((obj) => {
  //           return <NSDatabase.IColumn>{
  //             ...obj,
  //             isNullable: !!obj.isNullable ? obj.isNullable.toString() === 'yes' : null,
  //             size: obj.size !== null ? parseInt(obj.size, 10) : null,
  //             tableDatabase: obj.dbName,
  //             isPk: (obj.constraintType || '').toLowerCase() === 'primary key',
  //             isFk: (obj.constraintType || '').toLowerCase() === 'foreign key',
  //             tree: obj.tree,
  //           };
  //         });
  //     });
  // }

  // public getFunctions(): Promise<NSDatabase.IFunction[]> {
  //   return this.query(this.queries.fetchFunctions)
  //     .then(([queryRes]) => {
  //       return queryRes.results
  //         .reduce((prev, curr) => prev.concat(curr), [])
  //         .map((obj) => {
  //           return {
  //             ...obj,
  //             source: obj.source || '',
  //             args: obj.args ? obj.args.split(/, */g) : [],
  //             database: obj.dbName,
  //             schema: obj.dbSchema,
  //           } as NSDatabase.IFunction;
  //         });
  //     });
  // }
}
