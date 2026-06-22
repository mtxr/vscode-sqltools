import AbstractDriver from '@sqltools/base-driver';
import { IConnectionDriver, MConnectionExplorer, NSDatabase, ContextValue, Arg0, IQueryOptions } from '@sqltools/types';
import { v4 as generateId } from 'uuid';
import queries, { normalizeNamespace, qSymbolExpression, TableParams } from './queries';
import { KdbIpcClient, qValueToTabular } from './q-ipc';
import { endPerfSpan, perfSpan } from '../perf';

interface KdbDriverOptions {
  timeout?: number;
}

type DriverLib = KdbIpcClient;
type DriverOptions = KdbDriverOptions;

export default class KdbDriver extends AbstractDriver<DriverLib, DriverOptions> implements IConnectionDriver {
  public queries = queries;
  private sshTunnel: { port: number; close(): void } | null = null;

  public async open(): Promise<KdbIpcClient> {
    if (this.connection) {
      return this.connection;
    }

    let host = this.credentials.server || 'localhost';
    let port = Number(this.credentials.port || 5000);

    let tunnel: { port: number; close(): void } | null = null;

    try {
      if (this.credentials.ssh === 'Enabled' && this.credentials.sshOptions) {
        tunnel = await this.createSshTunnel(
          {
            host: this.credentials.sshOptions.host,
            port: this.credentials.sshOptions.port,
            username: this.credentials.sshOptions.username,
            password: this.credentials.sshOptions.password,
            privateKeyPath: this.credentials.sshOptions.privateKeyPath,
            passphrase: this.credentials.sshOptions.passphrase,
          },
          { host, port }
        );
        this.sshTunnel = tunnel;
        host = 'localhost';
        port = tunnel.port;
      }

      const client = new KdbIpcClient({
        host,
        port,
        username: this.credentials.username,
        password: this.credentials.password,
        timeoutMs: this.connectionTimeoutMs(),
      });

      await client.connect();
      this.connection = Promise.resolve(client);
      return this.connection;
    } catch (error) {
      if (tunnel) {
        tunnel.close();
      }
      this.sshTunnel = null;
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this.connection) {
      const client = await this.connection;
      this.connection = null;
      await client.close();
    }

    if (this.sshTunnel) {
      this.sshTunnel.close();
      this.sshTunnel = null;
    }
  }

  public query: (typeof AbstractDriver)['prototype']['query'] = async (query, opt = {}) => {
    const client = await this.open();
    const text = query.toString();
    const started = Date.now();
    const querySpan = perfSpan('driver.query.total', { queryChars: text.length });

    try {
      const value = await client.query(text);
      const tabularSpan = perfSpan('driver.qValueToTabular', { queryChars: text.length });
      let tabular: ReturnType<typeof qValueToTabular> | undefined;
      try {
        tabular = qValueToTabular(value);
      } finally {
        endPerfSpan(tabularSpan, tabular ? {
          rows: tabular.rows.length,
          columns: tabular.cols.length,
          kind: tabular.kind,
          error: false,
        } : { error: true });
      }
      const elapsed = Date.now() - started;
      endPerfSpan(querySpan, {
        rows: tabular.rows.length,
        columns: tabular.cols.length,
        kind: tabular.kind,
        error: false,
      });
      return [<NSDatabase.IResult>{
        requestId: opt.requestId,
        resultId: generateId(),
        connId: this.getId(),
        cols: tabular.cols,
        messages: [
          this.prepareMessage(`q returned ${tabular.kind} with ${tabular.rows.length} row${tabular.rows.length === 1 ? '' : 's'} in ${elapsed} ms.`),
        ],
        query: text,
        results: tabular.rows,
        pageSize: tabular.rows.length,
      }];
    } catch (error) {
      const err = toError(error);
      endPerfSpan(querySpan, { error: true, errorName: err.name });
      return [<NSDatabase.IResult>{
        requestId: opt.requestId,
        resultId: generateId(),
        connId: this.getId(),
        cols: [],
        messages: [this.prepareMessage(err.message)],
        error: true,
        rawError: err,
        query: text,
        results: [],
      }];
    }
  };

