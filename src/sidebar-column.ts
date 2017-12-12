import * as path from 'path';
import {
  Command,
  Event,
  EventEmitter,
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode';

export class SidebarColumn extends TreeItem {
  public iconPath = {
    dark: path.join(__dirname, '..', '..', 'resources', 'icon', 'column-dark.png'),
    light: path.join(__dirname, '..', '..', 'resources', 'icon', 'column-light.png'),
  };
  public contextValue = 'column';

  constructor(
    public readonly label: string,
    public readonly collapsibleState: TreeItemCollapsibleState,
  ) {
    super(label, collapsibleState);
    this.contextValue = 'connection.column';
  }

}
