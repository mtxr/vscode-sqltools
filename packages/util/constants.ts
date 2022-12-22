export const VERSION = process.env.VERSION;
export const EXT_NAMESPACE = process.env.EXT_NAMESPACE;
export const EXT_CONFIG_NAMESPACE = process.env.EXT_CONFIG_NAMESPACE;
export const DISPLAY_NAME = process.env.DISPLAY_NAME?.replace(/^"/, '').replace(/"$/, '');
export const AUTHOR = process.env.AUTHOR;
export const ENV = process.env.NODE_ENV || 'production';
export const DOCS_ROOT_URL = 'https://vscode-sqltools.mteixeira.dev';
export const TREE_SEP = '/-##-/';
export const AUTHENTICATION_PROVIDER = `${EXT_NAMESPACE}-driver-credentials`;

// query parsing
export const DELIMITER_START_REGEX = /(?:[\r\n]+)(\s*-{2,}\s*@block.*)$/guim;
export const DELIMITER_START_REPLACE_REGEX = /^(\s*-{2,}\s*@block.*)$/guim;
