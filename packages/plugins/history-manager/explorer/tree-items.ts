import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME } from '@sqltools/core/constants';

export class HistoryTreeItem extends TreeItem {
  public contextValue = 'history.item';
  public description: string;
  public get tooltip() {
    return this.query;
  }

  constructor(public query: string, public parent: HistoryTreeGroup) {
    super(query, TreeItemCollapsibleState.None);
    this.description = new Date().toLocaleString();
    this.command = {
      title: 'Edit',
      command: `${EXT_NAME}.editFromHistory`,
      arguments: [this],
    };
  }
}

export class HistoryTreeGroup extends TreeItem {
  public parent = null;
  public contextValue = 'history.group';
  public items: HistoryTreeItem[] = [];
  public get tooltip() {
    return this.name;
  }

  public addItem(query: string) {
    if (!query || (query.trim().length === 0)) {
      return;
    }
    if (this.items.length > 0 && this.items[0].query.trim() === query.toString().trim()) {
      this.items[0].description = new Date().toLocaleString();
      return this.items[0];
    }
    this.items = [new HistoryTreeItem(query, this)].concat(this.items);

    this.sizeKeeper();

    return this.items[0];
  }

  private sizeKeeper = () => {
    if (this.items.length >= this.getMaxSize()) {
      this.items.length = this.getMaxSize();
      this.refresh(this);
    }
  }
  private getMaxSize() {
    return (ConfigManager.historySize || 100);
  }

  constructor(public name: string, private refresh: Function) {
    super(name, TreeItemCollapsibleState.Expanded);

    ConfigManager.addOnUpdateHook(this.sizeKeeper);
  }
}