import { type IBaseQueries, ContextValue, type NSDatabase } from '@sqltools/types'
import queryFactory from '@sqltools/base-driver/dist/lib/factory.js'

import type { DDB, DdbTableData } from 'dolphindb'

import type { DdbConfig } from './types.ts'

/** write your queries here go fetch desired data. This queries are just examples copied from SQLite driver */

const describeTable: IBaseQueries['describeTable'] = queryFactory`
  select *
  from ${p => p.database.length ? `loadTable('${p.database}', '${p.schema}').schema().colDefs` : `${p.label}.schema().colDefs` }
`

async function fetchColumns  (db: any, item: NSDatabase.SearchableItem) {
  let colList: DdbTableData
  let parentDBName = item.database
  let tableName = item.label
  let nodeType = await db.execute('getNodeType()')
  if (nodeType === 2 && parentDBName !== '')
      colList = await db.execute(
      `rpc((exec name from getClusterPerf() where state == 1 limit 1)[0], loadTable, '${parentDBName}', '${tableName}').schema().colDefs`
      )
  else  
      if (parentDBName !== '')
          colList = await db.execute(`loadTable('${parentDBName}', '${tableName}').schema().colDefs`) 
      else
          colList = await db.execute(`${tableName}.schema().colDefs`)
  
  return colList.data.map(row => ({
      label: row.name,
      type: ContextValue.COLUMN,
      iconId: 'column',
      detail: row.typeString,
      childType: ContextValue.NO_CHILD
  }))
}

const fetchRecords: IBaseQueries['fetchRecords'] = queryFactory`
select *
from ${p => { console.log('asdr', p); return p.table.database.length ? `loadTable('${p.table.database}', '${p.table.schema}')` : `${p.table.schema}` }}
limit ${p => p.offset || 0}, ${p => p.limit || 50};
`


const countRecords: IBaseQueries['countRecords'] = queryFactory`
select count(*) as total
from ${p => p.table.database.length ? `loadTable('${p.table.database}', '${p.table.schema}')` : `${p.table.schema}` }
`

async function fetchTables  (db: any, item: NSDatabase.SearchableItem & { info?: any }) {
  Promise<IBaseQueries['fetchTables']>
  let dbName = item.label
  let tbList = item.info.filter(item => item.dbNames === dbName).map(item => item.tbNames)
  return tbList.map(tb => ({
      label: tb,
      schema: tb,
      type: ContextValue.TABLE,
      iconId: 'table',
      childType: ContextValue.COLUMN,
      database: dbName,
  }))
}


async function fetchDatabases  (db: any, item: NSDatabase.SearchableItem) {
  let dbList: any  
  let script = `
    def getInfo(){
        re = each(x->x[6:],getClusterDFSTables()) 
        dbNames = array(STRING)
        tbNames = array(STRING)
        if(re.size() > 0){
            s = re.split("/") 
            dbNames = ("dfs://" + loop(s->concat:R(s[0:(s.size()-1)]), s)).flatten()
            tbNames = s.tail:E(1)
        }
        
        return table(dbNames, tbNames)
    }
    getInfo()
  `
  let re = await db.execute(script)
  console.log('aaa', re)
  dbList = re.data.map(item => item.dbNames)
  dbList = [...new Set(dbList)]
  console.log('aaa', dbList)
  return dbList.map(db => ({
      label: db,
      type: ContextValue.DATABASE,
      iconId: 'database',
      childType: ContextValue.TABLE,
      info: re.data
  }))
}


async function fetchInMemTables  (db: any, item: NSDatabase.SearchableItem) {
  let script = `
   exec name from objs(true) where form = "TABLE"
  `
  let vars = await db.execute(script)
  
  return vars.map(item => ({
      label: item,
      type: ContextValue.TABLE,
      iconId: 'table',
      database: '',
      schema: item,
      childType: ContextValue.COLUMN,
      info: vars
  }))
}

async function fetchVariables  (db: any, item: NSDatabase.SearchableItem) {
  let script = `
   exec * from objs(true) where form != "TABLE"
  `
  let vars = await db.execute(script)
  console.log('var', vars)
  return vars.data.map(item => ({
      label: item.name,
      type: ContextValue.RESOURCE_GROUP,
      iconId: 'view',
      detail: item.form,
      childType: ContextValue.NO_CHILD,
  }))
}

interface IExpectedResult<T = any> extends String {
  resultsIn?: T
}

interface QueryBuilder<P, R> {
  (params?: P & { [k: string]: any }): IExpectedResult<R>
  raw?: string
}



const searchTables: IBaseQueries['searchTables'] = queryFactory`
tbName = getClusterDFSTables().split('/').tail:E();
dbName = each(substr{,0,}, getClusterDFSTables(), getClusterDFSTables().strlen() - tbName.strlen() - 1);

imt = select name as label, '' as database, name as schema, 'TABLE' as type from objs(true) where form = 'TABLE';
dfst = select (dbName + "/" + tbName) as label,
   dbName as database,
   tbName as schema,
  'TABLE' as type
from table(dbName, tbName);

tbInfo = unionAll(imt, dfst);

select * from tbInfo
${p => (p.search ? `where label like '%${p.search}%'` : '')}
order by label
`

const searchColumns: IBaseQueries['searchColumns'] = queryFactory`

tbName = getClusterDFSTables().split('/').tail:E();
dbName = each(substr{,0,}, getClusterDFSTables(), getClusterDFSTables().strlen() - tbName.strlen() - 1);

dfscolInfo = each(def(dbName, tbName){ return select dbName, tbName, * from loadTable(dbName, tbName).schema().colDefs}, dbName, tbName).unionAll{false}();

imtTbName = exec name from objs(true) where form = 'TABLE'
imtcolInfo = each(def(tbName){ return select '' as dbName, tbName, * from objByName(tbName).schema().colDefs}, imtTbName).unionAll{false}();

colInfo = unionAll(dfscolInfo, imtcolInfo)

select name as label,
  tbName as "table",
  dbName as database,
  typeString as dataType,
  false as isPk,
  '${ContextValue.COLUMN}' as type
from colInfo
where  1 = 1
${p =>
  p.tables?.filter(t => !!t.database).length
      ? `and dbName in (${p.tables
            ?.filter(t => !!t.database)
            .map(t => `'${t.database}'`)
            .join(', ')})`
      : ''}
${p =>
    p.tables?.filter(t => !!t.label).length
        ? `and tbName in (${p.tables
              ?.filter(t => !!t.label)
              .map(t => `'${t.label}'`)
              .join(', ')})`
        : ''}
${p =>
    p.search
        ? `and (
    (dbName + '.' + tbName + '.' + name) like '%${p.search}%'
    or (tbName + '.' + name) like '%${p.search}%'
    or name like '%${p.search}%'
  )`
        : ''}
order by name asc
limit ${p => p.limit || 100}
`


export const queries = {
    describeTable,
    countRecords,
    fetchColumns,
    fetchRecords,
    fetchTables,
    fetchDatabases,
    fetchInMemTables,
    fetchVariables,
    searchTables,
    searchColumns
}
