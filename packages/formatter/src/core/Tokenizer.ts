import escapeRegExp from 'lodash/escapeRegExp';
import { TokenTypes, Token, TokenizerConfig } from './types';
const wordUTF8 = '\\w$\\u0041-\\u005A\\u0061-\\u007A\\u00AA\\u00B5\\u00BA\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02C1\\u02C6-\\u02D1\\u02E0-\\u02E4\\u02EC\\u02EE\\u0370-\\u0374\\u0376\\u0377\\u037A-\\u037D\\u0386\\u0388-\\u038A\\u038C\\u038E-\\u03A1\\u03A3-\\u03F5\\u03F7-\\u0481\\u048A-\\u0527\\u0531-\\u0556\\u0559\\u0561-\\u0587\\u05D0-\\u05EA\\u05F0-\\u05F2\\u0620-\\u064A\\u066E\\u066F\\u0671-\\u06D3\\u06D5\\u06E5\\u06E6\\u06EE\\u06EF\\u06FA-\\u06FC\\u06FF\\u0710\\u0712-\\u072F\\u074D-\\u07A5\\u07B1\\u07CA-\\u07EA\\u07F4\\u07F5\\u07FA\\u0800-\\u0815\\u081A\\u0824\\u0828\\u0840-\\u0858\\u08A0\\u08A2-\\u08AC\\u0904-\\u0939\\u093D\\u0950\\u0958-\\u0961\\u0971-\\u0977\\u0979-\\u097F\\u0985-\\u098C\\u098F\\u0990\\u0993-\\u09A8\\u09AA-\\u09B0\\u09B2\\u09B6-\\u09B9\\u09BD\\u09CE\\u09DC\\u09DD\\u09DF-\\u09E1\\u09F0\\u09F1\\u0A05-\\u0A0A\\u0A0F\\u0A10\\u0A13-\\u0A28\\u0A2A-\\u0A30\\u0A32\\u0A33\\u0A35\\u0A36\\u0A38\\u0A39\\u0A59-\\u0A5C\\u0A5E\\u0A72-\\u0A74\\u0A85-\\u0A8D\\u0A8F-\\u0A91\\u0A93-\\u0AA8\\u0AAA-\\u0AB0\\u0AB2\\u0AB3\\u0AB5-\\u0AB9\\u0ABD\\u0AD0\\u0AE0\\u0AE1\\u0B05-\\u0B0C\\u0B0F\\u0B10\\u0B13-\\u0B28\\u0B2A-\\u0B30\\u0B32\\u0B33\\u0B35-\\u0B39\\u0B3D\\u0B5C\\u0B5D\\u0B5F-\\u0B61\\u0B71\\u0B83\\u0B85-\\u0B8A\\u0B8E-\\u0B90\\u0B92-\\u0B95\\u0B99\\u0B9A\\u0B9C\\u0B9E\\u0B9F\\u0BA3\\u0BA4\\u0BA8-\\u0BAA\\u0BAE-\\u0BB9\\u0BD0\\u0C05-\\u0C0C\\u0C0E-\\u0C10\\u0C12-\\u0C28\\u0C2A-\\u0C33\\u0C35-\\u0C39\\u0C3D\\u0C58\\u0C59\\u0C60\\u0C61\\u0C85-\\u0C8C\\u0C8E-\\u0C90\\u0C92-\\u0CA8\\u0CAA-\\u0CB3\\u0CB5-\\u0CB9\\u0CBD\\u0CDE\\u0CE0\\u0CE1\\u0CF1\\u0CF2\\u0D05-\\u0D0C\\u0D0E-\\u0D10\\u0D12-\\u0D3A\\u0D3D\\u0D4E\\u0D60\\u0D61\\u0D7A-\\u0D7F\\u0D85-\\u0D96\\u0D9A-\\u0DB1\\u0DB3-\\u0DBB\\u0DBD\\u0DC0-\\u0DC6\\u0E01-\\u0E30\\u0E32\\u0E33\\u0E40-\\u0E46\\u0E81\\u0E82\\u0E84\\u0E87\\u0E88\\u0E8A\\u0E8D\\u0E94-\\u0E97\\u0E99-\\u0E9F\\u0EA1-\\u0EA3\\u0EA5\\u0EA7\\u0EAA\\u0EAB\\u0EAD-\\u0EB0\\u0EB2\\u0EB3\\u0EBD\\u0EC0-\\u0EC4\\u0EC6\\u0EDC-\\u0EDF\\u0F00\\u0F40-\\u0F47\\u0F49-\\u0F6C\\u0F88-\\u0F8C\\u1000-\\u102A\\u103F\\u1050-\\u1055\\u105A-\\u105D\\u1061\\u1065\\u1066\\u106E-\\u1070\\u1075-\\u1081\\u108E\\u10A0-\\u10C5\\u10C7\\u10CD\\u10D0-\\u10FA\\u10FC-\\u1248\\u124A-\\u124D\\u1250-\\u1256\\u1258\\u125A-\\u125D\\u1260-\\u1288\\u128A-\\u128D\\u1290-\\u12B0\\u12B2-\\u12B5\\u12B8-\\u12BE\\u12C0\\u12C2-\\u12C5\\u12C8-\\u12D6\\u12D8-\\u1310\\u1312-\\u1315\\u1318-\\u135A\\u1380-\\u138F\\u13A0-\\u13F4\\u1401-\\u166C\\u166F-\\u167F\\u1681-\\u169A\\u16A0-\\u16EA\\u1700-\\u170C\\u170E-\\u1711\\u1720-\\u1731\\u1740-\\u1751\\u1760-\\u176C\\u176E-\\u1770\\u1780-\\u17B3\\u17D7\\u17DC\\u1820-\\u1877\\u1880-\\u18A8\\u18AA\\u18B0-\\u18F5\\u1900-\\u191C\\u1950-\\u196D\\u1970-\\u1974\\u1980-\\u19AB\\u19C1-\\u19C7\\u1A00-\\u1A16\\u1A20-\\u1A54\\u1AA7\\u1B05-\\u1B33\\u1B45-\\u1B4B\\u1B83-\\u1BA0\\u1BAE\\u1BAF\\u1BBA-\\u1BE5\\u1C00-\\u1C23\\u1C4D-\\u1C4F\\u1C5A-\\u1C7D\\u1CE9-\\u1CEC\\u1CEE-\\u1CF1\\u1CF5\\u1CF6\\u1D00-\\u1DBF\\u1E00-\\u1F15\\u1F18-\\u1F1D\\u1F20-\\u1F45\\u1F48-\\u1F4D\\u1F50-\\u1F57\\u1F59\\u1F5B\\u1F5D\\u1F5F-\\u1F7D\\u1F80-\\u1FB4\\u1FB6-\\u1FBC\\u1FBE\\u1FC2-\\u1FC4\\u1FC6-\\u1FCC\\u1FD0-\\u1FD3\\u1FD6-\\u1FDB\\u1FE0-\\u1FEC\\u1FF2-\\u1FF4\\u1FF6-\\u1FFC\\u2071\\u207F\\u2090-\\u209C\\u2102\\u2107\\u210A-\\u2113\\u2115\\u2119-\\u211D\\u2124\\u2126\\u2128\\u212A-\\u212D\\u212F-\\u2139\\u213C-\\u213F\\u2145-\\u2149\\u214E\\u2183\\u2184\\u2C00-\\u2C2E\\u2C30-\\u2C5E\\u2C60-\\u2CE4\\u2CEB-\\u2CEE\\u2CF2\\u2CF3\\u2D00-\\u2D25\\u2D27\\u2D2D\\u2D30-\\u2D67\\u2D6F\\u2D80-\\u2D96\\u2DA0-\\u2DA6\\u2DA8-\\u2DAE\\u2DB0-\\u2DB6\\u2DB8-\\u2DBE\\u2DC0-\\u2DC6\\u2DC8-\\u2DCE\\u2DD0-\\u2DD6\\u2DD8-\\u2DDE\\u2E2F\\u3005\\u3006\\u3031-\\u3035\\u303B\\u303C\\u3041-\\u3096\\u309D-\\u309F\\u30A1-\\u30FA\\u30FC-\\u30FF\\u3105-\\u312D\\u3131-\\u318E\\u31A0-\\u31BA\\u31F0-\\u31FF\\u3400-\\u4DB5\\u4E00-\\u9FCC\\uA000-\\uA48C\\uA4D0-\\uA4FD\\uA500-\\uA60C\\uA610-\\uA61F\\uA62A\\uA62B\\uA640-\\uA66E\\uA67F-\\uA697\\uA6A0-\\uA6E5\\uA717-\\uA71F\\uA722-\\uA788\\uA78B-\\uA78E\\uA790-\\uA793\\uA7A0-\\uA7AA\\uA7F8-\\uA801\\uA803-\\uA805\\uA807-\\uA80A\\uA80C-\\uA822\\uA840-\\uA873\\uA882-\\uA8B3\\uA8F2-\\uA8F7\\uA8FB\\uA90A-\\uA925\\uA930-\\uA946\\uA960-\\uA97C\\uA984-\\uA9B2\\uA9CF\\uAA00-\\uAA28\\uAA40-\\uAA42\\uAA44-\\uAA4B\\uAA60-\\uAA76\\uAA7A\\uAA80-\\uAAAF\\uAAB1\\uAAB5\\uAAB6\\uAAB9-\\uAABD\\uAAC0\\uAAC2\\uAADB-\\uAADD\\uAAE0-\\uAAEA\\uAAF2-\\uAAF4\\uAB01-\\uAB06\\uAB09-\\uAB0E\\uAB11-\\uAB16\\uAB20-\\uAB26\\uAB28-\\uAB2E\\uABC0-\\uABE2\\uAC00-\\uD7A3\\uD7B0-\\uD7C6\\uD7CB-\\uD7FB\\uF900-\\uFA6D\\uFA70-\\uFAD9\\uFB00-\\uFB06\\uFB13-\\uFB17\\uFB1D\\uFB1F-\\uFB28\\uFB2A-\\uFB36\\uFB38-\\uFB3C\\uFB3E\\uFB40\\uFB41\\uFB43\\uFB44\\uFB46-\\uFBB1\\uFBD3-\\uFD3D\\uFD50-\\uFD8F\\uFD92-\\uFDC7\\uFDF0-\\uFDFB\\uFE70-\\uFE74\\uFE76-\\uFEFC\\uFF21-\\uFF3A\\uFF41-\\uFF5A\\uFF66-\\uFFBE\\uFFC2-\\uFFC7\\uFFCA-\\uFFCF\\uFFD2-\\uFFD7\\uFFDA-\\uFFDC';

