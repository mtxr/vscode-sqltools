import { ThemeIcon, TreeItemCollapsibleState, commands, TreeItem, Uri } from 'vscode';
import SidebarAbstractItem from './SidebarAbstractItem';
import { getIconPaths } from '@sqltools/vscode/icons';
import { MConnectionExplorer, ContextValue } from '@sqltools/types';
import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { SidebarConnection } from '.';

export default class SidebarItem<T extends MConnectionExplorer.IChildItem = MConnectionExplorer.IChildItem> extends SidebarAbstractItem<SidebarItem> {
  public iconPath: ThemeIcon | { light: Uri, dark: Uri} = ThemeIcon.Folder;
  public value: string;
  public async getChildren() {
    const items: MConnectionExplorer.IChildItem[] = await commands.executeCommand(`${EXT_NAMESPACE}.getChildrenForTreeItem`, {
      conn: this.conn,
      item: this.metadata,
      parent: this.parent && this.parent.metadata || undefined
    });
    if (items.length === 0) {
      return [new TreeItem('Nothing here') as SidebarItem];
    }
    return items.map(item => new SidebarItem(item, this));
  }

  public contextValue = ContextValue.RESOURCE_GROUP;
  constructor(public metadata: T, public parent: SidebarItem | SidebarConnection) {
    super(metadata.label, TreeItemCollapsibleState.Collapsed);
    this.conn = this.parent.conn;
    this.description = this.metadata ? this.metadata.detail || null : null;
    this.value = typeof this.label === 'string' ? this.label : this.label?.label;
    metadata.snippet && (this.snippet = metadata.snippet);
    if (metadata.type) {
      this.contextValue = metadata.type;
      if (metadata.type && metadata.iconId) {
        this.iconPath =  new ThemeIcon(metadata.iconId);
      } else if (metadata.type && metadata.iconName) {
        this.iconPath =  getIconPaths(metadata.iconName);
      } else {
        this.iconPath = getIconPaths(metadata.type.replace('connection.', ''));
      }
    }
    if (metadata.childType === ContextValue.NO_CHILD) {
      this.collapsibleState = TreeItemCollapsibleState.None;
    }
  }
}
