import { TreeItem, TreeItemCollapsibleState } from 'vscode';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

export class BookmarkTreeItem extends TreeItem {
  public contextValue = 'bookmark.item';

  constructor(public name: string, public query: string, public parent: BookmarkTreeGroup) {
    super(name, TreeItemCollapsibleState.None);
    this.description = query;
    this.tooltip = query;
    this.command = {
      title: 'Edit',
      command: `${EXT_NAMESPACE}.editBookmark`,
      arguments: [this],
    };
  }

  public toJSON() {
    return { [this.name]: this.query };
  }
}

export class BookmarkTreeGroup extends TreeItem {
  public parent = null;
  public contextValue = 'bookmark.group';
  public items: { [id: string]: BookmarkTreeItem } = {};

  public addItem(name: string, query: string) {
    if (!query || (query && query.trim().length === 0)) {
      return;
    }
    if (this.items[name]) {
      this.items[name].description = query.trim();
      return this.items[0];
    }
    this.items[name] = new BookmarkTreeItem(name, query, this);

    return this.items[name];
  }

  public delete(name: string) {
    delete this.items[name];
  }

  public get length() {
    return Object.keys(this.items).length;
  }

  public toJSON() {
    const items = Object.values(this.items).reduce(( groupped, item) => ({ ...groupped, ...item.toJSON() }), {});
    return { [this.name]: items };
  }

  constructor(public name: string) {
    super(name, TreeItemCollapsibleState.Expanded);
    this.tooltip = name;
  }
}