export const VERSION = process.env.VERSION;
export const EXT_NAME = process.env.EXT_NAME;
export const DISPLAY_NAME = process.env.DISPLAY_NAME;
export const AUTHOR = process.env.AUTHOR;
export const ENV = process.env.NODE_ENV || 'production';
export const DOCS_ROOT_URL = 'https://vscode-sqltools.mteixeira.dev';
export const TREE_SEP = '/-##-/';

// query parsing
export const LineSplitterRegex = /\r?\n/g;
export const CommentIdentifiersRegex = /^\s*(#|\/{2})/;
export const FileVariableDefinitionRegex = /^\s*@([^\s=]+)\s*=\s*(.+?)\s*$/;
export const DelimiterStartRegex = /^\s*-{2,}\s*@block.*$/;