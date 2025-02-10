/// <reference types="node" />
/// <reference types="node" />
import * as ee from 'events';
import { DebugProtocol } from '@vscode/debugprotocol';
interface DebugProtocolMessage {
}
interface IDisposable {
    dispose(): void;
}
declare class Disposable0 implements IDisposable {
    dispose(): any;
}
interface Event0<T> {
    (listener: (e: T) => any, thisArg?: any): Disposable0;
}
/**
 * A structurally equivalent copy of vscode.DebugAdapter
 */
interface VSCodeDebugAdapter extends Disposable0 {
    readonly onDidSendMessage: Event0<DebugProtocolMessage>;
    handleMessage(message: DebugProtocol.ProtocolMessage): void;
}
export declare class ProtocolServer extends ee.EventEmitter implements VSCodeDebugAdapter {
    private static TWO_CRLF;
    private _sendMessage;
    private _rawData;
    private _contentLength;
    private _sequence;
    private _writableStream;
    private _pendingRequests;
    constructor();
    dispose(): any;
    onDidSendMessage: Event0<DebugProtocolMessage>;
    handleMessage(msg: DebugProtocol.ProtocolMessage): void;
    protected _isRunningInline(): boolean;
    start(inStream: NodeJS.ReadableStream, outStream: NodeJS.WritableStream): void;
    stop(): void;
    sendEvent(event: DebugProtocol.Event): void;
    sendResponse(response: DebugProtocol.Response): void;
    sendRequest(command: string, args: any, timeout: number, cb: (response: DebugProtocol.Response) => void): void;
    protected dispatchRequest(request: DebugProtocol.Request): void;
    private _emitEvent;
    private _send;
    private _handleData;
}
export {};
