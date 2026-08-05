import { NSDatabase, IConnectionDriver, IConnection, MConnectionExplorer, ContextValue, InternalID, IQueryOptions } from '@sqltools/types';
import decorateLSException from '@sqltools/util/decorators/ls-decorate-exception';
import { getConnectionId } from '@sqltools/util/connection';
import ConfigRO from '@sqltools/util/config-manager';
import generateId from '@sqltools/util/internal-id';
import LSContext from './context';
import { IConnection as LSIconnection, CompletionItem } from 'vscode-languageserver';
import DriverNotInstalledError from './exception/driver-not-installed';
import { createLogger } from '@sqltools/log/src';

const log = createLogger('conn');

export default class Connection {
  private connected: boolean = false;
  private conn: IConnectionDriver;
  constructor(private credentials: IConnection, getWorkspaceFolders: LSIconnection['workspace']['getWorkspaceFolders']) {
    if (!LSContext.drivers.has(credentials.driver)) {
      throw new DriverNotInstalledError(credentials.driver);
    }

    const DriverClass = LSContext.drivers.get(credentials.driver);

    this.conn = new DriverClass(this.credentials, getWorkspaceFolders);
  }

  private decorateException = (e: Error) => {
    e = decorateLSException(e, { conn: this.credentials });
    return Promise.reject(e);
  }

  public needsPassword() {
    return this.conn.credentials.askForPassword;
  }

  public async connect() {
    if (!this.connected && this.conn.checkDependencies) {
      await this.conn.checkDependencies();
    }

    if (typeof this.conn.testConnection === 'function')
      await this.conn.testConnection().catch(this.decorateException);
    else
      await this.query('SELECT 1;', { throwIfError: true });
    this.connected = true;
  }

  public setPassword(password: string) {
    this.conn.credentials.password = password;
  }

  public getPassword() {
    return this.conn.credentials.password;
  }
  public isConnected() {
    return this.connected;
  }

  public close() {
    if (this.needsPassword()) this.conn.credentials.password = null;
    this.connected = false;
    return this.conn.close();
  }

