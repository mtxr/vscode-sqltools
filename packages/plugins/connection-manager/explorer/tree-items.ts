import SidebarConnection from './SidebarConnection';
import SidebarResourceGroup from './SidebarResourceGroup';
import SidebarTableOrView from './SidebarTableOrView';
import SidebarColumn from './SidebarColumn';
import SidebarFunction from './SidebarFunction';

export type SidebarTreeItem = SidebarConnection
| SidebarTableOrView
| SidebarColumn
| SidebarResourceGroup
| SidebarFunction;
