"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolServer = void 0;
const ee = require("events");
const messages_1 = require("./messages");
class Disposable0 {
    dispose() {
    }
}
class Emitter {
    get event() {
        if (!this._event) {
            this._event = (listener, thisArg) => {
                this._listener = listener;
                this._this = thisArg;
                let result;
                result = {
                    dispose: () => {
                        this._listener = undefined;
                        this._this = undefined;
                    }
                };
                return result;
            };
        }
        return this._event;
    }
    fire(event) {
        if (this._listener) {
            try {
                this._listener.call(this._this, event);
            }
            catch (e) {
            }
        }
    }
    hasListener() {
        return !!this._listener;
    }
    dispose() {
        this._listener = undefined;
        this._this = undefined;
    }
}
class ProtocolServer extends ee.EventEmitter {
    constructor() {
        super();
        this._sendMessage = new Emitter();
        this._sequence = 1;
        this._pendingRequests = new Map();
        this.onDidSendMessage = this._sendMessage.event;
    }
    // ---- implements vscode.Debugadapter interface ---------------------------
    dispose() {
    }
    handleMessage(msg) {
        if (msg.type === 'request') {
            this.dispatchRequest(msg);
        }
        else if (msg.type === 'response') {
            const response = msg;
            const clb = this._pendingRequests.get(response.request_seq);
            if (clb) {
                this._pendingRequests.delete(response.request_seq);
                clb(response);
            }
        }
    }
    _isRunningInline() {
        return this._sendMessage && this._sendMessage.hasListener();
    }
    //--------------------------------------------------------------------------
    start(inStream, outStream) {
        this._writableStream = outStream;
        this._rawData = Buffer.alloc(0);
        inStream.on('data', (data) => this._handleData(data));
        inStream.on('close', () => {
            this._emitEvent(new messages_1.Event('close'));
        });
        inStream.on('error', (error) => {
            this._emitEvent(new messages_1.Event('error', 'inStream error: ' + (error && error.message)));
        });
        outStream.on('error', (error) => {
            this._emitEvent(new messages_1.Event('error', 'outStream error: ' + (error && error.message)));
        });
        inStream.resume();
    }
    stop() {
        if (this._writableStream) {
            this._writableStream.end();
        }
    }
    sendEvent(event) {
        this._send('event', event);
    }
    sendResponse(response) {
        if (response.seq > 0) {
            console.error(`attempt to send more than one response for command ${response.command}`);
        }
        else {
            this._send('response', response);
        }
    }
    sendRequest(command, args, timeout, cb) {
        const request = {
            command: command
        };
        if (args && Object.keys(args).length > 0) {
            request.arguments = args;
        }
        this._send('request', request);
        if (cb) {
            this._pendingRequests.set(request.seq, cb);
            const timer = setTimeout(() => {
                clearTimeout(timer);
                const clb = this._pendingRequests.get(request.seq);
                if (clb) {
                    this._pendingRequests.delete(request.seq);
                    clb(new messages_1.Response(request, 'timeout'));
                }
            }, timeout);
        }
    }
    // ---- protected ----------------------------------------------------------
    dispatchRequest(request) {
    }
    // ---- private ------------------------------------------------------------
    _emitEvent(event) {
        this.emit(event.event, event);
    }
    _send(typ, message) {
        message.type = typ;
        message.seq = this._sequence++;
        if (this._writableStream) {
            const json = JSON.stringify(message);
            this._writableStream.write(`Content-Length: ${Buffer.byteLength(json, 'utf8')}\r\n\r\n${json}`, 'utf8');
        }
        this._sendMessage.fire(message);
    }
    _handleData(data) {
        this._rawData = Buffer.concat([this._rawData, data]);
        while (true) {
            if (this._contentLength >= 0) {
                if (this._rawData.length >= this._contentLength) {
                    const message = this._rawData.toString('utf8', 0, this._contentLength);
                    this._rawData = this._rawData.slice(this._contentLength);
                    this._contentLength = -1;
                    if (message.length > 0) {
                        try {
                            let msg = JSON.parse(message);
                            this.handleMessage(msg);
                        }
                        catch (e) {
                            this._emitEvent(new messages_1.Event('error', 'Error handling data: ' + (e && e.message)));
                        }
                    }
                    continue; // there may be more complete messages to process
                }
            }
            else {
                const idx = this._rawData.indexOf(ProtocolServer.TWO_CRLF);
                if (idx !== -1) {
                    const header = this._rawData.toString('utf8', 0, idx);
                    const lines = header.split('\r\n');
                    for (let i = 0; i < lines.length; i++) {
                        const pair = lines[i].split(/: +/);
                        if (pair[0] == 'Content-Length') {
                            this._contentLength = +pair[1];
                        }
                    }
                    this._rawData = this._rawData.slice(idx + ProtocolServer.TWO_CRLF.length);
                    continue;
                }
            }
            break;
        }
    }
}
exports.ProtocolServer = ProtocolServer;
ProtocolServer.TWO_CRLF = '\r\n\r\n';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvdG9jb2wuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcHJvdG9jb2wudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOzs7QUFFaEcsNkJBQTZCO0FBRTdCLHlDQUE2QztBQVM3QyxNQUFNLFdBQVc7SUFDaEIsT0FBTztJQUNQLENBQUM7Q0FDRDtBQU1ELE1BQU0sT0FBTztJQU1aLElBQUksS0FBSztRQUNSLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxRQUF1QixFQUFFLE9BQWEsRUFBRSxFQUFFO2dCQUV4RCxJQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztnQkFDMUIsSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7Z0JBRXJCLElBQUksTUFBbUIsQ0FBQztnQkFDeEIsTUFBTSxHQUFHO29CQUNSLE9BQU8sRUFBRSxHQUFHLEVBQUU7d0JBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7d0JBQzNCLElBQUksQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDO29CQUN4QixDQUFDO2lCQUNELENBQUM7Z0JBQ0YsT0FBTyxNQUFNLENBQUM7WUFDZixDQUFDLENBQUM7U0FDRjtRQUNELE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztJQUNwQixDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVE7UUFDWixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSTtnQkFDSCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQ3ZDO1lBQUMsT0FBTyxDQUFDLEVBQUU7YUFDWDtTQUNEO0lBQ0YsQ0FBQztJQUVELFdBQVc7UUFDVixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxPQUFPO1FBQ04sSUFBSSxDQUFDLFNBQVMs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QUFFOzRCQUNoQyxJQUFJLENBQUMsY0FBYyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3lCQUMvQjtxQkFDRDtvQkFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO29CQUMxRSxTQUFTO2lCQUNUO2FBQ0Q7WUFDRCxNQUFNO1NBQ047SUFDRixDQUFDOztBQXRLRix3Q0F1S0M7QUFyS2UsdUJBQVEsR0FBRyxVQUFVLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICogIENvcHlyaWdodCAoYykgTWljcm9zb2Z0IENvcnBvcmF0aW9uLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICogIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS4gU2VlIExpY2Vuc2UudHh0IGluIHRoZSBwcm9qZWN0IHJvb3QgZm9yIGxpY2Vuc2UgaW5mb3JtYXRpb24uXG4gKi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cblxuaW1wb3J0ICogYXMgZWUgZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IERlYnVnUHJvdG9jb2wgfSBmcm9tICdAdnNjb2RlL2RlYnVncHJvdG9jb2wnO1xuaW1wb3J0IHsgUmVzcG9uc2UsIEV2ZW50IH0gZnJvbSAnLi9tZXNzYWdlcyc7XG5cbmludGVyZmFjZSBEZWJ1Z1Byb3RvY29sTWVzc2FnZSB7XG59XG5cbmludGVyZmFjZSBJRGlzcG9zYWJsZSB7XG5cdGRpc3Bvc2UoKTogdm9pZDtcbn1cblxuY2xhc3MgRGlzcG9zYWJsZTAgaW1wbGVtZW50cyBJRGlzcG9zYWJsZSB7XG5cdGRpc3Bvc2UoKTogYW55IHtcblx0fVxufVxuXG5pbnRlcmZhY2UgRXZlbnQwPFQ+IHtcblx0KGxpc3RlbmVyOiAoZTogVCkgPT4gYW55LCB0aGlzQXJnPzogYW55KTogRGlzcG9zYWJsZTA7XG59XG5cbmNsYXNzIEVtaXR0ZXI8VD4ge1xuXG5cdHByaXZhdGUgX2V2ZW50PzogRXZlbnQwPFQ+O1xuXHRwcml2YXRlIF9saXN0ZW5lcj86IChlOiBUKSA9PiB2b2lkO1xuXHRwcml2YXRlIF90aGlzPzogYW55O1xuXG5cdGdldCBldmVudCgpOiBFdmVudDA8VD4ge1xuXHRcdGlmICghdGhpcy5fZXZlbnQpIHtcblx0XHRcdHRoaXMuX2V2ZW50ID0gKGxpc3RlbmVyOiAoZTogVCkgPT4gYW55LCB0aGlzQXJnPzogYW55KSA9PiB7XG5cblx0XHRcdFx0dGhpcy5fbGlzdGVuZXIgPSBsaXN0ZW5lcjtcblx0XHRcdFx0dGhpcy5fdGhpcyA9IHRoaXNBcmc7XG5cblx0XHRcdFx0bGV0IHJlc3VsdDogSURpc3Bvc2FibGU7XG5cdFx0XHRcdHJlc3VsdCA9IHtcblx0XHRcdFx0XHRkaXNwb3NlOiAoKSA9PiB7XG5cdFx0XHRcdFx0XHR0aGlzLl9saXN0ZW5lciA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdHRoaXMuX3RoaXMgPSB1bmRlZmluZWQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9O1xuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdFx0fTtcblx0XHR9XG5cdFx0cmV0dXJuIHRoaXMuX2V2ZW50O1xuXHR9XG5cblx0ZmlyZShldmVudDogVCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLl9saXN0ZW5lcikge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0dGhpcy5fbGlzdGVuZXIuY2FsbCh0aGlzLl90aGlzLCBldmVudCk7XG5cdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0aGFzTGlzdGVuZXIoKSA6IGJvb2xlYW4ge1xuXHRcdHJldHVybiAhIXRoaXMuX2xpc3RlbmVyO1xuXHR9XG5cblx0ZGlzcG9zZSgpIHtcblx0XHR0aGlzLl9saXN0ZW5lciA9IHVuZGVmaW5lZDtcblx0XHR0aGlzLl90aGlzID0gdW5kZWZpbmVkO1xuXHR9XG59XG5cbi8qKlxuICogQSBzdHJ1Y3R1cmFsbHkgZXF1aXZhbGVudCBjb3B5IG9mIHZzY29kZS5EZWJ1Z0FkYXB0ZXJcbiAqL1xuaW50ZXJmYWNlIFZTQ29kZURlYnVnQWRhcHRlciBleHRlbmRzIERpc3Bvc2FibGUwIHtcblxuXHRyZWFkb25seSBvbkRpZFNlbmRNZXNzYWdlOiBFdmVudDA8RGVidWdQcm90b2NvbE1lc3NhZ2U+O1xuXG5cdGhhbmRsZU1lc3NhZ2UobWVzc2FnZTogRGVidWdQcm90b2NvbC5Qcm90b2NvbE1lc3NhZ2UpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgUHJvdG9jb2xTZXJ2ZXIgZXh0ZW5kcyBlZS5FdmVudEVtaXR0ZXIgaW1wbGVtZW50cyBWU0NvZGVEZWJ1Z0FkYXB0ZXIge1xuXG5cdHByaXZhdGUgc3RhdGljIFRXT19DUkxGID0gJ1xcclxcblxcclxcbic7XG5cblx0cHJpdmF0ZSBfc2VuZE1lc3NhZ2UgPSBuZXcgRW1pdHRlcjxEZWJ1Z1Byb3RvY29sTWVzc2FnZT4oKTtcblxuXHRwcml2YXRlIF9yYXdEYXRhOiBCdWZmZXI7XG5cdHByaXZhdGUgX2NvbnRlbnRMZW5ndGg6IG51bWJlcjtcblx0cHJpdmF0ZSBfc2VxdWVuY2U6IG51bWJlciA9IDE7XG5cdHByaXZhdGUgX3dyaXRhYmxlU3RyZWFtOiBOb2RlSlMuV3JpdGFibGVTdHJlYW07XG5cdHByaXZhdGUgX3BlbmRpbmdSZXF1ZXN0cyA9IG5ldyBNYXA8bnVtYmVyLCAocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UpID0+IHZvaWQ+KCk7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0fVxuXG5cdC8vIC0tLS0gaW1wbGVtZW50cyB2c2NvZGUuRGVidWdhZGFwdGVyIGludGVyZmFjZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwdWJsaWMgZGlzcG9zZSgpOiBhbnkge1xuXHR9XG5cblx0cHVibGljIG9uRGlkU2VuZE1lc3NhZ2U6IEV2ZW50MDxEZWJ1Z1Byb3RvY29sTWVzc2FnZT4gPSB0aGlzLl9zZW5kTWVzc2FnZS5ldmVudDtcblxuXHRwdWJsaWMgaGFuZGxlTWVzc2FnZShtc2c6IERlYnVnUHJvdG9jb2wuUHJvdG9jb2xNZXNzYWdlKTogdm9pZCB7XG5cdFx0aWYgKG1zZy50eXBlID09PSAncmVxdWVzdCcpIHtcblx0XHRcdHRoaXMuZGlzcGF0Y2hSZXF1ZXN0KDxEZWJ1Z1Byb3RvY29sLlJlcXVlc3Q+bXNnKTtcblx0XHR9IGVsc2UgaWYgKG1zZy50eXBlID09PSAncmVzcG9uc2UnKSB7XG5cdFx0XHRjb25zdCByZXNwb25zZSA9IDxEZWJ1Z1Byb3RvY29sLlJlc3BvbnNlPm1zZztcblx0XHRcdGNvbnN0IGNsYiA9IHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5nZXQocmVzcG9uc2UucmVxdWVzdF9zZXEpO1xuXHRcdFx0aWYgKGNsYikge1xuXHRcdFx0XHR0aGlzLl9wZW5kaW5nUmVxdWVzdHMuZGVsZXRlKHJlc3BvbnNlLnJlcXVlc3Rfc2VxKTtcblx0XHRcdFx0Y2xiKHJlc3BvbnNlKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRwcm90ZWN0ZWQgX2lzUnVubmluZ0lubGluZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fc2VuZE1lc3NhZ2UgJiYgdGhpcy5fc2VuZE1lc3NhZ2UuaGFzTGlzdGVuZXIoKTtcblx0fVxuXG5cdC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwdWJsaWMgc3RhcnQoaW5TdHJlYW06IE5vZGVKUy5SZWFkYWJsZVN0cmVhbSwgb3V0U3RyZWFtOiBOb2RlSlMuV3JpdGFibGVTdHJlYW0pOiB2b2lkIHtcblx0XHR0aGlzLl93cml0YWJsZVN0cmVhbSA9IG91dFN0cmVhbTtcblx0XHR0aGlzLl9yYXdEYXRhID0gQnVmZmVyLmFsbG9jKDApO1xuXG5cdFx0aW5TdHJlYW0ub24oJ2RhdGEnLCAoZGF0YTogQnVmZmVyKSA9PiB0aGlzLl9oYW5kbGVEYXRhKGRhdGEpKTtcblxuXHRcdGluU3RyZWFtLm9uKCdjbG9zZScsICgpID0+IHtcblx0XHRcdHRoaXMuX2VtaXRFdmVudChuZXcgRXZlbnQoJ2Nsb3NlJykpO1xuXHRcdH0pO1xuXHRcdGluU3RyZWFtLm9uKCdlcnJvcicsIChlcnJvcikgPT4ge1xuXHRcdFx0dGhpcy5fZW1pdEV2ZW50KG5ldyBFdmVudCgnZXJyb3InLCAnaW5TdHJlYW0gZXJyb3I6ICcgKyAoZXJyb3IgJiYgZXJyb3IubWVzc2FnZSkpKTtcblx0XHR9KTtcblxuXHRcdG91dFN0cmVhbS5vbignZXJyb3InLCAoZXJyb3IpID0+IHtcblx0XHRcdHRoaXMuX2VtaXRFdmVudChuZXcgRXZlbnQoJ2Vycm9yJywgJ291dFN0cmVhbSBlcnJvcjogJyArIChlcnJvciAmJiBlcnJvci5tZXNzYWdlKSkpO1xuXHRcdH0pO1xuXG5cdFx0aW5TdHJlYW0ucmVzdW1lKCk7XG5cdH1cblxuXHRwdWJsaWMgc3RvcCgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy5fd3JpdGFibGVTdHJlYW0pIHtcblx0XHRcdHRoaXMuX3dyaXRhYmxlU3RyZWFtLmVuZCgpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBzZW5kRXZlbnQoZXZlbnQ6IERlYnVnUHJvdG9jb2wuRXZlbnQpOiB2b2lkIHtcblx0XHR0aGlzLl9zZW5kKCdldmVudCcsIGV2ZW50KTtcblx0fVxuXG5cdHB1YmxpYyBzZW5kUmVzcG9uc2UocmVzcG9uc2U6IERlYnVnUHJvdG9jb2wuUmVzcG9uc2UpOiB2b2lkIHtcblx0XHRpZiAocmVzcG9uc2Uuc2VxID4gMCkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihgYXR0ZW1wdCB0byBzZW5kIG1vcmUgdGhhbiBvbmUgcmVzcG9uc2UgZm9yIGNvbW1hbmQgJHtyZXNwb25zZS5jb21tYW5kfWApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLl9zZW5kKCdyZXNwb25zZScsIHJlc3BvbnNlKTtcblx0XHR9XG5cdH1cblxuXHRwdWJsaWMgc2VuZFJlcXVlc3QoY29tbWFuZDogc3RyaW5nLCBhcmdzOiBhbnksIHRpbWVvdXQ6IG51bWJlciwgY2I6IChyZXNwb25zZTogRGVidWdQcm90b2NvbC5SZXNwb25zZSkgPT4gdm9pZCkgOiB2b2lkIHtcblxuXHRcdGNvbnN0IHJlcXVlc3Q6IGFueSA9IHtcblx0XHRcdGNvbW1hbmQ6IGNvbW1hbmRcblx0XHR9O1xuXHRcdGlmIChhcmdzICYmIE9iamVjdC5rZXlzKGFyZ3MpLmxlbmd0aCA+IDApIHtcblx0XHRcdHJlcXVlc3QuYXJndW1lbnRzID0gYXJncztcblx0XHR9XG5cblx0XHR0aGlzLl9zZW5kKCdyZXF1ZXN0JywgcmVxdWVzdCk7XG5cblx0XHRpZiAoY2IpIHtcblx0XHRcdHRoaXMuX3BlbmRpbmdSZXF1ZXN0cy5zZXQocmVxdWVzdC5zZXEsIGNiKTtcblxuXHRcdFx0Y29uc3QgdGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVyKTtcblx0XHRcdFx0Y29uc3QgY2xiID0gdGhpcy5fcGVuZGluZ1JlcXVlc3RzLmdldChyZXF1ZXN0LnNlcSk7XG5cdFx0XHRcdGlmIChjbGIpIHtcblx0XHRcdFx0XHR0aGlzLl9wZW5kaW5nUmVxdWVzdHMuZGVsZXRlKHJlcXVlc3Quc2VxKTtcblx0XHRcdFx0XHRjbGIobmV3IFJlc3BvbnNlKHJlcXVlc3QsICd0aW1lb3V0JykpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LCB0aW1lb3V0KTtcblx0XHR9XG5cdH1cblxuXHQvLyAtLS0tIHByb3RlY3RlZCAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblx0cHJvdGVjdGVkIGRpc3BhdGNoUmVxdWVzdChyZXF1ZXN0OiBEZWJ1Z1Byb3RvY29sLlJlcXVlc3QpOiB2b2lkIHtcblx0fVxuXG5cdC8vIC0tLS0gcHJpdmF0ZSAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuXHRwcml2YXRlIF9lbWl0RXZlbnQoZXZlbnQ6IERlYnVnUHJvdG9jb2wuRXZlbnQpIHtcblx0XHR0aGlzLmVtaXQoZXZlbnQuZXZlbnQsIGV2ZW50KTtcblx0fVxuXG5cdHByaXZhdGUgX3NlbmQodHlwOiAncmVxdWVzdCcgfCAncmVzcG9uc2UnIHwgJ2V2ZW50JywgbWVzc2FnZTogRGVidWdQcm90b2NvbC5Qcm90b2NvbE1lc3NhZ2UpOiB2b2lkIHtcblxuXHRcdG1lc3NhZ2UudHlwZSA9IHR5cDtcblx0XHRtZXNzYWdlLnNlcSA9IHRoaXMuX3NlcXVlbmNlKys7XG5cblx0XHRpZiAodGhpcy5fd3JpdGFibGVTdHJlYW0pIHtcblx0XHRcdGNvbnN0IGpzb24gPSBKU09OLnN0cmluZ2lmeShtZXNzYWdlKTtcblx0XHRcdHRoaXMuX3dyaXRhYmxlU3RyZWFtLndyaXRlKGBDb250ZW50LUxlbmd0aDogJHtCdWZmZXIuYnl0ZUxlbmd0aChqc29uLCAndXRmOCcpfVxcclxcblxcclxcbiR7anNvbn1gLCAndXRmOCcpO1xuXHRcdH1cblx0XHR0aGlzLl9zZW5kTWVzc2FnZS5maXJlKG1lc3NhZ2UpO1xuXHR9XG5cblx0cHJpdmF0ZSBfaGFuZGxlRGF0YShkYXRhOiBCdWZmZXIpOiB2b2lkIHtcblxuXHRcdHRoaXMuX3Jhd0RhdGEgPSBCdWZmZXIuY29uY2F0KFt0aGlzLl9yYXdEYXRhLCBkYXRhXSk7XG5cblx0XHR3aGlsZSAodHJ1ZSkge1xuXHRcdFx0aWYgKHRoaXMuX2NvbnRlbnRMZW5ndGggPj0gMCkge1xuXHRcdFx0XHRpZiAodGhpcy5fcmF3RGF0YS5sZW5ndGggPj0gdGhpcy5fY29udGVudExlbmd0aCkge1xuXHRcdFx0XHRcdGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9yYXdEYXRhLnRvU3RyaW5nKCd1dGY4JywgMCwgdGhpcy5fY29udGVudExlbmd0aCk7XG5cdFx0XHRcdFx0dGhpcy5fcmF3RGF0YSA9IHRoaXMuX3Jhd0RhdGEuc2xpY2UodGhpcy5fY29udGVudExlbmd0aCk7XG5cdFx0XHRcdFx0dGhpcy5fY29udGVudExlbmd0aCA9IC0xO1xuXHRcdFx0XHRcdGlmIChtZXNzYWdlLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRcdGxldCBtc2c6IERlYnVnUHJvdG9jb2wuUHJvdG9jb2xNZXNzYWdlID0gSlNPTi5wYXJzZShtZXNzYWdlKTtcblx0XHRcdFx0XHRcdFx0dGhpcy5oYW5kbGVNZXNzYWdlKG1zZyk7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRjYXRjaCAoZSkge1xuXHRcdFx0XHRcdFx0XHR0aGlzLl9lbWl0RXZlbnQobmV3IEV2ZW50KCdlcnJvcicsICdFcnJvciBoYW5kbGluZyBkYXRhOiAnICsgKGUgJiYgZS5tZXNzYWdlKSkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRjb250aW51ZTtcdC8vIHRoZXJlIG1heSBiZSBtb3JlIGNvbXBsZXRlIG1lc3NhZ2VzIHRvIHByb2Nlc3Ncblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc3QgaWR4ID0gdGhpcy5fcmF3RGF0YS5pbmRleE9mKFByb3RvY29sU2VydmVyLlRXT19DUkxGKTtcblx0XHRcdFx0aWYgKGlkeCAhPT0gLTEpIHtcblx0XHRcdFx0XHRjb25zdCBoZWFkZXIgPSB0aGlzLl9yYXdEYXRhLnRvU3RyaW5nKCd1dGY4JywgMCwgaWR4KTtcblx0XHRcdFx0XHRjb25zdCBsaW5lcyA9IGhlYWRlci5zcGxpdCgnXFxyXFxuJyk7XG5cdFx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRcdFx0Y29uc3QgcGFpciA9IGxpbmVzW2ldLnNwbGl0KC86ICsvKTtcblx0XHRcdFx0XHRcdGlmIChwYWlyWzBdID09ICdDb250ZW50LUxlbmd0aCcpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy5fY29udGVudExlbmd0aCA9ICtwYWlyWzFdO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0aGlzLl9yYXdEYXRhID0gdGhpcy5fcmF3RGF0YS5zbGljZShpZHggKyBQcm90b2NvbFNlcnZlci5UV09fQ1JMRi5sZW5ndGgpO1xuXHRcdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdH1cbn1cbiJdfQ==