import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface } from '@sqltools/core/interface';
import { getConnectionDescription, getConnectionId, asArray } from '@sqltools/core/utils';
import { isDeepStrictEqual } from 'util';
import { ExtensionContext, TreeItemCollapsibleState, Uri, commands } from 'vscode';
import SidebarAbstractItem from './SidebarAbstractItem';
import SidebarResourceGroup from "./SidebarResourceGroup";
import get from 'lodash/get';

export default class SidebarConnection extends SidebarAbstractItem<SidebarResourceGroup<SidebarAbstractItem>> {
  public static icons;
  public parent = null;

  public get contextValue() {
    return this.isConnected ? 'connectedConnection' : 'connection';
  }
  public tree: {
    [id: string]: SidebarResourceGroup;
  } = {};
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

  constructor(context: ExtensionContext, public conn: ConnectionInterface) {
    super(conn.name, TreeItemCollapsibleState.None);
    if (!SidebarConnection.icons) {
      SidebarConnection.icons = {
        active: {
          dark: context.asAbsolutePath('icons/database-active-dark.svg'),
          light: context.asAbsolutePath('icons/database-active-light.svg')
        },
        connected: {
          dark: context.asAbsolutePath('icons/database-dark.svg'),
          light: context.asAbsolutePath('icons/database-light.svg'),
        },
        disconnected: {
          dark: context.asAbsolutePath('icons/database-disconnected-dark.svg'),
          light: context.asAbsolutePath('icons/database-disconnected-light.svg'),
        }
      };
    }
  }
  public get iconPath() {
    if (this.isActive) {
      return get(this, 'conn.icons.active') ? Uri.parse(this.conn.icons.active) : SidebarConnection.icons.active;
    }
    else if (this.contextValue === 'connectedConnection') {
      return get(this, 'conn.icons.connected') ? Uri.parse(this.conn.icons.connected) : SidebarConnection.icons.connected;;
    }
    return get(this, 'conn.icons.disconnected') ? Uri.parse(this.conn.icons.disconnected) : SidebarConnection.icons.disconnected;;
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

  public updateStatus(c: ConnectionInterface) {
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
  public updateCreds(creds: ConnectionInterface) {
    if (isDeepStrictEqual(this.conn, creds)) {
      return false;
    }
    this.conn = creds;
    if (!this.isConnected) {
      this.reset();
    }
    return true;
  }
}
