import { time } from 'console'

import AbstractDriver from '@sqltools/base-driver'

import { type IConnectionDriver, type MConnectionExplorer, type NSDatabase, ContextValue, type Arg0 } from '@sqltools/types'

import { v4 as generateId } from 'uuid'

import {
    type DDB,
    DdbObj,
    SqlStandard,
    DdbForm,
    DdbType,
    type DdbOptions,
    type DdbTableObj,
    type DdbVectorStringObj,
    DdbFunctionType,
} from 'dolphindb'


import { createDDBClient } from './ddbFactory.ts'

import type { DdbConfig } from './types.ts'

import { queries } from './queries.ts'

import * as ddbUtils from './ddbUtils.ts'

/** set Driver lib to the type of your connection.
    Eg for postgres:
    import { Pool, PoolConfig } from 'pg';
    ...
    type DriverLib = Pool;
    type DriverOptions = PoolConfig;
    
    This will give you completions iside of the library */

type DriverLib = DDB
type DriverOptions = DdbConfig

// // import your actual DB library here
// import dblib from 'your-db-library';

export class dolphindbDriver extends AbstractDriver<DriverLib, DriverOptions> implements IConnectionDriver {
    
    /* If you driver depends on node packages, list it below on `deps` prop.
        It will be installed automatically on first use of your driver.     
    */
    // public override readonly deps: typeof AbstractDriver.prototype['deps'] = [{
    //     type: AbstractDriver.CONSTANTS.DEPENDENCY_PACKAGE,
    //     name: 'dolphindb',
    //     version: '3.0.210',
    //         }
    //     ];
    queries = queries
    
    /** if you need to require your lib in runtime and then
     * use `this.lib.methodName()` anywhere and vscode will take care of the dependencies
     * to be installed on a cache folder
     **/
    // private get lib() {
    //   return this.requireDep('node-packge-name') as DriverLib;
    // }
    public async open (): Promise<DDB> {
        if (this.connection) 
            return this.connection
        try {
            const connectOptions: DdbConfig = {
                ip: this.credentials.server,
                port: this.credentials.port,
                autologin: this.credentials.autologin ?? true, // 是否自动登录，应设为可选
                username: this.credentials.username || 'admin',
                password: this.credentials.password || '123456'
            }
            console.log(connectOptions)
            
            this.connection = createDDBClient(connectOptions)
            console.log('connected')  
            return await this.connection
        } catch (error) {
            console.error('Failed to open connection', error)
            throw new Error('Failed to open connection')
        }
        
    }
    public async close () {
        if (!this.connection) 
            return Promise.resolve()
        try {
            const db = await this.connection
            db.disconnect()
            this.connection = null
        } catch (error) {
            console.error('Failed to disconnect', error)
            throw new Error('Failed to disconnect')
        }
    }
    
    public query: (typeof AbstractDriver)['prototype']['query'] = async (queries, opt = { }) => {
        const db = await this.open()
        const resultsAgg: NSDatabase.IResult[] = [ ]
        const { requestId } = opt
        
        let queriesResults: any     
        
        // return the last results
        queriesResults = await db.eval(queries.toString().replaceAll('\r\n', '\n'))
        const ddbData = queriesResults.data()
        
        // scalar
        if (queriesResults.form === DdbForm.scalar) {
            let re = ddbUtils.scalarToVector(ddbData)
            resultsAgg.push({
                requestId: requestId,
                resultId: generateId(),
                cols: Object.keys(re[0]),
                connId: this.getId(),
                messages: [{ date: new Date(), message: `Query executed successfully and returned a ${DdbType[queriesResults.type]} scalar.` }],
                results: re,
                query: queries.toString()
            })
        } // vector
        else if (queriesResults.form === DdbForm.vector) {
            
            let re = ddbUtils.arrayToMatrix(ddbData, 10)
            
            resultsAgg.push({
                requestId: requestId,
                resultId: generateId(),
                cols: Object.keys(re[0]),
                connId: this.getId(),
                messages: [{ date: new Date(), message: `Query executed successfully and returned a ${DdbType[queriesResults.type]} vector with ${re.length} elements` }],
                results: re,
                query: queries.toString()
            })
        }// set
        else if (queriesResults.form === DdbForm.set) {
            let re = ddbUtils.arrayToMatrix(Array.from(ddbData), 10)
            resultsAgg.push({
                requestId: requestId,
                resultId: generateId(),
                cols: Object.keys(re[0]),
                connId: this.getId(),
                messages: [{ date: new Date(), message: `Query executed successfully and returned a ${DdbType[queriesResults.type]} set with ${ddbData.size} elements` }],
                results: re,
                query: queries.toString()
            })
        } // matrix
        else if (queriesResults.form === DdbForm.matrix) {
            let re: any
            let colLabel = ddbData.columns === undefined ? Object.keys(ddbData.data[0]) : ddbData.columns
            if (ddbData.rows !== undefined) { 
                colLabel = ['rowLabel', ...colLabel]
                re = ddbData.data.map((subArray, index) => [ddbData.rows[index], ...subArray])
            }
            else
                re = ddbData.data
            
            re = re.map(row => {
                const rowObject: { [key: string]: any } = { }
                colLabel.forEach((key, index) => {
                  rowObject[key] = row[index]
                })
                return rowObject
            })
            console.log(re)
            resultsAgg.push({
                requestId: requestId,
                resultId: generateId(),
                cols: colLabel,
                connId: this.getId(),
                messages: [{ date: new Date(), message: `Query executed successfully and returned a ${DdbType[queriesResults.type]} matrix with ${ddbData.nrows} * ${ddbData.ncolumns} results` }],
                results: re,
                query: queries.toString()
            })
        }
         // table   
        else if (queriesResults.form === DdbForm.table) {
            let re = ddbData.data
            console.log(re.length)
            resultsAgg.push({
                requestId: requestId,
                resultId: generateId(),
                cols: re.length === 0 ? [ ] : Object.keys(re[0]),
                connId: this.getId(),
                messages: [{ date: new Date(), message: `Query executed successfully and returned a table with ${re.length} results` }],
                results: re,
                query: queries.toString()
            })
        }
        else
            resultsAgg.push({
                requestId: requestId,
                resultId: generateId(),
                cols: [ ], 
                connId: this.getId(),
                messages: [{ date: new Date(), message: 'Query executed successfully and returned an object that cannot be fully displayed (e.g. a dictionary).' }],
                results: [[ ]],
                query: queries.toString()
            })
        
        return resultsAgg
    }
    