  public async testConnection(): Promise<void> {
    try {
      const client = await this.open();
      await client.query('1+1');
    } finally {
      await this.close();
    }
  }

  public async getChildrenForItem({ item, parent }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.type) {
      case ContextValue.CONNECTION:
      case ContextValue.CONNECTED_CONNECTION:
        return this.getRootGroups(item);
      case ContextValue.TABLE:
      case ContextValue.VIEW:
        return <MConnectionExplorer.IChildItem[]>[
          {
            label: 'Columns',
            type: ContextValue.RESOURCE_GROUP,
            iconId: 'folder',
            childType: ContextValue.COLUMN,
            schema: this.namespaceFor(item),
            database: this.namespaceFor(item),
          },
        ];
      case ContextValue.RESOURCE_GROUP:
        return this.getChildrenForGroup({ item, parent });
    }
    return [];
  }

  public async searchItems(itemType: ContextValue, search: string, extraParams: any = {}): Promise<NSDatabase.SearchableItem[]> {
    const needle = (search || '').toLowerCase();
    const limit = Number(extraParams.limit || 100);

    switch (itemType) {
      case ContextValue.TABLE:
        return this.filterItems(await this.fetchTables(ContextValue.TABLE), needle, limit);
      case ContextValue.VIEW:
        return this.filterItems(await this.fetchTables(ContextValue.VIEW), needle, limit);
      case ContextValue.FUNCTION:
        return this.filterItems(await this.fetchFunctions(), needle, limit);
      case ContextValue.COLUMN:
        return this.searchColumns(needle, limit, extraParams);
    }

    return [];
  }

  public async describeTable(metadata: NSDatabase.ITable, opt: IQueryOptions = {}): Promise<NSDatabase.IResult[]> {
    const results = await super.describeTable(metadata, opt);
    const namespace = this.namespaceFor(metadata);
    results.forEach(result => {
      result.results = result.results.map(row => this.columnItem(row, metadata, namespace));
    });
    return results;
  }

  public async getDefinitionForItem({ item }: Arg0<IConnectionDriver['getDefinitionForItem']>): Promise<string> {
    switch (item.type) {
      case ContextValue.TABLE:
      case ContextValue.VIEW:
      case ContextValue.MATERIALIZED_VIEW:
        return `meta ${qSymbolExpression(this.itemPath(item))}`;
      case ContextValue.FUNCTION:
        return `.Q.s1 value ${qSymbolExpression(this.itemPath(item))}`;
    }
    return '';
  }

  public async getInsertQuery({ item, columns }: Arg0<IConnectionDriver['getInsertQuery']>): Promise<string> {
    const tablePath = this.itemPath(item);
    const insertColumns = await this.columnsForInsert(item, columns);
    const values = insertColumns.map(column => placeholderForQType(column.dataType)).join('; ');
    return `(${qSymbolExpression(tablePath)}) insert (${values}, `;
  }

  public getStaticCompletions: IConnectionDriver['getStaticCompletions'] = async () => {
    const words = [
      'select', 'exec', 'update', 'delete', 'from', 'where', 'by',
      'insert', 'upsert', 'meta', 'cols', 'tables', 'views', 'count',
      'within', 'like', 'ij', 'lj', 'uj', 'aj', 'wj', 'each', 'raze', 'flip',
    ];
    return words.reduce((items, word) => {
      items[word] = {
        label: word,
        detail: 'q keyword',
        documentation: { kind: 'markdown', value: `q keyword \`${word}\`` },
      };
      return items;
    }, {} as { [w: string]: NSDatabase.IStaticCompletion });
  };

  private connectionTimeoutMs(): number {
    const rawSeconds = this.credentials.connectionTimeout ?? this.credentials.timeout ?? 30;
    const seconds = Number(rawSeconds);
    return Math.max(0, seconds * 1000);
  }

  private getRootGroups(item: NSDatabase.SearchableItem): MConnectionExplorer.IChildItem[] {
    const namespace = this.namespaceFor(item);
    return [
      {
        label: 'Tables',
        type: ContextValue.RESOURCE_GROUP,
        iconId: 'folder',
        childType: ContextValue.TABLE,
        schema: namespace,
        database: namespace,
      },
      {
        label: 'Views',
        type: ContextValue.RESOURCE_GROUP,
        iconId: 'folder',
        childType: ContextValue.VIEW,
        schema: namespace,
        database: namespace,
      },
      {
        label: 'Functions',
        type: ContextValue.RESOURCE_GROUP,
        iconId: 'folder',
        childType: ContextValue.FUNCTION,
        schema: namespace,
        database: namespace,
      },
    ];
  }

  private async getChildrenForGroup({ parent, item }: Arg0<IConnectionDriver['getChildrenForItem']>) {
    switch (item.childType) {
      case ContextValue.TABLE:
        return this.fetchTables(ContextValue.TABLE, item);
      case ContextValue.VIEW:
        return this.fetchTables(ContextValue.VIEW, item);
      case ContextValue.FUNCTION:
        return this.fetchFunctions(item);
      case ContextValue.COLUMN:
        return parent ? this.getColumns(parent as NSDatabase.ITable) : [];
    }
    return [];
  }

  private async fetchTables(type: ContextValue.TABLE | ContextValue.VIEW, parent?: NSDatabase.SearchableItem): Promise<NSDatabase.ITable[]> {
    const namespace = this.namespaceFor(parent);
    const query = type === ContextValue.VIEW
      ? this.queries.fetchViews({ namespace } as any)
      : this.queries.fetchTables({ namespace } as any);
    let results: any[];
    try {
      results = await this.queryResults<any>(query);
    } catch (error) {
      if (type === ContextValue.VIEW) {
        return [];
      }
      throw error;
    }
    return results.map(row => this.tableItem(row, type, namespace));
  }

  private async fetchFunctions(parent?: NSDatabase.SearchableItem): Promise<NSDatabase.IFunction[]> {
    const namespace = this.namespaceFor(parent);
    const fetchFunctions = this.queries.fetchFunctions;
    if (!fetchFunctions) {
      return [];
    }
    let results: any[];
    try {
      results = await this.queryResults<any>(fetchFunctions({ namespace } as any));
    } catch {
      return [];
    }
    return results.map(row => ({
      label: String(row.label || row.name || ''),
      name: String(row.name || row.label || ''),
      type: ContextValue.FUNCTION,
      schema: namespace,
      database: namespace,
      signature: String(row.signature || row.name || row.label || ''),
      args: [],
      resultType: String(row.resultType || 'function'),
      childType: ContextValue.NO_CHILD,
      iconName: 'function',
    }));
  }

  private async getColumns(parent: NSDatabase.ITable): Promise<NSDatabase.IColumn[]> {
    const namespace = this.namespaceFor(parent);
    const params: TableParams = { namespace, table: parent };
    const results = await this.queryResults<any>(this.queries.fetchColumns(params as any));
    return results.map(row => this.columnItem(row, parent, namespace));
  }

  private async columnsForInsert(item: NSDatabase.ITable, columns: NSDatabase.IColumn[]): Promise<NSDatabase.IColumn[]> {
    const first = columns[0] as MConnectionExplorer.IChildItem | undefined;
    if (
      columns.length === 1 &&
      first &&
      first.type === ContextValue.RESOURCE_GROUP &&
      first.childType === ContextValue.COLUMN
    ) {
      return this.getColumns(item);
    }

    return columns;
  }

  private async searchColumns(needle: string, limit: number, extraParams: any): Promise<NSDatabase.IColumn[]> {
    const tables: NSDatabase.ITable[] = extraParams.tables && extraParams.tables.length
      ? extraParams.tables
      : await this.fetchTables(ContextValue.TABLE);
    const columns: NSDatabase.IColumn[] = [];

    for (const table of tables) {
      const tableColumns = await this.getColumns(table);
      columns.push(...tableColumns.filter(column => {
        const fullName = `${table.label}.${column.label}`.toLowerCase();
        return !needle || fullName.includes(needle) || column.label.toLowerCase().includes(needle);
      }));
      if (columns.length >= limit) {
        break;
      }
    }

    return columns.slice(0, limit);
  }

  private tableItem(row: any, type: ContextValue.TABLE | ContextValue.VIEW, namespace: string): NSDatabase.ITable {
    const label = String(row.label || '');
    return {
      ...row,
      label,
      type,
      schema: namespace,
      database: namespace,
      isView: type === ContextValue.VIEW,
      childType: ContextValue.COLUMN,
      detail: type === ContextValue.VIEW ? 'view' : 'table',
    };
  }

  private filterItems<T extends NSDatabase.SearchableItem>(items: T[], needle: string, limit: number): T[] {
    return items
      .filter(item => !needle || item.label.toLowerCase().includes(needle))
      .slice(0, limit);
  }

  private namespaceFor(item?: Partial<MConnectionExplorer.IChildItem>): string {
    return normalizeNamespace(
      item && (item.database || item.schema)
        ? item.database || item.schema
        : this.credentials.database
    );
  }

  private itemPath(item: Partial<MConnectionExplorer.IChildItem>): string {
    const namespace = this.namespaceFor(item);
    return (item.label && item.label.startsWith('.')) || namespace === '.'
      ? String(item.label || '')
      : `${namespace}.${item.label || ''}`;
  }

  private columnItem(row: any, table: NSDatabase.ITable, namespace: string): NSDatabase.IColumn {
    const label = String(row.label || row.c || '');
    const dataType = qTypeName(String(row.dataType || row.t || ''));
    return {
      ...row,
      label,
      type: ContextValue.COLUMN,
      dataType,
      detail: [dataType, row.a ? `attr ${row.a}` : null, row.f ? `fk ${row.f}` : null].filter(Boolean).join(', '),
      schema: namespace,
      database: namespace,
      table,
      isNullable: row.isNullable === undefined ? true : row.isNullable,
      childType: ContextValue.NO_CHILD,
      iconName: 'column',
    };
  }
}

