import { EXT_NAMESPACE } from '@sqltools/util/constants';
import { IConnection, MConnectionExplorer, ContextValue, IIcons } from '@sqltools/types';
import { getConnectionDescription, getConnectionId } from '@sqltools/util/connection';
import { TreeItemCollapsibleState, Uri, ThemeIcon, commands } from 'vscode';
import SidebarAbstractItem from './SidebarAbstractItem';
import SidebarItem from "./SidebarItem";
import get from 'lodash/get';
import { createLogger } from '@sqltools/log/src';
import PluginResourcesMap, { buildResourceKey } from '@sqltools/util/plugin-resources';

const log = createLogger('conn-explorer');

export default class SidebarConnection extends SidebarAbstractItem<SidebarItem> {
  parent = null;

  constructor(public conn: IConnection) {
    super(conn.name, conn.isConnected ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None);
    this.description = getConnectionDescription(this.conn);
    this.id = this.getId();
    this.tooltip = this.getTooltip();
    this.iconPath = this.getIconPath();
    this.command = this.getCommand();
  }

  getId() {
    return getConnectionId(this.conn);
  }

  get contextValue() {
    return this.isConnected ? ContextValue.CONNECTED_CONNECTION : ContextValue.CONNECTION;
  }

  get isConnected() {
    return this.conn.isConnected;
  }

  get isActive() {
    return this.conn.isActive;
  }

  get value() {
    return this.conn.database;
  }

  get metadata() {
    return <MConnectionExplorer.IChildItem>{
      label: this.label,
      type: this.contextValue,
      database: this.conn.database,
      schema: ''
    };
  }

  private getTooltip() {
    if (this.isActive)
      return `Active Connection - Queries will run for this connection`;
    return undefined;
  }

  async getChildren() {
    if (!this.isConnected) {
      await commands.executeCommand(`${EXT_NAMESPACE}.selectConnection`, this);
    }
    const items: MConnectionExplorer.IChildItem[] = await commands.executeCommand(`${EXT_NAMESPACE}.getChildrenForTreeItem`, {
      conn: this.conn,
      item: this.metadata,
    });
    return items.map(item => new SidebarItem(item, this));
  }

  private getCommand() {
    if (!this.isActive) {
      return {
        title: 'Connect',
        command: `${EXT_NAMESPACE}.selectConnection`,
        arguments: [this],
      };
    }
  }

  private getIconPath(): Uri | ThemeIcon {
    try {
      if (this.isActive) {
        return this.getIcon('active');
      }
      else if (this.isConnected) {
        return this.getIcon('connected');
      }
      return this.getIcon('disconnected');
    } catch (error) {
      log.error(error);
    }
  }

  private getIcon = (type: 'active' | 'connected' | 'disconnected'): Uri | ThemeIcon => {
    if (get(this, ['conn', 'icons', type])) {
      return Uri.parse(this.conn.icons[type]);
    }

    const typeMap = {
      active: 'active',
      connected: 'default',
      disconnected: 'inactive',
    };

    const iconFile = (PluginResourcesMap.get<IIcons>(buildResourceKey({ type: 'driver', name: this.conn.driver, resource: 'icons' })) || {})[typeMap[type] as any || 'default'];

    // Fall back to a ThemeIcon if driver didn't register one of the type we want
    return iconFile ? Uri.file(iconFile) : new ThemeIcon('server-environment');
  }
}
