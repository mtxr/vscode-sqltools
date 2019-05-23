import { EventEmitter, TreeDataProvider,TreeView, ExtensionContext } from 'vscode';
import { BookmarkTreeItem, BookmarkTreeGroup } from './tree-items';
import { window } from 'vscode';
import { EXT_NAME } from '@sqltools/core/constants';
import { getHome } from '@sqltools/core/utils';
import fs from 'fs';
import path from 'path';

type BookmarkExplorerItem = BookmarkTreeItem | BookmarkTreeGroup;

export class BookmarkExplorer implements TreeDataProvider<BookmarkExplorerItem> {
  private treeView: TreeView<BookmarkExplorerItem>;
  private _onDidChangeTreeData: EventEmitter<BookmarkExplorerItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private tree: { [group: string]: BookmarkTreeGroup } = {};

  public getTreeItem(element: BookmarkExplorerItem): BookmarkExplorerItem {
    return element;
  }

  public getChildren(element?: BookmarkExplorerItem): BookmarkExplorerItem[] {
    if (!element) {
      return Object.keys(this.tree).map(group => this.tree[group]);
    } else if (element instanceof BookmarkTreeGroup) {
      return Object.values(element.items);
    }
    return [];
  }

  public getParent(element: BookmarkTreeItem | BookmarkTreeGroup) {
    return element.parent || null;
  }
  public refresh = (item?: BookmarkExplorerItem) => {
    this._onDidChangeTreeData.fire(item);
  }

  public addItem(group: string, name: string, query: string, skipSave: boolean = false) {
    if (!query || (query && query.trim().length === 0)) return;

    if (!this.tree[group]) {
      this.tree[group] = new BookmarkTreeGroup(group);
    }

    this.tree[group].addItem(name, query);
    this.refresh();
    if (!skipSave) this.save();
  }

  private get oldFilePath() {
    return path.join(getHome(), `.Bookmarks.SQLToolsStorage.json`);
  }

  private get filePath() {
    return path.join(this.asAbsolutePath('Bookmarks.json'));
  }

  /**
   * will be removed in the future.
   * Just move the old file to the new path
   */
  private migrateOldFile() {
    if (!fs.existsSync(this.oldFilePath)) return;
    try {
      fs.renameSync(this.oldFilePath, this.filePath);
      let data = {};
      try {
        data = JSON.parse(fs.readFileSync(this.filePath).toString('utf8'))
      } catch (error) {}
      const Bookmarks = {
        Ungrouped: data,
      };
      fs.writeFileSync(this.filePath, JSON.stringify(Bookmarks));
    } catch (e) {}
  }

  private readFromFile() {
    this.migrateOldFile();
    try {
      if (!fs.existsSync(this.filePath)) {
        fs.writeFileSync(this.filePath, '{}');
      }
      const data = JSON.parse(fs.readFileSync(this.filePath).toString('utf8'));
      Object.keys(data).forEach(group => {
        Object.keys(data[group]).forEach(name => {
          const query = data[group][name];
          this.addItem(group, name, query, true);
        });
      })

    } catch(e) {
      console.error('Error reading bookmarks:', e);
    }
  }

  public async clear() {
    const res = await window.showInformationMessage('Do you really want to delete all your bookmarks?', { modal: true }, 'Yes');
    if (res === 'Yes') {
      this.tree = {};
      this.refresh();
      this.save();
    }
  }

  public async delete(group: string, name: string) {
    const res = await window.showInformationMessage(`Do you really want to delete ${name} bookmark?`, { modal: true }, 'Yes');
    if (res !== 'Yes') return;

    this.tree[group].delete(name);
    if (this.tree[group].length === 0) {
      delete this.tree[group];
      this.refresh();
      this.save();
    }
    this.refresh(this.tree[group]);
    this.save();
  }

  private save() {
    const data = Object.values(this.tree).reduce(( groupped, item) => ({ ...groupped, ...item.toJSON() }), {});
    return fs.writeFileSync(this.filePath, JSON.stringify(data));
  }

  private asAbsolutePath: ExtensionContext['asAbsolutePath'];

  constructor(context: ExtensionContext) {
    this.asAbsolutePath = context.asAbsolutePath;
    this.treeView = window.createTreeView<BookmarkExplorerItem>(`${EXT_NAME}/bookmarksExplorer`, { treeDataProvider: this });
    context.subscriptions.push(this.treeView);
    this.readFromFile();
  }
}

export default BookmarkExplorer;
