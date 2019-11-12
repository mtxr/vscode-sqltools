process.env.DEBUG_HIDE_DATE = '1';

import debug, { Debugger } from 'debug';
import ConfigManager from '../config-manager';

type OutputChannelType = { outputChannel?: any };
process.env.DEBUG = process.env.NODE_ENV === 'development' ? '*' : '*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';
debug.enable(process.env.DEBUG);

const productLogger: Logger = debug(process.env.PRODUCT);

if (process.env.PRODUCT === 'ext') {
  // this means we are inside VSCode, so we can use output channels
  const vscodeOutputChannel: Console & OutputChannelType = require('./vscode');
  productLogger.log = vscodeOutputChannel.log.bind(vscodeOutputChannel);
  productLogger.show = vscodeOutputChannel.outputChannel.show;
  productLogger.outputChannel = vscodeOutputChannel;
} else {
  productLogger.log = console.log.bind(console);
  productLogger.show = () => productLogger.extend('warn')('Methodo show available just inside of VSCode context');
}

export type Logger = Debugger & { show?: Function } & OutputChannelType;

export default productLogger;

ConfigManager.addOnUpdateHook(() => {
  const debugSettings = ConfigManager.debug || {};
  const currentNS = (debug as any).load && (debug as any).load();
  let newNS = debugSettings.namespaces;
  if (!newNS) {
    newNS = process.env.NODE_ENV === 'development' ? '*' : '*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';
  }
  if (currentNS !== newNS) debug.enable(newNS);
});