  public async describeTable(table: NSDatabase.ITable, opt: { requestId: InternalID }) {
    const info = await this.conn.describeTable(table, opt).catch(this.decorateException);

    if (info[0]) {
      info[0].label = `Table ${table.label}`;
    }
    return info;
  }
  private extractTableNameFromQuery(query: string): string | null {
    if (!query) return null;
    const cleanQuery = query.replace(/--.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '').trim();
    
    const lowerQuery = cleanQuery.toLowerCase();
    if (lowerQuery.includes(' join ')) return null;
    
    const fromIndex = lowerQuery.indexOf(' from ');
    if (fromIndex !== -1) {
      let fromClause = lowerQuery.slice(fromIndex + 6);
      const endKeywords = [' where ', ' group by ', ' order by ', ' limit ', ' offset ', ' union '];
      let endIndex = fromClause.length;
      for (const kw of endKeywords) {
        const idx = fromClause.indexOf(kw);
        if (idx !== -1 && idx < endIndex) {
          endIndex = idx;
        }
      }
      fromClause = fromClause.slice(0, endIndex);
      if (fromClause.includes(',')) {
        return null;
      }
    }
    
    const selectRegex = /\bselect\s+[\s\S]+?\s+from\s+([a-zA-Z0-9_\.\"\`\[\]\-\#]+)/i;
    const match = cleanQuery.match(selectRegex);
    if (!match) return null;
    return match[1].replace(/[\"\`\[\]]/g, '').trim();
  }

  private async getPrimaryKeys(tableName: string): Promise<string[]> {
    try {
      let label = tableName;
      let schema = '';
      let database = '';

      const parts = tableName.split('.');
      if (parts.length === 3) {
        database = parts[0];
        schema = parts[1];
        label = parts[2];
      } else if (parts.length === 2) {
        schema = parts[0];
        label = parts[1];
      }

      if (!schema && this.credentials.driver !== 'SQLite') {
        const catalogQuery = `
          SELECT table_schema AS "schema", table_catalog AS "database"
          FROM information_schema.tables
          WHERE table_name = '${label}'
        `;
        const catalogRes = await this.conn.query(catalogQuery, {}).catch(() => []);
        if (catalogRes && catalogRes[0] && catalogRes[0].results && catalogRes[0].results[0]) {
          const row = catalogRes[0].results[0];
          schema = row.schema || '';
          database = row.database || '';
        }
      }

      let primaryKeys: string[] = [];

      if (this.credentials.driver === 'SQLite') {
        const sqliteQuery = `PRAGMA table_info("${label}")`;
        const res = await this.conn.query(sqliteQuery, {}).catch(() => []);
        const rows = res[0]?.results || [];
        for (const row of rows) {
          if (row.pk === 1 || row.pk === '1' || row.pk === true) {
            primaryKeys.push(row.name);
          }
        }
      } else if (this.credentials.driver === 'PostgreSQL') {
        const pgQuery = `
          SELECT a.attname AS "column_name"
          FROM pg_index i
          JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
          WHERE i.indrelid = '${schema ? `"${schema}"."${label}"` : `"${label}"`}'::regclass
          AND i.indisprimary;
        `;
        const res = await this.conn.query(pgQuery, {}).catch(() => []);
        const rows = res[0]?.results || [];
        for (const row of rows) {
          primaryKeys.push(row.column_name);
        }
      } else if (this.credentials.driver === 'MySQL') {
        const schemaName = schema || database;
        const mysqlQuery = schemaName ? `DESCRIBE \`${schemaName}\`.\`${label}\`` : `DESCRIBE \`${label}\``;
        const res = await this.conn.query(mysqlQuery, {}).catch(() => []);
        const rows = res[0]?.results || [];
        for (const row of rows) {
          const isPri = row.Key === 'PRI' || row.key === 'PRI' || row.COLUMN_KEY === 'PRI';
          if (isPri) {
            primaryKeys.push(row.Field || row.field || row.COLUMN_NAME);
          }
        }
      } else if (this.credentials.driver === 'MSSQL') {
        const mssqlQuery = `
          SELECT col.name AS "column_name"
          FROM sys.indexes idx
          INNER JOIN sys.index_columns idxCol ON idx.object_id = idxCol.object_id AND idx.index_id = idxCol.index_id
          INNER JOIN sys.columns col ON idxCol.object_id = col.object_id AND idxCol.column_id = col.column_id
          WHERE idx.is_primary_key = 1
          AND idx.object_id = OBJECT_ID('${schema ? `${schema}.${label}` : label}');
        `;
        const res = await this.conn.query(mssqlQuery, {}).catch(() => []);
        const rows = res[0]?.results || [];
        for (const row of rows) {
          primaryKeys.push(row.column_name);
        }
      } else {
        const tableItem: NSDatabase.ITable = {
          type: ContextValue.TABLE,
          label,
          schema,
          database,
          isView: false
        };
        const colsResults = await this.conn.describeTable(tableItem).catch(() => []);
        const colRows = colsResults[0]?.results || [];
        for (const col of colRows) {
          const isPrimaryKey = 
            col.isPk === true || 
            col.isPk === 1 || 
            col.isPk === '1' || 
            col.pk === 1 || 
            col.pk === '1' || 
            col.pk === true ||
            String(col.columnKey).toLowerCase() === 'pri' ||
            String(col.Key).toLowerCase() === 'pri' ||
            String(col.key).toLowerCase() === 'pri' ||
            String(col.COLUMN_KEY).toLowerCase() === 'pri';
            
          if (isPrimaryKey) {
            const colName = col.label || col.name || col.columnName || col.ColumnName || col.Field || col.field || col.COLUMN_NAME || col.column_name || col.cid;
            if (colName) {
              primaryKeys.push(colName);
            }
          }
        }
      }

      return primaryKeys.filter(Boolean);
    } catch (e) {
      log.error('Error fetching primary keys for table %s: %O', tableName, e);
      return [];
    }
  }

  public async showRecords(table: NSDatabase.ITable, opt: { requestId: InternalID; page: number; pageSize?: number }) {
    const { pageSize, page, requestId } = opt;
    const limit = pageSize || this.conn.credentials.previewLimit || (ConfigRO.results && ConfigRO.results.limit) || 50;

    const [records] = await this.conn.showRecords(table, { limit, page, requestId }).catch(this.decorateException);

    if (records) {
      records.label = [
        Math.max(records.total || 0, records.results.length, 0),
        'records on',
        `'${table.label}'`,
        'table'
      ].join(' ');
      
      const primaryKeys = await this.getPrimaryKeys(table.label);
      records.tableName = table.label;
      records.primaryKeys = primaryKeys;
      records.isEditable = primaryKeys.length > 0;
      records.queryType = 'showRecords';
      records.queryParams = table;
    }
    return [records];
  }

  public async query(query: string, opt: IQueryOptions & { throwIfError?: boolean } = {}): Promise<NSDatabase.IResult[]> {
    const results = await this.conn.query(query, opt)
      .catch(this.decorateException)
      .catch((e) => {
        log.error('%O', e);
        if (opt.throwIfError) throw e;
        let message = '';
        if (typeof e === 'string') {
          message = e;
        } else if (e.message) {
          message = e.message;
        } else {
          message = JSON.stringify(e);
        }
        return [<NSDatabase.IResult>{
          requestId: opt.requestId,
          resultId: generateId(),
          connId: this.getId(),
          cols: [],
          error: true,
          messages: [{ message, date: new Date() }],
          query,
          results: [],
        }];
      });

    for (const res of results) {
      if (res.error) continue;
      
      const tableName = res.queryType === 'showRecords' ? res.queryParams?.label : this.extractTableNameFromQuery(res.query);
      if (tableName) {
        const primaryKeys = await this.getPrimaryKeys(tableName);
        res.tableName = tableName;
        res.primaryKeys = primaryKeys;
        res.isEditable = primaryKeys.length > 0;
      } else {
        res.isEditable = false;
      }
    }
    return results;
  }

  public async updateRows(params: {
    tableName: string;
    primaryKeys: string[];
    edits: Array<{
      keys: Record<string, any>;
      original: Record<string, any>;
      modified: Record<string, any>;
    }>;
  }) {
    if (typeof (this.conn as any).updateRows === 'function') {
      const updatedRowCount = await (this.conn as any).updateRows(params.tableName, params.edits).catch(this.decorateException);
      return { updatedRowCount };
    }
    throw new Error(`Driver ${this.credentials.driver} does not support spreadsheet edits/updating rows.`);
  }
  public getName() {
    return this.conn.credentials.name;
  }
  public getServer() {
    return this.conn.credentials.server;
  }

  public getPort() {
    return this.conn.credentials.port;
  }
  public getUsername() {
    return this.conn.credentials.username;
  }

  public getDatabase() {
    return this.conn.credentials.database;
  }

  public getDriver() {
    return this.conn.credentials.driver;
  }

  public getId() {
    return getConnectionId(this.conn.credentials);
  }

  public serialize(): IConnection {
    return {
      id: this.getId(),
      ...this.conn.credentials,
      isConnected: this.isConnected(),
    };
  }

  public static async testConnection(credentials: IConnection, getWorkspaceFolders: LSIconnection['workspace']['getWorkspaceFolders']) {
    const testConn = new Connection(credentials, getWorkspaceFolders);
    await testConn.connect();
    await testConn.close();
    return true;
  }

  public getChildrenForItem(params: { item: MConnectionExplorer.IChildItem; parent?: MConnectionExplorer.IChildItem }) {
    return this.conn.getChildrenForItem(params);
  }

  public getDefinitionForItem(params: { item: NSDatabase.DefinableItem; }) {
    if (this.conn.getDefinitionForItem && typeof this.conn.getDefinitionForItem === 'function') {
      return this.conn.getDefinitionForItem(params);
    }
    return `-- Not supported by ${this.getDriver()}`;
  }

  public getInsertQuery(params: { item: NSDatabase.ITable; columns: Array<NSDatabase.IColumn> }) {
    if (this.conn.getInsertQuery && typeof this.conn.getInsertQuery === 'function') {
      return this.conn.getInsertQuery(params);
    }
    const { item, columns } = params;
    let insertQuery = `INSERT INTO ${item.label} (${columns.map((col) => col.label).join(', ')}) VALUES (`;
    columns.forEach((col, index) => {
      insertQuery = insertQuery.concat(`'\${${index + 1}:${col.label}:${col.dataType}}', `);
    });
    return insertQuery;
  }

  public searchItems(itemType: ContextValue, search: string = '', extraParams = {}) {
    return this.conn.searchItems(itemType, search, extraParams);
  }

  public getStaticCompletions: IConnectionDriver['getStaticCompletions'] = () => {
    if (typeof this.conn.getStaticCompletions !== 'function') return Promise.resolve({} as any);
    return this.conn.getStaticCompletions();
  }

  public getCompletionsForRawQuery(text: string, currentOffset: number): Promise<CompletionItem[] | null> {
    if (typeof this.conn.getCompletionsForRawQuery !== 'function') return Promise.resolve(null);
    return this.conn.getCompletionsForRawQuery(text, currentOffset);
  }
}
