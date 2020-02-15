import { ThemeIcon, TreeItemCollapsibleState } from 'vscode';
import SidebarAbstractItem from './SidebarAbstractItem';
import { getIconPaths } from '@sqltools/vscode/icons';
import { MConnectionExplorer, ContextValue } from '@sqltools/types';

export default class SidebarItem<T extends SidebarAbstractItem = SidebarAbstractItem> extends SidebarAbstractItem<T> {
  public iconPath = ThemeIcon.Folder;
  public value: string;
  public async getChildren() {
    return [];
  }
  public get description() {
    return this.itemMetadata && this.itemMetadata.detail || null;
  }
  public get conn() {
    return this.parent.conn;
  }
  public parent: SidebarAbstractItem;
  public contextValue = ContextValue.RESOURCE_GROUP;
  constructor(public itemMetadata: MConnectionExplorer.IChildItem) {
    super(itemMetadata.label, TreeItemCollapsibleState.Collapsed);
    this.value = this.label;
    if (itemMetadata.type) {
      this.iconPath = getIconPaths(itemMetadata.type);
      this.contextValue = ContextValue[itemMetadata.type.toUpperCase()];
    }
  }
}
