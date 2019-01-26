import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from './../interface';
import * as Utils from '../utils';
import USQL from '../utils/usql';

export default class OracleDB implements ConnectionDialect {
  public connection: Promise<any>;
  private connectString: string;
  private queries: DialectQueries = {
    describeTable: `select * from all_tab_columns
      where table_name = ':table'
      and owner = ':schema'`,
    fetchColumns: `select
    c.table_name as tablename,
    c.column_name as columnname,
    c.data_type as type,
    c.data_length as "size",
    user as tablecatalog,
    c.owner as tableschema,
    c.owner as dbname,
    c.data_default as defaultvalue,
    c.nullable as isnullable
    from all_tab_columns c
    join (
    select table_name, owner from all_tables
    union all
    select view_name as table_name, owner from all_views
    ) v on (c.table_name = v.table_name and c.owner = v.owner)
    where c.owner not like '%SYS%'`,
    fetchRecords: 'select * from :table where rownum <= :limit',
    fetchTables: `select
    table_name as tableName,
    owner AS tableSchema,
    user AS tableCatalog,
    isview AS isView,
    owner AS dbName,
    num_rows AS numberOfColumns
    from (
    select t.table_name, t.owner, user, 0 as isview, count(1) as num_rows
    from all_tables t
    join all_tab_columns c on c.table_name = t.table_name and c.owner = t.owner
    group by t.owner, t.table_name, user
    union all
    select v.view_name as table_name, v.owner, user, 1 as isview, count(1) as num_rows
    from all_views v
    join all_tab_columns c on c.table_name = v.view_name and c.owner = v.owner
    group by v.owner, v.view_name, user
    )
    where owner not like '%SYS%'`,
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {
    this.connectString = `oracle://${this.credentials.username}:${this.credentials.password}@${this.credentials.server}:${this.credentials.port}/${this.credentials.database}`;

  }

  public open() {
    this.connection = this.connection || USQL.checkAndInstall()
      .then(() => Promise.resolve(true));
    return this.connection;
  }

  public close() {
    return Promise.resolve();
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    await this.open()
    const results = await USQL.runQuery({ query, connectString: this.connectString });
    const queries = Utils.query.parse(query).filter(Boolean);
    return queries.map((query: any, index: number) => {
      const res = JSON.parse(results[index] || '{}');
      return this.prepareResults(query, res.cols, res.values, res.count);
    });
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: `${obj.TABLESCHEMA}.${obj.TABLENAME}`,
              isView: !!obj.ISVIEW,
              numberOfColumns: parseInt(obj.NUMBEROFCOLUMNS, 10),
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableSchema: obj.TABLESCHEMA,
            } as DatabaseInterface.Table;
          })
          .sort();
      });
  }

  public getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    return this.query(this.queries.fetchColumns)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              columnName: obj.COLUMNNAME,
              defaultValue: obj.DEFAULTVALUE,
              isNullable: !!obj.ISNULLABLE ? obj.ISNULLABLE.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.SIZE, 10) : null,
              tableCatalog: obj.TABLECATALOG,
              tableDatabase: obj.DBNAME,
              tableName: `${obj.TABLESCHEMA}.${obj.TABLENAME}`,
              tableSchema: obj.TABLESCHEMA,
              type: obj.TYPE,
            } as DatabaseInterface.TableColumn;
          })
          .sort();
      });
  }

  public describeTable(table: string) {
    const tableSplit = table.split('.');
    return this.query(Utils.replacer(this.queries.describeTable, { schema: tableSplit[0], table: tableSplit[1] }));
  }

  public showRecords(table: string, limit: number = 10) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }

  private prepareResults(query: string, cols: string[] = [], rowsValues: any[][] = [], count = 0): DatabaseInterface.QueryResults {
    return {
      query,
      cols,
      results: rowsValues.map(v => this.prepareRow(cols, v)),
      messages: [`${count} rows`]
    }
  }

  private prepareRow(cols: string[], results: any[]) {
    return cols.reduce((agg, c, i) => ({ ...agg, [c]: results[i] }), {});
  }
}
