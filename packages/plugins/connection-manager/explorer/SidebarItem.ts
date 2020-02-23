import { ThemeIcon, TreeItemCollapsibleState, commands, TreeItem } from 'vscode';
import SidebarAbstractItem from './SidebarAbstractItem';
import { getIconPaths } from '@sqltools/vscode/icons';
import { MConnectionExplorer, ContextValue } from '@sqltools/types';
import { EXT_NAMESPACE } from '@sqltools/util/constants';

export default class SidebarItem extends SidebarAbstractItem<SidebarItem> {
  public iconPath = ThemeIcon.Folder;
  public value: string;
  public async getChildren() {
    const items: MConnectionExplorer.IChildItem[] = await commands.executeCommand(`${EXT_NAMESPACE}.getChildrenForTreeItem`, {
      conn: this.conn, item: this.itemMetadata
    });
    if (items.length === 0) {
      return [new TreeItem('Nothing here') as SidebarItem];
    }
    return items.map(item => new SidebarItem(item, this));
  }

  public get description() {
    if (this.itemMetadata && this.itemMetadata.detail) {
      return this.itemMetadata.detail;
    }
    return null;
  }
  public get conn() {
    return this.parent.conn;
  }
  public contextValue = ContextValue.RESOURCE_GROUP;
  constructor(public itemMetadata: MConnectionExplorer.IChildItem, public parent: SidebarAbstractItem) {
    super(itemMetadata.label, TreeItemCollapsibleState.Collapsed);
    this.value = this.label;
    if (itemMetadata.type) {
      if (itemMetadata.type && itemMetadata.iconId) {
        this.iconPath =  new ThemeIcon(itemMetadata.iconId);
      } else {
        this.iconPath = getIconPaths(itemMetadata.type.replace('connection.', ''));
      }
      this.contextValue = itemMetadata.type;
    }
  }
}
