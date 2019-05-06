import MSSQLLib, { IResult } from 'mssql';
//process.env.DBCAPI_API_DLL='/Users/i022021/dev/node/vscode-sqltools/node_modules/@sap/hana-client/prebuilt/darwinintel64-xcode7';

import {
  ConnectionDialect,
  ConnectionInterface,
} from '@sqltools/core/interface';
import * as Utils from '@sqltools/core/utils';
import queries from './queries';
import GenericDialect from '@sqltools/core/dialect/generic';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
//import hanaClient from '@sap/hana-client';


var path = require('path');
var fs = require('fs');

if (process.platform === 'darwin') {
  process.env['DBCAPI_API_DLL'] = path.join(__dirname, 'prebuilt/darwinintel64-xcode7/libdbcapiHDB.dylib');
} else {
  process.env['DBCAPI_API_DLL'] = path.join(__dirname, 'prebuilt/linuxx86_64-gcc48/libdbcapiHDB.so');
}

let platformPath = 'linuxx86_64-gcc48';

if (process.platform === 'darwin') {
  platformPath = 'darwinintel64-xcode7';
//} else if (process.platform === 'windows') {
//  platformPath = 'ntamd64-msvc2010';
} 

let modulePath = path.join(__dirname, 'prebuilt', platformPath, 'hana-client_v10.node');
console.info('hana-client module path: ' + modulePath);
console.log('hana-client module path: ' + modulePath);
let hanaClient;
try {
  let stat = fs.statSync(modulePath);
  hanaClient = eval('require')(modulePath);
} catch (e) {
  console.error('module not found' + JSON.stringify(e));  
}


export default class SAPHana extends GenericDialect<MSSQLLib.ConnectionPool> implements ConnectionDialect {
  queries = queries;
  private schema: String;

  public async open(encrypt?: boolean): Promise<any> {
    if (this.connection) {
      return this.connection;
    }

    return new Promise<any>((resolve, reject) => {
      const connOptions = {
        host: this.credentials.server,
        port: this.credentials.port,
        user: this.credentials.username,
        password: this.credentials.password
      };
      try {
        let client = hanaClient.createClient(connOptions);
  
        client.connect(err => {
          if (err) {
              console.error("Connection to HANA failed", err);
              reject(err);
          }
          console.log("Connection to SAP Hana succedded!");
          this.connection = client;
          this.schema = this.credentials.database;
          resolve(this.connection);
        });
      } catch (e){
        console.error("Connection to HANA failed", encodeURI);
        reject(e);
      }
    });
  }

  public async close() {
    if (!this.connection) return Promise.resolve();


    //await this.connection.close();
    this.connection = null;
  }

  public async testConnection?() {
    await this.open();  
    this.connection.exec('select 1 from dummy;');
  }

  public async query(query: string): Promise<DatabaseInterface.QueryResults[]> {
    await this.open();
    return new Promise<DatabaseInterface.QueryResults[]>((resolve, reject) => {
      this.connection.exec(query, (err, rows) => {
        if (err) {
          let messages: string[] = [];
          if (err.message) {
            messages.push(err.message);
          }

          return resolve([{
            connId:"1",
            error: err,
            results:[],
            cols:[],
            query:query,
            messages: messages
          } as DatabaseInterface.QueryResults]);
        }
        let cols : string[] = [];
        if (rows.length > 0) {
          for (let colName in rows[0]) {
            cols.push(colName);
          }
        }

        let res = {
          connId:"1",
          results:rows,
          cols:cols,
          query:query,
          messages: []
        } as DatabaseInterface.QueryResults
        resolve([res]);
      });
    });
  }

  public async getTables(): Promise<DatabaseInterface.Table[]> {
    let query = "SELECT A.TABLE_NAME AS \"Table\", Count(B.COLUMN_NAME) AS COL_NUM FROM  M_CS_TABLES A INNER JOIN M_CS_COLUMNS B ON (A.TABLE_NAME = B.TABLE_NAME AND A.SCHEMA_NAME = B.SCHEMA_NAME) WHERE A.SCHEMA_NAME = '" + this.schema + "' GROUP BY A.TABLE_NAME";
    return this.query(query).then(results => {
      let tables = [];
      if (results.length == 1) {
        let result = results[0];
        if (result.error) {
          throw(result.error);
        }
        for (let i=0;i<result.results.length; i++) {
          tables.push(
              {
                name: result.results[i]["Table"],
                isView: false,
                numberOfColumns: result.results[i]["COL_NUM"],
                tableCatalog: '',
                tableDatabase: '',
                tableSchema: '',
                tree: undefined,
              } as DatabaseInterface.Table
            );
        }
      }
      return tables;
    });
  }

  public async getColumns(): Promise<DatabaseInterface.TableColumn[]> {
    let query = "SELECT TABLE_NAME, COLUMN_NAME FROM  M_CS_COLUMNS WHERE SCHEMA_NAME = '" + this.schema + "'";
    return this.query(query).then(results => {
     let cols = [];
     if (results.length == 1) {
       let result = results[0];
       if (result.error) {
         throw(result.error);
       }
       for (let i=0;i<result.results.length; i++) {
         cols.push(
             {  
                tableName: result.results[i]["TABLE_NAME"],
                columnName: result.results[i]["COLUMN_NAME"],
                type: '',
                size: 50,
                tableSchema: '',
                tableDatabase: '',
                tableCatalog: '',
                defaultValue: undefined,
                isNullable: true,
                isPk: false,
                isFk: false,
                columnKey: undefined,
                extra: undefined           
             } as DatabaseInterface.TableColumn);
       }
      }
      return cols;
    });
  }

  public async getFunctions() {
    return [];
    }
}
