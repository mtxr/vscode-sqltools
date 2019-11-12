import ConfigManager from '@sqltools/core/config-manager';
import { EXT_NAME, TREE_SEP } from '@sqltools/core/constants';
import { ConnectionInterface, DatabaseDriver } from '@sqltools/core/interface';
import { getConnectionId, asArray, getNameFromId } from '@sqltools/core/utils';
import { SidebarTreeItem } from '@sqltools/plugins/connection-manager/explorer/tree-items';
import SidebarFunction from "@sqltools/plugins/connection-manager/explorer/SidebarFunction";
import SidebarColumn from "@sqltools/plugins/connection-manager/explorer/SidebarColumn";
import SidebarTableOrView from "@sqltools/plugins/connection-manager/explorer/SidebarTableOrView";
import SidebarResourceGroup from "@sqltools/plugins/connection-manager/explorer/SidebarResourceGroup";
import SidebarConnection from "@sqltools/plugins/connection-manager/explorer/SidebarConnection";
import SidebarAbstractItem from "@sqltools/plugins/connection-manager/explorer/SidebarAbstractItem";
import { EventEmitter, TreeDataProvider, TreeItem, TreeView, window, TreeItemCollapsibleState, commands, ThemeIcon } from 'vscode';
import SQLTools, { DatabaseInterface } from '@sqltools/core/plugin-api';
import safeGet from 'lodash/get';
import sortBy from 'lodash/sortBy';
import logger from '@sqltools/core/log';

const log = logger.extend('conn-man:explorer');

const DriverHierarchyChildNames = {
  [DatabaseDriver.PostgreSQL]: ['Database', 'Schema'],
  [DatabaseDriver['AWS Redshift']]: ['Database', 'Schema'],
  [DatabaseDriver.Cassandra]: ['Keyspace'],
}

type ConnectionGroup = TreeItem & { items?: TreeItem[]; isGroup?: boolean };

const connectedTreeItem: ConnectionGroup = new TreeItem('Connected', TreeItemCollapsibleState.Expanded);
connectedTreeItem.id = 'CONNECTED'
connectedTreeItem.iconPath = ThemeIcon.Folder;

const notConnectedTreeItem: ConnectionGroup = new TreeItem('Not Connected', TreeItemCollapsibleState.Expanded);
notConnectedTreeItem.id = 'DISCONNECTED';
notConnectedTreeItem.iconPath = ThemeIcon.Folder;


export class ConnectionExplorer implements TreeDataProvider<SidebarTreeItem> {
  private treeView: TreeView<TreeItem>;
  private _onDidChangeTreeData: EventEmitter<SidebarTreeItem | undefined> = new EventEmitter();
  private _onConnectionDidChange: EventEmitter<{ conn: ConnectionInterface, action: 'added' | 'deleted' | 'changed' }[]> = new EventEmitter();
  public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
  public readonly onConnectionDidChange = this._onConnectionDidChange.event;
  private tree: { [database: string]: SidebarConnection } = {};
  public getActive(): ConnectionInterface | null {
    const activeId = Object.keys(this.tree).find(k => this.tree[k].isActive);
    if (!activeId) return null;

    return {
      ...this.tree[activeId].conn,
      id: getConnectionId(this.tree[activeId].conn),
    } as ConnectionInterface;
  }

  public getActiveId() {
    const active = this.getActive();
    if (!active) return null;
    return active.id;
  }

  public getTreeItem(element: SidebarTreeItem): SidebarTreeItem {
    return element;
  }

  private getTreeItems() {
    const items = asArray<SidebarConnection>(this.tree);
    if (items.length === 0) {
      const addNew = new TreeItem('No Connections. Click here to add one', TreeItemCollapsibleState.None);
      addNew.command = {
        title: 'Add New Connections',
        command: `${EXT_NAME}.openAddConnectionScreen`,
      };
      return [addNew];
    }

    connectedTreeItem.items = [];
    notConnectedTreeItem.items = [];
    let connectedTreeCount = 0;
    let notConnectedTreeCount = 0;
    items.forEach(item => {
      let group: ConnectionGroup = null;
      if (item.isConnected) {
        group = connectedTreeItem;
        connectedTreeCount++;
      } else {
        group = notConnectedTreeItem;
        notConnectedTreeCount++
      }
      if (item.conn && item.conn.group) {
        const groupId = `GID:${item.isConnected ? 'C' : 'N'}:${item.conn.group}`;
        let subGroup: ConnectionGroup = group.items.find((it: TreeItem) => it.id === groupId);
        if (!subGroup) {
          subGroup = new TreeItem(item.conn.group, TreeItemCollapsibleState.Expanded);
          subGroup.isGroup = true;
          subGroup.id = groupId;
          subGroup.items = subGroup.items || [];
          subGroup.iconPath = ThemeIcon.Folder;
          group.items.push(subGroup);
        }
        subGroup.description = `${subGroup.items.length + 1} connections`;
        group = subGroup;
      }
      group.items.push(item);
    });

    connectedTreeItem.items = sortBy(connectedTreeItem.items, ['isGroup', 'label']);
    notConnectedTreeItem.items = sortBy(notConnectedTreeItem.items, ['isGroup', 'label']);

    notConnectedTreeItem.description = `${notConnectedTreeCount} connections`;
    connectedTreeItem.description = `${connectedTreeCount} connections`;

    return [connectedTreeItem, notConnectedTreeItem].filter(a => a.items.length > 0);
  }
  public async getChildren(element?: SidebarTreeItem) {
    if (!element) {
      return Promise.resolve(asArray(this.getTreeItems()));
    }
    const items = (<any>element).getChildren ? await (<any>element).getChildren() : element.items as any[];
    if (ConfigManager.flattenGroupsIfOne && items.length === 1) {
      return this.getChildren(items[0]);
    }
    return items;
  }

