import { LanguageClientPlugin } from '@sqltools/core/interface/plugin';
import { CloseAction } from 'vscode-languageclient';
import { ExitCalledNotification } from './contracts';

let avoidRestart = false;

const AutoRestartPlugin: LanguageClientPlugin = {
  register(client) {
    const defaultHandler = client.clientErrorHandler;
    client.clientErrorHandler = {
      error: defaultHandler.error,
      closed: (): CloseAction => {
        if (avoidRestart) {
          return CloseAction.DoNotRestart;
        }
        return defaultHandler.closed();
      },
    };

    client.onNotification(ExitCalledNotification, () => {
      this.avoidRestart = true;
    });
  }
}

export default AutoRestartPlugin;