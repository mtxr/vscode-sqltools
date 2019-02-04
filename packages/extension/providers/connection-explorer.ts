import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeView,
  TreeItem,
} from 'vscode';
import {
  SidebarColumn,
  SidebarConnection,
  SidebarDatabaseSchemaGroup,
  SidebarTable,
  SidebarView,
} from './sidebar-provider/sidebar-tree-items';
import { ConnectionCredentials, SerializedConnection, DatabaseInterface } from '@sqltools/core/interface';
import { Logger, Utils } from '../api';
import { getDbId } from '@sqltools/core/utils';
export type SidebarDatabaseItem = SidebarConnection
| SidebarTable
| SidebarColumn
| SidebarView
| SidebarDatabaseSchemaGroup;

export class ConnectionExplorer implements TreeDataProvider<SidebarDatabaseItem> {
  public onDidChange: EventEmitter<SidebarDatabaseItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData: Event<SidebarDatabaseItem | undefined> =
    this.onDidChange.event;
  private tree: { [database: string]: SidebarConnection } = {};
  constructor(private logger: Logger) { }
  public fireUpdate(): void {
    this.onDidChange.fire();
  }

  public getTreeItem(element: SidebarDatabaseItem): SidebarDatabaseItem {
    return element;
  }

  public getChildren(element?: SidebarDatabaseItem): ProviderResult<SidebarDatabaseItem[]> {
    if (!element) {
      return Promise.resolve(this.toArray(this.tree));
    } else if (element instanceof SidebarConnection) {
      const result = [];
      if (Object.keys(element.tables.items).length > 0) result.push(element.tables);
      if (Object.keys(element.views.items).length > 0) result.push(element.views);
      return Promise.resolve(result);
    } else if (
      element instanceof SidebarTable
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
    this.fireUpdate();
  }

  public setConnections(connections: ConnectionCredentials[]) {
    const keys = [];
    let shouldUpdate = false;
    connections.forEach((conn) => {
      if (this.tree[this.getDbId(conn)] && this.tree[this.getDbId(conn)].updateCreds(conn)) {
        shouldUpdate = true;
      } else {
        this.tree[this.getDbId(conn)] = new SidebarConnection(conn);
      }
      keys.push(this.getDbId(conn));
    });

    if (Object.keys(this.tree).length !== keys.length) {
      Object.keys(this.tree).forEach(k => {
        if (keys.indexOf(k) >= 0) return;
        delete this.tree[k];
      });
    }
    this.refresh();
    return shouldUpdate;
  }

  public setTreeData(
    conn: SerializedConnection,
    tables: DatabaseInterface.Table[],
    columns: DatabaseInterface.TableColumn[],
    treeView: TreeView<TreeItem>,
  ) {
    if (!conn) return;
    const treeKey = this.getDbId(conn);

    this.tree[treeKey] = this.tree[treeKey] || new SidebarConnection(conn);

    this.tree[treeKey].reset();

    if (!tables && !columns) {
      this.tree[treeKey].deactivate();
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
      treeView.reveal(this.tree[treeKey][key], { select: false, focus: false })
        .then(Promise.resolve, Promise.resolve);
  }

  public setActiveConnection(c?: SerializedConnection) {
    const idActive = c ? this.getDbId(c) : null;
    Object.keys(this.tree).forEach(id => {
      if (id !== idActive) {
        return this.tree[id].deactivate();
      }
      this.tree[id].activate();
    });
    this.refresh();
  }

  private getDbId(c: SerializedConnection | ConnectionCredentials) {
    return getDbId(c);
  }

  private toArray(obj: any) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map((k) => obj[k]);
  }
}

export { SidebarColumn, SidebarConnection, SidebarTable, SidebarView };
