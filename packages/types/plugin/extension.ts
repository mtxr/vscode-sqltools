import { ILanguageClient } from '@sqltools/types/plugin/language-client';
import { ExtensionContext } from 'vscode';

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
  activate(): void;
  deactivate(): void;
  registerPlugin(plugin: IExtensionPlugin): this;
  addBeforeCommandHook(command: string, handler: CommandEventHandler<ICommandEvent>): this;
  addAfterCommandSuccessHook(command: string, handler: CommandEventHandler<ICommandSuccessEvent>): this;
  registerCommand(command: string, handler: Function): this;
  registerTextEditorCommand(command: string, handler: Function): this;
  errorHandler(message: string, error: any): any;
}

export interface IExtensionPlugin<T = IExtension> {
  register: (extension: T) => void;
}