import { DefaultUIAction } from '@sqltools/vscode/webview-provider/action';

export const UIAction = {
  ...DefaultUIAction,
  RESPONSE_ER_DATA: 'RESPONSE:ER_DATA' as const,
} as const;
