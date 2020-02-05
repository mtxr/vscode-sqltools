process.env.DEBUG_HIDE_DATE = '1';
process.env.DEBUG = process.env.NODE_ENV === 'development' ? '*' : '*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug';

import debug, { Debugger, Debug } from 'debug';

debug.enable(process.env.DEBUG);

const productLogger: Debugger & { _debug?: Debug } = debug(process.env.PRODUCT);

(debug as any).formatArgs = function(args: any) {
  args[0] = `['${this.namespace}'] ${args[0]}`;
}

productLogger.log = console.log.bind(console);
(productLogger as any).show = () => productLogger.extend('warn')(`Method show not available within ${process.env.PRODUCT} context`);
productLogger._debug = debug;

export default productLogger;