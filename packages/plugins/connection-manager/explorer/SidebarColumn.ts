import { TreeItemCollapsibleState } from 'vscode';
import { NSDatabase } from '@sqltools/types';
import SidebarAbstractItem from './SidebarAbstractItem';
import ContextValue from '../context-value';
import { getIconPaths } from '@sqltools/vscode/icons';
export default class SidebarColumn extends SidebarAbstractItem<null> {
  public contextValue = ContextValue.COLUMN;
  public value: string;
  public get items(): null { return null; }
  public addItem(_: never): never {
    throw new Error('Cannot add items to table column');
  }
  public get description() {
    let typeSize = '';
    if (typeof this.column.size !== 'undefined' && this.column.size !== null) {
      typeSize = `(${this.column.size})`;
    }
    return `${(this.column.type || '').toUpperCase()}${typeSize}`;
  }
  public get conn() { return this.parent.conn; }
  constructor(public column: NSDatabase.IColumn) {
    super(column.columnName, TreeItemCollapsibleState.None);
    this.value = column.columnName;
    this.updateIconPath();
  }
  public updateIconPath() {
    if (this.column.isPartitionKey) {
      this.iconPath = getIconPaths('partition-key');
    } else if (this.column.isPk) {
      this.iconPath = getIconPaths('pk');
    } else if (this.column.isFk) {
      this.iconPath = getIconPaths('fk');
    } else {
      this.iconPath = getIconPaths('column');
    }
  }
}
