import factory from './lib/factory';
/**
 * Export logger based on environment.
 *
 * When inside of VS Code, use extension output channel,
 * Otherwise write to console.log/stdout.
 *
 * logs when in LS: language server output channel
 * logs on webviews: webview devtools
  */
let logger: ReturnType<typeof factory>;

const isVSCodeContext = () => {
  try {
    require.resolve('vscode');
    return true;
  } catch (error) {
    return false;
  }
}

if (process.env.PRODUCT === 'ext' && isVSCodeContext()) {
  logger = require('./lib/vscode').default;
} else {
  logger = require('./lib/general').default;
}

export function createLogger(ns?: string, bindings: { [k: string]: any } = {}) {
  if (!ns) return logger;
  return logger.child({ ...bindings, ns });
}
export default logger;