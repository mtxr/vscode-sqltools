export * from './generic';
export * from './driver';
export * from './settings';
export * from './plugin';

export declare namespace NodeJS {
  interface ProcessEnv {
    PRODUCT: 'ext' | 'ls' | 'ui';
    NODE_ENV: 'development' | 'production';
    IS_NODE_RUNTIME: string;
    EXT_NAMESPACE: string;
    AUTHOR: string;
    DEBUG: string;
    DEBUG_HIDE_DATE: string;
    DISPLAY_NAME: string;
    DSN_KEY: string;
    EXT_CONFIG_NAMESPACE: string;
    HOME: string;
    USERPROFILE: string;
    VERSION: string;
  }
}
