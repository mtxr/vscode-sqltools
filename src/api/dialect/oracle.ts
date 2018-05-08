import { Client } from 'oracledb';
import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from './../interface';
import Utils from './../utils';

export default class Oracle implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    
    describeTable: `Select *  
                      from dba_tables
                     where upper(table_name) like upper('%:table%')`,

    fetchColumns: ` Select t.TABLE_NAME AS tableName, 
                           t.COLUMN_NAME AS columnName,
                           t.data_type AS type, 
                           t.data_length  AS size,
                           t.owner  AS tableSchema   
                      from dba_tab_columns t
                     where upper(t.TABLE_NAME) like upper('%:table%')
                       and upper(t.COLUMN_NAME) like upper('%:column_name%')`,

    fetchRecords: 'SELECT * FROM :table where rownum <= :limit',
    
    fetchTables: `Select table_name AS tableName,
                              owner AS tableSchema,
                    tablespace_name AS tableCatalog,
                                 0 AS isView
                    from dba_tables
                   GROUP by TABLE_NAME,
                            owner,
                            tablespace_name
                  ORDER BY TABLE_NAME `,
 
    fetchViews: `Select view_name AS tableName,
                           owner  AS tableSchema,
                               1  AS isView
                     from dba_views t
                    GROUP by view_name,
                             owner
                    ORDER BY view_name`,              
  } as DialectQueries;
  constructor(public credentials: ConnectionCredentials) {

  }

  public open() {
    if (this.connection) {
      return this.connection;
    }
    const options = {
      database: this.credentials.database,
      host: this.credentials.server,
      password: this.credentials.password,
      port: this.credentials.port,
      statement_timeout: this.credentials.connectionTimeout * 1000,
      user: this.credentials.username,
    };
    const self = this;
    const client = new Client(options);
    return client.connect()
      .then(() => {
        this.connection = Promise.resolve(client);
        return this.connection;
      });
  }

  public close() {
    if (!this.connection) return Promise.resolve();

    return this.connection.then((client) => client.end());
  }

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.open()
      .then((conn) => conn.query(query))
      .then((results: any[] | any) => {
        const queries = query.split(/\s*;\s*(?=([^']*'[^']*')*[^']*$)/g);
        const messages = [];
        if (!Array.isArray(results)) {
          results = [ results ];
        }

        return results.map((r, i) => {
          if (r.rows.length === 0 && r.command.toLowerCase() !== 'select') {
            messages.push(`${r.rowCount} rows were affected.`);
          }
          return {
            cols: r.rows.length > 0 ? Object.keys(r.rows[0]) : [],
            messages,
            query: queries[i],
            results: r.rows,
          };
        });
      });
  }

  public getTables(): Promise<DatabaseInterface.Table[]> {
    return this.query(this.queries.fetchTables)
      .then(([queryRes]) => {
        return queryRes.results
          .reduce((prev, curr) => prev.concat(curr), [])
          .map((obj) => {
            return {
              name: obj.tablename,
              isView: !!obj.isview,
              numberOfColumns: parseInt(obj.numberofcolumns, 10),
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableSchema: obj.tableschema,
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
              columnName: obj.columnname,
              defaultValue: obj.defaultvalue,
              isNullable: !!obj.isnullable ? obj.isnullable.toString() === 'yes' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableName: obj.tablename,
              tableSchema: obj.tableschema,
              type: obj.type,
            } as DatabaseInterface.TableColumn;
          })
          .sort();
      });
  }

  public describeTable(table: string) {
    return this.query(Utils.replacer(this.queries.describeTable, { table }));
  }

  public showRecords(table: string, limit: number = 10) {
    return this.query(Utils.replacer(this.queries.fetchRecords, { limit, table }));
  }
}
