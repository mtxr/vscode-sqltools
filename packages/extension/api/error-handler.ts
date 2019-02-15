import { Telemetry } from '@sqltools/core/utils';

namespace ErrorHandler {
  let telemetry: Telemetry;
  let outputFn = async (...args): Promise<string | void> => Promise.resolve();
  export function create(message: string, yesCallback?: Function): (reason: any) => void {
    return async (error: any): Promise<void> => {
      if (error) {
        telemetry.registerException(error);
        if (error.swallowError) return;
        message = `${message} ${error.message ? error.message : error.toString()}`;
      }
      if (typeof yesCallback !== 'function') {
        outputFn(message);
        return;
      }
      const res = await outputFn(`${message}\nWould you like to see the logs?`, 'Yes', 'No');
      if (res === 'Yes') {
        yesCallback();
      }
    };
  }
  export function setLogger(cli: Telemetry) {
    telemetry = cli;
  }

  export function setOutputFn(newOutputFn) {
    outputFn = newOutputFn;
  }
}

export default ErrorHandler;
