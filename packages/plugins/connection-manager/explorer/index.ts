import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { IConnection } from '@sqltools/types';
import { getConnectionId } from '@sqltools/util/connection';
import { SidebarTreeItem } from '@sqltools/plugins/connection-manager/explorer/tree-items';
import SidebarItem from "@sqltools/plugins/connection-manager/explorer/SidebarItem";
import SidebarConnection from "@sqltools/plugins/connection-manager/explorer/SidebarConnection";
import { EventEmitter, TreeDataProvider, TreeItem, TreeView, window, TreeItemCollapsibleState, commands, ThemeIcon } from 'vscode';
import sortBy from 'lodash/sortBy';
import logger from '@sqltools/util/log';
import Context from '@sqltools/vscode/context';
import Config from '@sqltools/util/config-manager';

const log = logger.extend('conn-man:explorer');

class ConnectionGroup extends TreeItem {
  items: (ConnectionGroup | SidebarTreeItem)[] =  [];
  isGroup: boolean = true;
  getChildren() {
    return this.items;
  }
}

const connectedTreeItem: ConnectionGroup = new ConnectionGroup('Connected', TreeItemCollapsibleState.Expanded);
connectedTreeItem.id = 'CONNECTED'
connectedTreeItem.iconPath = ThemeIcon.Folder;

const notConnectedTreeItem: ConnectionGroup = new ConnectionGroup('Not Connected', TreeItemCollapsibleState.Expanded);
notConnectedTreeItem.id = 'DISCONNECTED';
notConnectedTreeItem.iconPath = ThemeIcon.Folder;


export class ConnectionExplorer implements TreeDataProvider<SidebarTreeItem> {
  private treeView: TreeView<TreeItem>;
  private _active: SidebarConnection = null;
  private _onDidChangeTreeData: EventEmitter<SidebarTreeItem | undefined> = new EventEmitter();
  private _onDidChangeActiveConnection: EventEmitter<IConnection> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  public readonly onDidChangeActiveConnection = this._onDidChangeActiveConnection.event;

  public getActive(): IConnection | null {
    if (!this._active) return null;

    return {
      ...this._active.conn,
      id: getConnectionId(this._active.conn),
    };
  }

  public getActiveId() {
    const active = this.getActive();
    if (!active) return null;
    return active.id;
  }

  public getTreeItem = (element: SidebarTreeItem) => element;

  public async getChildren(element?: SidebarTreeItem) {
    if (!element) {
      return this.getRootItems();
    }
    const items = await element.getChildren();
    if (Config.flattenGroupsIfOne && items.length === 1) {
      return this.getChildren(items[0]);
    }
    return items;
  }

  public getParent = (element: SidebarTreeItem) => element.parent || null;

  public refresh(item?: SidebarTreeItem) {
    this._onDidChangeTreeData.fire(item);
    log.extend('debug')(`Connection explorer changed. Will be updated. ${item ? `Changed item: ${item.label}` : ''}`.trim());
  }

  public async getConnectionById(id: string): Promise<IConnection> {
    if (!id) return null;
    const items = await this.getConnections();
    return items.find(c => getConnectionId(c) === id) || null;
  }

  public focus(item?: SidebarConnection) {
    return this.treeView.reveal(item || this.treeView.selection[0] || this._active, {
      focus: true,
      select: true,
    });
  }
  public getSelection() {
    return this.treeView.selection;
  }

  public constructor() {
    this.treeView = window.createTreeView(`${EXT_NAMESPACE}/connectionExplorer`, { treeDataProvider: this, canSelectMany: true, showCollapseAll: true });
    Config.addOnUpdateHook(({ event }) => {
      if (
        event.affectsConfig('flattenGroupsIfOne')
        || event.affectsConfig('connections')
        || event.affectsConfig('connectionExplorer.groupConnected')
        || event.affectsConfig('sortColumns')
      ) {
        this.refresh();
      }
    });
    Context.subscriptions.push(this.treeView);
  }

