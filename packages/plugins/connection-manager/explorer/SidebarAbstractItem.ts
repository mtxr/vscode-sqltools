import { IConnection, MConnectionExplorer, ContextValue } from '@sqltools/types';
import { TreeItem, SnippetString } from 'vscode';
interface SidebarItemIterface<T extends SidebarItemIterface<any> | never, A = T> {
  parent: SidebarItemIterface<T, A>;
  value: string;
  snippet?: SnippetString;
  conn: IConnection;
  getChildren(): Promise<T[]>;
  metadata: MConnectionExplorer.IChildItem;
}
export default abstract class SidebarAbstractItem<T extends SidebarItemIterface<SidebarAbstractItem> = any, A = T> extends TreeItem implements SidebarItemIterface<T, A> {
  protected _snippet: SnippetString;
  get snippet() {
    if (!this._snippet) {
      this._snippet = new SnippetString(typeof this.label === 'string' ? this.label : this.label?.label);
    }
    return this._snippet;
  };

  set snippet(value: any) {
    this._snippet = value instanceof SnippetString ? value : new SnippetString(`${value}`);
  };
  conn: IConnection;
  parent: SidebarAbstractItem = null;
  abstract value: string;
  abstract contextValue: ContextValue;
  abstract metadata: MConnectionExplorer.IChildItem;
  abstract getChildren(): Promise<T[]>;
}
