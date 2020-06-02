import productLogger from '../base';
import outputChannelLogger from './channel';
import Config from '@sqltools/util/config-manager';

export type Logger = {
  show: Function;
  outputChannel: typeof outputChannelLogger['outputChannel'];
} & (typeof productLogger);

const vscodeLogger: Logger = productLogger as Logger;
vscodeLogger.log = outputChannelLogger.error;
vscodeLogger.outputChannel = outputChannelLogger.outputChannel;
vscodeLogger.show = () => outputChannelLogger.outputChannel.show();

export default vscodeLogger;

Config.addOnUpdateHook(({ event }) => {
  if (event.affectsConfig('debug')) {
    const currentNS = (productLogger._debug as any).load && (productLogger._debug as any).load();
    let newNS = Config.get('debug', {}).namespaces;

    if (!newNS) {
      newNS = process.env.NODE_ENV === 'development' ? '*,-babel*' : '*,-babel*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';
    }
    if (currentNS !== newNS) productLogger._debug.enable(newNS);
  }
});