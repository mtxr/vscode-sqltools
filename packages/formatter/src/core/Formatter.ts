import trimEnd from 'lodash/trimEnd';
import { TokenTypes, Config, Token } from './types';
import Indentation from './Indentation';
import InlineBlock from './InlineBlock';
import Params from './Params';
import Tokenizer from './Tokenizer';

export default class Formatter {
  private tokens: Token[] = [];
  private previousReservedWord: Token = { type: null, value: null };
  private indentation: Indentation;
  private inlineBlock: InlineBlock;
  private params: Params;
  private index = 0;
  /**
   * @param {Config} cfg
   *   @param {string} cfg.indent
   *   @param {Object} cfg.params
   * @param {Tokenizer} tokenizer
   */
  constructor(public cfg: Config, public tokenizer: Tokenizer) {
    this.indentation = new Indentation(this.cfg.indent);
    this.inlineBlock = new InlineBlock();
    this.params = new Params(this.cfg.params);
  }

  /**
   * Formats whitespaces in a SQL string to make it easier to read.
   *
   * @param {String} query The SQL query string
   * @return {String} formatted query
   */
  format(query) {
    this.tokens = this.tokenizer.tokenize(query);
    const formattedQuery = this.getFormattedQueryFromTokens();

    return formattedQuery.trim();
  }

  reservedWord(word) {
    if (this.cfg.reservedWordCase === 'upper') return word.toUpperCase();
    if (this.cfg.reservedWordCase === 'lower') return word.toLowerCase();
    return word;
  }

  getFormattedQueryFromTokens() {
    let formattedQuery = '';

    this.tokens.forEach((token, index) => {
      this.index = index;

      if (token.type === TokenTypes.WHITESPACE) {
        // ignore (we do our own whitespace formatting)
      } else if (token.type === TokenTypes.LINE_COMMENT) {
        formattedQuery = this.formatLineComment(token, formattedQuery);
      } else if (token.type === TokenTypes.BLOCK_COMMENT) {
        formattedQuery = this.formatBlockComment(token, formattedQuery);
      } else if (token.type === TokenTypes.TABLENAME_PREFIX) {
        formattedQuery = this.formatTablePrefix(token, formattedQuery);
      } else if (token.type === TokenTypes.RESERVED_TOPLEVEL) {
        formattedQuery = this.formatToplevelReservedWord(token, formattedQuery);
        this.previousReservedWord = token;
      } else if (token.type === TokenTypes.RESERVED_NEWLINE) {
        formattedQuery = this.formatNewlineReservedWord(token, formattedQuery);
        this.previousReservedWord = token;
      } else if (token.type === TokenTypes.RESERVED) {
        formattedQuery = this.formatWithSpaces(token, formattedQuery);
        this.previousReservedWord = token;
      } else if (token.type === TokenTypes.OPEN_PAREN) {
        formattedQuery = this.formatOpeningParentheses(token, formattedQuery);
      } else if (token.type === TokenTypes.CLOSE_PAREN) {
        formattedQuery = this.formatClosingParentheses(token, formattedQuery);
      } else if (token.type === TokenTypes.PLACEHOLDER) {
        formattedQuery = this.formatPlaceholderOrVariable(token, formattedQuery);
      } else if (token.type === TokenTypes.SERVERVARIABLE) {
        formattedQuery = this.formatPlaceholderOrVariable(token, formattedQuery);
      } else if (token.value === ',') {
        formattedQuery = this.formatComma(token, formattedQuery);
      } else if (token.value === '.') {
        formattedQuery = this.formatWithoutSpaces(token, formattedQuery);
      } else if (token.value === ';' || token.type === TokenTypes.QUERY_SEPARATOR ) {
        formattedQuery = this.formatQuerySeparator(token, formattedQuery);
      } else {
        formattedQuery = this.formatWithSpaces(token, formattedQuery);
      }
    });
    return formattedQuery;
  }

