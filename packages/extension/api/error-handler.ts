import { Telemetry } from '@sqltools/core/utils';

namespace ErrorHandler {
  let logger = console;
  let outputFn = async (...args): Promise<string | void> => Promise.resolve();
  export function create(message: string, yesCallback?: Function): (reason: any) => void {
    return async (error: any): Promise<void> => {
      if (error) {
        if (error.swallowError) return;
        logger.error(`${message}: `, error.stack);
        message = `${message} ${error.toString()}`;
      }
      if (typeof yesCallback !== 'function') {
        Telemetry.registerErrorMessage(message, error, 'No callback');
        outputFn(message);
        return;
      }
      const res = await outputFn(`${message}\nWould you like to see the logs?`, 'Yes', 'No');
      Telemetry.registerErrorMessage(message, error, res === 'Yes' ? 'View Log' : 'Dismissed');
      if (res === 'Yes') {
        yesCallback();
      }
    };
  }
  export function setLogger(newLogger) {
    logger = newLogger;
  }

  export function setOutputFn(newOutputFn) {
    outputFn = newOutputFn;
  }
}

export default ErrorHandler;
