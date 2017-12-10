import * as fs from 'fs';
import * as path from 'path';
import {
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode';
import Connection from './connection';
import { SidebarColumn } from './sidebar-column';
import { SidebarTable } from './sidebar-table';

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

  public getTreeItem(element: SidebarTable): TreeItem {
    return element;
  }

  public getChildren(element?: SidebarTable): Thenable<SidebarTable[] | SidebarColumn[]> {
    if (element) {
      const cols: SidebarColumn[] = this.tree[this.tableIndex[element.label]].columns;
      return Promise.resolve(cols.sort((a, b) => a.label.localeCompare(b.label)));
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
          return new SidebarTable(table.name, TreeItemCollapsibleState.Collapsed, {
            arguments: [table.name],
            command: null,
            title: '',
          });
        });
        this.refresh();
        return this.connection.getColumns()
          .then((columns) => {
            columns.forEach((column) => {
              const col = new SidebarColumn(column.columnName, TreeItemCollapsibleState.None, {
                arguments: [column.columnName],
                command: null,
                title: '',
              });
              this.tree[this.tableIndex[column.tableName]].columns.push(col);
            });
            this.refresh();
          });
      });
  }
}
