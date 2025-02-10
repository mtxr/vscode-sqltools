import { DebugProtocol } from '@vscode/debugprotocol';
import { ProtocolServer } from './protocol';
import { Event } from './messages';
export declare class Source implements DebugProtocol.Source {
    name: string;
    path: string;
    sourceReference: number;
    constructor(name: string, path?: string, id?: number, origin?: string, data?: any);
}
export declare class Scope implements DebugProtocol.Scope {
    name: string;
    variablesReference: number;
    expensive: boolean;
    constructor(name: string, reference: number, expensive?: boolean);
}
export declare class StackFrame implements DebugProtocol.StackFrame {
    id: number;
    name: string;
    source?: DebugProtocol.Source;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    canRestart?: boolean;
    instructionPointerReference?: string;
    moduleId?: number | string;
    presentationHint?: 'normal' | 'label' | 'subtle';
    constructor(i: number, nm: string, src?: Source, ln?: number, col?: number);
}
export declare class Thread implements DebugProtocol.Thread {
    id: number;
    name: string;
    constructor(id: number, name: string);
}
export declare class Variable implements DebugProtocol.Variable {
    name: string;
    value: string;
    variablesReference: number;
    constructor(name: string, value: string, ref?: number, indexedVariables?: number, namedVariables?: number);
}
export declare class Breakpoint implements DebugProtocol.Breakpoint {
    verified: boolean;
    constructor(verified: boolean, line?: number, column?: number, source?: Source);
    setId(id: number): void;
}
export declare class Module implements DebugProtocol.Module {
    id: number | string;
    name: string;
    constructor(id: number | string, name: string);
}
export declare class CompletionItem implements DebugProtocol.CompletionItem {
    label: string;
    start: number;
    length: number;
    constructor(label: string, start: number, length?: number);
}
export declare class StoppedEvent extends Event implements DebugProtocol.StoppedEvent {
    body: {
        reason: string;
    };
    constructor(reason: string, threadId?: number, exceptionText?: string);
}
export declare class ContinuedEvent extends Event implements DebugProtocol.ContinuedEvent {
    body: {
        threadId: number;
    };
    constructor(threadId: number, allThreadsContinued?: boolean);
}
export declare class InitializedEvent extends Event implements DebugProtocol.InitializedEvent {
    constructor();
}
export declare class TerminatedEvent extends Event implements DebugProtocol.TerminatedEvent {
    constructor(restart?: any);
}
export declare class ExitedEvent extends Event implements DebugProtocol.ExitedEvent {
    body: {
        exitCode: number;
    };
    constructor(exitCode: number);
}
export declare class OutputEvent extends Event implements DebugProtocol.OutputEvent {
    body: {
        category: string;
        output: string;
        data?: any;
    };
    constructor(output: string, category?: string, data?: any);
}
export declare class ThreadEvent extends Event implements DebugProtocol.ThreadEvent {
    body: {
        reason: string;
        threadId: number;
    };
    constructor(reason: string, threadId: number);
}
export declare class BreakpointEvent extends Event implements DebugProtocol.BreakpointEvent {
    body: {
        reason: string;
        breakpoint: DebugProtocol.Breakpoint;
    };
    constructor(reason: string, breakpoint: DebugProtocol.Breakpoint);
}
export declare class ModuleEvent extends Event implements DebugProtocol.ModuleEvent {
    body: {
        reason: 'new' | 'changed' | 'removed';
        module: DebugProtocol.Module;
    };
    constructor(reason: 'new' | 'changed' | 'removed', module: DebugProtocol.Module);
}
export declare class LoadedSourceEvent extends Event implements DebugProtocol.LoadedSourceEvent {
    body: {
        reason: 'new' | 'changed' | 'removed';
        source: DebugProtocol.Source;
    };
    constructor(reason: 'new' | 'changed' | 'removed', source: DebugProtocol.Source);
}
export declare class CapabilitiesEvent extends Event implements DebugProtocol.CapabilitiesEvent {
    body: {
        capabilities: DebugProtocol.Capabilities;
    };
    constructor(capabilities: DebugProtocol.Capabilities);
}
export declare class ProgressStartEvent extends Event implements DebugProtocol.ProgressStartEvent {
    body: {
        progressId: string;
        title: string;
    };
    constructor(progressId: string, title: string, message?: string);
}
export declare class ProgressUpdateEvent extends Event implements DebugProtocol.ProgressUpdateEvent {
    body: {
        progressId: string;
    };
    constructor(progressId: string, message?: string);
}
export declare class ProgressEndEvent extends Event implements DebugProtocol.ProgressEndEvent {
    body: {
        progressId: string;
    };
    constructor(progressId: string, message?: string);
}
export declare class InvalidatedEvent extends Event implements DebugProtocol.InvalidatedEvent {
    body: {
        areas?: DebugProtocol.InvalidatedAreas[];
        threadId?: number;
        stackFrameId?: number;
    };
    constructor(areas?: DebugProtocol.InvalidatedAreas[], threadId?: number, stackFrameId?: number);
}
export declare class MemoryEvent extends Event implements DebugProtocol.MemoryEvent {
    body: {
        memoryReference: string;
        offset: number;
        count: number;
    };
    constructor(memoryReference: string, offset: number, count: number);
}
export declare enum ErrorDestination {
    User = 1,
    Telemetry = 2
}
export declare class DebugSession extends ProtocolServer {
    private _debuggerLinesStartAt1;
    private _debuggerColumnsStartAt1;
    private _debuggerPathsAreURIs;
    private _clientLinesStartAt1;
    private _clientColumnsStartAt1;
    private _clientPathsAreURIs;
    protected _isServer: boolean;
    constructor(obsolete_debuggerLinesAndColumnsStartAt1?: boolean, obsolete_isServer?: boolean);
    setDebuggerPathFormat(format: string): void;
    setDebuggerLinesStartAt1(enable: boolean): void;
    setDebuggerColumnsStartAt1(enable: boolean): void;
    setRunAsServer(enable: boolean): void;
    /**
     * A virtual constructor...
     */
    static run(debugSession: typeof DebugSession): void;
    shutdown(): void;
    protected sendErrorResponse(response: DebugProtocol.Response, codeOrMessage: number | DebugProtocol.Message, format?: string, variables?: any, dest?: ErrorDestination): void;
    runInTerminalRequest(args: DebugProtocol.RunInTerminalRequestArguments, timeout: number, cb: (response: DebugProtocol.RunInTerminalResponse) => void): void;
    protected dispatchRequest(request: DebugProtocol.Request): void;
    protected initializeRequest(response: DebugProtocol.InitializeResponse, args: DebugProtocol.InitializeRequestArguments): void;
    protected disconnectRequest(response: DebugProtocol.DisconnectResponse, args: DebugProtocol.DisconnectArguments, request?: DebugProtocol.Request): void;
    protected launchRequest(response: DebugProtocol.LaunchResponse, args: DebugProtocol.LaunchRequestArguments, request?: DebugProtocol.Request): void;
    protected attachRequest(response: DebugProtocol.AttachResponse, args: DebugProtocol.AttachRequestArguments, request?: DebugProtocol.Request): void;
    protected terminateRequest(response: DebugProtocol.TerminateResponse, args: DebugProtocol.TerminateArguments, request?: DebugProtocol.Request): void;
    protected restartRequest(response: DebugProtocol.RestartResponse, args: DebugProtocol.RestartArguments, request?: DebugProtocol.Request): void;
    protected setBreakPointsRequest(response: DebugProtocol.SetBreakpointsResponse, args: DebugProtocol.SetBreakpointsArguments, request?: DebugProtocol.Request): void;
    protected setFunctionBreakPointsRequest(response: DebugProtocol.SetFunctionBreakpointsResponse, args: DebugProtocol.SetFunctionBreakpointsArguments, request?: DebugProtocol.Request): void;
    protected setExceptionBreakPointsRequest(response: DebugProtocol.SetExceptionBreakpointsResponse, args: DebugProtocol.SetExceptionBreakpointsArguments, request?: DebugProtocol.Request): void;
    protected configurationDoneRequest(response: DebugProtocol.ConfigurationDoneResponse, args: DebugProtocol.ConfigurationDoneArguments, request?: DebugProtocol.Request): void;
    protected continueRequest(response: DebugProtocol.ContinueResponse, args: DebugProtocol.ContinueArguments, request?: DebugProtocol.Request): void;
    protected nextRequest(response: DebugProtocol.NextResponse, args: DebugProtocol.NextArguments, request?: DebugProtocol.Request): void;
    protected stepInRequest(response: DebugProtocol.StepInResponse, args: DebugProtocol.StepInArguments, request?: DebugProtocol.Request): void;
    protected stepOutRequest(response: DebugProtocol.StepOutResponse, args: DebugProtocol.StepOutArguments, request?: DebugProtocol.Request): void;
    protected stepBackRequest(response: DebugProtocol.StepBackResponse, args: DebugProtocol.StepBackArguments, request?: DebugProtocol.Request): void;
    protected reverseContinueRequest(response: DebugProtocol.ReverseContinueResponse, args: DebugProtocol.ReverseContinueArguments, request?: DebugProtocol.Request): void;
    protected restartFrameRequest(response: DebugProtocol.RestartFrameResponse, args: DebugProtocol.RestartFrameArguments, request?: DebugProtocol.Request): void;
    protected gotoRequest(response: DebugProtocol.GotoResponse, args: DebugProtocol.GotoArguments, request?: DebugProtocol.Request): void;
    protected pauseRequest(response: DebugProtocol.PauseResponse, args: DebugProtocol.PauseArguments, request?: DebugProtocol.Request): void;
    protected sourceRequest(response: DebugProtocol.SourceResponse, args: DebugProtocol.SourceArguments, request?: DebugProtocol.Request): void;
    protected threadsRequest(response: DebugProtocol.ThreadsResponse, request?: DebugProtocol.Request): void;
    protected terminateThreadsRequest(response: DebugProtocol.TerminateThreadsResponse, args: DebugProtocol.TerminateThreadsArguments, request?: DebugProtocol.Request): void;
    protected stackTraceRequest(response: DebugProtocol.StackTraceResponse, args: DebugProtocol.StackTraceArguments, request?: DebugProtocol.Request): void;
    protected scopesRequest(response: DebugProtocol.ScopesResponse, args: DebugProtocol.ScopesArguments, request?: DebugProtocol.Request): void;
    protected variablesRequest(response: DebugProtocol.VariablesResponse, args: DebugProtocol.VariablesArguments, request?: DebugProtocol.Request): void;
    protected setVariableRequest(response: DebugProtocol.SetVariableResponse, args: DebugProtocol.SetVariableArguments, request?: DebugProtocol.Request): void;
    protected setExpressionRequest(response: DebugProtocol.SetExpressionResponse, args: DebugProtocol.SetExpressionArguments, request?: DebugProtocol.Request): void;
    protected evaluateRequest(response: DebugProtocol.EvaluateResponse, args: DebugProtocol.EvaluateArguments, request?: DebugProtocol.Request): void;
    protected stepInTargetsRequest(response: DebugProtocol.StepInTargetsResponse, args: DebugProtocol.StepInTargetsArguments, request?: DebugProtocol.Request): void;
    protected gotoTargetsRequest(response: DebugProtocol.GotoTargetsResponse, args: DebugProtocol.GotoTargetsArguments, request?: DebugProtocol.Request): void;
    protected completionsRequest(response: DebugProtocol.CompletionsResponse, args: DebugProtocol.CompletionsArguments, request?: DebugProtocol.Request): void;
    protected exceptionInfoRequest(response: DebugProtocol.ExceptionInfoResponse, args: DebugProtocol.ExceptionInfoArguments, request?: DebugProtocol.Request): void;
    protected loadedSourcesRequest(response: DebugProtocol.LoadedSourcesResponse, args: DebugProtocol.LoadedSourcesArguments, request?: DebugProtocol.Request): void;
    protected dataBreakpointInfoRequest(response: DebugProtocol.DataBreakpointInfoResponse, args: DebugProtocol.DataBreakpointInfoArguments, request?: DebugProtocol.Request): void;
    protected setDataBreakpointsRequest(response: DebugProtocol.SetDataBreakpointsResponse, args: DebugProtocol.SetDataBreakpointsArguments, request?: DebugProtocol.Request): void;
    protected readMemoryRequest(response: DebugProtocol.ReadMemoryResponse, args: DebugProtocol.ReadMemoryArguments, request?: DebugProtocol.Request): void;
    protected writeMemoryRequest(response: DebugProtocol.WriteMemoryResponse, args: DebugProtocol.WriteMemoryArguments, request?: DebugProtocol.Request): void;
    protected disassembleRequest(response: DebugProtocol.DisassembleResponse, args: DebugProtocol.DisassembleArguments, request?: DebugProtocol.Request): void;
    protected cancelRequest(response: DebugProtocol.CancelResponse, args: DebugProtocol.CancelArguments, request?: DebugProtocol.Request): void;
    protected breakpointLocationsRequest(response: DebugProtocol.BreakpointLocationsResponse, args: DebugProtocol.BreakpointLocationsArguments, request?: DebugProtocol.Request): void;
    protected setInstructionBreakpointsRequest(response: DebugProtocol.SetInstructionBreakpointsResponse, args: DebugProtocol.SetInstructionBreakpointsArguments, request?: DebugProtocol.Request): void;
    /**
     * Override this hook to implement custom requests.
     */
    protected customRequest(command: string, response: DebugProtocol.Response, args: any, request?: DebugProtocol.Request): void;
    protected convertClientLineToDebugger(line: number): number;
    protected convertDebuggerLineToClient(line: number): number;
    protected convertClientColumnToDebugger(column: number): number;
    protected convertDebuggerColumnToClient(column: number): number;
    protected convertClientPathToDebugger(clientPath: string): string;
    protected convertDebuggerPathToClient(debuggerPath: string): string;
    private static path2uri;
    private static uri2path;
    private static _formatPIIRegexp;
    private static formatPII;
}
