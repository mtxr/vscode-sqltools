import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { IConnection, MConnectionExplorer, ContextValue } from '@sqltools/types';
import { getConnectionDescription, getConnectionId } from '@sqltools/util/connection';
import { TreeItemCollapsibleState, Uri, commands } from 'vscode';
import { getIconPathForDriver } from '@sqltools/util/path/driver';
import SidebarAbstractItem from './SidebarAbstractItem';
import SidebarItem from "./SidebarItem";
import get from 'lodash/get';
import logger from '@sqltools/util/log';
import Context from '@sqltools/vscode/context';
const log = logger.extend('conn-explorer');

export default class SidebarConnection extends SidebarAbstractItem<SidebarItem> {
  parent = null;

  get contextValue() {
    return this.isConnected ? ContextValue.CONNECTED_CONNECTION : ContextValue.CONNECTION;
  }

  get description() {
    return getConnectionDescription(this.conn);
  }

  get isConnected() {
    return this.conn.isConnected;
  }
  get id() {
    return <string>this.getId();
  }
  get value() {
    return this.conn.database;
  }

  get itemMetadata() {
    return <MConnectionExplorer.IChildItem>{
      id: this.id,
      type: 'connection'
    };
  }
  get tooltip() {
    if (this.isActive)
      return `Active Connection - Queries will run for this connection`;
    return undefined;
  }

  async getChildren() {
    if (!this.isConnected) {
      await commands.executeCommand(`${EXT_NAMESPACE}.selectConnection`, this);
    }
    const items: MConnectionExplorer.IChildItem[] = await commands.executeCommand(`${EXT_NAMESPACE}.getChildrenForTreeItem`, {
      conn: this.conn, item: this.itemMetadata
    });
    return items.map(item => new SidebarItem(item, this));
  }

  public get command () {
    if (!this.isActive) {
      return {
        title: 'Connect',
        command: `${EXT_NAMESPACE}.selectConnection`,
        arguments: [this],
      };
    }
  }

  constructor(public conn: IConnection) {
    super(conn.name, conn.isConnected ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None);
  }
  get iconPath() {
    try {
      if (this.isActive) {
        return this.getIcon('active');
      }
      else if (this.contextValue === ContextValue.CONNECTED_CONNECTION) {
        return this.getIcon('connected');
      }
      return this.getIcon('disconnected');
    } catch (error) {
      log.extend('error')(error);
    }
  }
  getId() {
    return getConnectionId(this.conn);
  }

  get isActive() {
    return this.conn.isActive;
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
