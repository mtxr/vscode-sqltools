process.env.DEBUG_HIDE_DATE = '1';

import debug from 'debug';

debug.enable(process.env.NODE_ENV === 'development' ? '*,-babel*' : '*,-babel*,-*:debug,-*:*:debug,-*:*:*:debug,-*:*:*:*:debug,-*:*:*:*:*:debug');

(debug as any).formatArgs = function(args: any) {
  args[0] = `['${this.namespace}'] ${args[0]}`;
}

debug.log = console.log.bind(console);

export default debug('driver');