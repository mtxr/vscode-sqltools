import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
} from 'vscode';
import {
  SidebarColumn,
  SidebarConnection,
  SidebarDatabaseSchemaGroup,
  SidebarTable,
  SidebarView,
} from './sidebar-provider/sidebar-tree-items';
import { ConnectionCredentials, SerializedConnection } from '@sqltools/core/interface';
import { Logger } from '../api';
export type SidebarDatabaseItem = SidebarConnection | SidebarTable | SidebarColumn | SidebarView;

export class ConnectionExplorer implements TreeDataProvider<SidebarDatabaseItem> {
  public onDidChange: EventEmitter<SidebarDatabaseItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData: Event<SidebarDatabaseItem | undefined> =
  this.onDidChange.event;
  private tree: { [database: string]: SidebarConnection} = {};
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
  public refresh() {
    this.fireUpdate();
  }

  public setConnections(connections: ConnectionCredentials[]) {
    const keys = [];
    connections.forEach((conn) => {
      this.tree[this.getDbId(conn)] = this.tree[this.getDbId(conn)] || new SidebarConnection(conn);
      keys.push(this.getDbId(conn));
    });

    if (Object.keys(this.tree).length !== keys.length) {
      Object.keys(this.tree).forEach(k => {
        if (keys.indexOf(k) >= 0) return;
        delete this.tree[k];
      });
    }
    this.refresh();
  }

  public setTreeData(conn: SerializedConnection, tables, columns) {
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
    columns.sort((a, b) => a.columnName.localeCompare(b.columnName)).forEach((column) => {
      const key = this.tree[treeKey].views.items[column.tableName] ? 'views' : 'tables';
      this.tree[treeKey][key].items[column.tableName].addItem(new SidebarColumn(column, conn));
    });
    this.refresh();
  }

  public setActiveConnection(c?: SerializedConnection) {
    const idActive = c ? this.getDbId(c) : null;
    Object.keys(this.tree).forEach(id => {
      if (id === idActive) {
        return this.tree[id].activate();
      }
      return this.tree[id].deactivate();
    });
  }

  private getDbId(c: SerializedConnection | ConnectionCredentials) {
    return `${c.name}#${c.database}#${c.dialect}`;
  }

  private toArray(obj: any) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map((k) => obj[k]);
  }
}

export { SidebarColumn, SidebarConnection, SidebarTable, SidebarView };
