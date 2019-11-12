import { EXT_NAME } from '@sqltools/core/constants';
import { ConnectionInterface } from '@sqltools/core/interface';
import { getConnectionDescription, getConnectionId, asArray } from '@sqltools/core/utils';
import { isDeepStrictEqual } from 'util';
import { ExtensionContext, TreeItemCollapsibleState, Uri, commands } from 'vscode';
import { getIconPathForDriver } from '@sqltools/core/utils/driver';
import SidebarAbstractItem from './SidebarAbstractItem';
import SidebarResourceGroup from "./SidebarResourceGroup";
import get from 'lodash/get';
import ContextValue from '../context-value';
import logger from '@sqltools/core/log';

const log = logger.extend('conn-explorer');

export default class SidebarConnection extends SidebarAbstractItem<SidebarResourceGroup<SidebarAbstractItem>> {
  public static icons: { [driver: string]: { active: SidebarAbstractItem['iconPath']; connected: SidebarAbstractItem['iconPath']; disconnected: SidebarAbstractItem['iconPath'] } } = {};
  public parent = null;

  public get contextValue() {
    return this.isConnected ? ContextValue.CONNECTED_CONNECTION : ContextValue.CONNECTION;
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
    try {
      
      if (!SidebarConnection.icons.default) {
        SidebarConnection.icons.defaut = {
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
  
      if (!SidebarConnection.icons[conn.driver]) {
        SidebarConnection.icons[conn.driver] = {
          active: Uri.parse(context.asAbsolutePath(getIconPathForDriver(conn.driver, 'active'))),
          connected: Uri.parse(context.asAbsolutePath(getIconPathForDriver(conn.driver, 'default'))),
          disconnected: Uri.parse(context.asAbsolutePath(getIconPathForDriver(conn.driver, 'inactive'))),
        };
      }
    } catch (error) {
      log.extend('error')(error);
    }
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

  private getIcon = (type: 'active' | 'connected' | 'disconnected') => {
    if (get(this, ['conn', 'icons', type])) {
      return Uri.parse(this.conn.icons[type]);
    }

    return SidebarConnection.icons[this.conn.driver][type];
  }
}
