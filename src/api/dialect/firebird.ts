var Firebird = require('node-firebird');
import {
  ConnectionCredentials,
  ConnectionDialect,
  DatabaseInterface,
  DialectQueries,
} from './../interface';
import Utils from './../utils';

export default class fb implements ConnectionDialect {
  public connection: Promise<any>;
  private queries: DialectQueries = {
    describeTable: `SELECT * FROM INFORMATION_SCHEMA.COLUMNS
      WHERE table_name = ':table'
        AND TABLE_SCHEMA NOT IN ('pg_catalog', 'information_schema')`,


    fetchColumns: `SELECT
    RF.RDB$RELATION_NAME as tableName,
    RF.RDB$FIELD_NAME as columnName,
    RF.RDB$FIELD_POSITION FIELD_POSITION,
    CASE F.RDB$FIELD_TYPE
      WHEN 7 THEN
        CASE F.RDB$FIELD_SUB_TYPE
          WHEN 0 THEN 'SMALLINT'
          WHEN 1 THEN 'NUMERIC(' || F.RDB$FIELD_PRECISION || ', ' || (-F.RDB$FIELD_SCALE) || ')'
          WHEN 2 THEN 'DECIMAL'
        END
      WHEN 8 THEN
        CASE F.RDB$FIELD_SUB_TYPE
          WHEN 0 THEN 'INTEGER'
          WHEN 1 THEN 'NUMERIC('  || F.RDB$FIELD_PRECISION || ', ' || (-F.RDB$FIELD_SCALE) || ')'
          WHEN 2 THEN 'DECIMAL'
        END
      WHEN 9 THEN 'QUAD'
      WHEN 10 THEN 'FLOAT'
      WHEN 12 THEN 'DATE'
      WHEN 13 THEN 'TIME'
      WHEN 14 THEN 'CHAR(' || (TRUNC(F.RDB$FIELD_LENGTH / CH.RDB$BYTES_PER_CHARACTER)) || ') '
      WHEN 16 THEN
        CASE F.RDB$FIELD_SUB_TYPE
          WHEN 0 THEN 'BIGINT'
          WHEN 1 THEN 'NUMERIC(' || F.RDB$FIELD_PRECISION || ', ' || (-F.RDB$FIELD_SCALE) || ')'
          WHEN 2 THEN 'DECIMAL'
        END
      WHEN 27 THEN 'DOUBLE'
      WHEN 35 THEN 'TIMESTAMP'
      WHEN 37 THEN
       IIF (COALESCE(f.RDB$COMPUTED_SOURCE,'')<>'',
        'COMPUTED BY ' || CAST(f.RDB$COMPUTED_SOURCE AS VARCHAR(250)),
        'VARCHAR(' || (TRUNC(F.RDB$FIELD_LENGTH / CH.RDB$BYTES_PER_CHARACTER)) || ')')
      WHEN 40 THEN 'CSTRING' || (TRUNC(F.RDB$FIELD_LENGTH / CH.RDB$BYTES_PER_CHARACTER)) || ')'
      WHEN 45 THEN 'BLOB_ID'
      WHEN 261 THEN 'BLOB SUB_TYPE ' || F.RDB$FIELD_SUB_TYPE  ||   IIF (COALESCE(f.RDB$SEGMENT_LENGTH,'')<>'', ' SEGMENT SIZE ' ||f.RDB$SEGMENT_LENGTH ,'')
      ELSE 'RDB$FIELD_TYPE: ' || F.RDB$FIELD_TYPE || '?'
    END FIELD_TYPE, (TRUNC(F.RDB$FIELD_LENGTH / CH.RDB$BYTES_PER_CHARACTER)) as SIZE, '' AS tableCatalog, '' AS tableSchema,'' as dbName,
    IIF(COALESCE(RF.RDB$NULL_FLAG, 0) = 0, NULL, 'NOT NULL') FIELD_NULL,
    CH.RDB$CHARACTER_SET_NAME FIELD_CHARSET,
    DCO.RDB$COLLATION_NAME FIELD_COLLATION,
    CAST(COALESCE(RF.RDB$DEFAULT_SOURCE, F.RDB$DEFAULT_SOURCE) AS VARCHAR(256)) defaultValue,
    F.RDB$VALIDATION_SOURCE FIELD_CHECK,
    RF.RDB$DESCRIPTION FIELD_DESCRIPTION
  FROM RDB$RELATION_FIELDS RF
  JOIN RDB$FIELDS F ON (F.RDB$FIELD_NAME = RF.RDB$FIELD_SOURCE)
  LEFT OUTER JOIN RDB$CHARACTER_SETS CH ON (CH.RDB$CHARACTER_SET_ID = F.RDB$CHARACTER_SET_ID)
  LEFT OUTER JOIN RDB$COLLATIONS DCO ON ((DCO.RDB$COLLATION_ID = F.RDB$COLLATION_ID) AND (DCO.RDB$CHARACTER_SET_ID = F.RDB$CHARACTER_SET_ID))
  WHERE (COALESCE(RF.RDB$SYSTEM_FLAG, 0) = 0) AND RF.RDB$UPDATE_FLAG=1
  ORDER BY  RF.RDB$RELATION_NAME,RF.RDB$FIELD_POSITION
    
    `,

    fetchRecords: 'SELECT FIRST :limit * FROM :table ',

    fetchTables: `select r.rdb$relation_name AS tableName,
    '' AS tableSchema,
            '' AS tableCatalog,
    IIF (r.rdb$view_blr IS NULL, 0,1)    AS isView , '' AS DBNAME
    , COUNT(1) AS  numberOfColumns
    from rdb$relation_fields f
    join rdb$relations r on f.rdb$relation_name = r.rdb$relation_name
    /*r.rdb$view_blr is  NOT null and*/
    
    GROUP BY 1,2,3 ,4,5
    
    order by 1;`,
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
      user: this.credentials.username,
      lowercase_keys : this.credentials.fb_lowercase_keys, // set to true to lowercase keys
      role : this.credentials.fb_role,            // default
      pageSize : this.credentials.fb_pageSize,        // default 4096
      lc_ctype: this.credentials.fb_charset,   //default NONE
    };
    const self = this;

    //const client = new Firebird(options);
    return new Promise((resolve, reject) => {
        Firebird.attach(options, function (err, _db) {
        if (err) throw err
        else
          resolve(_db);
        //done();
        });
      
    });
   
  }

  public close() {
    //se nao tiver uma provessa..manda resolver as pormessas.
    if (!this.connection) return Promise.resolve();
    //se ja tiver resolvido a promessa connection
    //retorna um conn
    return this.connection.then((conn) => conn.detach());
  }

  public query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    return this.open()
      .then((conn) => conn.query(query , function (err, results) {
        if (err) throw err;
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


      }))      ;
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
              isNullable: !!obj.FIELDNULL ? obj.FIELDNULL.toString() === '' : null,
              size: obj.size !== null ? parseInt(obj.size, 10) : null,
              tableCatalog: obj.tablecatalog,
              tableDatabase: obj.dbname,
              tableName: obj.tablename,
              tableSchema: obj.tableschema,
              type: obj.FIELD_TYPE,
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
