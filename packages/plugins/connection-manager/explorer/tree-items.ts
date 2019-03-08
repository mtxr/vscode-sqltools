import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface, DatabaseInterface } from '@sqltools/core/interface';
import { getConnectionDescription, getConnectionId } from '@sqltools/core/utils';
import { isDeepStrictEqual } from 'util';
import { ExtensionContext, ThemeIcon, TreeItem, TreeItemCollapsibleState, Uri } from 'vscode';

export class SidebarConnection extends TreeItem {
  public static icons;

  public parent = null;
  public contextValue = 'connection';
  public tables: SidebarDatabaseSchemaGroup;
  public views: SidebarDatabaseSchemaGroup;

  public get items() {
    return [
      this.tables,
      this.views,
    ];
  }
  public get description() {
    return getConnectionDescription(this.conn);
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

  constructor(private context: ExtensionContext, public conn: ConnectionInterface) {
    super(conn.name, TreeItemCollapsibleState.None);
    this.tables = new SidebarDatabaseSchemaGroup('Tables', this);
    this.views = new SidebarDatabaseSchemaGroup('Views', this);
    this.command = {
      title: 'Connect',
      command: `${EXT_NAME}.selectConnection`,
      arguments: [this],
    };

    if (!SidebarConnection.icons) {
      SidebarConnection.icons = {
        active: Uri.parse(`file://${this.context.asAbsolutePath('icons/database-active.svg')}`),
        connected: {
          dark: this.context.asAbsolutePath('icons/database-dark.svg'),
          light: this.context.asAbsolutePath('icons/database-light.svg'),
        },
        disconnected: {
          dark: this.context.asAbsolutePath('icons/database-disconnected-dark.svg'),
          light: this.context.asAbsolutePath('icons/database-disconnected-light.svg'),
        }
      }
    }
    this.updateIconPath();
  }

  public updateIconPath() {
    this.iconPath = SidebarConnection.icons.disconnected;
    if (this.isActive) {
      this.iconPath = SidebarConnection.icons.active;
    } else if (this.contextValue === 'connectedConnection') {
      this.iconPath = SidebarConnection.icons.connected;
    }
  }

  public getId() {
    return getConnectionId(this.conn);
  }

  public addItem(item) {
    const key = item.isView ? 'views' : 'tables';
    const element = item.isView ? new SidebarView(this.context, item, this[key]) : new SidebarTable(this.context, item, this[key]);
    this[key].addItem(element);
    this.collapsibleState = this.collapsibleState === TreeItemCollapsibleState.None
      ? TreeItemCollapsibleState.Collapsed
      : this.collapsibleState;
    return element;
  }

  public reset() {
    if (this.views) this.views = new SidebarDatabaseSchemaGroup('Views', this);
    if (this.tables) this.tables = new SidebarDatabaseSchemaGroup('Tables', this);
    this.collapsibleState = TreeItemCollapsibleState.None;
    this.deactivate();
  }

  public activate() {
    this.isActive = true;
    this.expand();
    this.contextValue = 'connectedConnection';
    this.updateIconPath();
    return this;
  }

  public deactivate() {
    this.isActive = false;
    this.updateIconPath();
    return this;
  }

  public connect() {
    return this.activate();
  }

  public disconnect() {
    this.contextValue = 'connection';
    this.reset();
    return this;
  }

  public get active() {
    return this.isActive;
  }

  public expand() {
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }

  public updateCreds(creds: ConnectionInterface) {
    if (isDeepStrictEqual(this.conn, creds)) {
      return false;
    }
    this.conn = creds;
    this.reset();
    return true;
  }
}

export class SidebarDatabaseSchemaGroup extends TreeItem {
  public iconPath = ThemeIcon.Folder;
  public contextValue = 'connection.schema_group';
  public value = this.contextValue;
  public items: { [name: string]: SidebarTable | SidebarView} = {};
  public get description() {
    return `${Object.keys(this.items).length} ${this.label.toLowerCase()}`;
  }
  public get conn() { return this.parent.conn; }
  constructor(public label: string, public parent: SidebarConnection) {
    super(label, TreeItemCollapsibleState.Collapsed);
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
  public toString() {
    return this.table.name;
  }
  public get columns() {
    return this.items;
  }
  public items: SidebarColumn[] = [];
  public get conn() { return this.parent.conn; }
  public get description() {
    if (typeof this.table.numberOfColumns === 'undefined')  return '';
    return `${this.table.numberOfColumns} cols`;
  }

  constructor(private context: ExtensionContext, public table: DatabaseInterface.Table, public parent: SidebarDatabaseSchemaGroup) {
    super(table.name, (
      ConfigManager.get('tableTreeItemsExpanded', false)
        ? TreeItemCollapsibleState.Expanded
        : TreeItemCollapsibleState.Collapsed
    ));
    this.value = table.name;
    this.iconPath = {
      dark: this.context.asAbsolutePath('icons/table-dark.svg'),
      light: this.context.asAbsolutePath('icons/table-light.svg'),
    };
  }

  public addItem(item: DatabaseInterface.TableColumn) {
    this.items.push(new SidebarColumn(this.context, item, this));
  }
}

export class SidebarView extends SidebarTable { }

export class SidebarColumn extends TreeItem {
  public contextValue = 'connection.column';
  public value: string;

  public get description() {
    let typeSize = '';
    if (this.column.size !== null) {
      typeSize = `(${this.column.size})`;
    }
    return `${(this.column.type || '').toUpperCase()}${typeSize}`;
  }
  public get conn() { return this.parent.conn; }

  constructor(private context: ExtensionContext, public column: DatabaseInterface.TableColumn, public parent: SidebarTable) {
    super(column.columnName, TreeItemCollapsibleState.None);
    this.value = column.columnName;
    this.iconPath = {
      dark: this.context.asAbsolutePath('icons/column-dark.png'),
      light: this.context.asAbsolutePath('icons/column-light.png'),
    };
    this.command = {
      title: 'Append to Cursor',
      command: `${EXT_NAME}.insertText`,
      arguments: [this],
    };
  }
}
