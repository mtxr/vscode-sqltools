/**
 * Constants for token types
 */
export enum TokenTypes {
  WHITESPACE = 'whitespace',
  WORD = 'word',
  STRING = 'string',
  RESERVED = 'reserved',
  RESERVED_TOPLEVEL = 'reserved-toplevel',
  RESERVED_NEWLINE = 'reserved-newline',
  OPERATOR = 'operator',
  QUERY_SEPARATOR = 'query-separator',
  OPEN_PAREN = 'open-paren',
  CLOSE_PAREN = 'close-paren',
  LINE_COMMENT = 'line-comment',
  BLOCK_COMMENT = 'block-comment',
  NUMBER = 'number',
  PLACEHOLDER = 'placeholder',
  SERVERVARIABLE = 'servervariable',
  TABLENAME_PREFIX = 'tablename-prefix',
  TABLENAME = 'tablename',
}
export interface Config {
  indent?: string;
  reservedWordCase?: string;
  params?: Object;
}
export interface TokenizerConfig {
  reservedWords: string[];
  reservedToplevelWords: string[];
  reservedNewlineWords: string[];
  tableNamePrefixWords: string[];
  stringTypes: string[];
  openParens: string[];
  closeParens: string[];
  indexedPlaceholderTypes?: string[];
  namedPlaceholderTypes: string[];
  lineCommentTypes: string[];
}

export interface Token {
  type: TokenTypes;
  value: string;
  key?: string;
}
