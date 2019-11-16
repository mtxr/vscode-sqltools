import productLogger from '@sqltools/core/log';
import outputChannelLogger from './channel';

export type Logger = {
  show: Function;
  outputChannel: typeof outputChannelLogger['outputChannel'];
} & (typeof productLogger);

const vscodeLogger: Logger = productLogger as Logger;
vscodeLogger.log = outputChannelLogger.log.bind(outputChannelLogger);
vscodeLogger.show = outputChannelLogger.outputChannel.show;
vscodeLogger.outputChannel = outputChannelLogger.outputChannel;

export default vscodeLogger;
