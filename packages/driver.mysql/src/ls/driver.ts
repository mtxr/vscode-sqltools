import AbstractDriver from '@sqltools/base-driver';
import * as Queries from './queries';
import MySQLX from './xprotocol';
import MySQLDefault from './default';
// import compareVersions from 'compare-versions';
import { IConnectionDriver, IConnection, NSDatabase, Arg0, MConnectionExplorer, ContextValue } from '@sqltools/types';
import generateId from '@sqltools/util/internal-id';
import keywordsCompletion from './keywords';

const toBool = (v: any) => v && (v.toString() === '1' || v.toString().toLowerCase() === 'true' || v.toString().toLowerCase() === 'yes');

export default class MySQL<O = any> extends AbstractDriver<any, O> implements IConnectionDriver {
  queries = Queries;
  private driver: AbstractDriver<any, any>;

  constructor(public credentials: IConnection, getWorkSpaceFolders) {
    // move to diferent drivers
    super(credentials, getWorkSpaceFolders);
    if (this.credentials.mysqlOptions && this.credentials.mysqlOptions.authProtocol === 'xprotocol') {
      this.driver = new MySQLX(credentials, getWorkSpaceFolders);
    } else {
      this.driver = new MySQLDefault(credentials, getWorkSpaceFolders);
    }
  }
  public open() {
    return this.driver.open();
  }

  public close() {
    return this.driver.close();
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = (query, opt = {}) => {
    return this.driver.query(query, opt)
    .catch(err => {
      if (opt.throwIfError) {
        throw new Error(err.message);
      }
      return [<NSDatabase.IResult>{
        connId: this.getId(),
        requestId: opt.requestId,
        resultId: generateId(),
        cols: [],
        messages: [
          this.prepareMessage ([
            (err && err.message || err.toString()),
          ].filter(Boolean).join(' '))
        ],
        error: true,
        rawError: err,
        query,
        results: [],
      }];
    });
  }

  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        return this.queryResults(this.queries.fetchDatabases(item));
      case ContextValue.TABLE:
      case ContextValue.VIEW:
        return this.getColumns(item as NSDatabase.ITable);
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
      case ContextValue.DATABASE:
        return <MConnectionExplorer.IChildItem[]>[
          { label: 'Tables', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.TABLE },
          { label: 'Views', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.VIEW },
          // { label: 'Functions', type: ContextValue.RESOURCE_GROUP, iconId: 'folder', childType: ContextValue.FUNCTION },
        ];
    }
    return [];
  }
  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.fetchTables(parent as NSDatabase.ISchema)).then(res => res.map(t => ({ ...t, isView: toBool(t.isView) })));
      case ContextValue.VIEW:
        return this.queryResults(this.queries.fetchViews(parent as NSDatabase.ISchema)).then(res => res.map(t => ({ ...t, isView: toBool(t.isView) })));
      case ContextValue.FUNCTION:
        return this.queryResults(this.queries.fetchFunctions(parent as NSDatabase.ISchema));
    }
    return [];
  }

  public searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    switch (itemType) {
      case ContextValue.TABLE:
        return this.queryResults(this.queries.searchTables({ search })).then(r => r.map(t => {
          t.isView = toBool(t.isView);
          return t;
        }));
      case ContextValue.COLUMN:
        return this.queryResults(this.queries.searchColumns({ search, ...extraParams })).then(r => r.map(c => {
          c.isFk = toBool(c.isFk);
          c.isFk = toBool(c.isFk);
          return c;
        }));
    }
  }

  private async getColumns(parent: NSDatabase.ITable): Promise<NSDatabase.IColumn[]> {
    const results = await this.queryResults(this.queries.fetchColumns(parent));
    return results.map((obj) => {
      obj.isPk = toBool(obj.isPk);
      obj.isFk = toBool(obj.isFk);

      return <NSDatabase.IColumn>{
        ...obj,
        isNullable: toBool(obj.isNullable),
        iconName: obj.isPk ? 'pk' : (obj.isFk ? 'fk' : null),
        childType: ContextValue.NO_CHILD,
        table: parent
      };
    });
  }

  // public async getFunctions(): Promise<NSDatabase.IFunction[]> {
  //   const functions = await (
  //     await this.is55OrNewer()
  //       ? this.driver.query(this.queries.fetchFunctions)
  //       : this.driver.query(this.queries.fetchFunctionsV55Older)
  //   );

  //   return functions[0].results
  //     .reduce((prev, curr) => prev.concat(curr), [])
  //     .map((obj) => {
  //       return {
  //         ...obj,
  //         args: obj.args ? obj.args.split(/, */g) : [],
  //         database: obj.dbname,
  //         schema: obj.dbschema,
  //       } as NSDatabase.IFunction;
  //     })
  // }

  // mysqlVersion: string = null;

  // private async getVersion() {
  //   if (this.mysqlVersion) return Promise.resolve(this.mysqlVersion);
  //   this.mysqlVersion = await this.queryResults<any>(`SHOW variables WHERE variable_name = 'version'`).then((res) => res[0].Value);
  //   return this.mysqlVersion;
  // }

  // private async is55OrNewer() {
  //   try {
  //     await this.getVersion();
  //     return compareVersions.compare(this.mysqlVersion, '5.5.0', '>=');
  //   } catch (error) {
  //     return true;
  //   }
  // }

  private completionsCache: { [w: string]: NSDatabase.IStaticCompletion } = null;
  public getStaticCompletions = async () => {
    if (this.completionsCache) return this.completionsCache;
    try {
      this.completionsCache = {};
      const items = await this.queryResults(/* sql */`
      SELECT UPPER(word) AS label,
        (
          CASE
            WHEN reserved = 1 THEN 'RESERVED KEYWORD'
            ELSE 'KEYWORD'
          END
        ) AS "desc"
      FROM INFORMATION_SCHEMA.KEYWORDS
      ORDER BY word ASC
      `);

      items.forEach((item: any) => {
        this.completionsCache[item.label] = {
          label: item.label,
          detail: item.label,
          filterText: item.label,
          sortText: (['SELECT', 'CREATE', 'UPDATE', 'DELETE'].includes(item.label) ? '2:' : '') + item.label,
          documentation: {
            value: `\`\`\`yaml\nWORD: ${item.label}\nTYPE: ${item.desc}\n\`\`\``,
            kind: 'markdown'
          }
        }
      });
    } catch (error) {
      // use default reserved words
      this.completionsCache = keywordsCompletion;
    }

    return this.completionsCache;
  }
}