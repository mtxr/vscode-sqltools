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
  },
});

const patchedConsole = new Console({ stdout: writableStream, stderr: writableStream });

class OutputChannelLogger implements Console {
  private prefix = (type: string) => {
    return `${type}:`;
  }
  Console: NodeJS.ConsoleConstructor;
  clear = () => outputChannel.clear();
  assert: Console['assert'] =  (...args) => patchedConsole.assert(...args);
  count: Console['count'] =  (...args) => patchedConsole.count(...args);
  countReset: Console['countReset'] =  (...args) => patchedConsole.countReset(...args);
  dir: Console['dir'] =  (...args) => patchedConsole.dir(...args);
  dirxml: Console['dirxml'] =  (...args) => patchedConsole.dirxml(...args);
  group: Console['group'] =  (...args) => patchedConsole.group(...args);
  groupCollapsed: Console['groupCollapsed'] =  (...args) => patchedConsole.groupCollapsed(...args);
  groupEnd: Console['groupEnd'] =  patchedConsole.groupEnd;
  table: Console['table'] =  (...args) => patchedConsole.table(...args);
  time: Console['time'] =  (...args) => patchedConsole.time(...args);
  timeEnd: Console['timeEnd'] =  (...args) => patchedConsole.timeEnd(...args);
  timeLog: Console['timeLog'] =  (...args) => patchedConsole.timeLog(...args);
  trace: Console['trace'] =  (...args) => patchedConsole.trace(...args);
  markTimeline: Console['markTimeline'] =  (...args) => patchedConsole.markTimeline(...args);
  profile: Console['profile'] =  (...args) => patchedConsole.profile(...args);
  profileEnd: Console['profileEnd'] =  (...args) => patchedConsole.profileEnd(...args);
  timeStamp: Console['timeStamp'] =  (...args) => patchedConsole.timeStamp(...args);
  timeline: Console['timeline'] =  (...args) => patchedConsole.timeline(...args);
  timelineEnd: Console['timelineEnd'] =  (...args) => patchedConsole.timelineEnd(...args);

  log = (message: string, ...data: any[]) => {
    patchedConsole.log(this.prefix('DEBUG'), message, ...data);
  }
  debug = (message: string, ...data: any[]) => {
    patchedConsole.log(this.prefix('DEBUG'), message, ...data);
  }
  error = (message: string, ...data: any[]) => {
    patchedConsole.error(this.prefix('ERROR'), message, ...data);
  }
  info = (message: string, ...data: any[]) => {
    patchedConsole.info(this.prefix('INFO'), message, ...data);
  }
  warn = (message: string, ...data: any[]) => {
    patchedConsole.warn(this.prefix('WARN'), message, ...data);
  }
  show = (...args) => outputChannel.show(...args);
  get outputChannel(): OutputChannel {
    return outputChannel;
  };
  memory = () => void 0;
  exception = (...data: any[]) => {
    patchedConsole.error(this.prefix('EXCEPTION'), ...data);
  }
}

global.console = new OutputChannelLogger();
