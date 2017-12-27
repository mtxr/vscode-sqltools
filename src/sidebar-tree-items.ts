import * as path from 'path';
import {
  Command,
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode';
import DatabaseInterface from './api/interface/database-interface';

export class SidebarDatabase extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, 'resources', 'icon', 'db-dark.png'),
    light: path.join(__dirname, 'resources', 'icon', 'db-light.png'),
  };
  public contextValue = 'connection.database';
  public value: string;

  public tables: any = {};
  constructor(private db: DatabaseInterface.Database) {
    super(db.name, TreeItemCollapsibleState.Expanded);
    this.value = db.name;
    Object.defineProperty(this, 'label', {
      get() {
        return `${this.db.name} (${Object.keys(this.tables).length} tables)`;
      },
    });
  }
}

export class SidebarTable extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, 'resources', 'icon', 'table-dark.png'),
    light: path.join(__dirname, 'resources', 'icon', 'table-light.png'),
  };
  public contextValue = 'connection.table';
  public value: string;

  public columns: SidebarColumn[] = [];
  constructor(table: DatabaseInterface.Table) {
    super(table.name, TreeItemCollapsibleState.Collapsed);
    this.value = table.name;
    this.label = `${table.name} (${table.numberOfColumns} cols)`;
  }
}

export class SidebarColumn extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, 'resources', 'icon', 'column-dark.png'),
    light: path.join(__dirname, 'resources', 'icon', 'column-light.png'),
  };
  public contextValue = 'connection.column';
  public value: string;

  constructor(public column: DatabaseInterface.TableColumn) {
    super(column.columnName, TreeItemCollapsibleState.None);
    this.value = column.columnName;
    let typeSize = '';
    if (column.size !== null) {
      typeSize = `(${column.size})`;
    }
    this.label = `${column.columnName} (${column.type.toUpperCase()}${typeSize})`;
  }
}
