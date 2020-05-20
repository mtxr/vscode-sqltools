import { EXT_NAMESPACE, DISPLAY_NAME, EXT_CONFIG_NAMESPACE } from '@sqltools/util/constants';
import { getConnectionId } from '@sqltools/util/connection';
import WebviewProvider from '@sqltools/vscode/webview-provider';
import { commands, extensions } from 'vscode';
import Context from '@sqltools/vscode/context';
import PluginResourcesMap, { buildResouceKey } from '@sqltools/util/plugin-resources';
import { IDriverExtensionApi, IDriverAlias, IIcons } from '@sqltools/types';
import fs from 'fs';
import { UIAction } from '../actions';
import prepareSchema from '../ui/lib/prepare-schema';

export default class SettingsWebview extends WebviewProvider {
  protected id: string = 'Settings';
  protected title: string = `${DISPLAY_NAME} Settings`;

  constructor() {
    super();
    this.setMessageCallback(({ action, payload }) => {
      switch (action) {
        case UIAction.REQUEST_CREATE_CONNECTION:
          return this.createConnection(payload);
        case UIAction.REQUEST_UPDATE_CONNECTION:
          return this.updateConnection(payload);
        case UIAction.REQUEST_TEST_CONNECTION:
          return this.testConnection(payload);
        case UIAction.REQUEST_OPEN_CONNECTION_FILE:
          this.openConnectionFile();
        case UIAction.REQUEST_INSTALLED_DRIVERS:
          return this.getInstalledDrivers();
        case UIAction.REQUEST_DRIVER_SCHEMAS:
          return this.getDriverSchemas(payload);
        default:
        break;
      }
    });
  }

  private updateConnection = async ({ connInfo, globalSetting, transformToRelative, editId }) => {
    connInfo = await this.parseBeforeSave({ connInfo, transformToRelative });

    return commands.executeCommand(`${EXT_NAMESPACE}.updateConnection`, editId, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: UIAction.RESPONSE_UPDATE_CONNECTION_SUCCESS, payload: { globalSetting, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: UIAction.RESPONSE_UPDATE_CONNECTION_ERROR, payload });
    });
  }

  private createConnection = async ({ connInfo, globalSetting, transformToRelative }) => {
    connInfo = await this.parseBeforeSave({ connInfo, transformToRelative });

    return commands.executeCommand(`${EXT_NAMESPACE}.addConnection`, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      this.postMessage({ action: UIAction.RESPONSE_CREATE_CONNECTION_SUCCESS, payload: { globalSetting, connInfo: { ...connInfo, id: getConnectionId(connInfo) } } });
    }, (payload = {}) => {
        payload = {
          message: (payload.message || payload || '').toString(),
        }
        this.postMessage({ action: UIAction.RESPONSE_CREATE_CONNECTION_ERROR, payload });
    });
  }

  private testConnection = async ({ connInfo, transformToRelative }) => {
    connInfo = await this.parseBeforeSave({ connInfo, transformToRelative });

    return commands.executeCommand(`${EXT_NAMESPACE}.testConnection`, connInfo)
    .then((res: any) => {
      if (res && res.notification) {
        const message = `You need to fix some issues in your machine first. Check the notifications on bottom-right before moving forward.`
        return this.postMessage({ action: UIAction.RESPONSE_TEST_CONNECTION_WARNING, payload: { message } });
      }
      this.postMessage({ action: UIAction.RESPONSE_TEST_CONNECTION_SUCCESS, payload: { connInfo } });
    }, (payload = {}) => {
      payload = {
        message: (payload.message || payload || '').toString(),
      }
      this.postMessage({ action: UIAction.RESPONSE_TEST_CONNECTION_ERROR, payload });
    });
  }

  private parseBeforeSave = async ({ connInfo, transformToRelative }) => {
    const pluginExtenxion = await this.driverPluginExtension(connInfo.driver);
    if (pluginExtenxion && pluginExtenxion.parseBeforeSaveConnection) {
      connInfo = await pluginExtenxion.parseBeforeSaveConnection({ connInfo, transformToRelative });
    }
    return connInfo;
  }

  private getExtension = async (id?: string): Promise<IDriverExtensionApi> => {
    if (id) {
      const ext = extensions.getExtension(id);
      !ext.isActive && await ext.activate();
      return ext.exports;
    }
    return null;
  }
  private driverPluginExtension = async (driverName: string) => {
    const pluginExtenxionId = PluginResourcesMap.get(buildResouceKey({ type: 'driver', name: driverName, resource: 'extension-id' }));
    return this.getExtension(pluginExtenxionId);
  }

  private getInstalledDrivers = async (retry = 0) => {
    if (retry > 20) return;
    const driverExtensions: string[] = (Context.globalState.get<{ driver: string[] }>('extPlugins') || { driver: [] }).driver || [];
    const installedDrivers: (IDriverAlias & { icon: string })[] = [];
    await Promise.all(driverExtensions.map(async id => {
      const ext = await this.getExtension(id);
      if (ext && ext.driverAliases) {
        ext.driverAliases.map(({ displayName, value }) => {
          const iconsPath = PluginResourcesMap.get<IIcons>(buildResouceKey({ type: 'driver', name: value, resource: 'icons' }));
          let icon: string;
          if (iconsPath && iconsPath.default) {
            icon = 'data:application/octet-stream;base64,' + fs.readFileSync(iconsPath.default).toString('base64');
          }
          installedDrivers.push({
            displayName,
            value,
            icon,
          });
        });
      }
    }));

    if (installedDrivers.length === 0 && driverExtensions.length > 0) return setTimeout(() => this.getInstalledDrivers(retry++), 250);

    this.postMessage({ action: UIAction.RESPONSE_INSTALLED_DRIVERS, payload: installedDrivers.sort((a, b) => a.displayName.localeCompare(b.displayName)) });
  }

  private getDriverSchemas = ({ driver }: { driver: string } = { driver: null }) => {
    if (!driver) return;
    let schema = {};
    let uiSchema = {};
    try {
      schema = JSON.parse(fs.readFileSync(PluginResourcesMap.get<string>(buildResouceKey({ type: 'driver', name: driver, resource: 'connection-schema' }))).toString()) || {};
    } catch (error) { }
    try {
      uiSchema = JSON.parse(fs.readFileSync(PluginResourcesMap.get<string>(buildResouceKey({ type: 'driver', name: driver, resource: 'ui-schema' }))).toString()) || {};
    } catch (error) { }

    this.postMessage({ action: UIAction.RESPONSE_DRIVER_SCHEMAS, payload: prepareSchema(schema, uiSchema) });
  }
  private openConnectionFile = async () => {
    return commands.executeCommand('workbench.action.openSettings', `${EXT_CONFIG_NAMESPACE}.connections`);
  }
}