  formatLineComment(token, query) {
    return this.addNewline(query + token.value);
  }

  formatBlockComment(token, query) {
    return this.addNewline(this.addNewline(query) + this.indentComment(token.value));
  }

  indentComment(comment) {
    return comment.replace(/\r\n|\n/g, '\n' + this.indentation.getIndent());
  }

  formatToplevelReservedWord(token, query) {
    this.indentation.decreaseTopLevel();

    query = this.addNewline(query);

    this.indentation.increaseToplevel();

    query += this.equalizeWhitespace(this.reservedWord(token.value));
    return this.addNewline(query);
  }

  formatNewlineReservedWord(token, query) {
    return this.addNewline(query) + this.equalizeWhitespace(this.reservedWord(token.value)) + ' ';
  }

  // Replace any sequence of whitespace characters with single space
  equalizeWhitespace(string) {
    return string.replace(/\s+/g, ' ');
  }

  // Opening parentheses increase the block indent level and start a new line
  formatOpeningParentheses(token, query) {
    // Take out the preceding space unless there was whitespace there in the original query
    // or another opening parens or line comment
    const preserveWhitespaceFor = [TokenTypes.WHITESPACE, TokenTypes.OPEN_PAREN, TokenTypes.LINE_COMMENT];
    if (!preserveWhitespaceFor.includes(this.previousToken().type)) {
      query = trimEnd(query);
    }
    query += token.value;

    this.inlineBlock.beginIfPossible(this.tokens, this.index);

    if (!this.inlineBlock.isActive()) {
      this.indentation.increaseBlockLevel();
      query = this.addNewline(query);
    }
    return query;
  }

  // Closing parentheses decrease the block indent level
  formatClosingParentheses(token, query) {
    if (this.inlineBlock.isActive()) {
      this.inlineBlock.end();
      return this.formatWithSpaceAfter(token, query);
    } else {
      this.indentation.decreaseBlockLevel();
      return this.formatWithSpaces(token, this.addNewline(query));
    }
  }

  formatPlaceholderOrVariable(token, query) {
    return query + this.params.get(token) + ' ';
  }

  // Commas start a new line (unless within inline parentheses or SQL "LIMIT" clause)
  formatComma(token, query) {
    query = this.trimTrailingWhitespace(query) + token.value + ' ';

    if (this.inlineBlock.isActive()) {
      return query;
    } else if (/^LIMIT$/i.test(this.previousReservedWord.value)) {
      return query;
    } else {
      return this.addNewline(query);
    }
  }

  formatWithSpaceAfter(token, query) {
    return this.trimTrailingWhitespace(query) + token.value + ' ';
  }

  formatWithoutSpaces(token, query) {
    return this.trimTrailingWhitespace(query) + token.value;
  }

  formatWithSpaces(token, query) {
    return query + token.value + ' ';
  }

  formatTablePrefix(token, query) {
    this.indentation.decreaseTopLevel();

    query = this.addNewline(query);

    this.indentation.increaseToplevel();

    return query + this.equalizeWhitespace(this.reservedWord(token.value)) + ' ';
  }

  formatQuerySeparator(token, query) {
    return this.trimTrailingWhitespace(query) + trimEnd(token.value) + '\n';
  }

  addNewline(query) {
    return trimEnd(query) + '\n' + this.indentation.getIndent();
  }

  trimTrailingWhitespace(query) {
    if (this.previousNonWhitespaceToken().type === TokenTypes.LINE_COMMENT) {
      return trimEnd(query) + '\n';
    } else {
      return trimEnd(query);
    }
  }

  previousNonWhitespaceToken() {
    let n = 1;
    while (this.previousToken(n).type === TokenTypes.WHITESPACE) {
      n++;
    }
    return this.previousToken(n);
  }

  previousToken(offset = 1): Token {
    return this.tokens[this.index - offset] || { type: null, value: null };
  }
}
