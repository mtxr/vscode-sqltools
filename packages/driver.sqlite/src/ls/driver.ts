import SQLiteLib from 'sqlite3';
import AbstractDriver from '@sqltools/base-driver';
import queries from './queries';
import * as mkdir from 'make-dir';
import { dirname } from 'path';
import { IConnectionDriver, MConnectionExplorer, NSDatabase, ContextValue, Arg0 } from '@sqltools/types';
import { parse as queryParse } from '@sqltools/util/query';
import generateId from '@sqltools/util/internal-id';
import keywordsCompletion from './keywords';

const SQLite3Version = '5.1.7';

export default class SQLite extends AbstractDriver<SQLiteLib.Database, any> implements IConnectionDriver {

  public readonly deps: typeof AbstractDriver.prototype['deps'] = [{
    type: AbstractDriver.CONSTANTS.DEPENDENCY_PACKAGE,
    name: 'sqlite3',
    version: SQLite3Version,
  }];


  queries = queries;

  private get lib() {
    return this.requireDep('sqlite3') as SQLiteLib.sqlite3;
  }

  createDirIfNotExists = async () => {
    if (this.credentials.database.toLowerCase() === ':memory:') return;

    const baseDir = dirname(await this.getDatabase());
    mkdir.sync(baseDir);
  }
  private getDatabase = () => this.toAbsolutePath(this.credentials.database);

  public async open() {
    if (this.connection) {
      return this.connection;
    }

    await this.createDirIfNotExists();
    const db = await new Promise<SQLiteLib.Database>(async (resolve, reject) => {
      try {
        const instance = new (this.lib).Database(await this.getDatabase(), (err) => {
          if (err) return reject(err);
          return resolve(instance);
        });
      } catch (error) {
        reject(error);
      }
    });

    this.connection = Promise.resolve(db);
    return this.connection;
  }

  public async close() {
    if (!this.connection) return Promise.resolve();
    const db = await this.connection
    await new Promise<void>((resolve, reject) => {
      db.close(err => err ? reject(err) : resolve());
    });
    this.connection = null;
  }

  private runSingleQuery(db: SQLiteLib.Database, query: string) {
    return new Promise<any[]>((resolve, reject) => {
      db.all(query,(err, rows) => {
        if (err) return reject(err);
        return resolve(rows);
      })
    });
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = async (query, opt = {}) => {
    const db = await this.open();
    const { requestId } = opt;
    const queries = queryParse(query.toString()).filter(Boolean);
    let resultsAgg: NSDatabase.IResult[] = [];
    for (let q of queries) {
      const results: any[][] = (await this.runSingleQuery(db, q)) || [];
      const messages = [];
      if (results.length === 0 && q.toLowerCase() !== 'select') {
        messages.push(this.prepareMessage(`${results.length} rows were affected.`));
      }
      resultsAgg.push(<NSDatabase.IResult>{
        requestId,
        resultId: generateId(),
        connId: this.getId(),
        cols: results && results.length ? Object.keys(results[0]) : [],
        messages,
        query: q,
        results,
      });
    }
    return resultsAgg;
  }

  public async testConnection() {
    await this.open()
    await this.query('SELECT 1', {});
  }

  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
          { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
        ];
      case ContextValue.TABLE:
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchColumns(item as NSDatabase.ITable));
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
    }
    return [];
  }

  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema));
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema));
    }
    return [];
  }

  public searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.searchTables({ search }));
      case ContextValue.COLUMN:
        return this.queryResults(this.queries.searchColumns({ search, ...extraParams }));
    }
  }
  public getStaticCompletions = async () => {
    return keywordsCompletion;
  }
}