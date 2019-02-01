import {
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import ContextManager from '../../context';
import ConfigManager from '@sqltools/core/config-manager';
import { DatabaseInterface, ConnectionCredentials } from '@sqltools/core/interface';
import { EXT_NAME } from '@sqltools/core/constants';

export class SidebarConnection extends TreeItem {
  public parent = null;
  public contextValue = 'connection';
  public tables: SidebarDatabaseSchemaGroup = new SidebarDatabaseSchemaGroup('Tables', this);
  public views: SidebarDatabaseSchemaGroup = new SidebarDatabaseSchemaGroup('Views', this);
  public get description() {
    return this.isActive ? 'active' : '';
  }

  private isActive = false;
  public get id() {
    return this.getId();
  }
  public get value() {
    return this.conn.database;
  }

  public get tooltip() {
    if (this.isActive) return `Active Connection - Queries will run for this connection`;
    return undefined;
  }

  constructor(public conn: ConnectionCredentials) {
    super(`${conn.database}@${conn.name}`, TreeItemCollapsibleState.None);
    this.iconPath = {
      dark: ContextManager.context.asAbsolutePath('icons/database-dark.svg'),
      light: ContextManager.context.asAbsolutePath('icons/database-light.svg'),
    };
    this.command = {
      title: '',
      command: `${EXT_NAME}.selectConnection`,
      arguments: [this],
    };
  }

  public getId() {
    return `${this.conn.name}#${this.conn.database}#${this.conn.dialect}`;
  }

  public addItem(item) {
    const key = item.isView ? 'views' : 'tables';
    const element = item.isView ? new SidebarView(item, this[key]) : new SidebarTable(item, this[key]);
    this[key].addItem(element);
    this.collapsibleState = this.collapsibleState === TreeItemCollapsibleState.None
      ? TreeItemCollapsibleState.Collapsed
      : this.collapsibleState;
    return element;
  }

  public reset() {
    if (this.views) this.views.reset();
    if (this.tables) this.tables.reset();
    this.collapsibleState = TreeItemCollapsibleState.None;
  }

  public activate() {
    this.isActive = true;
    this.expand();
    return this;
  }

  public deactivate() {
    this.isActive = false;
    return this;
  }

  public get active() {
    return this.isActive;
  }

  public expand() {
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }
}

export class SidebarDatabaseSchemaGroup extends TreeItem {
  public iconPath = ThemeIcon.Folder;
  public contextValue = 'connection.schema_group';
  public value = this.contextValue;
  public items: { [name: string]: SidebarTable | SidebarView} = {};
  public get conn() { return this.parent.conn; }
  constructor(private name, public parent: SidebarConnection) {
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

  public reset() {
    this.items = {};
  }
}

export class SidebarTable extends TreeItem {
  public contextValue = 'connection.tableOrView';
  public value: string;
  public items: SidebarColumn[] = [];
  public get conn() { return this.parent.conn; }

  constructor(public table: DatabaseInterface.Table, public parent: SidebarDatabaseSchemaGroup) {
    super(table.name, (
      ConfigManager.get('tableTreeItemsExpanded', false)
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

  public addItem(item: DatabaseInterface.TableColumn) {
    this.items.push(new SidebarColumn(item, this));
  }
}

export class SidebarView extends SidebarTable { }

export class SidebarColumn extends TreeItem {
  public contextValue = 'connection.column';
  public value: string;

  public get conn() { return this.parent.conn; }

  constructor(public column: DatabaseInterface.TableColumn, public parent: SidebarTable) {
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
