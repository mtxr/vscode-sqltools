import productLogger from '@sqltools/core/log/base';
import outputChannelLogger from './channel';
import Config from '../config-manager';

export type Logger = {
  show: Function;
  outputChannel: typeof outputChannelLogger['outputChannel'];
} & (typeof productLogger);

const vscodeLogger: Logger = productLogger as Logger;
vscodeLogger.log = outputChannelLogger.log.bind(outputChannelLogger);
vscodeLogger.show = outputChannelLogger.outputChannel.show;
vscodeLogger.outputChannel = outputChannelLogger.outputChannel;

export default vscodeLogger;

Config.addOnUpdateHook(e => {
  if (e.affectsConfig('debug')) {
    const currentNS = (productLogger._debug as any).load && (productLogger._debug as any).load();
    let newNS = Config.get('debug', {}).namespaces;

    if (!newNS) {
      newNS = process.env.NODE_ENV === 'development' ? '*' : '*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';
    }
    if (currentNS !== newNS) productLogger._debug.enable(newNS);
  }
});