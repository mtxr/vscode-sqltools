import { IConnectionDriver, IBaseQueries, IConnection, IDatabaseFilter, IExpectedResult, NodeDependency, ContextValue, MConnectionExplorer, IQueryOptions } from '@sqltools/types';
import { NSDatabase } from '@sqltools/types';
import log from '@sqltools/util/log';
export default abstract class AbstractDriver<ConnectionType extends any, DriverOptions extends any> implements IConnectionDriver {
    credentials: IConnection<DriverOptions>;
    log: typeof log;
    readonly deps: NodeDependency[];
    getId(): string;
    connection: Promise<ConnectionType>;
    abstract queries: IBaseQueries;
    constructor(credentials: IConnection<DriverOptions>);
    abstract open(): Promise<ConnectionType>;
    abstract close(): Promise<void>;
    abstract query<R = any, Q = any>(queryOrQueries: Q | string | String, opt: IQueryOptions): Promise<NSDatabase.IResult<Q extends IExpectedResult<infer U> ? U : R>[]>;
    singleQuery<R = any, Q = any>(query: Q | string | String, opt: IQueryOptions): Promise<NSDatabase.IResult<Q extends IExpectedResult<infer U> ? U : R>>;
    describeTable(metadata: NSDatabase.ITable, opt: IQueryOptions): Promise<NSDatabase.IResult<any>[]>;
    showRecords(table: NSDatabase.ITable, opt: IQueryOptions & {
        limit: number;
        page?: number;
    }): Promise<NSDatabase.IResult<any>[]>;
    protected needToInstallDependencies(): boolean;
    getBaseQueryFilters(): {
        databaseFilter: IDatabaseFilter;
    };
    getChildrenForItem(_params: {
        item: NSDatabase.SearchableItem;
        parent?: NSDatabase.SearchableItem;
    }): Promise<MConnectionExplorer.IChildItem[]>;
    searchItems(_itemType: ContextValue, _search: string, _extraParams?: any): Promise<NSDatabase.SearchableItem[]>;
    protected prepareMessage(message: any): NSDatabase.IResult['messages'][number];
}