export default class Tokenizer {
  public WHITESPACE_REGEX: RegExp;
  public NUMBER_REGEX: RegExp;
  public OPERATOR_REGEX: RegExp;
  public QUERY_SEPARATOR_REGEX: RegExp;
  public BLOCK_COMMENT_REGEX: RegExp;
  public LINE_COMMENT_REGEX: RegExp;
  public RESERVED_TOPLEVEL_REGEX: RegExp;
  public RESERVED_NEWLINE_REGEX: RegExp;
  public RESERVED_PLAIN_REGEX: RegExp;
  public WORD_REGEX: RegExp;
  public TABLE_NAME_REGEX: RegExp;
  public TABLE_NAME_PREFIX_REGEX: RegExp;
  public STRING_REGEX: RegExp;
  public OPEN_PAREN_REGEX: RegExp;
  public CLOSE_PAREN_REGEX: RegExp;
  public INDEXED_PLACEHOLDER_REGEX: RegExp;
  public IDENT_NAMED_PLACEHOLDER_REGEX: RegExp;
  public STRING_NAMED_PLACEHOLDER_REGEX: RegExp;
  public OPEN_JINJA_DELIMITER_REGEX: RegExp;
  public CLOSE_JINJA_DELIMITER_REGEX: RegExp;
  
