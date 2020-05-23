import NotifyResponseError from './response-error';
import { ElectronNotSupportedNotification } from '../notification';

export class ElectronNotSupportedError extends NotifyResponseError {
  constructor(message: string = `Electron is not supported. You should enable \'sqltools.useNodeRuntime\' and have NodeJS installed to continue.`) {
    super(1001, message, {
      notification: ElectronNotSupportedNotification,
      dontNotify: true
    });
  }
}

export default ElectronNotSupportedError;