    /** if you need a different way to test your connection, you can set it here.
     * Otherwise by default we open and close the connection only
     */
    public async testConnection () {
        await this.open()
        await this.query('SELECT 1', { })
    }
    
    /** This method is a helper to generate the connection explorer tree.
        it gets the child items based on current item */
    public override async getChildrenForItem ({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
        
        const db = await this.open()  
        switch (item.type) {
            case ContextValue.CONNECTION:     
            case ContextValue.CONNECTED_CONNECTION:
                return <MConnectionExplorer.IChildItem[]>[
                    {
                      label: 'Databases',
                      type: ContextValue.RESOURCE_GROUP,
                      iconId: 'folder',
                      childType: ContextValue.DATABASE,
                    },
                    {
                      label: 'In-memory Tables',
                      type: ContextValue.RESOURCE_GROUP,
                      iconId: 'folder',
                      childType: ContextValue.RESOURCE_GROUP,
                      snippet: 'table'
                      
                    },
                    {
                        label: 'variables',
                        type: ContextValue.RESOURCE_GROUP,
                        iconId: 'folder',
                        childType: ContextValue.RESOURCE_GROUP,
                        snippet: 'var'
                    },
                  ]
            case ContextValue.RESOURCE_GROUP:
                return this.getChildrenForGroup({ parent, item }) 
            case ContextValue.DATABASE:
                return this.getChildrenForGroup({ parent, item })
            case ContextValue.TABLE:
                return this.getChildrenForGroup({ parent, item })
        }
        return [ ]
    }
    
    /** This method is a helper to generate the connection explorer tree.
        It gets the child based on child types */
    private async getChildrenForGroup ({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
        const db = await this.open()  
        console.log({ parent, item })
        
        switch (item.childType) {
            case ContextValue.RESOURCE_GROUP:
                return item.snippet === 'table' ? queries.fetchInMemTables(db, item) : queries.fetchVariables(db, item)
            case ContextValue.DATABASE:
                return queries.fetchDatabases(db, item)
            case ContextValue.TABLE:
                return queries.fetchTables(db, item)
            case ContextValue.COLUMN:
                return queries.fetchColumns(db, item)
                
        }
        return [ ]
    }
    
    /** This method is a helper for intellisense and quick picks. */
    public override async searchItems (itemType: ContextValue, search: string, _extraParams: any = { }): Promise<NSDatabase.SearchableItem[]> {
        switch (itemType) {
            case ContextValue.TABLE:
                return this.queryResults(
                    queries.searchTables({ search, ..._extraParams })
                )
            case ContextValue.COLUMN:
                return this.queryResults(
                    queries.searchColumns({ search, ..._extraParams })
                )
                
        }
        return [ ]
    }
    
    public getStaticCompletions: IConnectionDriver['getStaticCompletions'] = async () => ({ })
}
