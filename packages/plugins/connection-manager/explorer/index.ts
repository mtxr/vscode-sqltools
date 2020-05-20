import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { IConnection, NSDatabase } from '@sqltools/types';
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
  private messagesTreeView: TreeView<TreeItem>;
  private messagesTreeViewProvider: MessagesProvider;
  private _onDidChangeTreeData: EventEmitter<SidebarTreeItem | undefined> = new EventEmitter();
  private _onDidChangeActiveConnection: EventEmitter<IConnection> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  public readonly onDidChangeActiveConnection = this._onDidChangeActiveConnection.event;

  public async getActive(): Promise<IConnection | null> {
    const conns = await this.getConnections();
    const active = conns.find(c => c.isActive);
    if (!active) return null;

    return {
      ...active,
      id: getConnectionId(active),
    };
  }

  public async getActiveId() {
    const active = await this.getActive();
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

  public getSelection() {
    return this.treeView.selection;
  }

  public constructor() {
    this.treeView = window.createTreeView(`${EXT_NAMESPACE}-view-connectionExplorer`, { treeDataProvider: this, canSelectMany: true, showCollapseAll: true });
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
    this.messagesTreeViewProvider = new MessagesProvider();
    this.messagesTreeView = window.createTreeView(`${EXT_NAMESPACE}-view-consoleMessages`, { treeDataProvider: this.messagesTreeViewProvider, canSelectMany: false, showCollapseAll: true });
    Context.subscriptions.push(this.treeView, this.messagesTreeView);
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
      return null;
    }

    let active = null;
    if (groupConnected) {
      return this.getGroupedRootItems(items);
    }

    const root: ConnectionGroup = new ConnectionGroup('Root');
    root.items = [];
    items.forEach(item => {
      if (item.isActive) {
        active = item.conn;
      }
      let currentGroup: ConnectionGroup = root;
      if (item.conn && item.conn.group) {
        const groupId = `GID:${item.conn.group}`;
        let subGroup = this.getOrCreateConnectionGroup(currentGroup, groupId, item);
        currentGroup = subGroup;
      }
      currentGroup.items.push(item);
    });
    this._onDidChangeActiveConnection.fire(active);

    root.items = sortBy(root.items, ['isGroup', 'label']);

    return root.items;
  }

  private getGroupedRootItems(items: SidebarConnection[]) {
    connectedTreeItem.items = [];
    notConnectedTreeItem.items = [];
    let connectedTreeCount = 0;
    let notConnectedTreeCount = 0;
    let active = null;
    items.forEach(item => {
      if (item.isActive) {
        active = item.conn;
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
    this._onDidChangeActiveConnection.fire(active);

    connectedTreeItem.items = sortBy(connectedTreeItem.items, ['isGroup', 'label']);
    notConnectedTreeItem.items = sortBy(notConnectedTreeItem.items, ['isGroup', 'label']);

    notConnectedTreeItem.description = `${notConnectedTreeCount} connections`;
    connectedTreeItem.description = `${connectedTreeCount} connections`;

    return [connectedTreeItem, notConnectedTreeItem].filter(a => a.items.length > 0);
  }

  public get addConsoleMessages () {
    return this.messagesTreeViewProvider.addMessages;
  }
}

export class MessagesProvider implements TreeDataProvider<TreeItem> {
  private items: TreeItem[] = [];
  private _onDidChangeTreeData: EventEmitter<TreeItem> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
    return element;
  }
  async getChildren(element?: TreeItem): Promise<TreeItem[]> {
    if (element) return Promise.resolve(null);
    return Promise.resolve(this.items);
  }

  getParent = (_: TreeItem) => {
    return null;
  }

  addMessages = (messages: NSDatabase.IResult['messages'] = []) => {
    this.items = messages.map(m => {
      if (typeof m === 'string')
        return new TreeItem(m, TreeItemCollapsibleState.None);
      const date = new Date(m.date || undefined);
      const item = new TreeItem(m.message, TreeItemCollapsibleState.None);
      item.description = date.toLocaleTimeString();
      item.tooltip = date.toString();
      return item;
    });
    this._onDidChangeTreeData.fire(null);
  }
}

export { SidebarConnection, SidebarItem, SidebarTreeItem };

export default ConnectionExplorer;
