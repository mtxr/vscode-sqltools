import { DefaultUIAction } from '@sqltools/vscode/webview-provider/action';

export const UIAction = {
  ...DefaultUIAction,

  REQUEST_SYNC_CONSOLE_MESSAGES: 'REQUEST:SYNC_CONSOLE_MESSAGES' as const,
  RESPONSE_RESULTS: 'RESPONSE:RESULTS_RECEIVED' as const,
} as const;