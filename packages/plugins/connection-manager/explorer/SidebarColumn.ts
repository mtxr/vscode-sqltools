import { EXT_NAME } from '@sqltools/core/constants';
import { ExtensionContext, TreeItemCollapsibleState } from 'vscode';
import { DatabaseInterface } from '@sqltools/core/plugin-api';
import SidebarAbstractItem from './SidebarAbstractItem';
export default class SidebarColumn extends SidebarAbstractItem<null> {
  static icons;
  public contextValue = 'connection.column';
  public value: string;
  public get items(): null { return null; }
  public addItem(_: never): never {
    throw new Error('Cannot add items to table column');
  }
  public get description() {
    let typeSize = '';
    if (this.column.size !== null) {
      typeSize = `(${this.column.size})`;
    }
    return `${(this.column.type || '').toUpperCase()}${typeSize}`;
  }
  public get conn() { return this.parent.conn; }
  constructor(context: ExtensionContext, public column: DatabaseInterface.TableColumn) {
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
      };
    }
    this.updateIconPath();
    this.command = {
      title: 'Append to Cursor',
      command: `${EXT_NAME}.insertText`,
      arguments: [`\${1:${column.columnName}}$0`],
    };
  }
  public updateIconPath() {
    this.iconPath = SidebarColumn.icons.default;
    if (this.column.isPk) {
      this.iconPath = SidebarColumn.icons.primaryKey;
    }
    else if (this.column.isFk) {
      this.iconPath = SidebarColumn.icons.foreignKey;
    }
  }
}
