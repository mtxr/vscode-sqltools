import { DefaultUIAction } from '@sqltools/vscode/webview-provider/action';

export const UIAction = {
  ...DefaultUIAction,

  RESPONSE_RESULTS: 'RESPONSE:RESULTS_RECEIVED' as const,
} as const;