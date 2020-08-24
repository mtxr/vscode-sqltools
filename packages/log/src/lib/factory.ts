import pino, { LoggerOptions, DestinationStream, Logger } from 'pino';

declare var window: any;

function factory(opts: LoggerOptions = {}, stream?: DestinationStream) {
  if (typeof window !=='undefined' && window.navigator && process.env.PRODUCT === 'ui') {
    const interpolate = (args: IArguments) => {
      const newArgs = args[0].toString().split(/\s*\%[a-z]\s*/i);
      return newArgs.reduce((a, p, i) => {
        if (typeof p !== 'undefined') {
          a.push(p)
        }
        if (typeof args[i + 1] !== 'undefined') {
          a.push(args[i + 1])
        }
        return a;
      }, []);
    }

    const logger =  new Proxy({}, {
      get(_: never, prop: string) {
        if (prop === 'child') return () => logger;
        return function() {(console[prop] || console.log).call(null, prop.toUpperCase(), ...interpolate(arguments));}
      },
      set() { throw new Error('SET')},
    }) as Logger & { show: () => void; outputChannel?: { show: () => void } };
    return logger;
  };
  const logger = pino({
    name: process.env.PRODUCT || 'UNINDENTIFIED',
    base: {},
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
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
