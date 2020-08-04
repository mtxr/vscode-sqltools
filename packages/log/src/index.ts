import factory from './lib/factory';
/**
 * Export logger based on environment.
 *
 * When inside of VSCode, use extension output channel,
 * Otherwise write to console.log/stdout.
 *
 * logs when in LS: language server output channel
 * logs on webviews: webview devtools
  */
let logger: ReturnType<typeof factory>;
if (process.env.PRODUCT === 'ext') {
  logger = require('./lib/vscode').default;
} else {
  logger = require('./lib/general').default;
}

export function createLogger(ns?: string, bindings: { [k: string]: any } = {}) {
  if (!ns) return logger;
  return logger.child({ ...bindings, ns });
}
export default logger;