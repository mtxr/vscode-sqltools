import { ElectronNotSupportedNotification } from '../notification';
import NotifyResponseError from './response-error';

export class ElectronNotSupportedError extends NotifyResponseError {
  constructor(
    message = `Electron is not supported. You should enable 'sqltools.useNodeRuntime' and have NodeJS installed to continue.`
  ) {
    super(1001, message, {
      notification: ElectronNotSupportedNotification,
      dontNotify: true,
    });
  }
}

export default ElectronNotSupportedError;
