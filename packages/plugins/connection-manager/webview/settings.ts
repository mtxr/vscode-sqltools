import { EXT_NAMESPACE, DISPLAY_NAME, EXT_CONFIG_NAMESPACE } from '@sqltools/util/constants';
import { getConnectionId } from '@sqltools/util/connection';
import WebviewProvider from '@sqltools/vscode/webview-provider';
import { commands } from 'vscode';
import { IConnection } from '@sqltools/types';
import { UIAction } from './ui/screens/Settings/actions';
import { SettingsScreenState } from './ui/screens/Settings/interfaces';
import { driverPluginExtension, getInstalledDrivers, getDriverSchemas } from '../extension-util';

export default class SettingsWebview extends WebviewProvider {
  protected cssVariables: { [name: string]: string; };
  protected id: string = 'Settings';
  protected title: string = `${DISPLAY_NAME} Settings`;

  private updateConnection = async ({ connInfo, globalSetting, editId }) => {
    connInfo = await this.parseBeforeSave({ connInfo });

    return commands.executeCommand(`${EXT_NAMESPACE}.updateConnection`, editId, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      const partialState: Partial<SettingsScreenState> = {
        formData: { ...connInfo, id: getConnectionId(connInfo) },
        externalMessage: `${connInfo.name} updated!`,
        externalMessageType: 'success',
        // globalSetting,
      }
      return this.sendMessage(UIAction.RESPONSE_UPDATE_CONNECTION_SUCCESS, partialState);
    }, (error = {}) => {
      const partialState: Partial<SettingsScreenState> = {
        externalMessage: (error.message || error || '').toString(),
        externalMessageType: 'error',
        // globalSetting,
      }
      return this.sendMessage(UIAction.RESPONSE_UPDATE_CONNECTION_ERROR, partialState);
    });
  }

  private createConnection = async ({ connInfo, globalSetting }) => {
    connInfo = await this.parseBeforeSave({ connInfo });
    return commands.executeCommand(`${EXT_NAMESPACE}.addConnection`, connInfo, globalSetting ? 'Global' : undefined)
    .then(() => {
      const partialState: Partial<SettingsScreenState> = {
        formData: { ...connInfo, id: getConnectionId(connInfo) },
        externalMessage: `${connInfo.name} was added to your settings!`,
        externalMessageType: 'success',
        // globalSetting,
      }
      return this.sendMessage(
        UIAction.RESPONSE_CREATE_CONNECTION_SUCCESS,
        partialState
      );
    }, (error = {}) => {
      const partialState: Partial<SettingsScreenState> = {
        externalMessage: (error.message || error || '').toString(),
        externalMessageType: 'error',
        // globalSetting,
      }
      return this.sendMessage(UIAction.RESPONSE_CREATE_CONNECTION_ERROR, partialState);
    });
  }

  private testConnection = async ({ connInfo }) => {
    try {
      connInfo = await this.parseBeforeSave({ connInfo });
      const res = await commands.executeCommand<any>(`${EXT_NAMESPACE}.testConnection`, connInfo);
      if (res && res.notification) {
        const externalMessage = `You need to fix some connection issues. Check notifications at the right-hand end of status bar.`
        return this.sendMessage(UIAction.RESPONSE_TEST_CONNECTION_WARNING, { externalMessage });
      }
      this.sendMessage(UIAction.RESPONSE_TEST_CONNECTION_SUCCESS, { connInfo });     
    } catch (error) {
      const payload = {
        externalMessage: (error.message || error || '').toString(),
      }
      this.sendMessage(UIAction.RESPONSE_TEST_CONNECTION_ERROR, payload);
    }
  }

  private parseBeforeSave = async ({ connInfo }) => {
    const pluginExt = await driverPluginExtension(connInfo.driver);
    if (pluginExt && pluginExt.parseBeforeSaveConnection) {
      connInfo = await pluginExt.parseBeforeSaveConnection({ connInfo });
    }
    ['id', 'isConnected', 'isActive', 'isPasswordResolved'].forEach(p => delete connInfo[p]);
    return connInfo;
  }

  private parseBeforeEdit = async ({ connInfo }) => {

    // Ensure driver doesn't inadvertently treat authprovider-sourced password as having come from settings
    if (connInfo.isPasswordResolved) {
      delete connInfo.password;
    }
    delete connInfo.isPasswordResolved;

    const pluginExt = await driverPluginExtension(connInfo.driver);
    if (pluginExt && pluginExt.parseBeforeEditConnection) {
      connInfo = await pluginExt.parseBeforeEditConnection({ connInfo });
    }
    ['isConnected', 'isActive'].forEach(p => delete connInfo[p]);
    return connInfo;
  }

  private getAndSendInstalledDrivers = async () => {
    return this.sendMessage(UIAction.RESPONSE_INSTALLED_DRIVERS, await getInstalledDrivers());
  }

  private getAndSendDriverSchemas = ({ driver }: { driver: string } = { driver: null }) => {
    return this.sendMessage(UIAction.RESPONSE_DRIVER_SCHEMAS, getDriverSchemas({ driver }));
  }

  public editConnection = async ({ conn }: { conn: IConnection; }) => {
    this.show();

    const installedDrivers = await getInstalledDrivers();
    const { schema, uiSchema } = getDriverSchemas({ driver: conn.driver });
    const formData = await this.parseBeforeEdit({ connInfo: conn });
    const driver = installedDrivers.find(d => d.value === conn.driver);
    if (!driver) {
      throw new Error(`Driver ${conn.driver} not loaded or not installed yet. Try agian in a few seconds.`);
    }
    const partialState: Partial<SettingsScreenState> = {
      installedDrivers,
      driver: driver || { displayName: conn.driver, value: conn.driver, icon: null },
      schema,
      uiSchema,
      formData,
    };
    this.sendMessage(UIAction.REQUEST_EDIT_CONNECTION, partialState);
  }

  public reset() {
    return this.sendMessage(UIAction.REQUEST_RESET);
  }

  public sendMessage = (action: (typeof UIAction)[keyof typeof UIAction], payload?: any) => {
    return super.sendMessage(action, payload);
  }

  private openConnectionFile = async () => {
    return commands.executeCommand('workbench.action.openSettings', `${EXT_CONFIG_NAMESPACE}.connections`);
  }

  protected messagesHandler = ({ action, payload }) => {
    switch (action) {
      case UIAction.REQUEST_CREATE_CONNECTION:
        return this.createConnection(payload);
      case UIAction.REQUEST_UPDATE_CONNECTION:
        return this.updateConnection(payload);
      case UIAction.REQUEST_TEST_CONNECTION:
        return this.testConnection(payload);
      case UIAction.REQUEST_OPEN_CONNECTION_FILE:
        return this.openConnectionFile();
      case UIAction.REQUEST_INSTALLED_DRIVERS:
        return this.getAndSendInstalledDrivers();
      case UIAction.REQUEST_DRIVER_SCHEMAS:
        return this.getAndSendDriverSchemas(payload);
    }
  }
}
