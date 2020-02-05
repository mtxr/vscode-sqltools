import { asArray } from '@sqltools/util/transform';
import { ThemeIcon, TreeItemCollapsibleState } from 'vscode';
import SidebarAbstractItem from './SidebarAbstractItem';
import ContextValue from '../context-value';
import { getIconPaths } from '@sqltools/vscode/icons';

export default class SidebarResourceGroup<T extends SidebarAbstractItem = SidebarAbstractItem> extends SidebarAbstractItem<T> {
  public iconPath = ThemeIcon.Folder;
  public contextValue = ContextValue.RESOURCE_GROUP;
  public value: string;
  public tree: {
    [name: string]: T;
  } = {};
  public get items() {
    return asArray<T>(this.tree);
  }
  public get description() {
    return this.detail || `${Object.keys(this.tree).length} ${this.label.toLowerCase()}`;
  }
  public get conn() {
    return this.parent.conn;
  }
  public parent: SidebarAbstractItem;
  constructor(public label: string, private detail?: string, iconType?: string) {
    super(label, TreeItemCollapsibleState.Collapsed);
    this.value = this.label;
    if (iconType) {
      this.iconPath = getIconPaths(iconType);
    }
  }
  public addItem(item: T) {
    this.tree[item.value] = this.tree[item.value] || item;
    this.tree[item.value].parent = this;
    return this;
  }
  public reset() {
    this.tree = {};
  }
}
