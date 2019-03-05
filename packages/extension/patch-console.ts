import { DISPLAY_NAME } from '@sqltools/core/constants';
import { Console } from 'console';
import { Writable } from 'stream';
import { OutputChannel, window } from 'vscode';

const outputChannel = window.createOutputChannel(DISPLAY_NAME);

const writableStream: Writable = new Writable({
  write: (chunk, _, done) => {
    outputChannel.append(chunk.toString(chunk.encoding || 'utf8'));
    done();
  },
  writev: (chunks, done) => {
    chunks.forEach(i => outputChannel.append(i.chunk.toString(i.encoding || 'utf8')))
    done();
  }
})

const patchedConsole = new Console({ stdout: writableStream, stderr: writableStream });

class OutputChannelLogger implements Console {
  private prefix(type: string) {
    return `${type}:`;
  }
  Console: NodeJS.ConsoleConstructor;
  assert = patchedConsole.assert;
  clear = outputChannel.clear;
  count = patchedConsole.count;
  countReset = patchedConsole.countReset;
  dir = patchedConsole.dir;
  dirxml = patchedConsole.dirxml;
  group = patchedConsole.group;
  groupCollapsed = patchedConsole.groupCollapsed;
  groupEnd = patchedConsole.groupEnd;
  table = patchedConsole.table;
  time = patchedConsole.time;
  timeEnd = patchedConsole.timeEnd;
  timeLog = patchedConsole.timeLog;
  trace = patchedConsole.trace;
  markTimeline = patchedConsole.markTimeline;
  profile = patchedConsole.profile;
  profileEnd = patchedConsole.profileEnd;
  timeStamp = patchedConsole.timeStamp;
  timeline = patchedConsole.timeline;
  timelineEnd = patchedConsole.timelineEnd;

  log(message: string, ...data: any[]) {
    patchedConsole.log(this.prefix('DEBUG'), message, ...data);
  }
  debug(message: string, ...data: any[]) {
    patchedConsole.debug(this.prefix('DEBUG'), message, ...data);
  }
  error(message: string, ...data: any[]) {
    patchedConsole.error(this.prefix('ERROR'), message, ...data);
  }
  info(message: string, ...data: any[]) {
    patchedConsole.info(this.prefix('INFO'), message, ...data);
  }
  warn(message: string, ...data: any[]) {
    patchedConsole.warn(this.prefix('WARN'), message, ...data);
  }
  show = outputChannel.show;
  get outputChannel(): OutputChannel {
    return outputChannel;
  }
}

global.console = new OutputChannelLogger();
