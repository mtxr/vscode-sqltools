import { ConnectionInterface } from '@sqltools/core/interface';
import { TreeItem, TreeItemCollapsibleState } from 'vscode';

export class HistoryTreeItem extends TreeItem {
  public contextValue = 'historyItem';
  public get tooltip() {
    return this.value;
  }

  constructor(public conn: ConnectionInterface, public value: string, public parent: HistoryTreeGroup) {
    super(conn.name, TreeItemCollapsibleState.None);
  }
}

export class HistoryTreeGroup extends TreeItem {
  public parent = null;
  public contextValue = 'historyGroup';
  public get tooltip() {
    return this.name;
  }

  constructor(public name: string) {
    super(name, TreeItemCollapsibleState.Collapsed);
  }
}