// tslint:disable:no-namespace
export namespace DatabaseInterface {
  export interface Database {
    name: string;
  }

  export interface Table {
    tableSchema?: string;
    tableCatalog?: string;
    tableDatabase?: string;
    name: string;
    isView: boolean;
    numberOfColumns?: number;
  }
  export interface TableColumn {
    tableName: string;
    columnName: string;
    type: string;
    size?: number;
    tableSchema: string;
    tableDatabase?: string;
    tableCatalog?: string;
    defaultValue: string;
    isNullable: boolean;
    columnKey?: string;
    extra?: string;
  }

  export interface Function {
    name: string;
  }
  export interface QueryResults {
    error?: boolean;
    results: any[];
    cols: string[];
    query: string;
    messages: string[];
  }
}

export default DatabaseInterface;
