process.env.DEBUG_HIDE_DATE = '1';

import debug, { Debugger } from 'debug';
import ConfigManager from '../config-manager';

process.env.DEBUG = process.env.NODE_ENV === 'development' ? '*' : '*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';
debug.enable(process.env.DEBUG);

const productLogger: Debugger = debug(process.env.PRODUCT);

productLogger.log = console.log.bind(console);
(productLogger as any).show = () => productLogger.extend('warn')(`Method show not available within ${process.env.PRODUCT} context`);

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