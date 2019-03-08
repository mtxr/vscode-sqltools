import { ErrorHandler as LanguageClientErrorHandler, LanguageClient } from 'vscode-languageclient';
import { IConnection, RequestType, RequestType0, TextDocuments } from 'vscode-languageserver';
import { ExtensionContext } from 'vscode';
import { Contracts } from 'applicationinsights';
export declare type ArgsType<T> = T extends (...args: infer U) => any ? U : never;
export declare type Arg0<T> = ArgsType<T>[0];
export declare type RequestHandler<T> = T extends RequestType<infer P, infer R, any, any> ? (params: P) => R | Promise<R> : (T extends RequestType0<infer R, any, any> ? () => R | Promise<R> : never);
export declare namespace SQLTools {
    interface Timer {
        elapsed(): number;
        start(): void;
        end(): void;
    }
    type Product = 'core' | 'extension' | 'language-server' | 'language-client' | 'ui';
    interface VSCodeInfo {
        uniqId?: string;
        sessId?: string;
        version?: string;
    }
    interface TelemetryArgs {
        product: Product;
        enableTelemetry?: boolean;
        vscodeInfo?: VSCodeInfo;
    }
    class TelemetryStaticProps {
        static SeveriryLevel: Contracts.SeverityLevel;
        static enabled: Boolean;
        static vscodeInfo: VSCodeInfo;
    }
    interface TelemetryInterface extends TelemetryStaticProps {
        updateOpts(opts: TelemetryArgs): any;
        enable(): void;
        disable(): void;
        registerCommand(command: string): any;
        registerInfoMessage(message: string, value?: string): any;
        registerException(error: Error, meta?: {
            [key: string]: any;
        }): void;
        registerErrorMessage(message: string, error?: Error, value?: string): void;
        registerSession(): any;
        registerMessage(severity: Contracts.SeverityLevel, message: string, value?: string): void;
        registerTime(timeKey: string, timer: Timer): any;
        registerMetric(name: string, value: number): any;
    }
    interface LanguageServerPlugin<T = LanguageServerInterface> {
        register: (server: T) => void;
    }
    interface ExtensionPlugin<T = ExtensionInterface> {
        register: (extension: T) => void;
    }
    type CommandEvent = {
        command: string;
        args: any[];
    };
    type CommandSuccessEvent = {
        command: string;
        args: any[];
        result: any;
    };
    type CommandEventHandler<T> = (evt: T) => void;
    interface ExtensionInterface {
        client: LanguageClientInterface;
        context: ExtensionContext;
        activate(): void;
        deactivate(): void;
        registerPlugin(plugin: ExtensionPlugin): this;
        beforeCommandHook(command: string, handler: CommandEventHandler<CommandEvent>): any;
        afterCommandSuccessHook(command: string, handler: CommandEventHandler<CommandSuccessEvent>): any;
        registerPlugin(plugin: ExtensionPlugin): any;
        registerCommand(command: string, handler: Function): any;
        registerTextEditorCommand(command: string, handler: Function): any;
    }
    interface LanguageServerInterface {
        listen(): void;
        registerPlugin(plugin: LanguageServerPlugin): this;
        sendNotification: IConnection['sendNotification'];
        onNotification: IConnection['onNotification'];
        onDocumentFormatting: IConnection['onDocumentFormatting'];
        onDocumentRangeFormatting: IConnection['onDocumentRangeFormatting'];
        sendRequest: IConnection['sendRequest'];
        addOnDidChangeConfigurationHooks(hook: () => void): this;
        addOnInitializeHook(hook: Arg0<IConnection['onInitialize']>): this;
        addOnInitializedHook(hook: Arg0<IConnection['onInitialized']>): this;
        notifyError(message: string, error?: any): any;
        client: IConnection['client'];
        docManager: TextDocuments;
        telemetry: TelemetryInterface;
    }
    interface LanguageClientInterface {
        client: LanguageClient;
        clientErrorHandler: LanguageClientErrorHandler;
        start: LanguageClient['start'];
        sendRequest: LanguageClient['sendRequest'];
        onRequest: LanguageClient['onRequest'];
        sendNotification: LanguageClient['sendNotification'];
        onNotification: LanguageClient['onNotification'];
        telemetry: TelemetryInterface;
    }
}
export default SQLTools;
