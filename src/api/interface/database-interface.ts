// tslint:disable:no-namespace
namespace DatabaseInterface {
  export interface Table {
    tableSchema?: string;
    tableCatalog?: string;
    tableDatabase?: string;
    name: string;
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
}

export default DatabaseInterface;
