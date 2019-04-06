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

  private _isActive = false;

  public get isConnected() {
    return this.conn.isConnected;
  }
  public get id() {
    return <string>this.getId();
  }
  public get value() {
    return this.conn.database;
  }

  public get tooltip() {
    if (this._isActive) return `Active Connection - Queries will run for this connection`;
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
        active: this.context.asAbsolutePath('icons/database-active.svg'),
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
    const iconOptions = Object.assign({}, SidebarConnection.icons);
    if (this.conn.icons) {
      if (this.conn.icons.active) {
        iconOptions.active = Uri.parse(this.conn.icons.active);
      }

      if (this.conn.icons.connected) {
        iconOptions.connected = Uri.parse(this.conn.icons.connected);
      }
      if (this.conn.icons.disconnected) {
        iconOptions.disconnected = Uri.parse(this.conn.icons.disconnected);
      }
    }
    this.iconPath = iconOptions.disconnected;
    if (this._isActive) {
      this.iconPath = iconOptions.active;
    } else if (this.contextValue === 'connectedConnection') {
      this.iconPath = iconOptions.connected;
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
    this._isActive = true;
    this.expand();
    this.contextValue = 'connectedConnection';
    this.updateIconPath();
    return this;
  }

  public deactivate() {
    this._isActive = false;
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

  public get isActive() {
    return this._isActive;
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
  public get columns(): DatabaseInterface.TableColumn[] {
    return this.items.map(item => item.column);
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
  static icons;
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
    if (!SidebarColumn.icons) {
      SidebarColumn.icons = {
        default: {
          dark: this.context.asAbsolutePath('icons/column-dark.png'),
          light: this.context.asAbsolutePath('icons/column-light.png'),
        },
        primaryKey: this.context.asAbsolutePath('icons/pk.svg'),
        foreignKey: this.context.asAbsolutePath('icons/fk.svg'),
      }
    }
    this.updateIconPath();
    this.command = {
      title: 'Append to Cursor',
      command: `${EXT_NAME}.insertText`,
      arguments: [this],
    };
  }

  public updateIconPath() {
    this.iconPath = SidebarColumn.icons.default;
    if (this.column.isPk) {
      this.iconPath = SidebarColumn.icons.primaryKey;
    } else if (this.column.isFk) {
      this.iconPath = SidebarColumn.icons.foreignKey;
    }
  }
}
