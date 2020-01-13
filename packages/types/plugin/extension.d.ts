import { ILanguageClient } from '@sqltools/types/plugin/language-client';
import { ExtensionContext } from 'vscode';

export declare interface ICommandEvent {
  command: string;
  args: any[];
}
export declare interface ICommandSuccessEvent<T = any> {
  command: string;
  args: any[];
  result: T;
}

export declare type CommandEventHandler<T> = (evt: T) => void;

export declare interface IExtension {
  client: ILanguageClient;
  context: ExtensionContext;
  activate(): void;
  deactivate(): void;
  registerPlugin(plugin: IExtensionPlugin): this;
  addBeforeCommandHook(command: string, handler: CommandEventHandler<ICommandEvent>): this;
  addAfterCommandSuccessHook(command: string, handler: CommandEventHandler<ICommandSuccessEvent>): this;
  registerCommand(command: string, handler: Function): this;
  registerTextEditorCommand(command: string, handler: Function): this;
  errorHandler(message: string, error: any): any;
}

export declare interface IExtensionPlugin<T = IExtension> {
  register: (extension: T) => void;
}