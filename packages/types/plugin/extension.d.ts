import { ILanguageClient } from '../plugin/language-client';
import { IConnection } from '../generic';

export interface ICommandEvent {
  command: string;
  args: any[];
}
export interface ICommandSuccessEvent<T = any> {
  command: string;
  args: any[];
  result: T;
}

export type CommandEventHandler<T> = (evt: T) => void;

export interface IExtension {
  client: ILanguageClient;
  registerPlugin(plugin: IExtensionPlugin | IExtensionPlugin[]): this;
  addBeforeCommandHook(command: string, handler: CommandEventHandler<ICommandEvent>): this;
  addAfterCommandSuccessHook(command: string, handler: CommandEventHandler<ICommandSuccessEvent>): this;
  registerCommand(command: string, handler: Function): this;
  registerTextEditorCommand(command: string, handler: Function): this;
  errorHandler(message: string, error: any): any;
  resourcesMap(): Map<string, any>;
}


export interface IDriverExtensionApi {
  /**
   * Prepare connection settings that will be saved to settings file
   *
   * @param {{ connInfo: IConnection }} arg
   * @returns {(Promise<IConnection> | IConnection)}
   * @memberof IDriverExtensionApi
   */
  parseBeforeSaveConnection?(arg: { connInfo: IConnection, transformToRelative?: boolean }): Promise<IConnection> | IConnection;
  readonly driverName?: string;
  readonly driverAliases: IDriverAlias[];
}

export interface IDriverAlias {
  /**
   * Driver name
   */
  displayName: string;
  /**
   * Driver id
   */
  value: string;
}

export interface IIcons {
  default: string;
  active?: string;
  inactive: string;
}

export interface IExtensionPlugin<T = IExtension> {
  readonly extensionId?: string;
  readonly type?: 'plugin' | 'driver';
  readonly name: string;
  register: (extension: T) => void;
}