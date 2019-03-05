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
  },
  writev: (chunk, done) => {
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

  private prefix(type: string) {
    return `${type}:`;
  }
  public log(message: string, ...data: any[]) {
    console.log(this.prefix('DEBUG'), message, ...data);
  }
  public debug(message: string, ...data: any[]) {
    console.debug(this.prefix('DEBUG'), message, ...data);
  }
  public error(message: string, ...data: any[]) {
    console.error(this.prefix('ERROR'), message, ...data);
  }
  public info(message: string, ...data: any[]) {
    console.info(this.prefix('INFO'), message, ...data);
  }
  public warn(message: string, ...data: any[]) {
    console.warn(this.prefix('WARN'), message, ...data);
  }
  public show() {
    return outputChannel.show();
  }
  public getOutputChannel(): OutputChannel {
    return outputChannel;
  }
}
export default new Logwriter();
