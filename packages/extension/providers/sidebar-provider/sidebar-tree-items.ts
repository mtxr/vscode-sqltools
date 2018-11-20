import {
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import ContextManager from '../../context';
import ConfigManager from '@sqltools/core/config-manager';
import { DatabaseInterface } from '@sqltools/core/interface';

export class SidebarDatabase extends TreeItem {
  public contextValue = 'connection.database';
  public value: string;

  public tables: SidebarDatabaseStructure = new SidebarDatabaseStructure('Tables');
  public views: SidebarDatabaseStructure = new SidebarDatabaseStructure('Views');
  constructor(private name: string) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.value = name;
    this.label = name;
    this.iconPath = {
      dark: ContextManager.context.asAbsolutePath('icons/database-dark.svg'),
      light: ContextManager.context.asAbsolutePath('icons/database-light.svg'),
    };
  }

  public addItem(item) {
    const key = item.isView ? 'views' : 'tables';
    this[key].addItem(item.isView ? new SidebarView(item) : new SidebarTable(item));
  }
}

const tableTreeItemsExpanded = ConfigManager.get('tableTreeItemsExpanded', true);

export class SidebarDatabaseStructure extends TreeItem {
  public iconPath = ThemeIcon.Folder;
  public contextValue = 'connection.structure';
  public items: { [name: string]: SidebarTable | SidebarView} = {};
  constructor(private name) {
    super(name, TreeItemCollapsibleState.Expanded);
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
  public contextValue = 'connection.tableOrView';
  public value: string;

  public items: SidebarColumn[] = [];
  constructor(table: DatabaseInterface.Table) {
    super(table.name, (
      tableTreeItemsExpanded === true
        ? TreeItemCollapsibleState.Expanded
        : TreeItemCollapsibleState.Collapsed
    ));
    this.value = table.name;
    this.label = `${table.name} (${table.numberOfColumns} cols)`;
    this.iconPath = {
      dark: ContextManager.context.asAbsolutePath('icons/table-dark.svg'),
      light: ContextManager.context.asAbsolutePath('icons/table-light.svg'),
    };
  }

  public addItem(item) {
    this.items.push(item);
  }
}

export class SidebarView extends SidebarTable {
}

export class SidebarColumn extends TreeItem {
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
    this.iconPath = {
      dark: ContextManager.context.asAbsolutePath('icons/column-dark.png'),
      light: ContextManager.context.asAbsolutePath('icons/column-light.png'),
    };
  }
}
