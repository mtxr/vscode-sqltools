import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface, DatabaseInterface } from '@sqltools/core/interface';
import { getDbId } from '@sqltools/core/utils';
import { SidebarColumn, SidebarConnection, SidebarDatabaseSchemaGroup, SidebarTable, SidebarView } from '@sqltools/plugins/connection-manager/explorer/tree';
import { EventEmitter, ProviderResult, TreeDataProvider, TreeItem, TreeView, window } from 'vscode';

export type SidebarDatabaseItem = SidebarConnection
| SidebarTable
| SidebarColumn
| SidebarView
| SidebarDatabaseSchemaGroup;

export class ConnectionExplorer implements TreeDataProvider<SidebarDatabaseItem> {
  private static _instance: ConnectionExplorer;
  private treeView: TreeView<TreeItem>;
  private _onDidChangeTreeData: EventEmitter<SidebarDatabaseItem | undefined> = new EventEmitter();
  private _onConnectionDidChange: EventEmitter<{ conn: ConnectionInterface, action: 'added' | 'deleted' | 'changed' }[]> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  public readonly onConnectionDidChange = this._onConnectionDidChange.event;
  private tree: { [database: string]: SidebarConnection } = {};
  public getActive(): ConnectionInterface | null {
    const activeId = Object.keys(this.tree).find(k => this.tree[k].active);
    if (!activeId) return null;

    return {
      ...this.tree[activeId].conn,
      id: getDbId(this.tree[activeId].conn),
    } as ConnectionInterface;
  }

  public getTreeItem(element: SidebarDatabaseItem): SidebarDatabaseItem {
    return element;
  }

  public getChildren(element?: SidebarDatabaseItem): ProviderResult<SidebarDatabaseItem[]> {
    if (!element) {
      return Promise.resolve(this.toArray(this.tree));
    } else if (
      element instanceof SidebarConnection
      || element instanceof SidebarTable
      || element instanceof SidebarView
      || element instanceof SidebarDatabaseSchemaGroup
    ) {
      return Promise.resolve(this.toArray(element.items));
    }
    return [];
  }

  public getParent(element: SidebarDatabaseItem) {
    return element.parent || null;
  }
  public refresh() {
    this._onDidChangeTreeData.fire();
  }

  public setConnections(connections: (ConnectionInterface)[]) {
    const keys = [];
    const changed: { conn: ConnectionInterface, action: 'added' | 'deleted' | 'changed' }[] = [];

    connections.forEach((conn) => {
      if (this.tree[getDbId(conn)] && this.tree[getDbId(conn)].updateCreds(conn)) {
        changed.push({ conn, action: 'changed' });
      } else {
        this.tree[getDbId(conn)] = new SidebarConnection(conn);
        changed.push({ conn, action: 'added' });
      }
      keys.push(getDbId(conn));
    });

    if (Object.keys(this.tree).length !== keys.length) {
      Object.keys(this.tree).forEach(k => {
        if (keys.indexOf(k) >= 0) return;
        changed.push({ conn: this.tree[k].conn, action: 'deleted' });
        delete this.tree[k];
      });
    }
    this.refresh();
    if (changed.length > 0) {
      this._onConnectionDidChange.fire(changed);
    }
  }

  public setTreeData(
    conn: ConnectionInterface,
    tables: DatabaseInterface.Table[],
    columns: DatabaseInterface.TableColumn[],
  ) {
    if (!conn) return;
    const treeKey = getDbId(conn);

    this.tree[treeKey] = this.tree[treeKey] || new SidebarConnection(conn);

    this.tree[treeKey].reset();

    if (!tables && !columns) {
      return this.refresh();
    }

    tables.sort((a, b) => a.name.localeCompare(b.name)).forEach((item) => {
      if (!this.tree[treeKey]) return;
      this.tree[treeKey].addItem(item);
    });
    let key;
    columns.sort((a, b) => a.columnName.localeCompare(b.columnName)).forEach((column) => {
      key = this.tree[treeKey].views.items[column.tableName] ? 'views' : 'tables';
      this.tree[treeKey][key].items[column.tableName].addItem(column);
    });
    this.refresh();
    if (this.tree[treeKey].active && key)
      this.treeView.reveal(this.tree[treeKey][key], { select: false, focus: false });
  }

  public setActiveConnection(c?: ConnectionInterface, reveal?: boolean) {
    const idActive = c ? getDbId(c) : null;
    Object.keys(this.tree).forEach(id => {
      if (id !== idActive) {
        return this.tree[id].deactivate();
      }
      this.tree[id].activate();
      if (reveal) {
        this.treeView.reveal(this.tree[id].tables, { select: false, focus: false });
        this.treeView.reveal(this.tree[id]);
      }
    });
    this.refresh();
  }

  public disconnect(c: ConnectionInterface) {
    if (!this.tree[getDbId(c)]) return;
    this.tree[getDbId(c)].disconnect();
    this._onDidChangeTreeData.fire(this.tree[getDbId(c)]);
  }

  private toArray(obj: any) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map((k) => obj[k]);
  }

  public getById(id: string) {
    return this.tree[id] ? this.tree[id].conn : undefined;
  }

  private constructor() {
    this.treeView = window.createTreeView(`${EXT_NAME}.tableExplorer`, { treeDataProvider: this });
    ConfigManager.addOnUpdateHook(() => {
      this.setConnections(ConfigManager.connections);
    });

  }

  public static get instance() {
    return this._instance || (this._instance = new this());
  }
}

export { SidebarColumn, SidebarConnection, SidebarTable, SidebarView };

export default ConnectionExplorer.instance;