  private getConnections(): Thenable<IConnection[]> {
    return commands.executeCommand(`${EXT_NAMESPACE}.getConnections`);
  }
  private getConnectionsTreeItems = async () => {
    const connections: IConnection[] = await this.getConnections();
    const items: SidebarConnection[] = connections.map(conn => new SidebarConnection(conn));

    return items;
  }

  private getOrCreateConnectionGroup = (currentGroup: ConnectionGroup, groupId: string, item: SidebarConnection) => {
    let subGroup = currentGroup.items.find((it: ConnectionGroup) => it.id === groupId) as ConnectionGroup;
    if (!subGroup) {
      subGroup = new ConnectionGroup(item.conn.group, TreeItemCollapsibleState.Expanded);
      subGroup.id = groupId;
      subGroup.iconPath = ThemeIcon.Folder;
      currentGroup.items.push(subGroup);
    }
    subGroup.description = `${subGroup.items.length + 1} connections`;
    return subGroup;
  }

  private async getRootItems(): Promise<TreeItem[]> {
    const groupConnected = Config['connectionExplorer.groupConnected'];
    const items = await this.getConnectionsTreeItems();
    if (items.length === 0) {
      const addNew = new TreeItem('No Connections. Click here to add one', TreeItemCollapsibleState.None);
      addNew.command = {
        title: 'Add New Connections',
        command: `${EXT_NAMESPACE}.openAddConnectionScreen`,
      };
      return [addNew];
    }

    if (groupConnected) {
      return this.getGroupedRootItems(items);
    }

    const root: ConnectionGroup = new ConnectionGroup('Root');
    root.items = [];
    this._active = null;
    items.forEach(item => {
      if (item.isActive) {
        this._active = item;
      }
      let currentGroup: ConnectionGroup = root;
      if (item.conn && item.conn.group) {
        const groupId = `GID:${item.conn.group}`;
        let subGroup = this.getOrCreateConnectionGroup(currentGroup, groupId, item);
        currentGroup = subGroup;
      }
      currentGroup.items.push(item);
    });
    this._onDidChangeActiveConnection.fire(this._active ? this._active.conn : null);

    root.items = sortBy(root.items, ['isGroup', 'label']);

    return root.items;
  }

  private getGroupedRootItems(items: SidebarConnection[]) {
    connectedTreeItem.items = [];
    notConnectedTreeItem.items = [];
    let connectedTreeCount = 0;
    let notConnectedTreeCount = 0;
    this._active = null;
    items.forEach(item => {
      if (item.isActive) {
        this._active = item;
      }
      let currentGroup: ConnectionGroup = null;
      if (item.isConnected) {
        currentGroup = connectedTreeItem;
        connectedTreeCount++;
      } else {
        currentGroup = notConnectedTreeItem;
        notConnectedTreeCount++
      }
      if (item.conn && item.conn.group) {
        const groupId = `GID:${item.isConnected ? 'C' : 'N'}:${item.conn.group}`;
        let subGroup = this.getOrCreateConnectionGroup(currentGroup, groupId, item);
        currentGroup = subGroup;
      }
      currentGroup.items.push(item);
    });
    this._onDidChangeActiveConnection.fire(this._active ? this._active.conn : null);

    connectedTreeItem.items = sortBy(connectedTreeItem.items, ['isGroup', 'label']);
    notConnectedTreeItem.items = sortBy(notConnectedTreeItem.items, ['isGroup', 'label']);

    notConnectedTreeItem.description = `${notConnectedTreeCount} connections`;
    connectedTreeItem.description = `${connectedTreeCount} connections`;

    return [connectedTreeItem, notConnectedTreeItem].filter(a => a.items.length > 0);
  }
}

export { SidebarConnection, SidebarItem, SidebarTreeItem };

export default ConnectionExplorer;
