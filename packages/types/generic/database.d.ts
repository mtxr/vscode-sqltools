import { MConnectionExplorer, ContextValue } from './connection';

export declare namespace NSDatabase {
  export interface IDatabase extends MConnectionExplorer.IChildItem {
    name: string;
    label: string;
    type: ContextValue.DATABASE;
    id: string;
  }

  export interface ITable {
    tableSchema?: string;
    tableCatalog?: string;
    tableDatabase?: string;
    name: string;
    isView: boolean;
    numberOfColumns?: number;
    /**
     * This is used to build the connections explorer tree
     *
     * @type {string}
     * @memberof ITable
     */
     tree?: string;
  }
  export interface IColumn {
    tableName: string;
    columnName: string;
    type: string;
    size?: number;
    tableSchema?: string;
    tableDatabase?: string;
    tableCatalog?: string;
    defaultValue?: string;
    isNullable: boolean;
    isPartitionKey?: boolean;
    isPk?: boolean;
    isFk?: boolean;
    columnKey?: string;
    extra?: string;
    /**
     * This is used to build the connections explorer tree
     *
     * @type {string}
     * @memberof IColumn
     */
    tree?: string;
  }

  export interface IFunction {
    name: string;
    schema: string;
    database: string;
    signature: string;
    args: string[];
    resultType: string;
    /**
     * This is used to build the connections explorer tree
     *
     * @type {string}
     * @memberof IColumn
     */
    tree?: string;
    source?: string;
  }

  export interface IProcedure extends IFunction {}

  export interface IResult<T extends { [key: string]: any } = any> {
    label?: string;
    connId: string;
    error?: boolean;
    results: (T extends { [key: string]: any } ? T : any)[];
    cols: string[];
    query: string;
    messages: string[];
    page?: number;
    total?: number;
    pageSize?: number;
  }
}
