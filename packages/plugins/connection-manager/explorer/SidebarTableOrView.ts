// @TODO to be deleted

import ConfigRO from '@sqltools/util/config-manager';
import { TreeItemCollapsibleState, SnippetString } from 'vscode';
import { NSDatabase, ContextValue } from '@sqltools/types';
import prefixedtableName from '@sqltools/util/query/prefixed-tablenames';
import SidebarAbstractItem from './SidebarAbstractItem';
import SidebarColumn from './SidebarColumn';
import { getIconPaths } from '@sqltools/vscode/icons';

export default class SidebarTableOrView extends SidebarAbstractItem<SidebarColumn> {
  public contextValue = ContextValue.TABLEORVIEW;
  public value: string;
  public toString() {
    return this.table.name;
  }
  public get name() {
    return prefixedtableName(this.conn.driver, this.table);
  }
  public get columns(): NSDatabase.IColumn[] {
    return this._columns.map(item => item.column);
  }
  public get items() {
    return this._columns;
  }
  public get snippet(): SnippetString {
    if (!this.conn)
      return;
    let snptArr = prefixedtableName(this.conn.driver, this.table).split('.');
    return new SnippetString(snptArr.map((v, i) => `\${${i + 1}:${v}}`).join('.') + '$0');
  }
  public _columns: SidebarColumn[] = [];
  public get conn() { return this.parent.conn; }
  public get description() {
    if (typeof this.table.numberOfColumns === 'undefined')
      return '';
    return `${this.table.numberOfColumns} cols`;
  }
  constructor(public table: NSDatabase.ITable) {
    super(table.name, (ConfigRO.get('tableTreeItemsExpanded', false)
      ? TreeItemCollapsibleState.Expanded
      : TreeItemCollapsibleState.Collapsed));
    this.value = this.table.name;
    if (this.table.isView) {
      this.iconPath = getIconPaths('view');
    }
    else {
      this.iconPath = getIconPaths('table');
    }
  }
  public addItem(item: SidebarColumn) {
    item.parent = this;
    this._columns.push(item);
    return this;
  }
}
