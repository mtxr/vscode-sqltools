import { ConnectionInterface } from '@sqltools/core/interface';
import { TreeItem, SnippetString } from 'vscode';
interface SidebarItemIterface<T extends SidebarItemIterface<any> | never, A = T> {
  parent: SidebarItemIterface<T, A>;
  value: string;
  snippet?: SnippetString;
  items: T[] | never;
  conn: ConnectionInterface;
  addItem(item: A): this | never;
}
export default abstract class SidebarAbstractItem<T extends SidebarItemIterface<SidebarAbstractItem> = any, A = T> extends TreeItem implements SidebarItemIterface<T, A> {
  tree?: {
    [id: string]: SidebarAbstractItem;
  };
  protected _snippet: SnippetString;
  get snippet() {
    if (!this._snippet) {
      this._snippet = new SnippetString(this.label);
    }
    return this._snippet;
  };

  set snippet(value: any) {
    this._snippet = value instanceof SnippetString ? value : new SnippetString(`${value}`);
  };
  abstract value: string;
  abstract conn: ConnectionInterface;
  abstract items: T[];
  abstract addItem(item: A): this;
  public parent: SidebarAbstractItem = null;
}
