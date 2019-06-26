import SQLTools from '@sqltools/core/plugin-api';
import BookmarksExplorer from './explorer';
import { quickPick, insertText, getSelectedText, readInput } from '@sqltools/core/utils/vscode';
import { QuickPickItem, commands } from 'vscode';
import { EXT_NAME } from '@sqltools/core/constants';
import { BookmarkTreeGroup, BookmarkTreeItem } from './explorer/tree-items';

export default class BookmarksManagerPlugin implements SQLTools.ExtensionPlugin {
  private explorer: BookmarksExplorer;
  private errorHandler: SQLTools.ExtensionInterface['errorHandler'];

  private bookmarksMenu = async (): Promise<BookmarkTreeItem> => {
    const items = this.explorer.getChildren().reduce<QuickPickItem[]>((agg, group: BookmarkTreeGroup) =>
      agg.concat(
        Object.values(group.items).map<QuickPickItem>(item => ({
          label: item.name,
          detail: item.description,
          description: group.label,
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
-- @name {queryGroup}
-- @group {queryName}\n\n`.replace('{queryName}', item.name).replace('{queryGroup}', item.parent.name);
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
      await commands.executeCommand(`${EXT_NAME}.executeQuery`, item.query);
    } catch (e) {
      this.errorHandler('Error while running query.', e);
    }
  }


  public register(extension: SQLTools.ExtensionInterface) {
    if (this.explorer) return; // do not register twice

    this.explorer = new BookmarksExplorer(extension.context);
    this.errorHandler = extension.errorHandler;

    extension
    .registerCommand('bookmarkSelection', this.ext_bookmarkSelection)
    .registerCommand('clearBookmarks', this.ext_clearBookmarks)
    .registerCommand('editBookmark', this.ext_editBookmark)
    .registerCommand('deleteBookmark', this.ext_deleteBookmark)
    .registerCommand('runFromBookmarks', this.ext_runFromBookmarks);
  }
}