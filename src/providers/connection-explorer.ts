import fs = require('fs');
import path = require('path');
import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
} from 'vscode';
import LoggerInterface from '../api/interface/logger';
import { Logger } from './../api';
import Connection from './../api/connection';
import {
  SidebarColumn,
  SidebarDatabase,
  SidebarDatabaseStructure,
  SidebarTable,
  SidebarView,
} from './sidebar-provider/sidebar-tree-items';

export type SidebarDatabaseItem = SidebarDatabase | SidebarTable | SidebarColumn | SidebarView;

export class ConnectionExplorer implements TreeDataProvider<SidebarDatabaseItem> {
  public onDidChange: EventEmitter<SidebarDatabaseItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData: Event<SidebarDatabaseItem | undefined> =
    this.onDidChange.event;
  private tree: { [database: string]: SidebarDatabase} = {};
  public fireUpdate(): void {
    this.onDidChange.fire();
  }

  public getTreeItem(element: SidebarDatabaseItem): SidebarDatabaseItem {
    return element;
  }

  public getChildren(element?: SidebarDatabaseItem): ProviderResult<SidebarDatabaseItem[]> {
    if (!element) {
      return Promise.resolve(this.toArray(this.tree));
    } else if (element instanceof SidebarDatabase) {
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

  public setTreeData(tables, columns) {
    this.tree = {};
    tables.sort((a, b) => a.name.localeCompare(b.name)).forEach((item, index) => {
      if (!this.tree[item.tableDatabase]) {
        this.tree[item.tableDatabase] = new SidebarDatabase(item.tableDatabase);
      }
      this.tree[item.tableDatabase].addItem(item);
    });
    columns.sort((a, b) => a.columnName.localeCompare(b.columnName)).forEach((column) => {
      const key = this.tree[column.tableDatabase].views.items[column.tableName] ? 'views' : 'tables';
      this.tree[column.tableDatabase][key].items[column.tableName].addItem(new SidebarColumn(column));
    });
    this.fireUpdate();
  }

  private toArray(obj: any) {
    if (Array.isArray(obj)) {
      return obj;
    }
    return Object.keys(obj).map((k) => obj[k]);
  }
}

export { SidebarColumn, SidebarDatabase, SidebarTable, SidebarView };
