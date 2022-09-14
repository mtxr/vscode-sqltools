import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import Config from '@sqltools/util/config-manager';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { cleanUp } from '@sqltools/util/query';

export class HistoryTreeItem extends TreeItem {
  public contextValue = 'history.item';

  constructor(public query: string, public parent: HistoryTreeGroup) {
    super(cleanUp(query), TreeItemCollapsibleState.None);
    this.description = new Date().toLocaleString();
    this.tooltip = this.query;
    this.command = {
      title: 'Edit',
      command: `${EXT_NAMESPACE}.editHistory`,
      arguments: [this],
    };
  }
}

export class HistoryTreeGroup extends TreeItem {
  public parent = null;
  public contextValue = 'history.group';
  public items: HistoryTreeItem[] = [];

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
    return Config.get('historySize', 100);
  }

  constructor(public name: string, private refresh: Function) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.tooltip = this.name;
    Config.addOnUpdateHook(({ event }) => event.affectsConfig('historySize') && this.sizeKeeper);
  }
}