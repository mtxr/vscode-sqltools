import { ExtensionContext, TreeItemCollapsibleState } from 'vscode';
import { NSDatabase } from '@sqltools/types';
import SidebarAbstractItem from './SidebarAbstractItem';
import ContextValue from '../context-value';
export default class SidebarColumn extends SidebarAbstractItem<null> {
  static icons;
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
  constructor(context: ExtensionContext, public column: NSDatabase.IColumn) {
    super(column.columnName, TreeItemCollapsibleState.None);
    this.value = column.columnName;
    if (!SidebarColumn.icons) {
      SidebarColumn.icons = {
        default: {
          dark: context.asAbsolutePath('icons/column-dark.svg'),
          light: context.asAbsolutePath('icons/column-light.svg'),
        },
        primaryKey: {
          dark: context.asAbsolutePath('icons/pk-dark.svg'),
          light: context.asAbsolutePath('icons/pk-lightk.svg'),
        },
        foreignKey: {
          dark: context.asAbsolutePath('icons/fk-dark.svg'),
          light: context.asAbsolutePath('icons/fk-light.svg'),
        },
        partitionKey: {
          dark: context.asAbsolutePath('icons/partition-key-dark.svg'),
          light: context.asAbsolutePath('icons/partition-key-light.svg'),
        },
      };
    }
    this.updateIconPath();
  }
  public updateIconPath() {
    this.iconPath = SidebarColumn.icons.default;
    if (this.column.isPartitionKey) {
      this.iconPath = SidebarColumn.icons.partitionKey;
    }
    else if (this.column.isPk) {
      this.iconPath = SidebarColumn.icons.primaryKey;
    }
    else if (this.column.isFk) {
      this.iconPath = SidebarColumn.icons.foreignKey;
    }
  }
}
