// tslint:disable:no-namespace
namespace DatabaseInterface {
  export interface Table {
    name: string;
  }
  export interface TableColumn {
    tableName: string;
    columnName: string;
    type: string;
    size: number;
  }

  export interface Function {
    name: string;
  }
}

export default DatabaseInterface;
