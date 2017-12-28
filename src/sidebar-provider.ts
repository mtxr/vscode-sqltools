import fs = require('fs');
import path = require('path');
import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItemCollapsibleState,
} from 'vscode';
import { Logger } from './api';
import Connection from './connection';
import { SidebarColumn, SidebarDatabase, SidebarTable } from './sidebar-tree-items';

export type SidebarDatabaseItem = SidebarDatabase | SidebarTable | SidebarColumn;

export class SidebarTableColumnProvider implements TreeDataProvider<SidebarDatabaseItem> {
  public onDidChange: EventEmitter<SidebarDatabaseItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData: Event<SidebarDatabaseItem | undefined> =
    this.onDidChange.event;
  private tree: any = {};

  constructor(private connection: Connection, private logger: Logger) {
    this.setConnection(connection);
  }

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
      return Promise.resolve(this.toArray(element.tables));
    } else if (element instanceof SidebarTable) {
      return Promise.resolve(this.toArray(element.columns));
    }
    return [];
  }
  public setConnection(connection: Connection) {
    this.connection = connection;
    this.refresh();
  }

  public refresh() {
    this.tree = {};
    if (!this.connection) {
      this.fireUpdate();
      return;
    }
    this.connection.getTables()
      .then((tables) => {
        tables.sort((a, b) => a.name.localeCompare(b.name)).forEach((table, index) => {
          if (!this.tree[table.tableDatabase]) {
            this.tree[table.tableDatabase] = new SidebarDatabase({ name: table.tableDatabase });
          }
          if (!this.tree[table.tableDatabase].tables[table.name]) {
            this.tree[table.tableDatabase].tables[table.name] = new SidebarTable(table);
          }
        });
        return this.connection.getColumns()
          .then((columns) => {
            columns.sort((a, b) => a.columnName.localeCompare(b.columnName)).forEach((column) => {
              this.tree[column.tableDatabase].tables[column.tableName].columns.push(new SidebarColumn(column));
            });
            this.fireUpdate();
          });
      })
      .catch((e) => { this.logger.error('Failed to prepare sidebar itens', e); });
  }

  private toArray(obj: any) {
    return Object.keys(obj).map((k) => obj[k]);
  }
}
