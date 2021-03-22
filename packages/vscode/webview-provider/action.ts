export const DefaultUIAction = {
  CALL: 'call' as const,

  NOTIFY_VIEW_READY: 'NOTIFY:VIEW_READY' as const,

  REQUEST_RESET: 'REQUEST:RESET' as const,
  REQUEST_STATE: 'REQUEST:STATE' as const,

  RESPONSE_STATE: 'RESPONSE:STATE' as const,
  OPEN_DEVTOOLS: 'REQUEST:OPEN_DEVTOOLS' as const,

  SET_STATE: 'SET_STATE' as const,
} as const;