function qTypeName(type: string): string {
  const trimmed = type.trim();
  if (!trimmed) {
    return 'mixed';
  }
  const normalized = trimmed.toLowerCase();
  const names: { [key: string]: string } = {
    b: 'boolean',
    g: 'guid',
    x: 'byte',
    h: 'short',
    i: 'int',
    j: 'long',
    e: 'real',
    f: 'float',
    c: 'char',
    s: 'symbol',
    p: 'timestamp',
    m: 'month',
    d: 'date',
    z: 'datetime',
    n: 'timespan',
    u: 'minute',
    v: 'second',
    t: 'time',
  };
  if (names[normalized] && trimmed.length === 1 && trimmed !== normalized) {
    return `${names[normalized]} list`;
  }
  return names[normalized] || trimmed;
}

function placeholderForQType(type: string): string {
  const normalized = type.toLowerCase();
  const values: { [key: string]: string } = {
    boolean: '0b',
    b: '0b',
    guid: '0Ng',
    g: '0Ng',
    byte: '0x00',
    x: '0x00',
    short: '0Nh',
    h: '0Nh',
    int: '0Ni',
    i: '0Ni',
    long: '0Nj',
    j: '0Nj',
    real: '0Ne',
    e: '0Ne',
    float: '0n',
    f: '0n',
    char: '" "',
    c: '" "',
    symbol: '`',
    s: '`',
    timestamp: '.z.P',
    p: '.z.P',
    month: '2000.01m',
    m: '2000.01m',
    date: '.z.D',
    d: '.z.D',
    datetime: '.z.Z',
    z: '.z.Z',
    timespan: '00:00:00.000000000',
    n: '00:00:00.000000000',
    minute: '00:00',
    u: '00:00',
    second: '00:00:00',
    v: '00:00:00',
    time: '00:00:00.000',
    t: '00:00:00.000',
  };
  return values[normalized] || '::';
}

function toError(error: unknown): Error {
  return error instanceof Error ? error : new Error(String(error));
}
