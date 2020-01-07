import { EXT_NAME } from '@sqltools/core/constants';
import { IConnection, DatabaseDriver, MConnectionExplorer } from '@sqltools/types';
import { getConnectionDescription, getConnectionId, asArray } from '@sqltools/core/utils';
import { isDeepStrictEqual } from 'util';
import { TreeItemCollapsibleState, Uri, commands } from 'vscode';
import { getIconPathForDriver } from '@sqltools/core/utils/driver';
import SidebarAbstractItem from './SidebarAbstractItem';
import SidebarResourceGroup from "./SidebarResourceGroup";
import get from 'lodash/get';
import ContextValue from '../context-value';
import logger from '@sqltools/core/log';
import Context from '@sqltools/vscode/context';

const log = logger.extend('conn-explorer');

export default class SidebarConnection extends SidebarAbstractItem<SidebarResourceGroup<SidebarAbstractItem>> {
  public parent = null;

  public get contextValue() {
    return this.isConnected ? ContextValue.CONNECTED_CONNECTION : ContextValue.CONNECTION;
  }
  public tree: {
    [id: string]: SidebarResourceGroup;
  } = {};

  public async checkItemsCache() {
    if (this.conn.driver === DatabaseDriver['PostgreSQL']) {
      const items: MConnectionExplorer.IChildItem[] = await commands.executeCommand(`${EXT_NAME}.getChildrenForTreeItem`, { conn: this.conn, itemType: 'root', itemId: this.getId() });
      items.forEach(item => {
        this.addItem(new SidebarResourceGroup(item.label, item.itemType));
      });
    }
  }
  public get items() {
    return asArray<SidebarResourceGroup>(this.tree);
  }
  public get description() {
    return getConnectionDescription(this.conn);
  }

  public get isConnected() {
    return this.conn.isConnected;
  }
  public get id() {
    return <string>this.getId();
  }
  public get value() {
    return this.conn.database;
  }
  public get tooltip() {
    if (this.isActive)
      return `Active Connection - Queries will run for this connection`;
    return undefined;
  }

  public async getChildren() {
    try {
      if (!this.isConnected) {
        await commands.executeCommand(`${EXT_NAME}.selectConnection`, this);
      }
      await this.checkItemsCache();
      return this.items;
    } catch(e) {
      return null;
    }
  }
  public get command () {
    if (!this.isActive) {
      return {
        title: 'Connect',
        command: `${EXT_NAME}.selectConnection`,
        arguments: [this],
      };
    }
  }

  constructor(public conn: IConnection) {
    super(conn.name, TreeItemCollapsibleState.None);
  }
  public get iconPath() {
    try {
      if (this.isActive) {
        return this.getIcon('active');
      }
      else if (this.contextValue === 'connectedConnection') {
        return this.getIcon('connected');
      }
      return this.getIcon('disconnected');
    } catch (error) {
      log.extend('error')(error);
    }
  }
  public getId() {
    return getConnectionId(this.conn);
  }
  public addItem(item: SidebarResourceGroup) {
    if (this.tree[item.value])
      return this;
    this.tree[item.value] = this.tree[item.value] || item;
    this.tree[item.value].parent = this;
    this.collapsibleState = this.collapsibleState === TreeItemCollapsibleState.None
      ? TreeItemCollapsibleState.Collapsed
      : this.collapsibleState;
    return this;
  }
  public reset() {
    this.tree = {};
    this.collapsibleState = TreeItemCollapsibleState.None;
  }

  public updateStatus(c: IConnection) {
    this.updateCreds(c);
    if (this.isActive) {
      this.expand();
    }
  }

  public get isActive() {
    return this.conn.isActive;
  }
  public expand() {
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
  }
  public updateCreds(creds: IConnection) {
    if (isDeepStrictEqual(this.conn, creds)) {
      return false;
    }
    this.conn = creds;
    if (!this.isConnected) {
      this.reset();
    }
    return true;
  }

  private getIcon = (type: 'active' | 'connected' | 'disconnected') => {
    if (get(this, ['conn', 'icons', type])) {
      return Uri.parse(this.conn.icons[type]);
    }

    const typeMap = {
      active: 'active',
      connected: 'default',
      disconnected: 'inactive',
    };

    return Uri.parse(Context.asAbsolutePath(getIconPathForDriver(this.conn.driver, typeMap[type] as any || 'default')));
  }
}
