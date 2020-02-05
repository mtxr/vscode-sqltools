if (process.env.PRODUCT !== 'ext') { throw 'Cant use outputchannels outside of VSCode context'; }

import { DISPLAY_NAME } from '@sqltools/util/constants';
import { Console } from 'console';
import { Writable } from 'stream';
import { window, OutputChannel } from 'vscode';

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

type Logger = Console & { outputChannel?: OutputChannel };
const outputChannelConsoleWrapper: Logger = new Console({ stdout: writableStream, stderr: writableStream });

outputChannelConsoleWrapper.clear = outputChannel.clear.bind(outputChannel);
outputChannelConsoleWrapper.outputChannel = outputChannel;

export default outputChannelConsoleWrapper;
