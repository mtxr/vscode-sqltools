import pino, { LoggerOptions, DestinationStream, Logger } from 'pino';

function factory(opts: LoggerOptions = {}, stream?: DestinationStream) {
  const logger = pino({
    name: process.env.PRODUCT || 'UNINDENTIFIED',
    base: {},
    level: process.env.NODE_ENV === 'development' ? 'debug' : undefined,
    formatters: {
      level(level) { return { level }; },
    },
    prettyPrint: true,
    ...opts,
  }, stream);

  logger.show = () => void 0;

  return logger as Logger & { show: () => void; outputChannel?: { show: () => void } };
}

export default factory;
