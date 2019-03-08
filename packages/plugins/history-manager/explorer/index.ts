import { asArray } from '@sqltools/core/utils';
import { EventEmitter, ProviderResult, TreeDataProvider } from 'vscode';
import { HistoryTreeItem, HistoryTreeGroup } from './tree-items';

type HistoryExplorerItem = HistoryTreeItem | HistoryTreeGroup;

export class HistoryExplorer implements TreeDataProvider<HistoryExplorerItem> {
  private _onDidChangeTreeData: EventEmitter<HistoryExplorerItem | undefined> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  private tree: { [database: string]: HistoryTreeGroup } = {};

  public getTreeItem(element: HistoryExplorerItem): HistoryExplorerItem {
    return element;
  }

  public getChildren(element?: HistoryExplorerItem): ProviderResult<HistoryExplorerItem[]> {
    if (!element) {
      return Promise.resolve(asArray(this.tree));
    } else if (element instanceof HistoryTreeItem) {
      return Promise.resolve([]);
    }
    return [];
  }

  public getParent(element: HistoryTreeItem | HistoryTreeGroup) {
    return element.parent || null;
  }
  public refresh(item?: HistoryExplorerItem) {
    this._onDidChangeTreeData.fire(item);
  }


  public constructor() {
  }
}

export default HistoryExplorer;