  /**
   * @param {TokenizerConfig} cfg
   *  @param {string[]} cfg.reservedWords Reserved words in SQL
   *  @param {string[]} cfg.reservedToplevelWords Words that are set to new line separately
   *  @param {string[]} cfg.reservedNewlineWords Words that are set to newline
   *  @param {string[]} cfg.stringTypes String types to enable: "", '', ``, [], N''
   *  @param {string[]} cfg.openParens Opening parentheses to enable, like (, [
   *  @param {string[]} cfg.closeParens Closing parentheses to enable, like ), ]
   *  @param {string[]} cfg.indexedPlaceholderTypes Prefixes for indexed placeholders, like ?
   *  @param {string[]} cfg.namedPlaceholderTypes Prefixes for named placeholders, like @ and :
   *  @param {string[]} cfg.lineCommentTypes Line comments to enable, like # and --
   */
  constructor(cfg: TokenizerConfig) {
    this.WHITESPACE_REGEX = /^(\s+)/;
    this.NUMBER_REGEX = /^((-\s*)?[0-9]+(\.[0-9]+)?|0x[0-9a-fA-F]+|0b[01]+)\b/;
    this.OPERATOR_REGEX = /^(!=|<>|==|<=|>=|!<|!>|\|\||::|->>|->|~~\*|~~|!~~\*|!~~|~\*|!~\*|!~|.)/;
    this.QUERY_SEPARATOR_REGEX = /^(;[\n\r\s]*)/;

    this.BLOCK_COMMENT_REGEX = /^(\/\*[^]*?(?:\*\/|$))/;
    this.LINE_COMMENT_REGEX = this.createLineCommentRegex(cfg.lineCommentTypes);

    this.RESERVED_TOPLEVEL_REGEX = this.createReservedWordRegex(cfg.reservedToplevelWords);
    this.RESERVED_NEWLINE_REGEX = this.createReservedWordRegex(cfg.reservedNewlineWords);
    this.RESERVED_PLAIN_REGEX = this.createReservedWordRegex(cfg.reservedWords);
    this.TABLE_NAME_PREFIX_REGEX = this.createReservedWordRegex(cfg.tableNamePrefixWords);

    this.WORD_REGEX = new RegExp(`^([${wordUTF8}]+)`);
    this.TABLE_NAME_REGEX = new RegExp(`^([${wordUTF8}][${wordUTF8}\\.]*|[\\[\`][${wordUTF8}][${wordUTF8}\\. \\-]*[\\]\`])`, 'i');
    this.STRING_REGEX = this.createStringRegex(cfg.stringTypes);

    this.OPEN_PAREN_REGEX = this.createParenRegex(cfg.openParens);
    this.CLOSE_PAREN_REGEX = this.createParenRegex(cfg.closeParens);

    this.INDEXED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.indexedPlaceholderTypes, '[0-9]*');
    this.IDENT_NAMED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(cfg.namedPlaceholderTypes, '[a-zA-Z0-9._$]+');
    this.STRING_NAMED_PLACEHOLDER_REGEX = this.createPlaceholderRegex(
      cfg.namedPlaceholderTypes,
      this.createStringPattern(cfg.stringTypes)
    );

