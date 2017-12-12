import {
  window as Window,
} from 'vscode';
import { Logger } from './api';
import Telemetry from './telemetry';

function errorHandler(logger: Logger, message: string, error ?: Error, yesCallback?: Function): null {
  Telemetry.errorMessage(message);
  if (typeof yesCallback !== 'function') {
    Window.showErrorMessage(message);
  } else {
    Window.showErrorMessage(`${message} Would you like to see the logs?`, 'Yes', 'No')
    .then((res) => {
      if (res === 'Yes') {
        yesCallback();
      }
    });
  }
  if (error) {
    logger.error(`${message}: `, error.stack);
  }
  return null;
}

export default errorHandler;
