"use strict";
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = exports.Response = exports.Message = void 0;
class Message {
    constructor(type) {
        this.seq = 0;
        this.type = type;
    }
}
exports.Message = Message;
class Response extends Message {
    constructor(request, message) {
        super('response');
        this.request_seq = request.seq;
        this.command = request.command;
        if (message) {
            this.success = false;
            this.message = message;
        }
        else {
            this.success = true;
        }
    }
}
exports.Response = Response;
class Event extends Message {
    constructor(event, body) {
        super('event');
        this.event = event;
        if (body) {
            this.body = body;
        }
    }
}
exports.Event = Event;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvbWVzc2FnZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Z0dBR2dHOzs7QUFLaEcsTUFBYSxPQUFPO0lBSW5CLFlBQW1CLElBQVk7UUFDOUIsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUM7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNsQixDQUFDO0NBQ0Q7QUFSRCwwQkFRQztBQUVELE1BQWEsUUFBUyxTQUFRLE9BQU87SUFLcEMsWUFBbUIsT0FBOEIsRUFBRSxPQUFnQjtRQUNsRSxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQztRQUMvQixJQUFJLE9BQU8sRUFBRTtZQUNaLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1lBQ2YsSUFBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDOUI7YUFBTTtZQUNOLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO0lBQ0YsQ0FBQztDQUNEO0FBaEJELDRCQWdCQztBQUVELE1BQWEsS0FBTSxTQUFRLE9BQU87SUFHakMsWUFBbUIsS0FBYSxFQUFFLElBQVU7UUFDM0MsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxJQUFJLEVBQUU7WUFDSCxJQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztTQUN4QjtJQUNGLENBQUM7Q0FDRDtBQVZELHNCQVVDIiwic291cmNlc0NvbnRlbnQiOlsiLyotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAqICBDb3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqICBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuIFNlZSBMaWNlbnNlLnR4dCBpbiB0aGUgcHJvamVjdCByb290IGZvciBsaWNlbnNlIGluZm9ybWF0aW9uLlxuICotLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXG5cbmltcG9ydCB7IERlYnVnUHJvdG9jb2wgfSBmcm9tICdAdnNjb2RlL2RlYnVncHJvdG9jb2wnO1xuXG5cbmV4cG9ydCBjbGFzcyBNZXNzYWdlIGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5Qcm90b2NvbE1lc3NhZ2Uge1xuXHRzZXE6IG51bWJlcjtcblx0dHlwZTogc3RyaW5nO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3Rvcih0eXBlOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNlcSA9IDA7XG5cdFx0dGhpcy50eXBlID0gdHlwZTtcblx0fVxufVxuXG5leHBvcnQgY2xhc3MgUmVzcG9uc2UgZXh0ZW5kcyBNZXNzYWdlIGltcGxlbWVudHMgRGVidWdQcm90b2NvbC5SZXNwb25zZSB7XG5cdHJlcXVlc3Rfc2VxOiBudW1iZXI7XG5cdHN1Y2Nlc3M6IGJvb2xlYW47XG5cdGNvbW1hbmQ6IHN0cmluZztcblxuXHRwdWJsaWMgY29uc3RydWN0b3IocmVxdWVzdDogRGVidWdQcm90b2NvbC5SZXF1ZXN0LCBtZXNzYWdlPzogc3RyaW5nKSB7XG5cdFx0c3VwZXIoJ3Jlc3BvbnNlJyk7XG5cdFx0dGhpcy5yZXF1ZXN0X3NlcSA9IHJlcXVlc3Quc2VxO1xuXHRcdHRoaXMuY29tbWFuZCA9IHJlcXVlc3QuY29tbWFuZDtcblx0XHRpZiAobWVzc2FnZSkge1xuXHRcdFx0dGhpcy5zdWNjZXNzID0gZmFsc2U7XG5cdFx0XHQoPGFueT50aGlzKS5tZXNzYWdlID0gbWVzc2FnZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zdWNjZXNzID0gdHJ1ZTtcblx0XHR9XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIEV2ZW50IGV4dGVuZHMgTWVzc2FnZSBpbXBsZW1lbnRzIERlYnVnUHJvdG9jb2wuRXZlbnQge1xuXHRldmVudDogc3RyaW5nO1xuXG5cdHB1YmxpYyBjb25zdHJ1Y3RvcihldmVudDogc3RyaW5nLCBib2R5PzogYW55KSB7XG5cdFx0c3VwZXIoJ2V2ZW50Jyk7XG5cdFx0dGhpcy5ldmVudCA9IGV2ZW50O1xuXHRcdGlmIChib2R5KSB7XG5cdFx0XHQoPGFueT50aGlzKS5ib2R5ID0gYm9keTtcblx0XHR9XG5cdH1cbn1cbiJdfQ==