    this.OPEN_JINJA_DELIMITER_REGEX = this.createOpenJinjaDelimiterRegex(cfg.openJinjaDelimiters)
    this.CLOSE_JINJA_DELIMITER_REGEX = this.createCloseJinjaDelimiterRegex(cfg.closeJinjaDelimiters)
  }

  createLineCommentRegex(lineCommentTypes) {
    return new RegExp(`^((?:${lineCommentTypes.map(c => escapeRegExp(c)).join('|')}).*?(?:\r\n|\n|$))`);
  }

  createReservedWordRegex(reservedWords) {
    const reservedWordsPattern = reservedWords.join('|').replace(/ /g, '\\s+');
    return new RegExp(`^(${reservedWordsPattern})\\b`, 'i');
  }

  createStringRegex(stringTypes) {
    return new RegExp('^(' + this.createStringPattern(stringTypes) + ')');
  }

  // This enables the following string patterns:
  // 1. backtick quoted string using `` to escape
  // 2. square bracket quoted string (SQL Server) using ]] to escape
  // 3. double quoted string using "" or \" to escape
  // 4. single quoted string using '' or \' to escape
  // 5. national character quoted string using N'' or N\' to escape
  createStringPattern(stringTypes) {
    const patterns = {
      '``': '((`[^`]*($|`))+)',
      '[]': '((\\[[^\\]]*($|\\]))(\\][^\\]]*($|\\]))*)',
      '""': '(("[^"\\\\]*(?:\\\\.[^"\\\\]*)*("|$))+)',
      "''": "(('[^'\\\\]*(?:\\\\.[^'\\\\]*)*('|$))+)",
      "N''": "((N'[^N'\\\\]*(?:\\\\.[^N'\\\\]*)*('|$))+)",
    };

    return stringTypes.map(t => patterns[t]).join('|');
  }

  createParenRegex(parens) {
    return new RegExp('^(' + parens.map(p => this.escapeParen(p)).join('|') + ')', 'i');
  }

  escapeParen(paren) {
    if (paren.length === 1) {
      // A single punctuation character
      return escapeRegExp(paren);
    } else {
      // longer word
      return '\\b' + paren + '\\b';
    }
  }

  createPlaceholderRegex(types, pattern) {
    const typesRegex = types.map(escapeRegExp).join('|');

    return new RegExp(`^((?:${typesRegex})(?:${pattern}))`);
  }

  createOpenJinjaDelimiterRegex(types){
    return new RegExp('^(' + types.map(b => `${escapeRegExp(b)}-?`).join('|') + ')');
  }

  createCloseJinjaDelimiterRegex(types){
    return new RegExp('^(' + types.map(b => `-?${escapeRegExp(b)}`).join('|') + ')');
  }

  /**
   * Takes a SQL string and breaks it into tokens.
   * Each token is an object with type and value.
   *
   * @param {string} input The SQL string
   * @return {Object[]} tokens An array of tokens.
   *  @return {string} token.type
   *  @return {string} token.value
   */
  tokenize(input: string): Token[] {
    const tokens = [];
    let token: Token;

    // Keep processing the string until it is empty
    while (input.length) {
      // Get the next token and the token type
      token = this.getNextToken(input, this.getPreviousToken(tokens), this.getPreviousToken(tokens, 1));
      // Advance the string
      input = input.substring(token.value.length);

      tokens.push(token);
    }
    return tokens;
  }

  getNextToken(input: string, tokenMinus1?: Token, tokenMinus2?: Token): Token {
    return (
      this.getWhitespaceToken(input) ||
      this.getCommentToken(input) ||
      this.getStringToken(input) ||
      this.getOpenParenToken(input) ||
      this.getCloseParenToken(input) ||
      this.getOpenJinjaDelimiterToken(input) ||
      this.getCloseJinjaDelimiterToken(input) ||
      this.getServerVariableToken(input) ||
      this.getPlaceholderToken(input) ||
      this.getNumberToken(input) ||
      this.getReservedWordToken(input, tokenMinus1) ||
      this.getTableNameToken(input, tokenMinus1, tokenMinus2) ||
      this.getWordToken(input) ||
      this.getQuerySeparatorToken(input) ||
      this.getOperatorToken(input) 
    );
  }

  getWhitespaceToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.WHITESPACE,
      regex: this.WHITESPACE_REGEX,
    });
  }

  getCommentToken(input: string): Token {
    return this.getLineCommentToken(input) || this.getBlockCommentToken(input);
  }

  getLineCommentToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.LINE_COMMENT,
      regex: this.LINE_COMMENT_REGEX,
    });
  }

  getBlockCommentToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.BLOCK_COMMENT,
      regex: this.BLOCK_COMMENT_REGEX,
    });
  }

  getStringToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.STRING,
      regex: this.STRING_REGEX,
    });
  }

  getOpenParenToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.OPEN_PAREN,
      regex: this.OPEN_PAREN_REGEX,
    });
  }

  getCloseParenToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.CLOSE_PAREN,
      regex: this.CLOSE_PAREN_REGEX,
    });
  }
  
  getOpenJinjaDelimiterToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.OPEN_JINJA_DELIMITER,
      regex: this.OPEN_JINJA_DELIMITER_REGEX,
    });
  }

  getCloseJinjaDelimiterToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.CLOSE_JINJA_DELIMITER,
      regex: this.CLOSE_JINJA_DELIMITER_REGEX,
    });
  }

  getPlaceholderToken(input: string): Token {
    return (
      this.getIdentNamedPlaceholderToken(input) ||
      this.getStringNamedPlaceholderToken(input) ||
      this.getIndexedPlaceholderToken(input)
    );
  }

  getServerVariableToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.SERVERVARIABLE,
      regex: /(^@@\w+)/i,
    });
  }

  getIdentNamedPlaceholderToken(input: string): Token {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.IDENT_NAMED_PLACEHOLDER_REGEX,
      parseKey: v => v.slice(1),
    });
  }

  getStringNamedPlaceholderToken(input: string): Token {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.STRING_NAMED_PLACEHOLDER_REGEX,
      parseKey: v => this.getEscapedPlaceholderKey({ key: v.slice(2, -1), quoteChar: v.slice(-1) }),
    });
  }

  getIndexedPlaceholderToken(input: string): Token {
    return this.getPlaceholderTokenWithKey({
      input,
      regex: this.INDEXED_PLACEHOLDER_REGEX,
      parseKey: v => v.slice(1),
    });
  }

  getPlaceholderTokenWithKey({ input, regex, parseKey }) {
    const token = this.getTokenOnFirstMatch({ input, regex, type: TokenTypes.PLACEHOLDER });
    if (token) {
      token.key = parseKey(token.value);
    }
    return token;
  }

  getEscapedPlaceholderKey({ key, quoteChar }) {
    return key.replace(new RegExp(escapeRegExp('\\') + quoteChar, 'g'), quoteChar);
  }

  // Decimal, binary, or hex numbers
  getNumberToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.NUMBER,
      regex: this.NUMBER_REGEX,
    });
  }

  // Punctuation and symbols
  getOperatorToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.OPERATOR,
      regex: this.OPERATOR_REGEX,
    });
  }
  getQuerySeparatorToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.QUERY_SEPARATOR,
      regex: this.QUERY_SEPARATOR_REGEX,
    });
  }

  getReservedWordToken(input, previousToken) {
    // A reserved word cannot be preceded by a "."
    // this makes it so in "mytable.from", "from" is not considered a reserved word
    if (previousToken && previousToken.value && previousToken.value === '.') {
      return;
    }
    return (
      this.getToplevelTablePrefixReservedToken(input) || this.getToplevelReservedToken(input) || this.getNewlineReservedToken(input) || this.getPlainReservedToken(input)
    );
  }

  getTableNameToken(input, tokenMinus1, tokenMinus2) {
    if (tokenMinus1 && tokenMinus1.value && tokenMinus1.value.trim() !== '') {
      return;
    }
    if (tokenMinus2 && tokenMinus2.value && tokenMinus2.type !== TokenTypes.TABLENAME_PREFIX) {
      return;
    }

    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.TABLENAME,
      regex: this.TABLE_NAME_REGEX,
    });
  }

  getToplevelTablePrefixReservedToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.TABLENAME_PREFIX,
      regex: this.TABLE_NAME_PREFIX_REGEX,
    });
  }

  getToplevelReservedToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.RESERVED_TOPLEVEL,
      regex: this.RESERVED_TOPLEVEL_REGEX,
    });
  }

  getNewlineReservedToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.RESERVED_NEWLINE,
      regex: this.RESERVED_NEWLINE_REGEX,
    });
  }

  getPlainReservedToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.RESERVED,
      regex: this.RESERVED_PLAIN_REGEX,
    });
  }

  getWordToken(input: string): Token {
    return this.getTokenOnFirstMatch({
      input,
      type: TokenTypes.WORD,
      regex: this.WORD_REGEX,
    });
  }

  getTokenOnFirstMatch({ input, type, regex }: { input: string; type: TokenTypes; regex: RegExp }): Token {
    const matches = input.match(regex);

    if (matches) {
      return { type, value: matches[1] };
    }
  }

  getPreviousToken(tokens: Token[], offset = 0) {
    return tokens[tokens.length - offset - 1] || { value: null, type: null };
  }
}
