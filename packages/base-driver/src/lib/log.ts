process.env.DEBUG_HIDE_DATE = '1';
process.env.DEBUG = process.env.DEBUG || '*';

import debug from 'debug';

debug.enable(process.env.DEBUG);

(debug as any).formatArgs = function(args: any) {
  args[0] = `['${this.namespace}'] ${args[0]}`;
}

debug.log = console.log.bind(console);

export default debug('driver');