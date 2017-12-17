import * as fs from 'fs';
import * as path from 'path';
import {
  Event,
  EventEmitter,
  ProviderResult,
  TreeDataProvider,
  TreeItemCollapsibleState,
} from 'vscode';
import Connection from './connection';
import { SidebarColumn, SidebarTable } from './sidebar-tree-items';

export class SidebarTableColumnProvider implements TreeDataProvider<SidebarTable | SidebarColumn> {
  public onDidChange: EventEmitter<SidebarTable | undefined> = new EventEmitter<SidebarTable | undefined>();
  public readonly onDidChangeTreeData: Event<SidebarTable | undefined> = this.onDidChange.event;
  private tree: SidebarTable[] = [];
  private tableIndex: any = {};

  constructor(private connection: Connection) {
    this.setConnection(connection);
  }

  public refresh(): void {
    this.onDidChange.fire();
  }

  public getTreeItem(element: SidebarTable | SidebarColumn): SidebarTable | SidebarColumn {
    return element;
  }

  public getChildren(element?: SidebarTable): ProviderResult<SidebarTable[] | SidebarColumn[]> {
    if (element) {
      return Promise.resolve(this.tree[this.tableIndex[element.value]].columns);
    }
    return Promise.resolve(this.tree);
  }
  public setConnection(connection: Connection) {
    this.connection = connection;
    this.tree = [];
    if (!connection) {
      this.refresh();
      return;
    }
    this.connection.getTables()
      .then((tables) => {
        this.tree = tables.sort((a, b) => a.name.localeCompare(b.name)).map((table, index) => {
          this.tableIndex[table.name] = index;
          return new SidebarTable(table);
        });
        this.refresh();
        return this.connection.getColumns()
          .then((columns) => {
            columns.sort((a, b) => a.columnName.localeCompare(b.columnName)).forEach((column) => {
              this.tree[this.tableIndex[column.tableName]].columns.push(new SidebarColumn(column));
            });
            this.refresh();
          });
      });
  }
}
