if (process.env.PRODUCT !== 'ext') { throw 'Cant use outputchannels outside of VS Code context'; }

import { Writable } from 'stream';
import { window } from 'vscode';
import factory from './factory';

const outputChannel = window.createOutputChannel(process.env.DISPLAY_NAME || 'SQLTools');

const writableStream = new Writable({
  write: (chunk, _, done) => {
    outputChannel.append(chunk.toString(chunk.encoding || 'utf8'));
    done();
  },
  writev: (chunks, done) => {
    chunks.forEach(i => outputChannel.append(i.chunk.toString(i.encoding || 'utf8')));
    done();
  },
});

const logger = factory({}, writableStream);

logger.clear = outputChannel.clear.bind(outputChannel);
logger.outputChannel = outputChannel;
logger.show = () => outputChannel.show();

export default logger;