  public getParent(element: SidebarTreeItem) {
    return element.parent || null;
  }
  public refresh(item?: SidebarTreeItem) {
    this._onDidChangeTreeData.fire(item);
    log.extend('debug')(`Connection explorer updated. ${item ? `Updated ${item.label}` : ''}`.trim());

  }

  public setConnections(connections: (ConnectionInterface)[]) {
    const keys = [];
    const changed: { conn: ConnectionInterface, action: 'added' | 'deleted' | 'changed' }[] = [];

    connections.forEach((conn) => {
      if (!this.tree[getConnectionId(conn)]) {
        this.tree[getConnectionId(conn)] = new SidebarConnection(this.extension.context, conn);
        changed.push({ conn, action: 'added' });
      } else if (this.tree[getConnectionId(conn)].updateCreds(conn)) {
        changed.push({ conn, action: 'changed' });
      }
      keys.push(getConnectionId(conn));
    });

    if (Object.keys(this.tree).length !== keys.length) {
      Object.keys(this.tree).forEach(k => {
        if (keys.indexOf(k) >= 0) return;
        changed.push({ conn: this.tree[k].conn, action: 'deleted' });
        delete this.tree[k];
      });
    }
    if (changed.length > 0) {
      this.refresh();
      this._onConnectionDidChange.fire(changed);
    }
  }

  public setTreeData = ({
    conn,
    tables,
    columns,
    functions
  }: {
    conn: ConnectionInterface;
    tables: DatabaseInterface.Table[];
    columns: DatabaseInterface.TableColumn[];
    functions: DatabaseInterface.Function[];
  }) => {
    if (!conn) return;
    const connId = getConnectionId(conn);

    this.tree[connId] = this.tree[connId] || new SidebarConnection(this.extension.context, conn);

    this.tree[connId].reset();

    if (!tables && !columns && !functions) {
      return;
    }

    this.insertTables(connId, conn.driver, tables);

    this.insertColumns(connId, conn.driver, columns);

    this.insertFunctions(connId, conn.driver, functions);

    this.refresh(this.tree[connId]);
  }

  private getGroup(...k: string[]): SidebarAbstractItem {
    return safeGet(this.tree, k.reduce((agg, v, i) => ([ ...agg, v, ...(i === k.length - 1 ? [] : ['tree'])]), []));
  }

  private getOrCreateGroups(connId: string, driver: DatabaseDriver, path: string, ignoreLasts: number = 0): SidebarAbstractItem {
    try {
      let k = path.split(TREE_SEP);
      const hierachyNames = DriverHierarchyChildNames[driver] || [];
      if (ignoreLasts > 0) {
        k = k.slice(0, k.length - ignoreLasts);
      }
      const treeRef = this.getGroup(connId, ...k);
      if(treeRef) return treeRef;
      let created = [];
      let tree: SidebarAbstractItem = null;
      k.forEach((g, i) => {
        tree = this.getGroup(connId, ...created);
        tree.addItem(new SidebarResourceGroup(g, hierachyNames[i]));
        created.push(g);
      });

      const group = tree.tree[created.pop()];

      if (!group) {
        throw new Error(`Can't create tree '${path}' to driver '${getNameFromId(connId || '') || connId}'`);
      }

      return group;
    } catch (error) {
      throw new Error(`Can't create tree '${path}' to driver '${getNameFromId(connId || '') || connId}'`);
    }
  }

