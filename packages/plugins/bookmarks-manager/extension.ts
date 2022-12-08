import BookmarksExplorer from './explorer';
import { insertText, getSelectedText, readInput } from '@sqltools/vscode/utils';
import { quickPick } from '@sqltools/vscode/utils/quickPick';
import { QuickPickItem, commands, window } from 'vscode';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { BookmarkTreeGroup, BookmarkTreeItem } from './explorer/tree-items';
import { IExtensionPlugin, IExtension } from '@sqltools/types';
import Context from '@sqltools/vscode/context';

export default class BookmarksManagerPlugin implements IExtensionPlugin {
  public readonly name = 'Bookmarks Manager Plugin';
  private explorer: BookmarksExplorer;
  private errorHandler: IExtension['errorHandler'];

  private bookmarksMenu = async (): Promise<BookmarkTreeItem> => {
    const items = this.explorer.getChildren().reduce<QuickPickItem[]>((agg, group: BookmarkTreeGroup) =>
      agg.concat(
        Object.values(group.items).map<QuickPickItem>(item => ({
          label: item.name,
          detail: typeof item.description === 'string' ? item.description : undefined,
          description: typeof group.label === 'string' ? group.label : group.label?.label,
          item,
        }))
      ), []);
    return quickPick<BookmarkTreeItem>(
      items,
      'item',
      {
        matchOnDescription: true,
        matchOnDetail: true,
        placeHolder: 'Pick a bookmarked query',
        placeHolderDisabled: 'You don\'t have any bookmarks yet.',
        title: 'Bookmarks',
      });
  }

  private ext_editBookmark = async (item?: BookmarkTreeItem): Promise<void> => {
    try {
      item = item || (await this.bookmarksMenu());
      // Add an option for bookmark header
      const headerText = `-- @block Bookmarked query
-- @group {queryGroup}
-- @name {queryName}\n\n`.replace('{queryName}', item.name).replace('{queryGroup}', item.parent.name);
      insertText(`${headerText}${item.query}`, true, true);
    } catch (e) {
      this.errorHandler('Could not edit bookmarked query', e);
    }
  }
  private ext_bookmarkSelection = async () => {
    try {
      const query = await getSelectedText('bookmark');
      if (!query || !query.trim()) return;
      const name = await readInput('Query name');
      const group = await readInput('Group Name', undefined, 'Ungrouped');
      this.explorer.addItem(group, name, query);
    } catch (e) {
      this.errorHandler('Error bookmarking query.', e);
    }
  }

  private ext_deleteBookmark = async (item?: BookmarkTreeItem): Promise<void> => {
    try {
      item = item || (await this.bookmarksMenu());
      if (!item) return;
      this.explorer.delete(item.parent.name, item.name);
    } catch (e) {
      this.errorHandler('Error deleting bookmark.', e);
    }
  }

  private ext_clearBookmarks = (): void => {
    this.explorer.clear();
  }

  private ext_runFromBookmarks = async (item?: BookmarkTreeItem): Promise<void> => {
    try {
      item = item || (await this.bookmarksMenu());
      if (!item) return;
      await commands.executeCommand(`${EXT_NAMESPACE}.executeQuery`, item.query);
    } catch (e) {
      this.errorHandler('Error while running query.', e);
    }
  }


  public register(extension: IExtension) {
    if (this.explorer) return; // do not register twice

    this.explorer = new BookmarksExplorer();

    Context.subscriptions.push(
      window.createTreeView(
        `${EXT_NAMESPACE}ViewBookmarksExplorer`,
        { treeDataProvider: this.explorer, showCollapseAll: true, canSelectMany: false }
      )
    );

    this.errorHandler = extension.errorHandler;

    extension
    .registerCommand('bookmarkSelection', this.ext_bookmarkSelection)
    .registerCommand('clearBookmarks', this.ext_clearBookmarks)
    .registerCommand('editBookmark', this.ext_editBookmark)
    .registerCommand('deleteBookmark', this.ext_deleteBookmark)
    .registerCommand('runFromBookmarks', this.ext_runFromBookmarks);
  }
}