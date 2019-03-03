import {
  OutputChannel,
  window,
} from 'vscode';
import { VERSION, DISPLAY_NAME } from '@sqltools/core/constants';
import { Console } from 'console';
import { Writable } from 'stream';

const outputChannel = window.createOutputChannel(DISPLAY_NAME);

const writableStream: Writable = new Writable({

  write: (chunk, _, done) => {
    outputChannel.append(chunk.toString());
    done();
  }
})

const console = new Console({ stdout: writableStream, stderr: writableStream });

export class Logwriter implements Console {
  Console: NodeJS.ConsoleConstructor;
  assert = console.assert;
  clear(): void {
    outputChannel.clear()
  }
  count = console.count;
  countReset = console.countReset;
  dir = console.dir;
  dirxml = console.dirxml;
  group = console.group;
  groupCollapsed = console.groupCollapsed;
  groupEnd = console.groupEnd;
  table = console.table;
  time = console.time;
  timeEnd = console.timeEnd;
  timeLog = console.timeLog;
  trace = console.trace;
  markTimeline = console.markTimeline;
  profile = console.profile;
  profileEnd = console.profileEnd;
  timeStamp = console.timeStamp;
  timeline = console.timeline;
  timelineEnd = console.timelineEnd;
  public log(message: string, ...data: any[]) {
    this.writeLog(`DEBUG: ${message}`, ...data);
  }
  public debug(message: string, ...data: any[]) {
    this.writeLog(`DEBUG: ${message}`, ...data);
  }
  public error(message: string, ...data: any[]) {
    this.writeLog(`ERROR: ${message}`, ...data);
  }
  public info(message: string, ...data: any[]) {
    this.writeLog(`INFO: ${message}`, ...data);
  }
  public warn(message: string, ...data: any[]) {
    this.writeLog(`WARN: ${message}`, ...data);
  }
  public showOutput() {
    outputChannel.show();
  }
  public getOutputChannel(): OutputChannel {
    return outputChannel;
  }

  public writeLog(message: string, ...data: any[]) {
    const date = new Date().toISOString().substr(0, 19).replace('T', ' ');
    outputChannel.appendLine(`[${date}][${VERSION}] ${message}`);
    if (data.length > 0) {
      data.forEach((obj: any | object) => {
        if (typeof obj === 'object' || Array.isArray(obj)) {
          return outputChannel.appendLine(`[${date}][${VERSION}] ` + JSON.stringify(obj));
        }
        return outputChannel.appendLine(`[${date}][${VERSION}] ` + obj.toString());
      });
    }
  }
}
export default new Logwriter();