  private insertTables(connId: string, driver: DatabaseDriver, tables: DatabaseInterface.Table[]) {
    try {
      switch (driver) {
        case DatabaseDriver.DB2:
        case DatabaseDriver.PostgreSQL:
        case DatabaseDriver['AWS Redshift']:
        case DatabaseDriver.SQLite:
        case DatabaseDriver.MySQL:
        case DatabaseDriver.MSSQL:
        case DatabaseDriver.OracleDB:
        case DatabaseDriver.SAPHana:
        case DatabaseDriver.Cassandra:
          tables.sort((a, b) => a.name.localeCompare(b.name)).forEach((item) => {
            this.getOrCreateGroups(connId, driver, item.tree, 1).addItem(new SidebarTableOrView(this.extension.context, item));
          });
          break;
        default:
          // old style. Compatibily
          tables.sort((a, b) => a.name.localeCompare(b.name)).forEach((item) => {
            const key = item.isView ? 'views' : 'tables';
            this.getOrCreateGroups(connId, driver, key).addItem(new SidebarTableOrView(this.extension.context, item));
          });
          break;
      }
    } catch (error) {
      this.extension.errorHandler(`Error while trying to create tables tree for ${driver}`, error);
    }
  }

  private insertColumns(connId: string, driver: DatabaseDriver, columns: DatabaseInterface.TableColumn[]) {
    try {
      if (ConfigManager.sortColumns && ConfigManager.sortColumns === 'name') {
        columns = columns.sort((a, b) => a.columnName.localeCompare(b.columnName));
      } else if (ConfigManager.sortColumns && ConfigManager.sortColumns === 'ordinalnumber') { /* it's already sorted by position */}
      switch (driver) {
        case DatabaseDriver.DB2:
        case DatabaseDriver.PostgreSQL:
        case DatabaseDriver['AWS Redshift']:
        case DatabaseDriver.SQLite:
        case DatabaseDriver.MySQL:
        case DatabaseDriver.MSSQL:
        case DatabaseDriver.OracleDB:
        case DatabaseDriver.SAPHana:
        case DatabaseDriver.Cassandra:
          columns.forEach((column) => {
            this.getOrCreateGroups(connId, driver, column.tree, 1).addItem(new SidebarColumn(this.extension.context, column));
          });
          break;
        default:
          // old style. Compatibily
          columns.forEach((column) => {
            const key = this.getGroup(connId, 'views', column.tableName) ? 'views' : 'tables';
            this.getOrCreateGroups(connId, driver, `${key}/${column.tableName}`).addItem(new SidebarColumn(this.extension.context, column));
          });
          break;
      }
    } catch (error) {
      this.extension.errorHandler(`Error while trying to create columns tree for ${driver}`, error);
    }
  }

  private insertFunctions(connId: string, driver: DatabaseDriver, functions: DatabaseInterface.Function[]) {
    try {
      switch (driver) {
        case DatabaseDriver.DB2:
        case DatabaseDriver.PostgreSQL:
        case DatabaseDriver['AWS Redshift']:
        case DatabaseDriver.MySQL:
        case DatabaseDriver.MSSQL:
        case DatabaseDriver.OracleDB:
        case DatabaseDriver.Cassandra:
          functions.forEach((fn) => {
            this.getOrCreateGroups(connId, driver, fn.tree, 1).addItem(new SidebarFunction(this.extension.context, fn));
          });
          break;
        default:
          // old style. Compatibily
          functions.forEach((fn) => {
            this.getOrCreateGroups(connId, driver, `functions/${fn.name}`).addItem(new SidebarFunction(this.extension.context, fn));
          });
          break;
      }
    } catch (error) {
      this.extension.errorHandler(`Error while trying to create functions tree for ${driver}`, error);
    }
  }

  public async focusActiveConnection(c: ConnectionInterface) {
    if (!c) return;

    const item = this.tree[getConnectionId(c)];
    if (!item || item.isActive) return;

    await this.updateTreeRoot();

    if (this.treeView.visible && Object.keys(item.tree).length > 0) {
      this.treeView.reveal(Object.values(item.tree)[0], { select: false, focus: false });
      this.treeView.reveal(item);
    }
    this.refresh(item);
  }

  public getById(id: string) {
    return this.tree[id] ? this.tree[id].conn : undefined;
  }

  public focus() {
    this.treeView.reveal(this.treeView.selection[0] || Object.values(this.tree)[0], {
      focus: true,
      select: true,
    });
  }

  public updateTreeRoot = async () => {
    const connections: ConnectionInterface[] = await commands.executeCommand(`${EXT_NAME}.getConnectionStatus`);
    this.setConnections(connections);
  }

  public getSelection() {
    return this.treeView.selection;
  }

  public constructor(private extension: SQLTools.ExtensionInterface) {
    this.treeView = window.createTreeView(`${EXT_NAME}/connectionExplorer`, { treeDataProvider: this, canSelectMany: true });
    ConfigManager.addOnUpdateHook(this.updateTreeRoot);
    this.updateTreeRoot();
    this.extension.context.subscriptions.push(this.treeView);
  }
}

export { SidebarColumn, SidebarConnection, SidebarTableOrView, SidebarTreeItem };

export default ConnectionExplorer;
