import path = require('path');
import {
  Command,
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode';
import DatabaseInterface from './../../api/interface/database-interface';

export class SidebarDatabase extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, '..', '..', 'resources', 'icon', 'database-dark.svg'),
    light: path.join(__dirname, '..', '..', 'resources', 'icon', 'database-light.svg'),
  };
  public contextValue = 'connection.database';
  public value: string;

  public tables: SidebarDatabaseStructure = new SidebarDatabaseStructure('Tables');
  public views: SidebarDatabaseStructure = new SidebarDatabaseStructure('Views');
  constructor(private name: string) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.value = name;
    this.label = name;
  }

  public addItem(item) {
    const key = item.isView ? 'views' : 'tables';
    this[key].addItem(item.isView ? new SidebarView(item) : new SidebarTable(item));
  }
}

export class SidebarDatabaseStructure extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, '..', '..', 'resources', 'icon', 'folder-open-dark.svg'),
    light: path.join(__dirname, '..', '..', 'resources', 'icon', 'folder-open-light.svg'),
  };
  public contextValue = 'connection.structure';
  public items: { [name: string]: SidebarTable | SidebarView} = {};
  constructor(private name) {
    super(name, TreeItemCollapsibleState.Collapsed);
    this.label = name;
    Object.defineProperty(this, 'label', {
      get() {
        return `${this.name} (${Object.keys(this.items).length} ${name.toLowerCase()})`;
      },
    });
  }

  public addItem(item) {
    this.items[item.value] = this.items[item.value] || item;
  }
}

export class SidebarTable extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, '..', '..', 'resources', 'icon', 'table-dark.svg'),
    light: path.join(__dirname, '..', '..', 'resources', 'icon', 'table-light.svg'),
  };
  public contextValue = 'connection.tableOrView';
  public value: string;

  public items: SidebarColumn[] = [];
  constructor(table: DatabaseInterface.Table) {
    super(table.name, TreeItemCollapsibleState.Collapsed);
    this.value = table.name;
    this.label = `${table.name} (${table.numberOfColumns} cols)`;
  }

  public addItem(item) {
    this.items.push(item);
  }
}

export class SidebarView extends SidebarTable {
}

export class SidebarColumn extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, '..', '..', 'resources', 'icon', 'column-dark.png'),
    light: path.join(__dirname, '..', '..', 'resources', 'icon', 'column-light.png'),
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
