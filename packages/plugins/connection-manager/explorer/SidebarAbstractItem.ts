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
  snippet?: SnippetString;
  abstract value: string;
  abstract conn: ConnectionInterface;
  abstract items: T[];
  abstract addItem(item: A): this;
  public parent: SidebarAbstractItem = null;
}
