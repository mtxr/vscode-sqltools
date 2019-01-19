import fs from 'fs';
import path from 'path';
import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
} from 'vscode';
import {
  SidebarColumn,
  SidebarConnection,
  SidebarDatabaseStructure,
  SidebarTable,
  SidebarView,
} from './sidebar-provider/sidebar-tree-items';
import { ConnectionCredentials, SerializedConnection } from '@sqltools/core/interface';

export type SidebarDatabaseItem = SidebarConnection | SidebarTable | SidebarColumn | SidebarView;

export class ConnectionExplorer implements TreeDataProvider<SidebarDatabaseItem> {
  public onDidChange: EventEmitter<SidebarDatabaseItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData: Event<SidebarDatabaseItem | undefined> =
    this.onDidChange.event;
  private tree: { [database: string]: SidebarConnection} = {};
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
      || element instanceof SidebarDatabaseStructure
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
      this.tree[this.getDbKey(conn)] = this.tree[this.getDbKey(conn)] || new SidebarConnection(conn);
      keys.push(this.getDbKey(conn));
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
    const treeKey = this.getDbKey(conn);

    if (this.tree[treeKey]) this.tree[treeKey].reset();

    tables.sort((a, b) => a.name.localeCompare(b.name)).forEach((item) => {
      if (!this.tree[treeKey]) return;
      this.tree[treeKey].addItem(item);
    });
    columns.sort((a, b) => a.columnName.localeCompare(b.columnName)).forEach((column) => {
      const key = this.tree[treeKey].views.items[column.tableName] ? 'views' : 'tables';
      this.tree[treeKey][key].items[column.tableName].addItem(new SidebarColumn(column));
    });
    this.refresh();
  }

  private getDbKey(c: SerializedConnection | ConnectionCredentials) {
    return `${c.name}:${c.database}`;
  }

  private toArray(obj: any) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map((k) => obj[k]);
  }
}

export { SidebarColumn, SidebarConnection, SidebarTable, SidebarView };
