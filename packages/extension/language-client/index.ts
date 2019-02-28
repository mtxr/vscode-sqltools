import { SQLToolsLanguageClient } from './client';
import AutoRestartPlugin from '@sqltools/plugins/auto-restart/language-client';

let languageClient = null;

export default (): SQLToolsLanguageClient => {

  if (languageClient) return languageClient;

  languageClient = new SQLToolsLanguageClient()
    .registerPlugin(AutoRestartPlugin);
  return languageClient;
}