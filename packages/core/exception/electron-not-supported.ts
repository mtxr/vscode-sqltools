import { ElectronNotSupportedNotification, EXT_NAMESPACE } from '@sqltools/core/constants';
import NotifyResponseError from './response-error';


export class ElectronNotSupportedError extends NotifyResponseError {
  constructor(message: string = `Electron is not supported. You should enable \'${EXT_NAMESPACE}.useNodeRuntime\' and have NodeJS installed to continue.`) {
    super(1001, message, {
      notification: ElectronNotSupportedNotification,
      dontNotify: true
    });
  }
}

export default ElectronNotSupportedError;
